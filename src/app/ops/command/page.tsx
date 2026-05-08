'use client'

import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { OpsTimeline } from '@/components/portal/OpsTimeline'
import { useOpsCommand } from '@/lib/data/hooks'

export default function OpsCommandCenter() {
  const { data: OPS_EVENTS } = useOpsCommand()
  const exceptions = OPS_EVENTS.filter(e => e.status !== 'ok')
  const byKind = (k: string) => OPS_EVENTS.filter(e => e.kind === k)

  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Estate Liquidity Ops">
      <PageHeader
        eyebrow="Operational Command Center"
        title="Floor view."
        subtitle="Pickup, custody, storage, packing evidence, channel publishing, exceptions, returns, disputes, and reconciliation — one stream, one source of truth."
      />

      {/* Pillars */}
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-x-0 gap-y-3 mb-10 border-b border-[#E0E0E0] pb-1" data-testid="ops-pillars">
        {[
          { l: 'Pickup', c: byKind('pickup_scheduled').length, color: '#826DEE' },
          { l: 'Custody', c: byKind('custody_transfer').length, color: '#FFDB15' },
          { l: 'Storage', c: byKind('storage_logged').length, color: '#FF99DC' },
          { l: 'Packing', c: byKind('packing_evidence').length, color: '#FFDB15' },
          { l: 'Listings', c: byKind('channel_published').length, color: '#0E9F6E' },
          { l: 'Exceptions', c: byKind('exception').length, color: '#F94500' },
          { l: 'Returns', c: byKind('return_requested').length, color: '#F94500' },
          { l: 'Recon', c: byKind('reconciliation').length, color: '#0E9F6E' },
        ].map(s => (
          <div key={s.l} className="border-t-2 pt-4 sm:pt-5 pb-4 sm:pb-5 pr-2 sm:pr-3" style={{ borderTopColor: s.color }} data-testid={`pillar-${s.l.toLowerCase()}`}>
            <span className="label block mb-1.5 sm:mb-2 truncate" style={{ color: s.color, fontSize: 9 }}>● {s.l}</span>
            <span className="block tabular" style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', lineHeight: 1, color: s.color }}>
              {s.c}
            </span>
          </div>
        ))}
      </div>

      {/* Exceptions queue first */}
      {exceptions.length > 0 && (
        <SectionCard
          title="Exceptions Queue"
          description="Anything not green — disputes, exceptions, returns, blocked listings."
        >
          <OpsTimeline events={exceptions} title="Exceptions, returns, disputes" />
        </SectionCard>
      )}

      {/* Full timeline */}
      <SectionCard
        title="Today's Floor Timeline"
        description="Single chronological view of all ops activity across estates."
      >
        <OpsTimeline events={OPS_EVENTS} title="All operations events" />
      </SectionCard>

      {/* Escalation paths */}
      <SectionCard
        title="Escalation Paths"
        description="When and how ops kicks problems to the right specialist."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: 'Restricted / Prohibited Match', detail: 'Auto-block + customer notification + compliance review. Lift requires legal sign-off.', color: '#F94500' },
            { t: 'Authentication Risk', detail: 'AI confidence < 0.6 on $2K+ items → assigned specialist within 24h SLA.', color: '#FFDB15' },
            { t: 'Customer Dispute', detail: 'Stop-sell, evidence pack drafted, returns desk owns until resolution. CSAT survey on close.', color: '#826DEE' },
            { t: 'Legal Hold', detail: 'Litigation registry hit → all dispositions paused. Concierge + legal lead engagement.', color: '#0A0A0A' },
          ].map(e => (
            <div key={e.t} className="border border-[#E0E0E0] bg-white p-5" data-testid={`escalation-${e.t.split(' ')[0].toLowerCase()}`}>
              <span className="label block mb-2" style={{ color: e.color }}>● {e.t}</span>
              <p className="body-light" style={{ fontSize: 13 }}>{e.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  )
}
