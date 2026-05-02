'use client'

import Link from 'next/link'
import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import {
  PORTFOLIO_SUMMARY as P,
  RISK_FLAGS,
  INVENTORY,
  LEDGER,
  fmt,
  DISPOSITION_COLOR,
  DISPOSITION_LABEL,
} from '@/lib/sample-data'

export default function PortalCommandCenter() {
  const recentLedger = LEDGER.slice(0, 5)
  const dispositionBreakdown: Array<{ key: keyof typeof DISPOSITION_LABEL; count: number }> = [
    { key: 'sell_managed', count: INVENTORY.filter(i => i.disposition === 'sell_managed').length },
    { key: 'store', count: INVENTORY.filter(i => i.disposition === 'store').length },
    { key: 'donate', count: INVENTORY.filter(i => i.disposition === 'donate').length },
    { key: 'keep', count: INVENTORY.filter(i => i.disposition === 'keep').length },
    { key: 'undecided', count: INVENTORY.filter(i => i.disposition === 'undecided').length },
  ]

  return (
    <AppShell role="customer" userName="Sarah Mitchell" orgName={P.estateName}>
      <PageHeader
        eyebrow="Client Portal"
        title={P.estateName + '.'}
        subtitle={`${P.itemsCataloged} items cataloged across the estate. Adjust your decisions like a financial account — sell, list, store, donate, or keep at any time.`}
        badge={
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5"
            style={{ background: '#82eda710', border: '1px solid #0E9F6E' }}
            data-testid="portal-active-badge"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#0E9F6E' }} />
            <span className="label" style={{ color: '#0E9F6E' }}>Active · Job {P.jobId}</span>
          </span>
        }
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/portal/offers" className="btn btn-yellow" data-testid="portal-cta-review-offers">
              Review Cash Offer →
            </Link>
            <Link href="/portal/inventory" className="btn btn-ink" data-testid="portal-cta-decide-items">
              Decide on Items
            </Link>
          </div>
        }
      />

      {/* TOP — Available cash, inventory value, donation, storage */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-14 border-b border-[#E0E0E0]" data-testid="portal-summary-grid">
        <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: '#FFDB15' }}>
          <span className="label block mb-3">Cash Available Now</span>
          <span
            className="block tabular"
            style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', lineHeight: 1, color: '#0A0A0A' }}
          >
            {fmt(P.cashOfferAvailable)}
          </span>
          <span className="label mt-3 block" style={{ color: '#F94500' }}>● Offer expires {P.cashOfferExpires}</span>
        </div>
        <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: '#826DEE' }}>
          <span className="label block mb-3">Managed Sale Estimate</span>
          <span
            className="block tabular"
            style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.5rem, 3.4vw, 2.6rem)', lineHeight: 1.05, color: '#826DEE' }}
          >
            {fmt(P.estimatedNetLow)}
            <span className="text-[#BDBDBD]"> – </span>
            {fmt(P.estimatedNetHigh)}
          </span>
          <span className="label mt-3 block">After fees · 6+ channels</span>
        </div>
        <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: '#0E9F6E' }}>
          <span className="label block mb-3">Donation Impact</span>
          <span
            className="block tabular"
            style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', lineHeight: 1, color: '#0E9F6E' }}
          >
            {fmt(P.donationsToDate)}
          </span>
          <span className="label mt-3 block">→ {P.charityName}</span>
        </div>
        <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: '#FF99DC' }}>
          <span className="label block mb-3">In Storage</span>
          <span
            className="block tabular"
            style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', lineHeight: 1, color: '#0A0A0A' }}
          >
            {P.itemsStored} <span className="text-[#BDBDBD]" style={{ fontSize: '0.55em' }}>items</span>
          </span>
          <span className="label mt-3 block">{fmt(P.storageMonthlyCost)}/mo · adjust anytime</span>
        </div>
      </div>

      {/* LIFECYCLE STRIP */}
      <SectionCard
        title="Estate Lifecycle"
        description="Where each item sits in the appraisal → decision → fulfillment pipeline."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0 -mt-2">
          {[
            { label: 'Captured', count: P.itemsCataloged, color: '#6B6B6B' },
            { label: 'AI Reviewed', count: P.itemsApproved, color: '#826DEE' },
            { label: 'Human Validated', count: 32, color: '#0E9F6E' },
            { label: 'Listed', count: P.itemsListed, color: '#FFDB15' },
            { label: 'Sold', count: P.itemsSold, color: '#F94500' },
            { label: 'Stored', count: P.itemsStored, color: '#FF99DC' },
            { label: 'Donated', count: P.itemsDonated, color: '#0E9F6E' },
          ].map(s => (
            <div
              key={s.label}
              className="border-t border-[#E0E0E0] py-5 pr-3"
              data-testid={`lifecycle-${s.label.toLowerCase().replace(' ', '-')}`}
            >
              <span className="label block mb-2.5" style={{ color: s.color }}>● {s.label}</span>
              <span
                className="block tabular"
                style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: '2.1rem', lineHeight: 1 }}
              >
                {s.count}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* DECISIONS PENDING + LIVE CASH OFFER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-14">
        {/* Live cash offer card — primary trust receipt */}
        <div className="lg:col-span-2 border-t border-[#E0E0E0] pt-10" data-testid="portal-live-offer">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="label block mb-2" style={{ color: '#FFDB15' }}>● Live Cash Offer</span>
              <h3 className="display-md" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)' }}>Whole-Estate Buyout</h3>
              <p className="body-light mt-2 max-w-md">
                Funded escrow. Single net-cash deposit on acceptance. 3-day pickup window. Adjust which items are included before accepting.
              </p>
            </div>
            <span className="label flex-shrink-0" style={{ color: '#F94500' }}>● Expires {P.cashOfferExpires}</span>
          </div>
          <div className="grid grid-cols-3 gap-0 border-y border-[#E0E0E0]">
            <div className="py-5 pr-4 border-r border-[#E0E0E0]">
              <span className="label block mb-2">Offer Amount</span>
              <span className="block tabular" style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', color: '#0A0A0A', lineHeight: 1 }}>
                {fmt(P.cashOfferAvailable)}
              </span>
            </div>
            <div className="py-5 px-4 border-r border-[#E0E0E0]">
              <span className="label block mb-2">vs Managed</span>
              <span className="block tabular" style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.2rem, 2.4vw, 1.7rem)', color: '#826DEE', lineHeight: 1 }}>
                ~{fmt(P.estimatedNetLow)}
              </span>
              <span className="label mt-1.5 block">Estimated minimum after fees</span>
            </div>
            <div className="py-5 pl-4">
              <span className="label block mb-2">Items Covered</span>
              <span className="block tabular" style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', lineHeight: 1 }}>
                {P.itemsCataloged}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link href="/portal/offers" className="btn btn-yellow" data-testid="offer-card-accept">
              Accept Cash Offer →
            </Link>
            <Link href="/portal/offers" className="btn btn-outline" data-testid="offer-card-counter">
              Counter or Adjust Scope
            </Link>
            <Link href="/portal/offers" className="btn btn-outline" data-testid="offer-card-compare">
              Compare with Managed Sale
            </Link>
          </div>
        </div>

        {/* Risk flags */}
        <div className="border-t border-[#E0E0E0] pt-10" data-testid="portal-risk-flags">
          <span className="label block mb-2" style={{ color: '#F94500' }}>● Trust & Safety</span>
          <h3 className="display-md mb-4" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>{P.riskFlags} flags need a look</h3>
          <div className="flex flex-col">
            {RISK_FLAGS.map(f => {
              const sev = f.severity === 'high' ? '#F94500' : f.severity === 'medium' ? '#FFDB15' : '#826DEE'
              return (
                <Link
                  key={f.id}
                  href={`/portal/inventory?focus=${f.itemId}`}
                  className="border-b border-[#E0E0E0] py-4 hover:bg-[#F5F5F5] transition-colors -mx-2 px-2"
                  data-testid={`risk-flag-${f.id}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: sev }} />
                    <div className="flex-1 min-w-0">
                      <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{f.title}</span>
                      <span className="body-light block mt-1" style={{ fontSize: 13 }}>{f.detail}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <Link href="/portal/inventory" className="label inline-block mt-4" style={{ color: '#826DEE' }}>
            Open Inventory Review →
          </Link>
        </div>
      </div>

      {/* DISPOSITION BREAKDOWN */}
      <SectionCard
        title="Your Decisions"
        description="Adjust at any time — sell, list, store, donate, or keep. Decisions are reversible until items leave the estate."
        action={<Link href="/portal/inventory" className="btn btn-outline" data-testid="decisions-view-all">View All →</Link>}
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
          {dispositionBreakdown.map(d => {
            const color = DISPOSITION_COLOR[d.key]
            return (
              <Link
                key={d.key}
                href={`/portal/inventory?disposition=${d.key}`}
                className="border-t border-[#E0E0E0] py-6 pr-4 group hover:bg-[#F5F5F5] transition-colors -mx-2 px-2"
                data-testid={`disposition-${d.key}`}
              >
                <span className="label block mb-3" style={{ color }}>● {DISPOSITION_LABEL[d.key]}</span>
                <span
                  className="block tabular"
                  style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: '2.4rem', lineHeight: 1, color }}
                >
                  {d.count}
                </span>
                <span className="label mt-2 block group-hover:text-[#0A0A0A] transition-colors">Adjust →</span>
              </Link>
            )
          })}
        </div>
      </SectionCard>

      {/* LEDGER + NEXT ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-14">
        {/* Ledger preview */}
        <div className="border-t border-[#E0E0E0] pt-10" data-testid="portal-ledger-preview">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <span className="label block mb-2">Ledger</span>
              <h3 className="display-md" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>
                {fmt(P.availableForPayout)} available
              </h3>
            </div>
            <Link href="/portal/ledger" className="label" style={{ color: '#826DEE' }}>View All →</Link>
          </div>
          <div className="grid grid-cols-3 gap-0 border-y border-[#E0E0E0] mb-6">
            <div className="py-4 pr-3 border-r border-[#E0E0E0]">
              <span className="label block mb-1.5">Proceeds to Date</span>
              <span className="display-md tabular block" style={{ fontSize: '1.2rem' }}>{fmt(P.proceedsToDate)}</span>
            </div>
            <div className="py-4 px-3 border-r border-[#E0E0E0]">
              <span className="label block mb-1.5">Reserves & Fees</span>
              <span className="display-md tabular block" style={{ fontSize: '1.2rem', color: '#F94500' }}>{fmt(P.reservedForFees)}</span>
            </div>
            <div className="py-4 pl-3">
              <span className="label block mb-1.5">Available</span>
              <span className="display-md tabular block" style={{ fontSize: '1.2rem', color: '#0E9F6E' }}>{fmt(P.availableForPayout)}</span>
            </div>
          </div>
          <div className="flex flex-col">
            {recentLedger.map(l => {
              const color = l.type === 'sale' ? '#0E9F6E' : l.type === 'fee' || l.type === 'storage' ? '#F94500' : l.type === 'donation' ? '#826DEE' : '#6B6B6B'
              return (
                <div key={l.id} className="flex items-start gap-3 border-b border-[#E0E0E0] py-3" data-testid={`ledger-row-${l.id}`}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[#0A0A0A]" style={{ fontSize: 13 }}>{l.description}</span>
                    <span className="label">{l.date}{l.channel ? ` · ${l.channel}` : ''}</span>
                  </div>
                  <span
                    className="tabular flex-shrink-0"
                    style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13, color: l.net >= 0 ? '#0A0A0A' : '#F94500' }}
                  >
                    {l.net >= 0 ? '+' : '−'}{fmt(Math.abs(l.net))}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Next actions */}
        <div className="border-t border-[#E0E0E0] pt-10" data-testid="portal-next-actions">
          <span className="label block mb-2">Next Best Actions</span>
          <h3 className="display-md mb-6" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>What we recommend next.</h3>
          <div className="flex flex-col">
            {[
              {
                label: `Review ${P.pendingApprovals} listing approvals`,
                detail: 'AI-priced and human-validated. Approve to publish across channels.',
                href: '/portal/inventory?status=human_review',
                color: '#826DEE',
              },
              {
                label: 'Confirm donation routing for 6 low-velocity items',
                detail: `Goes to ${P.charityName}. Tax receipt auto-generated.`,
                href: '/portal/donations',
                color: '#0E9F6E',
              },
              {
                label: 'Set floor on Crystal Chandelier',
                detail: 'Item is in human review. Set your lowest acceptable price before listing.',
                href: '/portal/inventory?focus=ITM-1045',
                color: '#FFDB15',
              },
              {
                label: 'Schedule next pickup or restock storage',
                detail: 'Bedroom and garage rooms remain unscanned — coverage 78%.',
                href: '/portal',
                color: '#FF99DC',
              },
            ].map((a, i) => (
              <Link
                key={i}
                href={a.href}
                className="border-b border-[#E0E0E0] py-4 hover:bg-[#F5F5F5] -mx-2 px-2 group"
                data-testid={`next-action-${i}`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: a.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{a.label}</span>
                    <span className="body-light block mt-1" style={{ fontSize: 13 }}>{a.detail}</span>
                  </div>
                  <span className="label flex-shrink-0 group-hover:text-[#0A0A0A] transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST FOOTER */}
      <div className="border-t border-[#E0E0E0] pt-10 grid grid-cols-2 md:grid-cols-4 gap-6" data-testid="portal-trust-strip">
        {[
          { l: 'Authority & Consent', v: 'Verified · 2026-04-18' },
          { l: 'PII Redaction', v: 'Active on all photos' },
          { l: 'Prohibited Items', v: '0 blocks · all clear' },
          { l: 'Audit Log', v: 'Immutable · view trail' },
        ].map(t => (
          <div key={t.l}>
            <span className="label block mb-1.5" style={{ color: '#0E9F6E' }}>● {t.l}</span>
            <span className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>{t.v}</span>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
