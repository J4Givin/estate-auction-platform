/**
 * Centralized idempotency for portal write routes.
 *
 * Behavior summary:
 *   1. Read key from `Idempotency-Key` header (preferred) or body field
 *      `idempotencyKey` (fallback for tools that can't set headers easily).
 *   2. If no key is present, the route runs without idempotency protection.
 *      A `Idempotency-Status: bypassed` response header is set so clients
 *      and ops/audit can spot un-keyed writes.
 *   3. With a key, hash (method + path + normalized body) using SHA-256 and
 *      try to RESERVE the row as `processing`.
 *   4. On unique-violation (duplicate key):
 *        - status=completed AND same request_hash → return cached
 *          response with `Idempotent-Replay: true`.
 *        - status=completed AND different request_hash →
 *          409 `idempotency_key_reused_with_different_request`.
 *        - status=processing → 409 `idempotency_key_in_progress`.
 *        - status=failed AND same request_hash → allow retry: we update
 *          the row back to `processing` and proceed (a previous attempt
 *          failed; the caller is welcome to try again).
 *        - status=failed AND different request_hash → 409
 *          `idempotency_key_reused_with_different_request`.
 *   5. On successful business write, COMPLETE the row with the response
 *      status + body so future replays return the same envelope.
 *   6. On business failure (thrown / non-2xx), MARK FAILED so the caller
 *      can retry with the same key.
 *
 * Privacy:
 *   - Raw request body is NEVER stored — only the SHA-256 hash of the
 *     normalized body. Cookies, auth headers, and Idempotency-Key value
 *     itself are not part of the hash.
 *   - The cached `response_body` is the same JSON envelope our route
 *     would return on a fresh request. If a route ever needs to surface a
 *     secret, it must NOT use this helper for that response.
 *
 * Demo mode:
 *   - When Supabase is not configured, an in-memory map provides the same
 *     semantics so demo flows can demonstrate idempotency end-to-end.
 *   - The map lives on `globalThis` so HMR doesn't reset it during dev.
 *
 * Failure posture:
 *   - Any infra failure (DB unavailable, etc.) DEGRADES OPEN: we run the
 *     business write without idempotency and tag the response with
 *     `Idempotency-Status: degraded`. Idempotency is defense-in-depth on
 *     top of route authz/rate-limit; a transient blip should not break
 *     legitimate writes.
 *
 * This file is server-only.
 */

import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'

import { isSupabaseConfigured } from '@/lib/data/env'
import type { ActorContext } from '@/lib/data/auth'

export type IdempotencyScope =
  | 'offer:accept'
  | 'offer:counter'
  | 'item:floor'
  | 'item:disposition'
  | 'item:stop-sell'
  | 'item:expert-review'
  | 'payout:request'
  | 'donation:routing'
  | 'capture:checklist'
  | 'statement:request'
  | 'trust-receipt:create'

const ANON_ACTOR_UUID = '00000000-0000-0000-0000-000000000000'

/** Hex SHA-256 of the canonical request fingerprint. */
export function hashRequest(method: string, path: string, body: unknown): string {
  const normalized = stableStringify(body ?? null)
  return createHash('sha256').update(`${method.toUpperCase()}\n${path}\n${normalized}`).digest('hex')
}

/**
 * Stable JSON stringify (recursive key sort) so semantically-equal bodies
 * hash to the same value regardless of property order.
 */
function stableStringify(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v)
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']'
  const obj = v as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + stableStringify(obj[k])).join(',') + '}'
}

export interface IdempotencyMeta {
  caseId?: string | null
  itemId?: string | null
  offerId?: string | null
}

export interface IdempotencyHandle {
  /** The key extracted from headers/body, or null when bypassed/degraded. */
  key: string | null
  /** Whether persistence is active for this request. */
  active: boolean
  /** SHA-256 hex of the normalized request fingerprint. */
  requestHash: string
  /** Mark the reservation as completed, persisting the response envelope. */
  complete: (status: number, body: unknown) => Promise<void>
  /** Mark the reservation as failed, allowing a future retry with the same key. */
  fail: (reason?: string) => Promise<void>
  /** Headers to attach to the route's response (status tag, replay marker). */
  responseHeaders: Record<string, string>
}

export interface IdempotencyReplay {
  kind: 'replay'
  response: NextResponse
}

export interface IdempotencyConflict {
  kind: 'conflict'
  response: NextResponse
}

export type IdempotencyOutcome = IdempotencyHandle | IdempotencyReplay | IdempotencyConflict

/**
 * Read the idempotency key from headers (or body fallback). Returns null
 * when no key is present.
 */
