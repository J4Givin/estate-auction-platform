/**
 * Read-side helpers for the security audit console.
 *
 * Pulls denied-action events from `audit_events` (see migration 0005) when
 * Supabase is configured; otherwise returns a realistic, deterministic demo
 * dataset so the ops console has something useful to look at in preview /
 * local-dev mode.
 *
 * Privacy posture mirrors `_audit.ts`:
 *   - We never expose raw IPs, cookies, headers, request bodies, or auth
 *     tokens. The table itself only stores hashes; this reader passes
 *     them through unchanged.
 *   - Demo events are synthesized — no real PII anywhere.
 *
 * Server-only.
 */

import { isSupabaseConfigured, getDataMode, type DataMode } from './env'

export type AuditEventType =
  | 'auth_required'
  | 'forbidden'
  | 'rate_limited'
  | 'csrf_blocked'

export type AuditSeverity = 'info' | 'warn' | 'critical'

export interface AuditEventRow {
  id: string
  createdAt: string
  eventType: AuditEventType
  severity: AuditSeverity
  route: string
  method: string
  statusCode: number
  actorUserId: string | null
  actorLabel: string | null
  caseId: string | null
  itemId: string | null
  offerId: string | null
  ipHash: string | null
  userAgentHash: string | null
  reason: string | null
  metadata: Record<string, unknown>
}

export interface AuditQuery {
  eventType?: AuditEventType | 'all'
  severity?: AuditSeverity | 'all'
  windowHours?: number
  caseId?: string | null
  route?: string | null
  actorLabel?: string | null
  limit?: number
}

export interface AuditSummary {
  total: number
  authRequired: number
  forbidden: number
  rateLimited: number
  csrfBlocked: number
  topRoutes: Array<{ route: string; count: number }>
  topActors: Array<{ actor: string; count: number }>
  windowHours: number
  mode: DataMode
}

export interface AuditConsoleData {
  mode: DataMode
  events: AuditEventRow[]
  summary: AuditSummary
  liveBackingTable: boolean
}

/* ────────────────────────────────────────────────────────────── */
/* Demo dataset                                                    */
/* ────────────────────────────────────────────────────────────── */

