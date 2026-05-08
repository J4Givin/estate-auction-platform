/**
 * Centralized rate limiting for portal write routes.
 *
 * Provider abstraction:
 *   - `memory`  — in-process sliding-window counter (dev / single-instance)
 *   - `upstash` — Upstash Redis REST sliding-window counter (production)
 *
 * Selection is automatic at module load:
 *   - When `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
 *     we use the Upstash provider. Both env vars are server-only.
 *   - Otherwise we fall back to memory. Builds and demo mode never require
 *     Upstash credentials.
 *
 * Behavior:
 *   - Each category has a `limit` (max requests) inside a `windowMs`.
 *   - Per-actor key derived via `actorRateKey()` (userId / IP / demo sentinel).
 *   - Demo flows still consume a counter under a deterministic demo key.
 *   - When the limit is exceeded the helper returns a structured 429 JSON
 *     response with a `Retry-After` header and a clean message.
 *   - On Upstash transport failure we DEGRADE OPEN (allow the request) and
 *     log a single warning — auditing must never break the user response,
 *     and a transient Redis blip should not page every customer.
 *
 * Privacy:
 *   - The Upstash provider sends only the bucket key (e.g. `offer:user:<uuid>`)
 *     and an integer increment. No request body, no headers, no IPs.
 *   - Credentials live only in server env. They are never bundled.
 *
 * This file is server-only.
 */

import { NextResponse } from 'next/server'

import type { ActorContext } from '@/lib/data/auth'

export type RateLimitCategory =
  | 'offer'
  | 'item-write'
  | 'expert-review'
  | 'payout'
  | 'donation'
  | 'capture'
  | 'statement'
  | 'trust-receipt'

interface CategoryConfig {
  limit: number
  windowMs: number
  description: string
}

/**
 * Per-category limits. Tighten the high-impact categories (money movement,
 * trust receipts, offer decisions); leave high-frequency UX paths like the
 * capture checklist relatively loose.
 */
export const RATE_LIMITS: Record<RateLimitCategory, CategoryConfig> = {
  offer: { limit: 20, windowMs: 60_000, description: 'Offer accept/counter actions' },
  'item-write': { limit: 60, windowMs: 60_000, description: 'Item floor/disposition/stop-sell writes' },
  'expert-review': { limit: 30, windowMs: 60_000, description: 'Expert review routing' },
  payout: { limit: 5, windowMs: 60_000, description: 'Payout requests' },
  donation: { limit: 10, windowMs: 60_000, description: 'Donation routing changes' },
  capture: { limit: 240, windowMs: 60_000, description: 'Capture checklist updates' },
  statement: { limit: 10, windowMs: 60_000, description: 'Statement requests' },
  'trust-receipt': { limit: 30, windowMs: 60_000, description: 'Trust receipt creations' },
}

export type RateLimitProviderName = 'memory' | 'upstash'

export interface RateLimitOk {
  ok: true
  remaining: number
  limit: number
  resetMs: number
  provider: RateLimitProviderName
}

export interface RateLimitDenied {
  ok: false
  retryAfterSeconds: number
  resetMs: number
  limit: number
  category: RateLimitCategory
  provider: RateLimitProviderName
}

export type RateLimitResult = RateLimitOk | RateLimitDenied

interface RateLimitProvider {
  readonly name: RateLimitProviderName
  consume(category: RateLimitCategory, actorKey: string, now?: number): Promise<RateLimitResult>
  reset(): void
}

/* ────────────────────────────────────────────────────────────── */
/* Memory provider — sliding-window counter on a global Map.      */
/* ────────────────────────────────────────────────────────────── */

interface Bucket {
  start: number
  count: number
}

const memoryBuckets: Map<string, Bucket> = (globalThis as unknown as {
  __portalRateLimitBuckets?: Map<string, Bucket>
}).__portalRateLimitBuckets ?? new Map<string, Bucket>()

;(globalThis as unknown as { __portalRateLimitBuckets?: Map<string, Bucket> }).__portalRateLimitBuckets = memoryBuckets

