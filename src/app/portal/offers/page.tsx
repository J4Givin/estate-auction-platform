'use client'

import { useState } from 'react'
import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { OfferStack } from '@/components/portal/OfferStack'
import { TrustReceipt } from '@/components/portal/TrustReceipt'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { fmt } from '@/lib/sample-data'
import { useOffers, useEstateCase, useTrustReceipts } from '@/lib/data/hooks'
import { newIdempotencyKey, portalWrite } from '@/lib/portal-client'

export default function OffersPage() {
  const [accepted, setAccepted] = useState<string | null>(null)
  const offersQuery = useOffers()
  const estate = useEstateCase()
  const trust = useTrustReceipts()
  const CASH_OFFERS = offersQuery.data
  const P = estate.data
  const ASSET_BALANCE = { cashAvailable: estate.data.availableForPayout }
  const offerReceipts = trust.data.filter(r => r.kind === 'payout' || r.kind === 'authentication').slice(0, 2)

  const onAccept = async (offerId: string) => {
    setAccepted(offerId)
    try {
      await portalWrite(
        '/api/portal/offers/accept',
        { offerId, actor: 'Sarah Mitchell' },
        { idempotencyKey: newIdempotencyKey() },
      )
    } catch {}
  }

  const onCounter = async (offerId: string, amount: number) => {
    try {
      await portalWrite(
        '/api/portal/offers/counter',
        { offerId, counterAmount: amount, actor: 'Sarah Mitchell' },
        { idempotencyKey: newIdempotencyKey() },
      )
    } catch {}
  }

  return (
    <AppShell
      role="customer"
      userName="Sarah Mitchell"
      orgName="Mitchell Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Take Cash" primaryHref="#stack" />}
    >
      <PageHeader
        eyebrow="Cash Offers"
        title="Sell to Estate Liquidity."
        subtitle="Funded escrow. Net cash. No channel risk. Each offer is backed by current comps and the live evidence snapshot."
        actions={
          <a href="#compare" className="btn btn-outline" data-testid="offers-compare-cta">
            Compare with Managed Sale ↓
          </a>
        }
      />

      {/* Instant liquidity engine */}
      <div id="stack" className="mb-12">
        <OfferStack />
      </div>

      {/* Receipts for past offer-related actions */}
      {offerReceipts.length > 0 && (
        <SectionCard
          title="Recent Trust Receipts"
          description="Past payouts and authentications that affect today's offers."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offerReceipts.map(r => <TrustReceipt key={r.id} receipt={r} compact />)}
          </div>
        </SectionCard>
      )}

      {/* Offer cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-16 border-t border-[#E0E0E0]" data-testid="offers-grid">
        {CASH_OFFERS.map((o) => {
          const expiring = o.status === 'expiring'
          const isAccepted = accepted === o.id
          return (
            <div
              key={o.id}
              className="border-b lg:border-b-0 lg:border-r border-[#E0E0E0] last:border-r-0 px-6 lg:px-8 py-10 flex flex-col"
              data-testid={`offer-card-${o.id}`}
            >
              <div className="flex items-start justify-between mb-4 gap-3">
                <span className="label" style={{ color: expiring ? '#F94500' : '#0E9F6E' }}>
                  ● {expiring ? 'EXPIRES SOON' : 'LIVE OFFER'}
                </span>
                <span className="label">{o.id}</span>
              </div>
              <h3 className="display-md mb-2" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>{o.scope}</h3>
              <p className="body-light mb-6" style={{ fontSize: 14 }}>{o.description}</p>

              <div className="border-y border-[#E0E0E0] py-4 mb-5">
                <span className="label block mb-2">Net Cash to You</span>
                <span
                  className="block tabular"
                  style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1, color: '#0A0A0A' }}
                >
                  {fmt(o.amount)}
                </span>
                <span className="label mt-2 block">{o.itemCount} items · expires {o.expires}</span>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                {isAccepted ? (
                  <span
                    className="btn"
                    style={{ background: '#0E9F6E', color: '#FFFFFF', justifyContent: 'center' }}
                    data-testid={`offer-accepted-${o.id}`}
                  >
                    ● Accepted — Pickup Scheduled
                  </span>
                ) : (
                  <>
                    <button
                      className="btn btn-yellow"
                      style={{ justifyContent: 'center' }}
                      onClick={() => onAccept(o.id)}
                      data-testid={`offer-accept-${o.id}`}
                    >
                      Accept Cash Offer →
                    </button>
                    <button
                      className="btn btn-outline"
                      style={{ justifyContent: 'center' }}
                      onClick={() => onCounter(o.id, Math.round(o.amount * 1.05))}
                      data-testid={`offer-counter-${o.id}`}
                    >
                      Counter or Adjust Scope
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Trust receipt */}
      <div className="border-t border-[#E0E0E0] pt-10 mb-16">
        <span className="label block mb-2" style={{ color: '#826DEE' }}>● How We Calculate Cash</span>
        <h2 className="display-md mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Transparent. Source-Backed.</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="offers-method">
          {[
            { n: '01', title: 'Comp Floor', body: 'Bottom of last 12-month sale comps from auction houses, 1stDibs, eBay sold, Heritage, Doyle.', color: '#826DEE' },
            { n: '02', title: 'Channel Discount', body: 'Apply our channel-mix expected net (after commission, fulfillment, expected sell-through).', color: '#FFDB15' },
            { n: '03', title: 'Velocity Premium', body: 'Cash now vs months of listing — we discount for liquidity in your favor.', color: '#FF99DC' },
            { n: '04', title: 'Authenticity Buffer', body: 'Items pending human authentication carry a small reserve until the certificate clears.', color: '#0E9F6E' },
          ].map(s => (
            <div key={s.n} className="border-t border-[#E0E0E0] pt-5">
              <span className="label block mb-3" style={{ color: s.color }}>{s.n}</span>
              <h3 className="display-md mb-2" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>{s.title}</h3>
              <p className="body-light" style={{ fontSize: 13 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compare table */}
      <div id="compare" className="border-t border-[#E0E0E0] pt-10">
        <span className="label block mb-2">Compare</span>
        <h2 className="display-md mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Cash Now vs. Managed Sale.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-[#E0E0E0]" data-testid="offers-compare">
          {[
            ['Net to You', fmt(P.cashOfferAvailable), `${fmt(P.estimatedNetLow)}–${fmt(P.estimatedNetHigh)}`],
            ['Time to Cash', '1–2 business days', '14–90 days, rolling settlements'],
            ['Channel Risk', 'None — we hold the inventory', 'Distributed across 6+ channels'],
            ['Floor Control', 'You set scope inclusion', 'You set per-item / per-lot floor'],
            ['Fulfillment', 'We pick up and remove', 'We list, ship, and settle on your behalf'],
            ['Stop-Sell', 'N/A — finalized at acceptance', 'Available at any time, instantly'],
          ].map(([row, cash, managed], i) => (
            <div key={i} className="contents">
              <div className="border-t border-[#E0E0E0] py-4 px-2">
                <span className="label">{row}</span>
              </div>
              <div className="border-t border-[#E0E0E0] py-4 px-2 bg-[#FFDB1510]">
                <span className="body-light text-[#0A0A0A]" style={{ fontSize: 14 }}>{cash}</span>
              </div>
              <div className="border-t border-[#E0E0E0] py-4 px-2 bg-[#826DEE10]">
                <span className="body-light text-[#0A0A0A]" style={{ fontSize: 14 }}>{managed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
