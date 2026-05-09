'use client'
import { useEffect } from 'react'
import {
  InventoryItem,
  Disposition,
  DISPOSITION_COLOR,
  fmt,
} from '@/lib/sample-data'

interface DecisionSheetProps {
  item: InventoryItem | null
  onClose: () => void
  onDecide: (itemId: string, disposition: Disposition, floor?: number) => void
}

const DECISIONS: { value: Disposition; title: string; sub: string; color: string }[] = [
  { value: 'sell_to_platform', title: 'Sell to Estate Liquidity', sub: 'Take the cash offer now. Funds clear in 1–2 business days.', color: DISPOSITION_COLOR.sell_to_platform },
  { value: 'sell_managed', title: 'Managed Multi-Channel Sale', sub: 'List across our channel network with a price floor you set.', color: DISPOSITION_COLOR.sell_managed },
  { value: 'store', title: 'Store & Decide Later', sub: 'Bonded storage. Adjust like a savings account — sell, donate, or keep anytime.', color: DISPOSITION_COLOR.store },
  { value: 'donate', title: 'Donate to Charity', sub: 'Routed to your selected charity. Tax receipt and impact report generated.', color: DISPOSITION_COLOR.donate },
  { value: 'keep', title: 'Keep / Lock', sub: 'Item is locked from sale and donation. Returned or held for family.', color: DISPOSITION_COLOR.keep },
  { value: 'dispose', title: 'Dispose / Recycle', sub: 'Only for unsellable items. Confirmation and documentation required.', color: DISPOSITION_COLOR.dispose },
]

export function DecisionSheet({ item, onClose, onDecide }: DecisionSheetProps) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center md:justify-end animate-fade-in"
      role="dialog"
      aria-modal="true"
      data-testid="decision-sheet"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        data-testid="decision-sheet-backdrop"
      />

      {/* Sheet — bottom on mobile, side panel on desktop */}
      <div
        className="relative w-full md:max-w-[520px] md:h-screen bg-white border-t md:border-t-0 md:border-l border-[#E0E0E0] overflow-y-auto"
        style={{
          animation: 'slideUp 0.28s cubic-bezier(0.22,1,0.36,1)',
          maxHeight: '90vh',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0.9 }
            to { transform: translateY(0); opacity: 1 }
          }
        `}</style>

        {/* Header */}
        <div className="border-b border-[#E0E0E0] px-6 sm:px-8 py-6 flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
          <div className="flex-1 min-w-0">
            <span className="label block mb-2">Decide for Item</span>
            <h2 className="display-md leading-tight" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)' }}>
              {item.name}
            </h2>
            <span className="label mt-2 block">{item.room} · {item.id}</span>
          </div>
          <button
            onClick={onClose}
            className="tap-target text-[#6B6B6B] hover:text-[#0A0A0A] -mt-2 -mr-2"
            aria-label="Close decision sheet"
            data-testid="decision-sheet-close"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        {/* Quick price summary */}
        <div className="px-6 sm:px-8 py-6 grid grid-cols-2 gap-x-6 gap-y-4 border-b border-[#E0E0E0]">
          <div>
            <span className="label block mb-1.5">Cash Offer Now</span>
            <span className="display-md tabular block" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: DISPOSITION_COLOR.sell_to_platform }}>
              {item.cashOffer ? fmt(item.cashOffer) : '—'}
            </span>
          </div>
          <div>
            <span className="label block mb-1.5">Managed Estimate</span>
            <span className="display-md tabular block" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: DISPOSITION_COLOR.sell_managed }}>
              {item.estimateLow ? `${fmt(item.estimateLow)}–${fmt(item.estimateHigh)}` : '—'}
            </span>
          </div>
          <div>
            <span className="label block mb-1.5">Your Floor</span>
            <span className="display-md tabular block" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}>
              {item.floorPrice ? fmt(item.floorPrice) : '—'}
            </span>
          </div>
          <div>
            <span className="label block mb-1.5">Confidence</span>
            <span className="display-md block" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>
              {item.confidence.toUpperCase()}
            </span>
          </div>
        </div>

        {/* AI rationale receipt */}
        <div className="px-6 sm:px-8 py-6 border-b border-[#E0E0E0] bg-[#F5F5F5]">
          <span className="label block mb-2" style={{ color: '#826DEE' }}>● AI Appraisal Receipt</span>
          <p className="body-light text-[#0A0A0A]" style={{ fontSize: 14 }}>{item.aiRationale}</p>
          {item.humanReviewed && item.reviewer && (
            <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
              <span className="label block mb-1.5" style={{ color: '#0E9F6E' }}>● Human Validated</span>
              <span className="body-light block" style={{ fontSize: 13 }}>
                <strong className="text-[#0A0A0A]">{item.reviewer.name}</strong> · {item.reviewer.role}
              </span>
              <span className="label block mt-1">{item.reviewer.date}</span>
              <p className="body-light mt-2" style={{ fontSize: 13 }}>{item.reviewer.rationale}</p>
            </div>
          )}
          {!item.humanReviewed && (
            <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
              <span className="label block" style={{ color: '#FFDB15' }}>● Awaiting Human Validation</span>
              <p className="body-light mt-1.5" style={{ fontSize: 13 }}>
                A specialist secondary review is recommended before final disposition for this item.
              </p>
            </div>
          )}
        </div>

        {/* Decision options */}
        <div className="px-6 sm:px-8 py-6">
          <span className="label block mb-4">Choose Disposition</span>
          <div className="flex flex-col gap-2">
            {DECISIONS.map(d => {
              const selected = item.disposition === d.value
              return (
                <button
                  key={d.value}
                  onClick={() => onDecide(item.id, d.value)}
                  className="text-left border border-[#E0E0E0] hover:border-[#0A0A0A] transition-all px-4 py-4 flex items-start gap-4 group"
                  style={selected ? { borderColor: d.color, background: `${d.color}10` } : {}}
                  data-testid={`decision-option-${d.value}`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: d.color, boxShadow: selected ? `0 0 0 4px ${d.color}33` : undefined }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>
                      {d.title}
                      {selected && <span className="label ml-2" style={{ color: d.color }}>● Active</span>}
                    </span>
                    <span className="body-light block mt-0.5" style={{ fontSize: 13 }}>{d.sub}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Floor price */}
        <div className="px-6 sm:px-8 py-6 border-t border-[#E0E0E0]">
          <span className="label block mb-3">Lowest Acceptable Price (Floor)</span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              defaultValue={item.floorPrice}
              className="flex-1 border border-[#E0E0E0] focus:border-[#0A0A0A] px-4 py-3 tabular text-lg"
              data-testid="decision-floor-input"
              aria-label="Floor price"
            />
            <button
              className="btn btn-outline"
              data-testid="decision-floor-save"
              onClick={onClose}
            >
              Save Floor
            </button>
          </div>
          <span className="label mt-2 block">
            Selling channels will not drop below this price without your re-approval.
          </span>
        </div>

        {/* Sticky bottom action bar */}
        <div
          className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-6 sm:px-8 py-4 flex items-center gap-3"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        >
          <button
            onClick={onClose}
            className="btn btn-outline flex-1"
            data-testid="decision-cancel"
          >
            Cancel
          </button>
          <button
            onClick={() => onDecide(item.id, item.disposition)}
            className="btn btn-ink flex-1"
            data-testid="decision-confirm"
          >
            Confirm Decision →
          </button>
        </div>
      </div>
    </div>
  )
}