export function readIdempotencyKey(req: Request, body: unknown): string | null {
  const header = req.headers.get('idempotency-key') || req.headers.get('Idempotency-Key')
  const fromHeader = header?.trim()
  if (fromHeader) return fromHeader.slice(0, 200)
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const candidate = (body as Record<string, unknown>).idempotencyKey
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim().slice(0, 200)
  }
  return null
}

/* ────────────────────────────────────────────────────────────── */
/* In-memory store for demo / fallback                             */
/* ────────────────────────────────────────────────────────────── */

interface MemoryRow {
  idempotency_key: string
  scope: string
  actor_user_id: string
  request_hash: string
  status: 'processing' | 'completed' | 'failed'
  response_status: number | null
  response_body: unknown
  expires_at: number
  case_id: string | null
  item_id: string | null
  offer_id: string | null
}

const memoryStore: Map<string, MemoryRow> = (globalThis as unknown as {
  __portalIdempotencyStore?: Map<string, MemoryRow>
}).__portalIdempotencyStore ?? new Map<string, MemoryRow>()

;(globalThis as unknown as { __portalIdempotencyStore?: Map<string, MemoryRow> }).__portalIdempotencyStore = memoryStore

function memoryKey(scope: string, idempotencyKey: string, actorUuid: string): string {
  return `${scope}|${idempotencyKey}|${actorUuid}`
}

function memoryReserve(row: Omit<MemoryRow, 'expires_at'> & { ttlMs: number }): MemoryRow | 'conflict-different-hash' | 'conflict-in-progress' | { kind: 'replay'; row: MemoryRow } {
  const now = Date.now()
  const k = memoryKey(row.scope, row.idempotency_key, row.actor_user_id)
  const existing = memoryStore.get(k)
  if (!existing || existing.expires_at < now) {
    const next: MemoryRow = { ...row, expires_at: now + row.ttlMs }
    memoryStore.set(k, next)
    return next
  }
  if (existing.request_hash !== row.request_hash) return 'conflict-different-hash'
  if (existing.status === 'processing') return 'conflict-in-progress'
  if (existing.status === 'completed') return { kind: 'replay', row: existing }
  // failed + same hash → retry allowed
  const next: MemoryRow = { ...existing, status: 'processing', response_body: null, response_status: null, expires_at: now + row.ttlMs }
  memoryStore.set(k, next)
  return next
}

function memoryComplete(row: MemoryRow, status: number, body: unknown) {
  const k = memoryKey(row.scope, row.idempotency_key, row.actor_user_id)
  const cur = memoryStore.get(k)
  if (!cur) return
  cur.status = 'completed'
  cur.response_status = status
  cur.response_body = body
  memoryStore.set(k, cur)
}

function memoryFail(row: MemoryRow) {
  const k = memoryKey(row.scope, row.idempotency_key, row.actor_user_id)
  const cur = memoryStore.get(k)
  if (!cur) return
  cur.status = 'failed'
  memoryStore.set(k, cur)
}

/* ────────────────────────────────────────────────────────────── */
/* Public reservation entrypoint                                    */
/* ────────────────────────────────────────────────────────────── */

interface ReserveOptions {
  scope: IdempotencyScope
  req: Request
  body: unknown
  actor: ActorContext
  meta?: IdempotencyMeta
  ttlSeconds?: number
}

