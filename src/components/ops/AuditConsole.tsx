'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import type {
  AuditConsoleData,
  AuditEventRow,
  AuditEventType,
  AuditSeverity,
} from '@/lib/data/audit'

const TYPE_LABEL: Record<AuditEventType, string> = {
  auth_required: 'Auth required',
  forbidden: 'Forbidden',
  rate_limited: 'Rate limited',
  csrf_blocked: 'CSRF blocked',
}

const TYPE_COLOR: Record<AuditEventType, string> = {
  auth_required: '#826DEE',
  forbidden: '#F94500',
  rate_limited: '#FFDB15',
  csrf_blocked: '#0A0A0A',
}

const SEVERITY_TONE: Record<AuditSeverity, string> = {
  info: '#6B6B6B',
  warn: '#B07A00',
  critical: '#F94500',
}

interface Filters {
  type: AuditEventType | 'all'
  severity: AuditSeverity | 'all'
  windowHours: number
  caseId: string | null
  route: string | null
  actor: string | null
}

interface AuditConsoleProps {
  data: AuditConsoleData
  initialFilters: Filters
}

function fmtTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function relativeTime(iso: string): string {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return ''
  const diffMs = Date.now() - t
  const mins = Math.round(diffMs / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

export function AuditConsole({ data, initialFilters }: AuditConsoleProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const events = data.events

  function applyFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    const next = { ...filters, [key]: value }
    setFilters(next)
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    const map: Record<keyof Filters, string> = {
      type: 'type',
      severity: 'severity',
      windowHours: 'window',
      caseId: 'case',
      route: 'route',
      actor: 'actor',
    }
    Object.entries(next).forEach(([k, v]) => {
      const param = map[k as keyof Filters]
      if (v === null || v === undefined || v === '' || v === 'all') params.delete(param)
      else params.set(param, String(v))
    })
    router.replace(`/ops/audit${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const summaryCards = useMemo(
    () => [
      { label: 'Total denied', value: data.summary.total, color: '#0A0A0A' },
      { label: 'Rate-limit spikes', value: data.summary.rateLimited, color: TYPE_COLOR.rate_limited },
      { label: 'CSRF blocks', value: data.summary.csrfBlocked, color: TYPE_COLOR.csrf_blocked },
      { label: 'Forbidden writes', value: data.summary.forbidden, color: TYPE_COLOR.forbidden },
    ],
    [data.summary],
  )

  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Estate Liquidity Ops">
      <PageHeader
        eyebrow="Security · Ops only"
        title="Audit console."
        subtitle="Denied-action events from the portal write surface — auth failures, forbidden writes, CSRF blocks, and rate-limit hits. Read-only. Admin / ops eyes only."
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span
              className="inline-flex items-center px-2.5 py-1 border"
              style={{
                borderColor: data.liveBackingTable ? '#0E9F6E' : '#FFDB15',
                color: data.liveBackingTable ? '#0E9F6E' : '#B07A00',
              }}
              data-testid="audit-source"
            >
              {data.liveBackingTable ? '● Live audit_events' : '● Demo events'}
            </span>
          </div>
        }
      />

      {/* KPI cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-10 border-b border-[#E0E0E0]"
        data-testid="audit-kpis"
      >
        {summaryCards.map((c) => (
          <div key={c.label} className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: c.color }}>
            <span className="label block mb-3">{c.label}</span>
            <span
              className="block tabular"
              style={{
                fontFamily: 'var(--font-display-family)',
                fontWeight: 900,
                fontSize: 'clamp(1.6rem, 3.6vw, 2.8rem)',
                lineHeight: 1,
                color: c.color,
              }}
            >
              {c.value}
            </span>
            <span className="label mt-3 block" style={{ color: '#6B6B6B' }}>
              last {data.summary.windowHours}h
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <SectionCard
        title="Filters"
        description="Narrow events by type, severity, window, route, case, or actor. No raw IPs or cookies are stored or displayed."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <FilterSelect
            label="Event type"
            value={filters.type}
            onChange={(v) => applyFilter('type', v as Filters['type'])}
            options={[
              { value: 'all', label: 'All types' },
              { value: 'auth_required', label: 'Auth required' },
              { value: 'forbidden', label: 'Forbidden' },
              { value: 'rate_limited', label: 'Rate limited' },
              { value: 'csrf_blocked', label: 'CSRF blocked' },
            ]}
          />
          <FilterSelect
            label="Severity"
            value={filters.severity}
            onChange={(v) => applyFilter('severity', v as Filters['severity'])}
            options={[
              { value: 'all', label: 'All' },
              { value: 'info', label: 'Info' },
              { value: 'warn', label: 'Warn' },
              { value: 'critical', label: 'Critical' },
            ]}
          />
          <FilterSelect
            label="Window"
            value={String(filters.windowHours)}
            onChange={(v) => applyFilter('windowHours', Math.max(1, Math.min(720, Number(v) || 24)))}
            options={[
              { value: '1', label: 'Last 1h' },
              { value: '24', label: 'Last 24h' },
              { value: '72', label: 'Last 3d' },
              { value: '168', label: 'Last 7d' },
              { value: '720', label: 'Last 30d' },
            ]}
          />
          <FilterText
            label="Route contains"
            placeholder="/api/portal/offers"
            value={filters.route ?? ''}
            onChange={(v) => applyFilter('route', v.trim() || null)}
          />
          <FilterText
            label="Case ID"
            placeholder="JOB-2026-0418"
            value={filters.caseId ?? ''}
            onChange={(v) => applyFilter('caseId', v.trim() || null)}
          />
          <FilterText
            label="Actor (label)"
            placeholder="email@example.com"
            value={filters.actor ?? ''}
            onChange={(v) => applyFilter('actor', v.trim() || null)}
          />
        </div>
      </SectionCard>

      {/* Top routes / actors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <SectionCard title="Top routes" description="Denial counts in window">
          <div className="border border-[#E0E0E0] bg-white">
            {data.summary.topRoutes.length === 0 ? (
              <div className="px-4 py-6 label">No denials in window.</div>
            ) : (
              data.summary.topRoutes.map((r) => (
                <button
                  key={r.route}
                  type="button"
                  onClick={() => applyFilter('route', r.route)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-[#F0F0F0] hover:bg-[#F8F8F8] text-left"
                >
                  <span className="text-sm text-[#0A0A0A] truncate pr-3" style={{ fontSize: 13 }}>
                    {r.route}
                  </span>
                  <span className="tabular label">{r.count}</span>
                </button>
              ))
            )}
          </div>
        </SectionCard>
        <SectionCard title="Top actors" description="Most-denied subject in window">
          <div className="border border-[#E0E0E0] bg-white">
            {data.summary.topActors.length === 0 ? (
              <div className="px-4 py-6 label">No denials in window.</div>
            ) : (
              data.summary.topActors.map((a) => (
                <button
                  key={a.actor}
                  type="button"
                  onClick={() => applyFilter('actor', a.actor.startsWith('user:') ? '' : a.actor)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-[#F0F0F0] hover:bg-[#F8F8F8] text-left"
                >
                  <span className="text-sm text-[#0A0A0A] truncate pr-3" style={{ fontSize: 13 }}>
                    {a.actor}
                  </span>
                  <span className="tabular label">{a.count}</span>
                </button>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      {/* Event list */}
      <SectionCard
        title={`Events (${events.length})`}
        description="Tap a row for detail. No raw IPs or cookies — only stable salted hashes."
      >
        {events.length === 0 ? (
          <div className="border border-[#E0E0E0] bg-white px-5 py-12 text-center">
            <div className="label mb-2">No denied-action events</div>
            <div className="body-light" style={{ fontSize: 13 }}>
              Either the platform is quiet (good!) or your filters are too narrow.
            </div>
          </div>
        ) : (
          <div className="space-y-3" data-testid="audit-events-list">
            {events.map((evt) => (
              <AuditEventCard
                key={evt.id}
                event={evt}
                expanded={expandedId === evt.id}
                onToggle={() => setExpandedId((cur) => (cur === evt.id ? null : evt.id))}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <div className="h-24" />
    </AppShell>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="block">
      <span className="label block mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#E0E0E0] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function FilterText({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="label block mb-1.5">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#E0E0E0] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]"
      />
    </label>
  )
}

function AuditEventCard({
  event,
  expanded,
  onToggle,
}: {
  event: AuditEventRow
  expanded: boolean
  onToggle: () => void
}) {
  const tone = SEVERITY_TONE[event.severity]
  const typeColor = TYPE_COLOR[event.eventType]
  return (
    <div
      className="border border-[#E0E0E0] bg-white"
      data-testid={`audit-event-${event.id}`}
      data-event-type={event.eventType}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 sm:px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
      >
        <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
          <span
            className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium tracking-wider uppercase"
            style={{ background: typeColor, color: event.eventType === 'rate_limited' ? '#0A0A0A' : '#FFFFFF' }}
          >
            {TYPE_LABEL[event.eventType]}
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium tracking-wider uppercase border"
            style={{ borderColor: tone, color: tone }}
          >
            {event.severity}
          </span>
          <span className="label tabular">{event.method}</span>
          <span className="text-sm text-[#0A0A0A] flex-1 min-w-0 truncate" style={{ fontSize: 13 }}>
            {event.route}
          </span>
          <span className="label tabular text-right">{relativeTime(event.createdAt)}</span>
        </div>
        {event.reason && (
          <div className="mt-2 text-[#3A3A3A]" style={{ fontSize: 13 }}>
            {event.reason}
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 label">
          <span>{fmtTime(event.createdAt)}</span>
          {event.actorLabel && <span>actor · {event.actorLabel}</span>}
          {event.caseId && <span>case · {event.caseId}</span>}
          {event.itemId && <span>item · {event.itemId}</span>}
          {event.offerId && <span>offer · {event.offerId}</span>}
        </div>
      </button>
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-[#F0F0F0] bg-[#FAFAFA]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px] tabular">
            <DetailRow k="Status" v={String(event.statusCode)} />
            <DetailRow k="Method" v={event.method} />
            <DetailRow k="Route" v={event.route} />
            <DetailRow k="Severity" v={event.severity} />
            <DetailRow k="Actor (label)" v={event.actorLabel ?? '—'} />
            <DetailRow
              k="Actor (id)"
              v={event.actorUserId ? `${event.actorUserId.slice(0, 8)}…` : '—'}
            />
            <DetailRow k="Case ID" v={event.caseId ?? '—'} />
            <DetailRow k="Item ID" v={event.itemId ?? '—'} />
            <DetailRow k="Offer ID" v={event.offerId ?? '—'} />
            <DetailRow k="IP (hash)" v={event.ipHash ?? '—'} />
            <DetailRow k="UA (hash)" v={event.userAgentHash ?? '—'} />
            <DetailRow k="Created" v={fmtTime(event.createdAt)} />
          </div>
          {Object.keys(event.metadata ?? {}).length > 0 && (
            <div className="mt-3">
              <span className="label block mb-1.5">Metadata</span>
              <div className="border border-[#E0E0E0] bg-white px-3 py-2 text-[12px] tabular flex flex-wrap gap-x-4 gap-y-1">
                {Object.entries(event.metadata).map(([k, v]) => (
                  <span key={k}>
                    <span className="text-[#6B6B6B]">{k}:</span> <span>{String(v)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DetailRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#F0F0F0] py-1.5">
      <span className="label">{k}</span>
      <span className="text-[#0A0A0A] truncate text-right">{v}</span>
    </div>
  )
}
