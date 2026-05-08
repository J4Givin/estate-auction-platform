'use client'

import { useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppShell, PageHeader } from '@/components/layout/AppShell'
import { DecisionSheet } from '@/components/portal/DecisionSheet'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { MobileSegmentedControl, SwipeHint } from '@/components/portal/MobilePrimitives'
import {
  type InventoryItem,
  type Disposition,
  DISPOSITION_LABEL,
  DISPOSITION_COLOR,
  STATUS_LABEL,
  fmt,
} from '@/lib/sample-data'
import { useInventory, useEstateCase } from '@/lib/data/hooks'
import { newIdempotencyKey, portalWrite } from '@/lib/portal-client'

export default function InventoryPageWrapper() {
  return (
    <Suspense fallback={null}>
      <InventoryPage />
    </Suspense>
  )
}

const FILTERS: { key: 'all' | 'undecided' | 'sell_managed' | 'store' | 'donate' | 'keep' | 'flagged'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'undecided', label: 'Undecided' },
  { key: 'sell_managed', label: 'For Sale' },
  { key: 'store', label: 'In Storage' },
  { key: 'donate', label: 'Donating' },
  { key: 'keep', label: 'Locked' },
  { key: 'flagged', label: 'Needs Review' },
]

function InventoryPage() {
  const params = useSearchParams()
  const focusId = params.get('focus')
  const initialDispo = params.get('disposition')

  const inventoryQuery = useInventory()
  const estateQuery = useEstateCase()
  const ASSET_BALANCE = {
    cashAvailable: estateQuery.data.availableForPayout,
    cashPending: 0,
    listedValue: 0,
    storageValue: 0,
    donatedValue: estateQuery.data.donationsToDate,
    reserves: estateQuery.data.reservedForFees,
    estimatedNetLow: estateQuery.data.estimatedNetLow,
    estimatedNetHigh: estateQuery.data.estimatedNetHigh,
  }
  const [localItems, setLocalItems] = useState<InventoryItem[] | null>(null)
  const items = localItems ?? inventoryQuery.data
  const setItems = (next: InventoryItem[] | ((prev: InventoryItem[]) => InventoryItem[])) => {
    setLocalItems(prev =>
      typeof next === 'function' ? next(prev ?? inventoryQuery.data) : next,
    )
  }

  const [filter, setFilter] = useState<typeof FILTERS[number]['key']>(
    (initialDispo as typeof FILTERS[number]['key']) ?? 'all'
  )
  const [room, setRoom] = useState<string>('all')
  const [confidence, setConfidence] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [activeItem, setActiveItem] = useState<InventoryItem | null>(
    focusId ? inventoryQuery.data.find(i => i.id === focusId) ?? null : null
  )


  const rooms = useMemo(() => Array.from(new Set(items.map(i => i.room))).sort(), [items])

  const filtered = items.filter(i => {
    if (filter === 'flagged' && !(i.flags.length > 0 && i.flags.some(f => f === 'NEEDS_HUMAN_REVIEW' || f === 'AUTHENTICATION_REQUIRED'))) return false
    if (filter !== 'all' && filter !== 'flagged' && i.disposition !== filter) return false
    if (room !== 'all' && i.room !== room) return false
    if (confidence !== 'all' && i.confidence !== confidence) return false
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleDecide = (id: string, disposition: Disposition) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, disposition } : i))
    setActiveItem(null)
    void portalWrite(
      `/api/portal/items/${id}/disposition`,
      { disposition, actor: 'Sarah Mitchell' },
      { idempotencyKey: newIdempotencyKey() },
    ).catch(() => {})
  }

  const totals = {
    cashOffer: filtered.reduce((s, i) => s + i.cashOffer, 0),
    estimateLow: filtered.reduce((s, i) => s + i.estimateLow, 0),
    estimateHigh: filtered.reduce((s, i) => s + i.estimateHigh, 0),
  }

  return (
    <AppShell
      role="customer"
      userName="Sarah Mitchell"
      orgName="Mitchell Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Bulk Decide" primaryHref="/portal/inventory" />}
    >
      <PageHeader
        eyebrow="Inventory"
        title="Estate Items."
        subtitle="Every cataloged piece, with AI appraisal evidence, human validation, and full disposition control."
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn btn-outline" data-testid="inventory-export">Export CSV</button>
            <button className="btn btn-ink" data-testid="inventory-bulk-decide">Bulk Decide ({filtered.length})</button>
          </div>
        }
      />

      {/* Totals strip */}
      <div className="grid grid-cols-3 gap-0 mb-12 border-b border-[#E0E0E0]" data-testid="inventory-totals">
        <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: '#FFDB15' }}>
          <span className="label block mb-2.5">Cash Offer (Filtered)</span>
          <span className="block tabular" style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)', lineHeight: 1 }}>
            {fmt(totals.cashOffer)}
          </span>
        </div>
        <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: '#826DEE' }}>
          <span className="label block mb-2.5">Managed Estimate</span>
          <span className="block tabular" style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', lineHeight: 1, color: '#826DEE' }}>
            {fmt(totals.estimateLow)} – {fmt(totals.estimateHigh)}
          </span>
        </div>
        <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: '#0A0A0A' }}>
          <span className="label block mb-2.5">Items in View</span>
          <span className="block tabular" style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)', lineHeight: 1 }}>
            {filtered.length}
          </span>
        </div>
      </div>

      {/* Filters bar */}
      <div className="border-t border-[#E0E0E0] py-5 sm:py-6 mb-6 sm:mb-8 flex flex-col gap-4" data-testid="inventory-filters">
        {/* Disposition pills */}
        <MobileSegmentedControl
          options={FILTERS.map(f => ({ key: f.key, label: f.label }))}
          value={filter}
          onChange={setFilter}
          ariaLabel="Disposition filter"
          testId="filter"
        />
        {filter === 'all' && <SwipeHint className="-mt-2">Swipe filters →</SwipeHint>}
        {/* Secondary filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-[#E0E0E0] focus:border-[#0A0A0A] px-4 py-3"
            data-testid="inventory-search"
            inputMode="search"
            autoComplete="off"
            style={{ fontSize: 16 }}
          />
          <select
            value={room}
            onChange={e => setRoom(e.target.value)}
            className="border border-[#E0E0E0] px-4 py-3 bg-white sm:min-w-[160px]"
            data-testid="inventory-room-filter"
            style={{ fontSize: 16 }}
          >
            <option value="all">All Rooms</option>
            {rooms.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={confidence}
            onChange={e => setConfidence(e.target.value)}
            className="border border-[#E0E0E0] px-4 py-3 bg-white sm:min-w-[160px]"
            data-testid="inventory-confidence-filter"
            style={{ fontSize: 16 }}
          >
            <option value="all">Any Confidence</option>
            <option value="high">High Confidence</option>
            <option value="medium">Medium Confidence</option>
            <option value="low">Low Confidence</option>
          </select>
        </div>
      </div>

      {/* Items list — single column on mobile, list rows on desktop */}
      <div className="border-t border-[#E0E0E0]" data-testid="inventory-list">
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <span className="label block mb-3">No items match these filters</span>
            <button onClick={() => { setFilter('all'); setRoom('all'); setConfidence('all'); setSearch('') }} className="btn btn-outline">
              Reset Filters
            </button>
          </div>
        )}
        {filtered.map(item => (
          <ItemRow key={item.id} item={item} onOpen={() => setActiveItem(item)} />
        ))}
      </div>

      <DecisionSheet item={activeItem} onClose={() => setActiveItem(null)} onDecide={handleDecide} />
    </AppShell>
  )
}