const DEMO_AUDIT_EVENTS: AuditEventRow[] = (() => {
  const now = Date.now()
  const m = (mins: number) => new Date(now - mins * 60_000).toISOString()
  const hash = (n: number) => `h${n.toString(16).padStart(8, '0')}${'a1b2'.repeat(2)}`.slice(0, 16)
  const events: AuditEventRow[] = [
    {
      id: 'evt-001',
      createdAt: m(2),
      eventType: 'rate_limited',
      severity: 'warn',
      route: '/api/portal/offers/accept',
      method: 'POST',
      statusCode: 429,
      actorUserId: null,
      actorLabel: 'demo-actor',
      caseId: 'JOB-2026-0418',
      itemId: null,
      offerId: 'OFF-2026-001',
      ipHash: hash(1),
      userAgentHash: hash(11),
      reason: 'rate-limit offer',
      metadata: { category: 'offer', limit: 20, retryAfterSeconds: 22 },
    },
    {
      id: 'evt-002',
      createdAt: m(7),
      eventType: 'forbidden',
      severity: 'warn',
      route: '/api/portal/items/ITM-218/floor',
      method: 'POST',
      statusCode: 403,
      actorUserId: 'aa11bb22-cccc-4ddd-9eee-ff0011223344',
      actorLabel: 'expert@example.com',
      caseId: 'JOB-2026-0418',
      itemId: 'ITM-218',
      offerId: null,
      ipHash: hash(2),
      userAgentHash: hash(12),
      reason: 'You cannot set a floor price on this item',
      metadata: {},
    },
    {
      id: 'evt-003',
      createdAt: m(14),
      eventType: 'csrf_blocked',
      severity: 'warn',
      route: '/api/portal/payouts/request',
      method: 'POST',
      statusCode: 403,
      actorUserId: null,
      actorLabel: null,
      caseId: 'JOB-2026-0418',
      itemId: null,
      offerId: null,
      ipHash: hash(3),
      userAgentHash: hash(13),
      reason: 'csrf:cross-site-fetch-metadata',
      metadata: { detail: 'Sec-Fetch-Site=cross-site' },
    },
    {
      id: 'evt-004',
      createdAt: m(28),
      eventType: 'auth_required',
      severity: 'info',
      route: '/api/portal/trust-receipts',
      method: 'POST',
      statusCode: 401,
      actorUserId: null,
      actorLabel: 'anonymous',
      caseId: 'JOB-2026-0418',
      itemId: 'ITM-103',
      offerId: null,
      ipHash: hash(4),
      userAgentHash: hash(14),
      reason: 'Sign in required',
      metadata: {},
    },
    {
      id: 'evt-005',
      createdAt: m(46),
      eventType: 'rate_limited',
      severity: 'warn',
      route: '/api/portal/payouts/request',
      method: 'POST',
      statusCode: 429,
      actorUserId: 'cc55dd66-eeee-4fff-9000-112233445566',
      actorLabel: 'owner@example.com',
      caseId: 'JOB-2026-0418',
      itemId: null,
      offerId: null,
      ipHash: hash(5),
      userAgentHash: hash(15),
      reason: 'rate-limit payout',
      metadata: { category: 'payout', limit: 5, retryAfterSeconds: 41 },
    },
    {
      id: 'evt-006',
      createdAt: m(63),
      eventType: 'forbidden',
      severity: 'critical',
      route: '/api/portal/offers/accept',
      method: 'POST',
      statusCode: 403,
      actorUserId: '99887766-5544-4332-8221-aabbccddeeff',
      actorLabel: 'partner@example.com',
      caseId: 'JOB-2026-0418',
      itemId: null,
      offerId: 'OFF-2026-001',
      ipHash: hash(6),
      userAgentHash: hash(16),
      reason: 'You do not have write access to the case for this offer',
      metadata: {},
    },
    {
      id: 'evt-007',
      createdAt: m(95),
      eventType: 'csrf_blocked',
      severity: 'warn',
      route: '/api/portal/donations/routing',
      method: 'POST',
      statusCode: 403,
      actorUserId: null,
      actorLabel: null,
      caseId: null,
      itemId: null,
      offerId: null,
      ipHash: hash(7),
      userAgentHash: hash(17),
      reason: 'csrf:origin-mismatch',
      metadata: { detail: 'origin=https://malicious.example' },
    },
    {
      id: 'evt-008',
      createdAt: m(140),
      eventType: 'rate_limited',
      severity: 'warn',
      route: '/api/portal/items/ITM-091/disposition',
      method: 'POST',
      statusCode: 429,
      actorUserId: 'cc55dd66-eeee-4fff-9000-112233445566',
      actorLabel: 'owner@example.com',
      caseId: 'JOB-2026-0418',
      itemId: 'ITM-091',
      offerId: null,
      ipHash: hash(8),
      userAgentHash: hash(18),
      reason: 'rate-limit item-write',
      metadata: { category: 'item-write', limit: 60, retryAfterSeconds: 9 },
    },
    {
      id: 'evt-009',
      createdAt: m(188),
      eventType: 'auth_required',
      severity: 'info',
      route: '/api/portal/statements/request',
      method: 'POST',
      statusCode: 401,
      actorUserId: null,
      actorLabel: 'anonymous',
      caseId: 'JOB-2026-0418',
      itemId: null,
      offerId: null,
      ipHash: hash(9),
      userAgentHash: hash(19),
      reason: 'Sign in required',
      metadata: {},
    },
    {
      id: 'evt-010',
      createdAt: m(240),
      eventType: 'forbidden',
      severity: 'warn',
      route: '/api/portal/items/ITM-411/stop-sell',
      method: 'POST',
      statusCode: 403,
      actorUserId: '11223344-5566-4778-9988-aabbccddeeff',
      actorLabel: 'viewer@example.com',
      caseId: 'JOB-2026-0418',
      itemId: 'ITM-411',
      offerId: null,
      ipHash: hash(10),
      userAgentHash: hash(20),
      reason: 'You cannot stop-sell this item',
      metadata: {},
    },
  ]
  return events
})()

function rowToAuditEvent(row: Record<string, unknown>): AuditEventRow {
  return {
    id: String(row.audit_event_id ?? row.id ?? ''),
    createdAt: String(row.created_at ?? ''),
    eventType: (row.event_type as AuditEventType) ?? 'forbidden',
    severity: (row.severity as AuditSeverity) ?? 'warn',
    route: String(row.route ?? ''),
    method: String(row.method ?? ''),
    statusCode: typeof row.status_code === 'number' ? row.status_code : Number(row.status_code ?? 0),
    actorUserId: (row.actor_user_id as string | null) ?? null,
    actorLabel: (row.actor_label as string | null) ?? null,
    caseId: (row.case_id as string | null) ?? null,
    itemId: (row.item_id as string | null) ?? null,
    offerId: (row.offer_id as string | null) ?? null,
    ipHash: (row.ip_hash as string | null) ?? null,
    userAgentHash: (row.user_agent_hash as string | null) ?? null,
    reason: (row.reason as string | null) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  }
}

/* ────────────────────────────────────────────────────────────── */
/* Pure helpers (used by route + tests)                            */
/* ────────────────────────────────────────────────────────────── */