export async function reserveIdempotency(opts: ReserveOptions): Promise<IdempotencyOutcome> {
  const key = readIdempotencyKey(opts.req, opts.body)
  const path = extractPath(opts.req)
  const requestHash = hashRequest(opts.req.method, path, sanitizeBodyForHash(opts.body))

  // No key: route still runs, but there's nothing to reserve. Return a
  // pass-through handle the route can use uniformly.
  if (!key) {
    return passthroughHandle(requestHash, { 'Idempotency-Status': 'bypassed' })
  }

  const actorUuid = opts.actor.userId ?? ANON_ACTOR_UUID
  const ttlMs = (opts.ttlSeconds ?? 60 * 60 * 24) * 1000

  if (!isSupabaseConfigured()) {
    return reserveInMemory({ ...opts, key, requestHash, actorUuid, ttlMs })
  }

  // Persistent path. Any DB error degrades open.
  try {
    const { getServerSupabase } = await import('@/lib/data/supabase-server')
    const sb = await getServerSupabase()
    if (!sb) return passthroughHandle(requestHash, { 'Idempotency-Status': 'degraded' })

    const insertRow = {
      idempotency_key: key,
      scope: opts.scope,
      actor_user_id: opts.actor.userId,
      actor_label: opts.actor.actorLabel ?? null,
      request_hash: requestHash,
      status: 'processing' as const,
      case_id: opts.meta?.caseId ?? null,
      item_id: opts.meta?.itemId ?? null,
      offer_id: opts.meta?.offerId ?? null,
      expires_at: new Date(Date.now() + ttlMs).toISOString(),
    }

    const { data: inserted, error: insertError } = await sb
      .from('idempotency_keys')
      .insert(insertRow)
      .select('idempotency_row_id')
      .single()

    if (!insertError && inserted) {
      // Reserved fresh. Build a handle that completes/fails through the row.
      return persistentHandle({
        sb,
        key,
        scope: opts.scope,
        actorUuid,
        actorUserId: opts.actor.userId,
        requestHash,
        rowId: inserted.idempotency_row_id as string,
      })
    }

    // Conflict path. Look up the existing row and decide replay/conflict.
    const { data: existing } = await sb
      .from('idempotency_keys')
      .select('status,request_hash,response_status,response_body')
      .eq('idempotency_key', key)
      .eq('scope', opts.scope)
      .filter('actor_user_id', opts.actor.userId ? 'eq' : 'is', opts.actor.userId ?? null)
      .maybeSingle()

    if (!existing) {
      // We hit a unique violation but can't find the row. Degrade open.
      return passthroughHandle(requestHash, { 'Idempotency-Status': 'degraded' })
    }

    if (existing.request_hash !== requestHash) {
      return {
        kind: 'conflict',
        response: NextResponse.json(
          {
            ok: false,
            error: 'Idempotency key was reused with a different request body.',
            reason: 'idempotency_key_reused_with_different_request',
          },
          { status: 409, headers: { 'Idempotency-Status': 'conflict' } },
        ),
      }
    }

    if (existing.status === 'processing') {
      return {
        kind: 'conflict',
        response: NextResponse.json(
          {
            ok: false,
            error: 'A request with this Idempotency-Key is already in progress. Retry shortly.',
            reason: 'idempotency_key_in_progress',
          },
          { status: 409, headers: { 'Idempotency-Status': 'in-progress', 'Retry-After': '2' } },
        ),
      }
    }

    if (existing.status === 'completed') {
      const status = existing.response_status ?? 200
      const cached = existing.response_body ?? { ok: true }
      return {
        kind: 'replay',
        response: NextResponse.json(cached, {
          status,
          headers: { 'Idempotent-Replay': 'true', 'Idempotency-Status': 'replayed' },
        }),
      }
    }

    // Failed + same hash → allow retry. Reset the row to processing.
    const { error: updateError } = await sb
      .from('idempotency_keys')
      .update({
        status: 'processing',
        response_status: null,
        response_body: null,
        expires_at: new Date(Date.now() + ttlMs).toISOString(),
      })
      .eq('idempotency_key', key)
      .eq('scope', opts.scope)
      .filter('actor_user_id', opts.actor.userId ? 'eq' : 'is', opts.actor.userId ?? null)

    if (updateError) return passthroughHandle(requestHash, { 'Idempotency-Status': 'degraded' })

    return persistentHandle({
      sb,
      key,
      scope: opts.scope,
      actorUuid,
      actorUserId: opts.actor.userId,
      requestHash,
      rowId: null,
    })
  } catch {
    return passthroughHandle(requestHash, { 'Idempotency-Status': 'degraded' })
  }
}

/* ────────────────────────────────────────────────────────────── */
/* Handles                                                          */
/* ────────────────────────────────────────────────────────────── */

function passthroughHandle(requestHash: string, headers: Record<string, string>): IdempotencyHandle {
  return {
    key: null,
    active: false,
    requestHash,
    async complete() {
      /* no-op */
    },
    async fail() {
      /* no-op */
    },
    responseHeaders: headers,
  }
}

interface ReserveMemoryArgs extends ReserveOptions {
  key: string
  requestHash: string
  actorUuid: string
  ttlMs: number
}