function ItemRow({ item, onOpen }: { item: InventoryItem; onOpen: () => void }) {
  const dispoColor = DISPOSITION_COLOR[item.disposition]
  const confColor = item.confidence === 'high' ? '#0E9F6E' : item.confidence === 'medium' ? '#FFDB15' : '#F94500'

  return (
    <div
      className="border-b border-[#E0E0E0] py-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 md:items-center hover:bg-[#F5F5F5] transition-colors -mx-3 px-3 cursor-pointer"
      onClick={onOpen}
      data-testid={`item-row-${item.id}`}
    >
      {/* Title block */}
      <div className="md:col-span-5">
        <div className="flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: dispoColor }} />
          <div className="flex-1 min-w-0">
            <span className="block text-[#0A0A0A] font-medium leading-snug" style={{ fontSize: 15 }}>
              {item.name}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <span className="label">{item.room}</span>
              <span className="label">{item.id}</span>
              <span className="label">{STATUS_LABEL[item.status]}</span>
            </div>
            {/* Flags */}
            {item.flags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.flags.map(f => (
                  <span
                    key={f}
                    className="label px-1.5 py-0.5"
                    style={{ background: '#FFDB1520', color: '#7B6800', border: '1px solid #FFDB1580' }}
                  >
                    {f.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confidence + AI/Human */}
      <div className="md:col-span-2">
        <span className="label block mb-1.5 md:hidden">Trust</span>
        <span className="label block" style={{ color: confColor }}>● {item.confidence.toUpperCase()} CONF</span>
        <span className="label block mt-1" style={{ color: item.humanReviewed ? '#0E9F6E' : '#6B6B6B' }}>
          {item.humanReviewed ? '● Human Validated' : '○ AI Only'}
        </span>
      </div>

      {/* Cash + estimate */}
      <div className="md:col-span-3 flex flex-col md:flex-row md:items-center md:justify-end gap-1 md:gap-6">
        <div className="md:text-right">
          <span className="label block">Cash</span>
          <span className="tabular text-[#0A0A0A]" style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>
            {item.cashOffer ? fmt(item.cashOffer) : '—'}
          </span>
        </div>
        <div className="md:text-right">
          <span className="label block">Managed</span>
          <span className="tabular text-[#826DEE]" style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14 }}>
            {item.estimateLow ? `${fmt(item.estimateLow)}–${fmt(item.estimateHigh)}` : '—'}
          </span>
        </div>
      </div>

      {/* Disposition pill */}
      <div className="md:col-span-2 flex md:justify-end">
        <span
          className="label px-3 py-2 inline-flex items-center gap-2"
          style={{ background: `${dispoColor}15`, color: dispoColor, border: `1px solid ${dispoColor}` }}
          data-testid={`item-disposition-${item.id}`}
        >
          {DISPOSITION_LABEL[item.disposition]}
          <span aria-hidden="true">›</span>
        </span>
      </div>
    </div>
  )
}