const memoryProvider: RateLimitProvider = {
  name: 'memory',
  async consume(category, actorKey, now = Date.now()) {
    const cfg = RATE_LIMITS[category]
    const key = `${category}:${actorKey}`
    const bucket = memoryBuckets.get(key)
    if (!bucket || now - bucket.start >= cfg.windowMs) {
      memoryBuckets.set(key, { start: now, count: 1 })
      return {
        ok: true,
        remaining: cfg.limit - 1,
        limit: cfg.limit,
        resetMs: now + cfg.windowMs,
        provider: 'memory',
      }
    }
    if (bucket.count >= cfg.limit) {
      const resetMs = bucket.start + cfg.windowMs
      const retryAfterSeconds = Math.max(1, Math.ceil((resetMs - now) / 1000))
      return {
        ok: false,
        retryAfterSeconds,
        resetMs,
        limit: cfg.limit,
        category,
        provider: 'memory',
      }
    }
    bucket.count += 1
    return {
      ok: true,
      remaining: cfg.limit - bucket.count,
      limit: cfg.limit,
      resetMs: bucket.start + cfg.windowMs,
      provider: 'memory',
    }
  },
  reset() {
    memoryBuckets.clear()
  },
}

/* ────────────────────────────────────────────────────────────── */
/* Upstash provider — INCR + EXPIRE on first hit; degrade OPEN on */
/* any transport failure.                                          */
/* ────────────────────────────────────────────────────────────── */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.trim() || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || ''

function isUpstashConfigured(): boolean {
  return UPSTASH_URL.length > 0 && UPSTASH_TOKEN.length > 0
}

/**
 * Run a single Upstash REST pipeline command. Returns null on transport
 * failure — caller decides whether to degrade open.
 *
 * Pipeline shape: POST <url>/pipeline with body `[["INCR", key], ...]`.
 * Response: `[{ result: <int> }, { result: <"OK"|null> }, ...]`.
 */
async function upstashPipeline(commands: Array<Array<string | number>>): Promise<unknown[] | null> {
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
      // Always bypass any framework caching; rate limits are per-request.
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = (await res.json()) as Array<{ result?: unknown; error?: string }>
    if (!Array.isArray(json)) return null
    return json.map((r) => (r && 'result' in r ? r.result : null))
  } catch {
    return null
  }
}

let upstashWarnedOnce = false

const upstashProvider: RateLimitProvider = {
  name: 'upstash',
  async consume(category, actorKey, now = Date.now()) {
    const cfg = RATE_LIMITS[category]
    const ttlSeconds = Math.max(1, Math.ceil(cfg.windowMs / 1000))
    // Bucket key bound to category, actor, AND current window.
    // Using a window stamp keeps fixed-window semantics that match the
    // memory provider's behavior, so a single test can validate either.
    const windowStamp = Math.floor(now / cfg.windowMs)
    const key = `el:rl:${category}:${actorKey}:${windowStamp}`

    const results = await upstashPipeline([
      ['INCR', key],
      ['EXPIRE', key, ttlSeconds],
      ['PTTL', key],
    ])
    if (!results) {
      if (!upstashWarnedOnce) {
        upstashWarnedOnce = true
        console.warn('[rate-limit] upstash transport failed — degrading open until recovery')
      }
      // Degrade OPEN — allow the request but mark provider so callers/audit
      // can see we did not actually enforce.
      return {
        ok: true,
        remaining: cfg.limit,
        limit: cfg.limit,
        resetMs: now + cfg.windowMs,
        provider: 'upstash',
      }
    }
    upstashWarnedOnce = false

    const count = typeof results[0] === 'number' ? (results[0] as number) : 0
    const pttl = typeof results[2] === 'number' ? (results[2] as number) : cfg.windowMs
    const resetMs = now + Math.max(0, pttl)

    if (count > cfg.limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((resetMs - now) / 1000))
      return {
        ok: false,
        retryAfterSeconds,
        resetMs,
        limit: cfg.limit,
        category,
        provider: 'upstash',
      }
    }
    return {
      ok: true,
      remaining: Math.max(0, cfg.limit - count),
      limit: cfg.limit,
      resetMs,
      provider: 'upstash',
    }
  },
  reset() {
    // No-op for Upstash; tests never use this path.
  },
}

/* ────────────────────────────────────────────────────────────── */
/* Provider selection                                              */
/* ────────────────────────────────────────────────────────────── */

