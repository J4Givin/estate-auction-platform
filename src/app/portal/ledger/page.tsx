'use client'

import { useState } from 'react'
import { AppShell, PageHeader } from '@/components/layout/AppShell'
import { TrustReceipt } from '@/components/portal/TrustReceipt'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { fmt } from '@/lib/sample-data'
import { useLedger, useEstateCase, useTrustReceipts } from '@/lib/data/hooks'
import { newIdempotencyKey, portalWrite } from '@/lib/portal-client'

const TYPE_COLOR: Record<string, string> = {
  sale: '#0E9F6E',
  fee: '#F94500',
  storage: '#FF99DC',
  donation: '#826DEE',
  payout: '#0A0A0A',
  reserve: '#FFDB15',
  refund: '#F94500',
}

const TYPE_LABEL: Record<string, string> = {
  sale: 'Sale',
  fee: 'Fee',
  storage: 'Storage',
  donation: 'Donation',
  payout: 'Payout',
  reserve: 'Reserve',
  refund: 'Refund',
}

export default function LedgerPage() {
  const [filter, setFilter] = useState<'all' | 'sale' | 'fee' | 'payout' | 'donation'>('all')

  const ledgerQuery = useLedger()
  const estate = useEstateCase()
  const trust = useTrustReceipts()
  const LEDGER = ledgerQuery.data
  const P = estate.data
  const ASSET_BALANCE = { cashAvailable: estate.data.availableForPayout }

  const filtered = LEDGER.filter(l => filter === 'all' || l.type === filter)

  const grossSales = LEDGER.filter(l => l.type === 'sale').reduce((s, l) => s + l.gross, 0)
  const totalFees = LEDGER.filter(l => l.type === 'sale' || l.type === 'storage').reduce((s, l) => s + l.fee, 0)
  const totalPayouts = Math.abs(LEDGER.filter(l => l.type === 'payout').reduce((s, l) => s + l.net, 0))

  const payoutReceipt = trust.data.find(r => r.kind === 'payout')

  const onRequestPayout = async () => {
    try {
      await portalWrite(
        '/api/portal/payouts/request',
        { caseId: P.jobId, amount: P.availableForPayout, actor: 'Sarah Mitchell' },
        { idempotencyKey: newIdempotencyKey() },
      )
    } catch {}
  }

  return (
    <AppShell
      role="customer"
      userName="Sarah Mitchell"
      orgName="Mitchell Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Request Payout" primaryHref="/portal/ledger#payout" />}
    >
      <PageHeader
        eyebrow="Ledger"
        title="Money Trail."
        subtitle="Every sale, fee, reserve, payout, and donation receipt — itemized and timestamped. Like a bank statement for your estate assets."
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn btn-outline" data-testid="ledger-statement-pdf">Download Statement PDF</button>
            <button className="btn btn-ink" onClick={onRequestPayout} data-testid="ledger-request-payout">
              Request Payout · {fmt(P.availableForPayout)}
            </button>
          </div>
        }
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-12 border-b border-[#E0E0E0]" data-testid="ledger-summary">
        <Stat title="Gross Sales" value={fmt(grossSales)} color="#826DEE" sub="Across all channels" />
        <Stat title="Fees & Storage" value={fmt(totalFees)} color="#F94500" sub="Channel + escrow + storage" />
        <Stat title="Available for Payout" value={fmt(P.availableForPayout)} color="#0E9F6E" sub="Cleared & releasable" />
        <Stat title="Lifetime Payouts" value={fmt(totalPayouts)} color="#0A0A0A" sub="Total transferred to bank" />
      </div>

      {/* Filter chips */}
      <div className="border-t border-[#E0E0E0] py-6 mb-6 scroll-x flex gap-2" data-testid="ledger-filters">
        {(['all', 'sale', 'fee', 'payout', 'donation'] as const).map(k => {
          const active = filter === k
          return (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className="label whitespace-nowrap px-4 py-2.5 border transition-colors min-w-[44px]"
              style={
                active
                  ? { background: '#0A0A0A', borderColor: '#0A0A0A', color: '#FFFFFF' }
                  : { borderColor: '#E0E0E0', color: '#6B6B6B' }
              }
              data-testid={`ledger-filter-${k}`}
            >
              {k === 'all' ? 'All' : TYPE_LABEL[k]}
            </button>
          )
        })}
      </div>

      {/* Ledger entries */}
      <div className="border-t border-[#E0E0E0]" data-testid="ledger-entries">
        {/* Desktop column headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b border-[#E0E0E0]">
          <span className="label col-span-2">Date</span>
          <span className="label col-span-5">Description</span>
          <span className="label col-span-1">Type</span>
          <span className="label col-span-1 text-right">Gross</span>
          <span className="label col-span-1 text-right">Fee</span>
          <span className="label col-span-2 text-right">Net</span>
        </div>
        {filtered.map(l => {
          const color = TYPE_COLOR[l.type]
          return (
            <div
              key={l.id}
              className="border-b border-[#E0E0E0] py-5 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 md:items-center hover:bg-[#F5F5F5] -mx-2 px-2 transition-colors"
              data-testid={`ledger-row-${l.id}`}
            >
              <div className="md:col-span-2">
                <span className="label">{l.date}</span>
              </div>
              <div className="md:col-span-5 flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
                <div>
                  <span className="block text-[#0A0A0A]" style={{ fontSize: 14 }}>{l.description}</span>
                  {l.channel && <span className="label">{l.channel}</span>}
                </div>
              </div>
              <div className="md:col-span-1">
                <span className="label" style={{ color }}>{TYPE_LABEL[l.type]}</span>
              </div>
              <div className="md:col-span-1 text-left md:text-right">
                <span className="tabular text-[#0A0A0A]" style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>
                  {l.gross ? fmt(l.gross) : '—'}
                </span>
              </div>
              <div className="md:col-span-1 text-left md:text-right">
                <span className="tabular text-[#F94500]" style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>
                  {l.fee ? `−${fmt(l.fee)}` : '—'}
                </span>
              </div>
              <div className="md:col-span-2 text-left md:text-right">
                <span
                  className="tabular"
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    fontFamily: 'var(--font-display-family)',
                    fontWeight: 900,
                    fontSize: 16,
                    color: l.net >= 0 ? '#0A0A0A' : '#F94500',
                  }}
                >
                  {l.net >= 0 ? '+' : '−'}{fmt(Math.abs(l.net))}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Latest payout receipt */}
      {payoutReceipt && (
        <div id="payout" className="mt-12">
          <TrustReceipt receipt={payoutReceipt} />
        </div>
      )}

      {/* Reserves & disputes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
        <div className="border-t border-[#E0E0E0] pt-8" data-testid="ledger-reserves">
          <span className="label block mb-2" style={{ color: '#FFDB15' }}>● Reserves & Holdbacks</span>
          <h3 className="display-md mb-4" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>{fmt(P.reservedForFees)} held</h3>
          <p className="body-light mb-3" style={{ fontSize: 14 }}>
            Standard 7-day reserve on auction sales protects against returns and chargebacks. Funds release automatically.
          </p>
          <div className="border-t border-[#E0E0E0] pt-3 flex justify-between">
            <span className="label">Next release</span>
            <span className="body-light" style={{ fontSize: 13 }}>2026-05-07</span>
          </div>
        </div>
        <div className="border-t border-[#E0E0E0] pt-8" data-testid="ledger-disputes">
          <span className="label block mb-2" style={{ color: '#0E9F6E' }}>● Disputes & Stop-Sell</span>
          <h3 className="display-md mb-4" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>0 active disputes</h3>
          <p className="body-light mb-3" style={{ fontSize: 14 }}>
            Pause any item at any time — listing freezes, evidence pack is preserved, and our team confirms within one business hour.
          </p>
          <button className="btn btn-outline" data-testid="ledger-stop-sell">Open Stop-Sell Request</button>
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
        style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', lineHeight: 1, color }}
      >
        {value}
      </span>
      <span className="label mt-3 block">{sub}</span>
    </div>
  )
}