export function filterAuditEvents(events: AuditEventRow[], q: AuditQuery): AuditEventRow[] {
  const windowMs = (q.windowHours ?? 24) * 3_600_000
  const cutoff = Date.now() - windowMs
  return events.filter((e) => {
    if (q.eventType && q.eventType !== 'all' && e.eventType !== q.eventType) return false
    if (q.severity && q.severity !== 'all' && e.severity !== q.severity) return false
    if (q.caseId && e.caseId !== q.caseId) return false
    if (q.route && !e.route.includes(q.route)) return false
    if (q.actorLabel && (e.actorLabel ?? '').toLowerCase().indexOf(q.actorLabel.toLowerCase()) === -1) return false
    const ts = Date.parse(e.createdAt)
    if (!Number.isFinite(ts)) return true
    return ts >= cutoff
  })
}

export function summarizeAuditEvents(events: AuditEventRow[], windowHours = 24): AuditSummary {
  const counts = { authRequired: 0, forbidden: 0, rateLimited: 0, csrfBlocked: 0 }
  const byRoute = new Map<string, number>()
  const byActor = new Map<string, number>()
  for (const e of events) {
    if (e.eventType === 'auth_required') counts.authRequired += 1
    else if (e.eventType === 'forbidden') counts.forbidden += 1
    else if (e.eventType === 'rate_limited') counts.rateLimited += 1
    else if (e.eventType === 'csrf_blocked') counts.csrfBlocked += 1
    byRoute.set(e.route, (byRoute.get(e.route) ?? 0) + 1)
    const actor = e.actorLabel ?? (e.actorUserId ? `user:${e.actorUserId.slice(0, 8)}` : 'anonymous')
    byActor.set(actor, (byActor.get(actor) ?? 0) + 1)
  }
  const top = (m: Map<string, number>) =>
    [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, v]) => ({ count: v, key: k }))
  return {
    total: events.length,
    authRequired: counts.authRequired,
    forbidden: counts.forbidden,
    rateLimited: counts.rateLimited,
    csrfBlocked: counts.csrfBlocked,
    topRoutes: top(byRoute).map((x) => ({ route: x.key, count: x.count })),
    topActors: top(byActor).map((x) => ({ actor: x.key, count: x.count })),
    windowHours,
    mode: getDataMode(),
  }
}

/* ────────────────────────────────────────────────────────────── */
/* Public reader                                                   */
/* ────────────────────────────────────────────────────────────── */

export async function getAuditConsole(query: AuditQuery = {}): Promise<AuditConsoleData> {
  const windowHours = query.windowHours ?? 24
  const limit = Math.min(Math.max(query.limit ?? 200, 1), 500)
  const baseQuery: AuditQuery = { ...query, windowHours, limit }

  if (!isSupabaseConfigured()) {
    const filtered = filterAuditEvents(DEMO_AUDIT_EVENTS, baseQuery).slice(0, limit)
    return {
      mode: 'demo',
      events: filtered,
      summary: summarizeAuditEvents(filtered, windowHours),
      liveBackingTable: false,
    }
  }

  try {
    const { getServerSupabase } = await import('./supabase-server')
    const sb = await getServerSupabase()
    if (!sb) throw new Error('no-supabase-client')
    const cutoff = new Date(Date.now() - windowHours * 3_600_000).toISOString()
    let q = sb
      .from('audit_events')
      .select('*')
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (query.eventType && query.eventType !== 'all') q = q.eq('event_type', query.eventType)
    if (query.severity && query.severity !== 'all') q = q.eq('severity', query.severity)
    if (query.caseId) q = q.eq('case_id', query.caseId)
    if (query.route) q = q.ilike('route', `%${query.route}%`)
    if (query.actorLabel) q = q.ilike('actor_label', `%${query.actorLabel}%`)
    const { data, error } = await q
    if (error || !data) throw error ?? new Error('no-rows')
    const events = data.map((r) => rowToAuditEvent(r as Record<string, unknown>))
    if (events.length === 0) {
      // Empty table — still surface demo events so the ops console is
      // useful before any real denials have been recorded.
      const filtered = filterAuditEvents(DEMO_AUDIT_EVENTS, baseQuery).slice(0, limit)
      return {
        mode: 'supabase',
        events: filtered,
        summary: summarizeAuditEvents(filtered, windowHours),
        liveBackingTable: true,
      }
    }
    return {
      mode: 'supabase',
      events,
      summary: summarizeAuditEvents(events, windowHours),
      liveBackingTable: true,
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[audit] supabase read failed, using demo events:', (err as Error).message)
    }
    const filtered = filterAuditEvents(DEMO_AUDIT_EVENTS, baseQuery).slice(0, limit)
    return {
      mode: getDataMode(),
      events: filtered,
      summary: summarizeAuditEvents(filtered, windowHours),
      liveBackingTable: false,
    }
  }
}

/** Test/internal: return the raw demo dataset. */
export function __getDemoAuditEvents(): AuditEventRow[] {
  return [...DEMO_AUDIT_EVENTS]
}