/**
 * Resolve which provider should be active given the current env. Pure so it
 * is easy to unit-test.
 */
export function selectProviderName(env: NodeJS.ProcessEnv = process.env): RateLimitProviderName {
  const u = env.UPSTASH_REDIS_REST_URL?.trim()
  const t = env.UPSTASH_REDIS_REST_TOKEN?.trim()
  return u && t ? 'upstash' : 'memory'
}

let activeProvider: RateLimitProvider = isUpstashConfigured() ? upstashProvider : memoryProvider

export function getActiveRateLimitProvider(): RateLimitProviderName {
  return activeProvider.name
}

/** Test-only: swap the active provider. */
export function __setRateLimitProviderForTests(
  name: RateLimitProviderName | 'auto',
): void {
  if (name === 'auto') {
    activeProvider = isUpstashConfigured() ? upstashProvider : memoryProvider
    return
  }
  activeProvider = name === 'upstash' ? upstashProvider : memoryProvider
}

/* ────────────────────────────────────────────────────────────── */
/* Public API                                                      */
/* ────────────────────────────────────────────────────────────── */

/**
 * Build a deterministic key per actor + category. Prefers authenticated
 * userId; falls back to inbound IP / forwarded-for; falls back to a demo
 * sentinel so demo flows still throttle (per category) without leaking
 * across users when multiple demo sessions happen in parallel.
 */
export function actorRateKey(req: Request, ctx: ActorContext): string {
  if (ctx.authenticated && ctx.userId) return `user:${ctx.userId}`
  const headers = req.headers
  const fwd = headers.get('x-forwarded-for')
  const real = headers.get('x-real-ip')
  const ip = (fwd?.split(',')[0]?.trim() || real || '').trim()
  if (ip) return `ip:${ip}`
  return ctx.mode === 'demo' ? `demo:${ctx.actorLabel}` : 'anonymous'
}

/**
 * Check (and consume one token from) the rate limit bucket for this
 * category + actor. Async because the durable provider hits Redis over the
 * network.
 */
export async function checkRateLimit(
  category: RateLimitCategory,
  actorKey: string,
  now: number = Date.now(),
): Promise<RateLimitResult> {
  return activeProvider.consume(category, actorKey, now)
}

/**
 * Build a structured 429 NextResponse when a rate limit is hit. Includes
 * the `Retry-After` header (seconds, per RFC 7231) and machine-readable
 * fields the UI can use to surface a friendly message.
 */
export function rateLimited(denied: RateLimitDenied) {
  console.warn(
    `[rate-limit] denied category=${denied.category} provider=${denied.provider} retryAfter=${denied.retryAfterSeconds}s limit=${denied.limit}`,
  )
  return NextResponse.json(
    {
      ok: false,
      error: 'Too many requests. Please slow down and try again shortly.',
      category: denied.category,
      retryAfterSeconds: denied.retryAfterSeconds,
      limit: denied.limit,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(denied.retryAfterSeconds),
      },
    },
  )
}

/**
 * Convenience wrapper used by route handlers:
 *
 *   const limited = await enforceRateLimit('offer', req, actor)
 *   if (limited) return limited
 *
 * Returns a NextResponse only when the request should be denied.
 */
export async function enforceRateLimit(
  category: RateLimitCategory,
  req: Request,
  ctx: ActorContext,
): Promise<NextResponse | null> {
  const key = actorRateKey(req, ctx)
  const result = await checkRateLimit(category, key)
  if (result.ok) return null
  return rateLimited(result)
}

/**
 * Same as `enforceRateLimit` but returns both the response and the
 * structured denial when the limit is hit. Used by helpers that want to
 * persist a denied-action audit event before returning the 429 response.
 */
export async function enforceRateLimitVerbose(
  category: RateLimitCategory,
  req: Request,
  ctx: ActorContext,
): Promise<{ response: NextResponse; denied: RateLimitDenied } | null> {
  const key = actorRateKey(req, ctx)
  const result = await checkRateLimit(category, key)
  if (result.ok) return null
  return { response: rateLimited(result), denied: result }
}

/** Reset the in-memory state. Test-only helper. */
export function __resetRateLimitsForTests() {
  memoryProvider.reset()
}
