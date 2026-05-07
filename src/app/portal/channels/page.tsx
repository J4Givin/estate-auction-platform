'use client'

import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { ChannelMatrix } from '@/components/portal/ChannelMatrix'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { useChannels, useEstateCase } from '@/lib/data/hooks'

const STATUS_COLOR: Record<string, string> = {
  green: '#0E9F6E',
  yellow: '#FFDB15',
  red: '#F94500',
}

export default function ChannelsPage() {
  const channelsQuery = useChannels()
  const estate = useEstateCase()
  const CHANNEL_MATRIX = channelsQuery.data.matrix
  const CHANNEL_HEALTH = channelsQuery.data.health
  const ASSET_BALANCE = { cashAvailable: estate.data.availableForPayout }

  return (
    <AppShell
      role="customer"
      userName="Sarah Mitchell"
      orgName="Mitchell Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Approve Listings" primaryHref="/portal/inventory?status=human_review" />}
    >
      <PageHeader
        eyebrow="Marketplace Distribution"
        title="Channel Strategy."
        subtitle="Each item goes where it sells best. We score eBay, 1stDibs, Chairish, Etsy, Facebook MP, House Auction, Direct Buyout, and Donation routing on fit, net, fees, policy risk, fulfillment, and time-to-sale."
      />

      {/* Channel health */}
      <SectionCard
        title="Channel Health"
        description="Live signal from every channel — listings, errors, and platform lift over baseline."
      >
        <div className="border border-[#E0E0E0] bg-white">
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 sm:px-6 py-3 border-b border-[#F0F0F0]">
            <span className="label col-span-3">Channel</span>
            <span className="label col-span-1">Status</span>
            <span className="label col-span-2 text-right">Listings</span>
            <span className="label col-span-2 text-right">Errors</span>
            <span className="label col-span-2 text-right">Sell-through</span>
            <span className="label col-span-2 text-right">Lift</span>
          </div>
          {CHANNEL_HEALTH.map(c => (
            <div
              key={c.channel}
              className="border-b border-[#F0F0F0] last:border-b-0 px-4 sm:px-6 py-3 grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-3"
              data-testid={`channel-health-${c.channel.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR[c.status] }} />
                <span className="text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{c.channel}</span>
              </div>
              <div className="md:col-span-1"><span className="label" style={{ color: STATUS_COLOR[c.status] }}>{c.status}</span></div>
              <div className="md:col-span-2 md:text-right"><span className="tabular text-[#0A0A0A]" style={{ fontSize: 13 }}>{c.listings}</span></div>
              <div className="md:col-span-2 md:text-right"><span className="tabular" style={{ fontSize: 13, color: c.errors > 0 ? '#F94500' : '#0A0A0A' }}>{c.errors}</span></div>
              <div className="md:col-span-2 md:text-right"><span className="tabular text-[#0A0A0A]" style={{ fontSize: 13 }}>{Math.round(c.sellThrough * 100)}%</span></div>
              <div className="md:col-span-2 md:text-right">
                <span className="tabular" style={{ fontSize: 13, color: c.lift > 0 ? '#0E9F6E' : c.lift < 0 ? '#F94500' : '#6B6B6B' }}>
                  {c.lift > 0 ? '+' : ''}{Math.round(c.lift * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Per-item matrices */}
      {CHANNEL_MATRIX.map(m => (
        <div key={m.itemId} className="mb-10">
          <ChannelMatrix matrix={m} />
        </div>
      ))}

      {/* Listing readiness */}
      <SectionCard
        title="Listing Publish Readiness"
        description="A listing must clear photo quality, copy, comps, floor, and policy before it goes live."
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border-y border-[#E0E0E0]">
          {[
            { l: 'Photos', s: '8 / 8 ready', color: '#0E9F6E' },
            { l: 'Copy', s: 'AI draft + human edit', color: '#0E9F6E' },
            { l: 'Comps', s: '12 of last 24 mo', color: '#0E9F6E' },
            { l: 'Floor', s: 'Customer-confirmed', color: '#0E9F6E' },
            { l: 'Policy', s: 'No restricted matches', color: '#0E9F6E' },
          ].map(s => (
            <div key={s.l} className="py-4 px-4 border-r last:border-r-0 border-[#F0F0F0]">
              <span className="label block mb-1.5" style={{ color: s.color }}>● {s.l}</span>
              <span className="block text-[#0A0A0A]" style={{ fontSize: 13 }}>{s.s}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  )
}
