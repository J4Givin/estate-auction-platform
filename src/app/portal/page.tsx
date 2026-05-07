'use client'

import Link from 'next/link'
import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { EstateBalanceCard } from '@/components/portal/EstateBalanceCard'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { ConciergeStrip } from '@/components/portal/ConciergeStrip'
import { ComplianceStrip } from '@/components/portal/ComplianceStrip'
import { TrustReceipt } from '@/components/portal/TrustReceipt'
import { OfferStack } from '@/components/portal/OfferStack'
import {
  fmt,
  DISPOSITION_COLOR,
  DISPOSITION_LABEL,
} from '@/lib/sample-data'
import {
  usePortalOverview,
  useInventory,
  useLedger,
  useTrustReceipts,
} from '@/lib/data/hooks'

export default function PortalCommandCenter() {
  const overview = usePortalOverview()
  const { data: inventory } = useInventory()
  const { data: ledger } = useLedger()
  const { data: trustReceipts } = useTrustReceipts()
  const P = overview.data.case
  const ASSET_BALANCE = overview.data.balance
  const RISK_FLAGS = overview.data.riskFlags
  const recentLedger = ledger.slice(0, 5)
  const dispositionBreakdown: Array<{ key: keyof typeof DISPOSITION_LABEL; count: number }> = [
    { key: 'sell_managed', count: inventory.filter(i => i.disposition === 'sell_managed').length },
    { key: 'store', count: inventory.filter(i => i.disposition === 'store').length },
    { key: 'donate', count: inventory.filter(i => i.disposition === 'donate').length },
    { key: 'keep', count: inventory.filter(i => i.disposition === 'keep').length },
    { key: 'undecided', count: inventory.filter(i => i.disposition === 'undecided').length },
  ]

  return (
    <AppShell
      role="customer"
      userName="Sarah Mitchell"
      orgName={P.estateName}
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} />}
    >
      <PageHeader
        eyebrow="Client Portal"
        title={P.estateName + '.'}
        subtitle={`${P.itemsCataloged} items cataloged. Manage your estate like a financial account — sell, list, store, donate, or keep at any time.`}
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
          <div className="hidden md:flex flex-col sm:flex-row gap-3">
            <Link href="/portal/offers" className="btn btn-yellow" data-testid="portal-cta-review-offers">
              Review Cash Offer →
            </Link>
            <Link href="/portal/inventory" className="btn btn-ink" data-testid="portal-cta-decide-items">
              Decide on Items
            </Link>
          </div>
        }
      />

      {/* HERO BALANCE — bank-app style, primary mobile surface */}
      <div className="mb-10">
        <EstateBalanceCard />
      </div>

      {/* CONCIERGE — always near the top so executors see "we'll handle it" */}
      <div className="mb-10">
        <ConciergeStrip />
      </div>

      {/* OFFER STACK — instant liquidity engine */}
      <div className="mb-10">
        <OfferStack />
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
                style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', lineHeight: 1 }}
              >
                {s.count}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* RISK FLAGS — surfaced near top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="border border-[#E0E0E0] bg-white" data-testid="portal-risk-flags">
          <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0]">
            <span className="label block mb-1.5" style={{ color: '#F94500' }}>● Trust &amp; Safety</span>
            <h3 className="text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>{P.riskFlags} flags need a look</h3>
          </div>
          <div className="flex flex-col">
            {RISK_FLAGS.map(f => {
              const sev = f.severity === 'high' ? '#F94500' : f.severity === 'medium' ? '#FFDB15' : '#826DEE'
              return (
                <Link
                  key={f.id}
                  href={`/portal/inventory?focus=${f.itemId}`}
                  className="border-b border-[#F0F0F0] py-3 px-4 sm:px-6 hover:bg-[#F5F5F5] transition-colors"
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
        </div>

        {/* Next best actions */}
        <div className="border border-[#E0E0E0] bg-white" data-testid="portal-next-actions">
          <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0]">
            <span className="label block mb-1.5">Next Best Actions</span>
            <h3 className="text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>What we recommend next.</h3>
          </div>
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
                label: 'Resume capture in Bedroom + Garage',
                detail: 'Coverage is 78%. Two rooms remain unscanned.',
                href: '/portal/capture',
                color: '#FF99DC',
              },
            ].map((a, i) => (
              <Link
                key={i}
                href={a.href}
                className="border-b border-[#F0F0F0] py-3 px-4 sm:px-6 hover:bg-[#F5F5F5] transition-colors group"
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
                  style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', lineHeight: 1, color }}
                >
                  {d.count}
                </span>
                <span className="label mt-2 block group-hover:text-[#0A0A0A] transition-colors">Adjust →</span>
              </Link>
            )
          })}
        </div>
      </SectionCard>

      {/* RECENT TRUST RECEIPTS */}
      <SectionCard
        title="Trust Receipts"
        description="Every appraisal, listing, donation, payout, stop-sell, and dispute — recorded as immutable proof."
        action={<Link href="/portal/receipts" className="btn btn-outline" data-testid="trust-receipts-view-all">View All →</Link>}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {trustReceipts.slice(0, 4).map(r => (
            <TrustReceipt key={r.id} receipt={r} compact />
          ))}
        </div>
      </SectionCard>

      {/* LEDGER PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="border border-[#E0E0E0] bg-white" data-testid="portal-ledger-preview">
          <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0] flex items-end justify-between gap-4">
            <div>
              <span className="label block mb-1.5">Ledger</span>
              <h3 className="text-[#0A0A0A] font-medium" style={{ fontSize: 15 }}>{fmt(P.availableForPayout)} available</h3>
            </div>
            <Link href="/portal/ledger" className="label" style={{ color: '#826DEE' }}>View all →</Link>
          </div>
          <div className="grid grid-cols-3 gap-0 border-b border-[#F0F0F0]">
            <div className="py-4 px-4 sm:px-6 border-r border-[#F0F0F0]">
              <span className="label block mb-1.5">Proceeds to Date</span>
              <span className="tabular text-[#0A0A0A]" style={{ fontSize: 14 }}>{fmt(P.proceedsToDate)}</span>
            </div>
            <div className="py-4 px-4 border-r border-[#F0F0F0]">
              <span className="label block mb-1.5">Reserves &amp; Fees</span>
              <span className="tabular" style={{ fontSize: 14, color: '#F94500' }}>{fmt(P.reservedForFees)}</span>
            </div>
            <div className="py-4 px-4">
              <span className="label block mb-1.5">Available</span>
              <span className="tabular" style={{ fontSize: 14, color: '#0E9F6E' }}>{fmt(P.availableForPayout)}</span>
            </div>
          </div>
          <div className="flex flex-col">
            {recentLedger.map(l => {
              const color = l.type === 'sale' ? '#0E9F6E' : l.type === 'fee' || l.type === 'storage' ? '#F94500' : l.type === 'donation' ? '#826DEE' : '#6B6B6B'
              return (
                <div key={l.id} className="flex items-start gap-3 border-b border-[#F0F0F0] py-3 px-4 sm:px-6" data-testid={`ledger-row-${l.id}`}>
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

        {/* Compliance strip */}
        <ComplianceStrip compact />
      </div>

      {/* TRUST FOOTER (legacy) */}
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
