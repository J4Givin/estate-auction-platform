'use client'

import { useState } from 'react'
import { AppShell, PageHeader } from '@/components/layout/AppShell'
import { TrustReceipt } from '@/components/portal/TrustReceipt'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { TRUST_RECEIPTS, RECEIPT_LABEL, ASSET_BALANCE, ReceiptKind } from '@/lib/sample-data'

const FILTERS: Array<{ key: ReceiptKind | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'appraisal', label: 'Appraisal' },
  { key: 'authentication', label: 'Authentication' },
  { key: 'listing', label: 'Listing' },
  { key: 'donation', label: 'Donation' },
  { key: 'payout', label: 'Payout' },
  { key: 'stop_sell', label: 'Stop-sell' },
]

export default function ReceiptsPage() {
  const [filter, setFilter] = useState<ReceiptKind | 'all'>('all')
  const filtered = TRUST_RECEIPTS.filter(r => filter === 'all' || r.kind === filter)

  return (
    <AppShell
      role="customer"
      userName="Sarah Mitchell"
      orgName="Mitchell Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Open Dispute" primaryHref="/portal/concierge" />}
    >
      <PageHeader
        eyebrow="Trust Receipts"
        title="Immutable record."
        subtitle="Every appraisal, listing, price drop, donation, payout, disposal, and stop-sell becomes a receipt — what happened, why, who approved, evidence used, when, and how to dispute."
      />

      <div className="scroll-x flex gap-2 mb-8 -mx-4 px-4" data-testid="receipts-filters">
        {FILTERS.map(f => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="label whitespace-nowrap px-4 py-2.5 border transition-colors"
              style={
                active
                  ? { background: '#0A0A0A', borderColor: '#0A0A0A', color: '#FFFFFF' }
                  : { borderColor: '#E0E0E0', color: '#6B6B6B' }
              }
              data-testid={`receipts-filter-${f.key}`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12" data-testid="receipts-grid">
        {filtered.map(r => (
          <TrustReceipt key={r.id} receipt={r} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="border border-[#E0E0E0] py-16 text-center">
          <span className="label block mb-2">No {RECEIPT_LABEL[filter as ReceiptKind] ?? ''} receipts yet</span>
        </div>
      )}
    </AppShell>
  )
}
