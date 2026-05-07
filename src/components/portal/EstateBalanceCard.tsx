'use client'

import Link from 'next/link'
import { fmt, ASSET_BALANCE, PORTFOLIO_SUMMARY } from '@/lib/sample-data'

/**
 * The big "estate balance" hero — modeled like a banking app's balance card.
 * Mobile-first: balance dominant, ATM-like actions in a thumb row beneath.
 */
export function EstateBalanceCard() {
  const a = ASSET_BALANCE
  const totalAssets = a.cashAvailable + a.cashPending + a.listedValue + a.storageValue + a.donatedValue
  return (
    <div
      className="border border-[#0A0A0A] bg-white"
      data-testid="estate-balance-card"
    >
      <div className="px-5 sm:px-7 py-6 sm:py-7 bg-[#0A0A0A] text-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="label-dark block mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>● Estate Balance</span>
            <span className="label-dark" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {PORTFOLIO_SUMMARY.estateName} · {PORTFOLIO_SUMMARY.jobId}
            </span>
          </div>
          <Link
            href="/portal/statements"
            className="label-dark tap-target px-3 border border-white/30 text-white"
            data-testid="balance-statement"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Statement →
          </Link>
        </div>
        <span
          className="block tabular"
          style={{
            fontFamily: 'var(--font-display-family)',
            fontWeight: 900,
            fontSize: 'clamp(2.6rem, 9vw, 4.6rem)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
          data-testid="balance-cash-available"
        >
          {fmt(a.cashAvailable)}
        </span>
        <span className="label-dark block mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
          available now · {fmt(a.cashPending)} pending · {fmt(totalAssets)} total assets
        </span>
      </div>

      {/* ATM action row */}
      <div className="grid grid-cols-4 border-b border-[#E0E0E0]">
        {[
          { label: 'Withdraw', sub: fmt(a.cashAvailable), href: '/portal/ledger', testid: 'atm-withdraw' },
          { label: 'Take Cash', sub: fmt(PORTFOLIO_SUMMARY.cashOfferAvailable), href: '/portal/offers', testid: 'atm-take-cash' },
          { label: 'Donate', sub: 'route', href: '/portal/donations', testid: 'atm-donate' },
          { label: 'Concierge', sub: 'now', href: '/portal/concierge', testid: 'atm-concierge' },
        ].map(b => (
          <Link
            key={b.label}
            href={b.href}
            className="tap-target flex flex-col items-center justify-center px-1 py-3 border-r last:border-r-0 border-[#E0E0E0] hover:bg-[#F5F5F5] transition-colors"
            data-testid={b.testid}
          >
            <span className="label" style={{ fontSize: 9 }}>{b.label}</span>
            <span className="tabular text-[#0A0A0A]" style={{ fontSize: 11, marginTop: 2 }}>{b.sub}</span>
          </Link>
        ))}
      </div>

      {/* Asset slices */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { l: 'Cash Available', v: fmt(a.cashAvailable), c: '#0E9F6E' },
          { l: 'Pending', v: fmt(a.cashPending), c: '#FFDB15' },
          { l: 'Listed Value', v: fmt(a.listedValue), c: '#826DEE' },
          { l: 'In Storage', v: fmt(a.storageValue), c: '#FF99DC' },
          { l: 'Donated', v: fmt(a.donatedValue), c: '#0E9F6E' },
          { l: 'Reserves', v: fmt(a.reserves), c: '#F94500' },
        ].map(s => (
          <div
            key={s.l}
            className="px-4 py-4 border-b sm:border-r last:border-r-0 border-[#F0F0F0]"
          >
            <span className="label block mb-1" style={{ color: s.c }}>● {s.l}</span>
            <span className="tabular text-[#0A0A0A]" style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14, fontWeight: 500 }}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
