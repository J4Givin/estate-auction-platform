import { NextResponse } from 'next/server'

import {
  authorize,
  getActorContext,
  type ActorContext,
  type AuthzDecision,
} from '@/lib/data/auth'

import { auditAuthzDenied, auditCsrfDenied, auditRateLimited } from './_audit'
import { enforceCsrf as rawEnforceCsrf } from './_security'
import { enforceRateLimitVerbose, type RateLimitCategory } from './_rate-limit'
import {
  finalizeIdempotency,
  reserveIdempotency,
  type IdempotencyHandle,
  type IdempotencyMeta,
  type IdempotencyScope,
} from './_idempotency'

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function jsonErr(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

export async function readJsonBody<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T
  } catch {
    return null
  }
}

/**
 * Resolve actor context for a portal API route.
 * In demo mode, falls back gracefully so seed flows work.
 */
export async function resolveActor(): Promise<ActorContext> {
  return getActorContext()
}

export interface AuditScope {
  caseId?: string | null
  itemId?: string | null
  offerId?: string | null
}

/**
 * Reject a request with the right HTTP code and a clean JSON envelope.
 * Use this in route handlers to surface 401/403 to clients without leaking
 * RLS error strings.
 *
 * When called with `req` + optional scope identifiers, also persists a
 * denied-action audit event. Audit failures never break the user response.
 */
export function rejectAuthz(
  decision: Extract<AuthzDecision, { ok: false }>,
  req?: Request,
  scope?: AuditScope,
) {
  if (req) {
    auditAuthzDenied(req, {
      status: decision.status,
      actor: decision.ctx,
      reason: decision.reason,
      caseId: scope?.caseId ?? null,
      itemId: scope?.itemId ?? null,
      offerId: scope?.offerId ?? null,
    })
  }
  return NextResponse.json(
    {
      ok: false,
      mode: decision.ctx.mode,
      error: decision.reason,
      authenticated: decision.ctx.authenticated,
    },
    { status: decision.status },
  )
}

/**
 * Run CSRF/origin protection. Returns a NextResponse iff the request must
 * be denied. Logs an audit event on denial.
 */
export function enforceCsrf(req: Request, actor?: ActorContext | null): NextResponse | null {
  const blocked = rawEnforceCsrf(req)
  if (!blocked) return null
  auditCsrfDenied(req, { denied: blocked.denied, actor: actor ?? null })
  return blocked.response
}

/**
 * Run rate-limit enforcement and audit on denial. Drop-in replacement for
 * direct `enforceRateLimit` calls when you want audit coverage.
 *
 * Async because the durable provider (Upstash) does a network round-trip;
 * the memory provider resolves synchronously so dev/demo stays snappy.
 */
export async function enforceRateLimit(
  category: RateLimitCategory,
  req: Request,
  ctx: ActorContext,
  scope?: AuditScope,
): Promise<NextResponse | null> {
  const result = await enforceRateLimitVerbose(category, req, ctx)
  if (!result) return null
  auditRateLimited(req, {
    actor: ctx,
    denied: result.denied,
    caseId: scope?.caseId ?? null,
    itemId: scope?.itemId ?? null,
    offerId: scope?.offerId ?? null,
  })
  return result.response
}

export { authorize }

/**
 * Reserve an idempotency slot for this request. Returns a `done` callback
 * the route should invoke with the final response, plus an `early`
 * NextResponse iff the request must be replayed or rejected immediately.
 *
 *   const idem = await beginIdempotency('offer:accept', req, body, ctx, scope)
 *   if (idem.early) return idem.early
 *   ...
 *   return idem.done(jsonOk(res), res)
 *
 * The cached body is the second argument to `done`. We pass the route's
 * domain object (not the NextResponse) so future replays return an
 * identical envelope without us re-serializing.
 */
export async function beginIdempotency(
  scope: IdempotencyScope,
  req: Request,
  body: unknown,
  actor: ActorContext,
  meta?: IdempotencyMeta,
): Promise<{ early: NextResponse | null; done: (response: NextResponse, cached?: unknown) => Promise<NextResponse>; handle: IdempotencyHandle | null }> {
  const outcome = await reserveIdempotency({ scope, req, body, actor, meta })
  if ('kind' in outcome && outcome.kind === 'replay') {
    return { early: outcome.response, done: async (r) => r, handle: null }
  }
  if ('kind' in outcome && outcome.kind === 'conflict') {
    return { early: outcome.response, done: async (r) => r, handle: null }
  }
  const handle = outcome as IdempotencyHandle
  return {
    early: null,
    handle,
    done: (response, cached) => finalizeIdempotency(handle, response, cached),
  }
}
