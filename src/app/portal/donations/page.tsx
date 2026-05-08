'use client'

import { useState } from 'react'
import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { TrustReceipt } from '@/components/portal/TrustReceipt'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { fmt } from '@/lib/sample-data'
import { useDonations, useEstateCase, useTrustReceipts, useInventory } from '@/lib/data/hooks'
import { newIdempotencyKey, portalWrite } from '@/lib/portal-client'

export default function DonationsPage() {
  const donationsQuery = useDonations()
  const inventoryQuery = useInventory()
  const estate = useEstateCase()
  const trust = useTrustReceipts()
  const ASSET_BALANCE = { cashAvailable: estate.data.availableForPayout }
  const [charities, setCharities] = useState(donationsQuery.data.charities)
  // sync when async load returns
  if (charities !== donationsQuery.data.charities && charities.length === 0) {
    setCharities(donationsQuery.data.charities)
  }
  const INVENTORY = inventoryQuery.data
  const donatingItems = INVENTORY.filter(i => i.disposition === 'donate')
  const suggested = INVENTORY.filter(i => i.donationSuggested && i.disposition !== 'donate')

  const totalRouted = charities.reduce((s, c) => s + c.totalRouted, 0)
  const totalSelected = charities.filter(c => c.selected).length
  const projectedAdditional = suggested.reduce((s, i) => s + Math.max(i.estimateLow, 50), 0)

  const toggle = (id: string) => {
    setCharities(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c))
    void portalWrite(
      '/api/portal/donations/routing',
      { caseId: estate.data.jobId, charityId: id, actor: 'Sarah Mitchell' },
      { idempotencyKey: newIdempotencyKey() },
    ).catch(() => {})
  }

  const donationReceipt = trust.data.find(r => r.kind === 'donation')

  return (
    <AppShell
      role="customer"
      userName="Sarah Mitchell"
      orgName="Mitchell Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Route to Donate" primaryHref="/portal/donations" />}
    >
      <PageHeader
        eyebrow="Donations"
        title="Donation Impact."
        subtitle="Maximizing the good your estate can do. Donate hard-to-sell items, dedicate proceeds, and get tax-ready receipts automatically."
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn btn-outline" data-testid="donations-receipts">Download Tax Receipts</button>
            <button className="btn btn-ink" style={{ background: '#0E9F6E' }} data-testid="donations-add-charity">
              Add a Charity →
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-12 border-b border-[#E0E0E0]" data-testid="donations-summary">
        <Stat color="#0E9F6E" title="Donated to Date" value={fmt(totalRouted)} sub={`${charities.reduce((s, c) => s + c.taxReceipts, 0)} receipts issued`} />
        <Stat color="#826DEE" title="Items Routed" value={`${donatingItems.length}`} sub="Across cataloged inventory" />
        <Stat color="#FFDB15" title="Suggested Additions" value={`+${suggested.length}`} sub={`~${fmt(projectedAdditional)} potential`} />
        <Stat color="#FF99DC" title="Active Charities" value={`${totalSelected}`} sub="Of your selected list" />
      </div>

      {/* My charities */}
      <div className="border-t border-[#E0E0E0] pt-10 mb-16" data-testid="donations-charities">
        <span className="label block mb-2">My Charities</span>
        <h2 className="display-md mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Where the proceeds flow.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-[#E0E0E0]">
          {charities.map(c => (
            <div
              key={c.id}
              className="border-t border-[#E0E0E0] md:border-t-0 md:border-r border-[#E0E0E0] last:border-r-0 px-6 py-7 flex flex-col"
              data-testid={`charity-${c.id}`}
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <h3 className="text-[#0A0A0A] font-medium leading-snug" style={{ fontSize: 16 }}>{c.name}</h3>
                  <span className="label block mt-1.5">EIN {c.ein}</span>
                </div>
                <button
                  onClick={() => toggle(c.id)}
                  className="label px-3 py-1.5 border whitespace-nowrap transition-colors"
                  style={c.selected
                    ? { background: '#0E9F6E', borderColor: '#0E9F6E', color: '#FFFFFF' }
                    : { borderColor: '#E0E0E0', color: '#6B6B6B' }
                  }
                  data-testid={`charity-toggle-${c.id}`}
                >
                  {c.selected ? '● Selected' : 'Select'}
                </button>
              </div>
              <p className="body-light mb-4" style={{ fontSize: 13 }}>{c.mission}</p>
              <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-[#E0E0E0]">
                <div>
                  <span className="label block mb-1">Total Routed</span>
                  <span className="display-md tabular block" style={{ fontSize: '1.2rem', color: '#0E9F6E' }}>{fmt(c.totalRouted)}</span>
                </div>
                <div>
                  <span className="label block mb-1">Tax Receipts</span>
                  <span className="display-md tabular block" style={{ fontSize: '1.2rem' }}>{c.taxReceipts}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items currently donating */}
      <div className="border-t border-[#E0E0E0] pt-10 mb-16" data-testid="donations-current">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <span className="label block mb-2" style={{ color: '#0E9F6E' }}>● Currently Donating</span>
            <h2 className="display-md" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>{donatingItems.length} items routed</h2>
          </div>
        </div>
        {donatingItems.length === 0 ? (
          <div className="border border-[#E0E0E0] p-10 text-center">
            <span className="label block mb-2">No items currently routed for donation</span>
          </div>
        ) : (
          <div className="border-t border-[#E0E0E0]">
            {donatingItems.map(i => (
              <div key={i.id} className="border-b border-[#E0E0E0] py-4 flex items-start gap-4" data-testid={`donating-${i.id}`}>
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#0E9F6E' }} />
                <div className="flex-1 min-w-0">
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{i.name}</span>
                  <span className="label">{i.room} · {i.id}</span>
                </div>
                <span className="label flex-shrink-0">→ {charities.find(c => c.selected)?.name ?? '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested */}
      <div className="border-t border-[#E0E0E0] pt-10" data-testid="donations-suggested">
        <span className="label block mb-2" style={{ color: '#FFDB15' }}>● Suggested for Donation</span>
        <h2 className="display-md mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Maximize your impact.</h2>
        <p className="body-light mb-6 max-w-2xl">
          Hard-to-sell or low-velocity items that would generate more good as donations than open-market listings. Each comes with an estimated tax-deductible value.
        </p>
        {suggested.length === 0 ? (
          <p className="body-light">All low-velocity items already routed.</p>
        ) : (
          <div className="border-t border-[#E0E0E0]">
            {suggested.map(i => (
              <div key={i.id} className="border-b border-[#E0E0E0] py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:items-center" data-testid={`suggested-${i.id}`}>
                <div className="md:col-span-6 flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#FFDB15' }} />
                  <div>
                    <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{i.name}</span>
                    <span className="label">{i.room} · {i.id}</span>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <span className="label block">Tax-deductible Estimate</span>
                  <span className="tabular text-[#0E9F6E]" style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>
                    ~{fmt(Math.max(i.estimateLow, 50))}
                  </span>
                </div>
                <div className="md:col-span-3 flex md:justify-end">
                  <button
                    className="btn btn-outline"
                    style={{ borderColor: '#0E9F6E', color: '#0E9F6E' }}
                    data-testid={`suggested-route-${i.id}`}
                  >
                    Route to Donation →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest donation receipt */}
      {donationReceipt && (
        <SectionCard title="Latest donation receipt" description="Tax-ready, immutable.">
          <TrustReceipt receipt={donationReceipt} />
        </SectionCard>
      )}

      {/* Legacy / Impact Report */}
      <div className="border border-[#0A0A0A] bg-white" data-testid="impact-report">
        <div className="px-5 sm:px-7 py-6 bg-[#0A0A0A] text-white">
          <span className="label-dark block mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>● Legacy &amp; Impact Report</span>
          <p className="text-white" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.4 }}>
            Your estate helped <strong>{charities.filter(c => c.selected).length} charities</strong>, routed{' '}
            <strong>{donatingItems.length + suggested.length} items</strong>, and contributed{' '}
            <strong>{fmt(totalRouted)}</strong> in tax-deductible value to your community.
          </p>
        </div>
        <div className="px-5 sm:px-7 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="label block mb-1.5" style={{ color: '#0E9F6E' }}>● Affordable housing built</span>
            <span className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>~3 weeks of materials at Habitat for Humanity Greater LA</span>
          </div>
          <div>
            <span className="label block mb-1.5" style={{ color: '#826DEE' }}>● Hospice family support</span>
            <span className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>~12 hours of family-grief support at Hospice of San Joaquin</span>
          </div>
          <div>
            <span className="label block mb-1.5" style={{ color: '#FFDB15' }}>● Items keep being useful</span>
            <span className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>Re-use diverts ~120 lbs from landfill — household goods placed with families.</span>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function Stat({ title, value, color, sub }: { title: string; value: string; color: string; sub: string }) {
  return (
    <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: color }}>
      <span className="label block mb-3">{title}</span>
      <span
        className="block tabular"
        style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', lineHeight: 1, color }}
      >
        {value}
      </span>
      <span className="label mt-3 block">{sub}</span>
    </div>
  )
}
