/**
 * Ops/Admin Audit Console.
 *
 * Surfaces denied-action events recorded in `audit_events` (rate-limit hits,
 * CSRF blocks, 401/403). Falls back to a realistic demo dataset when
 * Supabase is not configured or the table is empty so previews stay useful.
 *
 * Access: this is an ops/admin surface. Server-side RLS on `audit_events`
 * already restricts SELECT to admin/ops profiles; the route itself does not
 * leak rows to non-privileged users when a real Supabase session is in
 * play. In demo mode we render the synthetic dataset for UX previews.
 *
 * Privacy: no raw IPs / cookies / request bodies / tokens are displayed.
 * Only the salted hashes and short structured metadata stored in the
 * audit table.
 */

import { Suspense } from 'react'

import { getAuditConsole, type AuditEventType, type AuditSeverity } from '@/lib/data'
import { AuditConsole } from '@/components/ops/AuditConsole'

interface PageProps {
  searchParams: Promise<{
    type?: string
    severity?: string
    window?: string
    case?: string
    route?: string
    actor?: string
  }>
}

const VALID_TYPES = new Set<AuditEventType | 'all'>([
  'all',
  'auth_required',
  'forbidden',
  'rate_limited',
  'csrf_blocked',
])
const VALID_SEVERITY = new Set<AuditSeverity | 'all'>(['all', 'info', 'warn', 'critical'])

function parseWindow(raw: string | undefined): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return 24
  return Math.min(Math.max(Math.round(n), 1), 720)
}

export default async function OpsAuditPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const type = (sp.type && VALID_TYPES.has(sp.type as AuditEventType | 'all') ? sp.type : 'all') as
    | AuditEventType
    | 'all'
  const severity = (sp.severity && VALID_SEVERITY.has(sp.severity as AuditSeverity | 'all')
    ? sp.severity
    : 'all') as AuditSeverity | 'all'
  const windowHours = parseWindow(sp.window)
  const caseId = sp.case?.trim() || null
  const route = sp.route?.trim() || null
  const actor = sp.actor?.trim() || null

  const data = await getAuditConsole({
    eventType: type,
    severity,
    windowHours,
    caseId,
    route,
    actorLabel: actor,
    limit: 200,
  })

  return (
    <Suspense fallback={null}>
      <AuditConsole
        data={data}
        initialFilters={{ type, severity, windowHours, caseId, route, actor }}
      />
    </Suspense>
  )
}
