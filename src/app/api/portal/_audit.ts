/**
 * Denied-action audit logging for portal API routes.
 *
 * Records 401 / 403 / 429 / CSRF denials to the `audit_events` table when
 * Supabase is configured. Falls back to a structured console log line in
 * demo mode and any time the persistent write fails — auditing must NEVER
 * break the user-facing route response.
 *
 * Privacy posture:
 *   - Never logs cookies, auth headers, or raw request bodies.
 *   - IPs and user-agents are hashed (sha-256, truncated) using a stable
 *     server-only salt. If no salt is configured the hash is best-effort
 *     correlation — see `PORTAL_AUDIT_SALT` below.
 *   - Free-form `reason` is short and operator-meaningful; never a
 *     verbatim error message from upstream services.
 *
 * Configuration:
 *   - `PORTAL_AUDIT_SALT` (server-only, NOT NEXT_PUBLIC_) — optional salt
 *     mixed into IP / user-agent hashes. Without it, hashes are still
 *     stable across requests but trivially reversible by anyone with the
 *     source. Set this in production.
 *
 * This file is server-only.
 */

import { createHash } from 'node:crypto'

import { isSupabaseConfigured } from '@/lib/data/env'
import type { ActorContext } from '@/lib/data/auth'

import type { CsrfDenied } from './_security'
import type { RateLimitDenied } from './_rate-limit'

export type AuditEventType =
  | 'auth_required'
  | 'forbidden'
  | 'rate_limited'
  | 'csrf_blocked'

export type AuditSeverity = 'info' | 'warn' | 'critical'

export interface AuditEventInput {
  eventType: AuditEventType
  severity?: AuditSeverity
  route: string
  method: string
  statusCode: number
  actor?: ActorContext | null
  caseId?: string | null
  itemId?: string | null
  offerId?: string | null
  reason?: string
  metadata?: Record<string, unknown>
}

const AUDIT_SALT = process.env.PORTAL_AUDIT_SALT ?? ''

/**
 * Stable, salted SHA-256 prefix. We truncate to 16 hex chars (~64 bits)
 * which is plenty for correlation but small enough to keep the table tidy.
 */
function hashWithSalt(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    return createHash('sha256').update(`${AUDIT_SALT}::${value}`).digest('hex').slice(0, 16)
  } catch {
    return null
  }
}

function extractIp(req: Request): string | null {
  const headers = req.headers
  const fwd = headers.get('x-forwarded-for')
  const real = headers.get('x-real-ip')
  const ip = (fwd?.split(',')[0]?.trim() || real || '').trim()
  return ip || null
}

function extractRoute(req: Request): string {
  try {
    const u = new URL(req.url)
    return u.pathname
  } catch {
    return req.url || 'unknown'
  }
}

interface RouteContext {
  method: string
  route: string
  ipHash: string | null
  userAgentHash: string | null
}

export function routeAuditContext(req: Request): RouteContext {
  return {
    method: req.method.toUpperCase(),
    route: extractRoute(req),
    ipHash: hashWithSalt(extractIp(req)),
    userAgentHash: hashWithSalt(req.headers.get('user-agent')),
  }
}

/**
 * Persist an audit event. Never throws — failures degrade to a console
 * warning so the user-facing route response is unaffected.
 */
export async function logDeniedAction(
  req: Request,
  input: AuditEventInput,
): Promise<void> {
  const ctx = routeAuditContext(req)
  const severity = input.severity ?? defaultSeverity(input.eventType)

  const row = {
    event_type: input.eventType,
    severity,
    route: input.route ?? ctx.route,
    method: input.method ?? ctx.method,
    status_code: input.statusCode,
    actor_user_id: input.actor?.userId ?? null,
    actor_label: input.actor?.actorLabel ?? null,
    case_id: input.caseId ?? null,
    item_id: input.itemId ?? null,
    offer_id: input.offerId ?? null,
    ip_hash: ctx.ipHash,
    user_agent_hash: ctx.userAgentHash,
    reason: input.reason ?? null,
    metadata: input.metadata ?? {},
  }

  // Always emit a structured console line for ops/SIEM forwarding.
  // Single line, machine-parseable, no secrets.
  try {
    console.warn(
      `[audit] ${row.event_type} status=${row.status_code} route=${row.route} method=${row.method} actor=${row.actor_user_id ?? 'anon'} reason=${JSON.stringify(row.reason ?? '')}`,
    )
  } catch {
    /* ignore */
  }

  if (!isSupabaseConfigured()) return

  try {
    const { getServerSupabase } = await import('@/lib/data/supabase-server')
    const sb = await getServerSupabase()
    if (!sb) return
    await sb.from('audit_events').insert(row)
  } catch {
    // Never break the route on audit failure.
  }
}

function defaultSeverity(eventType: AuditEventType): AuditSeverity {
  switch (eventType) {
    case 'auth_required':
      return 'info'
    case 'forbidden':
    case 'csrf_blocked':
      return 'warn'
    case 'rate_limited':
      return 'warn'
    default:
      return 'warn'
  }
}

/* ────────────────────────────────────────────────────────────── */
/* Convenience wrappers used by route handlers + helpers          */
/* ────────────────────────────────────────────────────────────── */

/**
 * Log an authz denial (401 or 403). Fire-and-forget — does not await.
 */
export function auditAuthzDenied(
  req: Request,
  input: {
    status: 401 | 403
    actor: ActorContext
    reason: string
    caseId?: string | null
    itemId?: string | null
    offerId?: string | null
  },
): void {
  void logDeniedAction(req, {
    eventType: input.status === 401 ? 'auth_required' : 'forbidden',
    statusCode: input.status,
    route: extractRoute(req),
    method: req.method.toUpperCase(),
    actor: input.actor,
    caseId: input.caseId,
    itemId: input.itemId,
    offerId: input.offerId,
    reason: input.reason,
  })
}

/**
 * Log a rate-limit denial (429). Fire-and-forget.
 */
export function auditRateLimited(
  req: Request,
  input: {
    actor: ActorContext
    denied: RateLimitDenied
    caseId?: string | null
    itemId?: string | null
    offerId?: string | null
  },
): void {
  void logDeniedAction(req, {
    eventType: 'rate_limited',
    statusCode: 429,
    route: extractRoute(req),
    method: req.method.toUpperCase(),
    actor: input.actor,
    caseId: input.caseId,
    itemId: input.itemId,
    offerId: input.offerId,
    reason: `rate-limit ${input.denied.category}`,
    metadata: {
      category: input.denied.category,
      limit: input.denied.limit,
      retryAfterSeconds: input.denied.retryAfterSeconds,
    },
  })
}

/**
 * Log a CSRF/origin denial (403). Fire-and-forget. Actor is usually
 * unresolved at this point — we still log route + reason.
 */
export function auditCsrfDenied(
  req: Request,
  input: {
    denied: CsrfDenied
    actor?: ActorContext | null
  },
): void {
  void logDeniedAction(req, {
    eventType: 'csrf_blocked',
    statusCode: 403,
    route: extractRoute(req),
    method: req.method.toUpperCase(),
    actor: input.actor ?? null,
    reason: `csrf:${input.denied.reason}`,
    metadata: {
      detail: input.denied.detail,
    },
  })
}
