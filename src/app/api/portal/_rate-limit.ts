/**
 * Centralized rate limiting for portal write routes.
 *
 * Implementation: in-memory sliding-window counter, keyed by
 * `<category>:<actorKey>`.
 *
 * ⚠️  Dev / single-instance only.
 * In a multi-instance production deployment (Vercel preview/serverless,
 * multiple Node containers) each instance keeps its own counter map and
 * the limit is effectively per-instance, not per-user. Replace with a
 * Redis / Upstash / Supabase-backed token bucket before relying on this
 * for abuse prevention in production. See docs/auth-rls.md.
 *
 * Behavior:
 *   - Each category has a `limit` (max requests) inside a `windowMs`.
 *   - Demo mode is allowed-by-default but still consumes a counter under a
 *     deterministic demo key, so the loops in seed flows still throttle if
 *     they ever go pathological.
 *   - When the limit is exceeded the helper returns a structured 429 JSON
 *     response with a `Retry-After` header and a clean message.
 *   - A simple console event is emitted on every limit hit for basic
 *     observability — no external services are involved.
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

interface Bucket {
  /** Window start (ms epoch). When `now - start > windowMs`, the bucket resets. */
  start: number
  count: number
}

const buckets: Map<string, Bucket> = (globalThis as unknown as {
  __portalRateLimitBuckets?: Map<string, Bucket>
}).__portalRateLimitBuckets ?? new Map<string, Bucket>()

;(globalThis as unknown as { __portalRateLimitBuckets?: Map<string, Bucket> }).__portalRateLimitBuckets = buckets

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

export interface RateLimitOk {
  ok: true
  remaining: number
  limit: number
  resetMs: number
}

export interface RateLimitDenied {
  ok: false
  retryAfterSeconds: number
  resetMs: number
  limit: number
  category: RateLimitCategory
}

export type RateLimitResult = RateLimitOk | RateLimitDenied

/**
 * Check (and consume one token from) the rate limit bucket for this
 * category + actor. Pure function over the in-memory bucket map; safe to
 * call from any route handler.
 */
export function checkRateLimit(
  category: RateLimitCategory,
  actorKey: string,
  now: number = Date.now(),
): RateLimitResult {
  const cfg = RATE_LIMITS[category]
  const key = `${category}:${actorKey}`
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.start >= cfg.windowMs) {
    buckets.set(key, { start: now, count: 1 })
    return { ok: true, remaining: cfg.limit - 1, limit: cfg.limit, resetMs: now + cfg.windowMs }
  }

  if (bucket.count >= cfg.limit) {
    const resetMs = bucket.start + cfg.windowMs
    const retryAfterSeconds = Math.max(1, Math.ceil((resetMs - now) / 1000))
    return { ok: false, retryAfterSeconds, resetMs, limit: cfg.limit, category }
  }

  bucket.count += 1
  return { ok: true, remaining: cfg.limit - bucket.count, limit: cfg.limit, resetMs: bucket.start + cfg.windowMs }
}

/**
 * Build a structured 429 NextResponse when a rate limit is hit. Includes
 * the `Retry-After` header (seconds, per RFC 7231) and machine-readable
 * fields the UI can use to surface a friendly message.
 */
export function rateLimited(denied: RateLimitDenied) {
  // Lightweight observability hook: a single line in server logs each time
  // we deny a request. Production deployments can pipe this to a real
  // logger / SIEM.
  console.warn(
    `[rate-limit] denied category=${denied.category} retryAfter=${denied.retryAfterSeconds}s limit=${denied.limit}`,
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
 *   const limited = enforceRateLimit('offer', req, actor)
 *   if (limited) return limited
 *
 * Returns a NextResponse only when the request should be denied.
 */
export function enforceRateLimit(
  category: RateLimitCategory,
  req: Request,
  ctx: ActorContext,
): NextResponse | null {
  const key = actorRateKey(req, ctx)
  const result = checkRateLimit(category, key)
  if (result.ok) return null
  return rateLimited(result)
}

/** Reset the in-memory state. Test-only helper. */
export function __resetRateLimitsForTests() {
  buckets.clear()
}