function reserveInMemory(args: ReserveMemoryArgs): IdempotencyOutcome {
  const result = memoryReserve({
    idempotency_key: args.key,
    scope: args.scope,
    actor_user_id: args.actorUuid,
    request_hash: args.requestHash,
    status: 'processing',
    response_status: null,
    response_body: null,
    case_id: args.meta?.caseId ?? null,
    item_id: args.meta?.itemId ?? null,
    offer_id: args.meta?.offerId ?? null,
    ttlMs: args.ttlMs,
  })

  if (result === 'conflict-different-hash') {
    return {
      kind: 'conflict',
      response: NextResponse.json(
        {
          ok: false,
          error: 'Idempotency key was reused with a different request body.',
          reason: 'idempotency_key_reused_with_different_request',
        },
        { status: 409, headers: { 'Idempotency-Status': 'conflict' } },
      ),
    }
  }
  if (result === 'conflict-in-progress') {
    return {
      kind: 'conflict',
      response: NextResponse.json(
        {
          ok: false,
          error: 'A request with this Idempotency-Key is already in progress. Retry shortly.',
          reason: 'idempotency_key_in_progress',
        },
        { status: 409, headers: { 'Idempotency-Status': 'in-progress', 'Retry-After': '2' } },
      ),
    }
  }
  if (typeof result === 'object' && 'kind' in result && result.kind === 'replay') {
    const status = result.row.response_status ?? 200
    const cached = result.row.response_body ?? { ok: true }
    return {
      kind: 'replay',
      response: NextResponse.json(cached, {
        status,
        headers: { 'Idempotent-Replay': 'true', 'Idempotency-Status': 'replayed' },
      }),
    }
  }
  // Reserved (fresh or retry-after-fail).
  const row = result as MemoryRow
  return {
    key: args.key,
    active: true,
    requestHash: args.requestHash,
    async complete(status, body) {
      memoryComplete(row, status, body)
    },
    async fail() {
      memoryFail(row)
    },
    responseHeaders: { 'Idempotency-Status': 'reserved' },
  }
}

interface PersistentHandleArgs {
  sb: NonNullable<Awaited<ReturnType<typeof import('@/lib/data/supabase-server').getServerSupabase>>>
  key: string
  scope: IdempotencyScope
  actorUuid: string
  actorUserId: string | null
  requestHash: string
  rowId: string | null
}

function persistentHandle(args: PersistentHandleArgs): IdempotencyHandle {
  return {
    key: args.key,
    active: true,
    requestHash: args.requestHash,
    async complete(status, body) {
      try {
        const safeBody = sanitizeResponseForCache(body)
        await args.sb
          .from('idempotency_keys')
          .update({
            status: 'completed',
            response_status: status,
            response_body: safeBody as unknown as Record<string, unknown>,
          })
          .eq('idempotency_key', args.key)
          .eq('scope', args.scope)
          .filter('actor_user_id', args.actorUserId ? 'eq' : 'is', args.actorUserId)
      } catch {
        /* ignore */
      }
    },
    async fail() {
      try {
        await args.sb
          .from('idempotency_keys')
          .update({ status: 'failed' })
          .eq('idempotency_key', args.key)
          .eq('scope', args.scope)
          .filter('actor_user_id', args.actorUserId ? 'eq' : 'is', args.actorUserId)
      } catch {
        /* ignore */
      }
    },
    responseHeaders: { 'Idempotency-Status': 'reserved' },
  }
}

/* ────────────────────────────────────────────────────────────── */
/* Helpers                                                          */
/* ────────────────────────────────────────────────────────────── */

function extractPath(req: Request): string {
  try {
    return new URL(req.url).pathname
  } catch {
    return req.url
  }
}

/**
 * Strip the idempotency key (when supplied via body) before hashing so a
 * client that varies its key value but keeps the rest of the body
 * identical still hashes to the same value. We never want the key itself
 * to be part of its own request hash.
 */
function sanitizeBodyForHash(body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body
  const clone = { ...(body as Record<string, unknown>) }
  delete clone.idempotencyKey
  return clone
}

/**
 * Cached responses must never store secrets / cookies. Our route helpers
 * already return clean JSON envelopes, but we belt-and-suspender here in
 * case a future caller passes a response with sensitive top-level fields.
 */
function sanitizeResponseForCache(body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body
  const clone = { ...(body as Record<string, unknown>) }
  for (const k of Object.keys(clone)) {
    if (/cookie|authorization|secret|token|password/i.test(k)) delete clone[k]
  }
  return clone
}

/**
 * Helper that wraps a route's NextResponse to include idempotency
 * headers. When the handle is active, also commits the cached response.
 */
export async function finalizeIdempotency(
  handle: IdempotencyHandle,
  response: NextResponse,
  cached?: unknown,
): Promise<NextResponse> {
  for (const [k, v] of Object.entries(handle.responseHeaders)) {
    if (!response.headers.has(k)) response.headers.set(k, v)
  }
  if (handle.active && response.status >= 200 && response.status < 300 && cached !== undefined) {
    await handle.complete(response.status, cached)
  } else if (handle.active && (response.status >= 400 || response.status < 200)) {
    await handle.fail()
  }
  return response
}

/** Test-only reset for the in-memory store. */
export function __resetIdempotencyForTests() {
  memoryStore.clear()
}
