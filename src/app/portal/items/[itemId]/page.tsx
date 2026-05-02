'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { AppShell, PageHeader } from '@/components/layout/AppShell'
import { DecisionSheet } from '@/components/portal/DecisionSheet'
import {
  INVENTORY,
  type Disposition,
  DISPOSITION_LABEL,
  DISPOSITION_COLOR,
  STATUS_LABEL,
  fmt,
} from '@/lib/sample-data'

export default function ItemDetail() {
  const params = useParams()
  const id = params.itemId as string
  const initial = INVENTORY.find(i => i.id === id)
  const [item, setItem] = useState(initial)
  const [open, setOpen] = useState(false)

  if (!item) return notFound()

  const dispoColor = DISPOSITION_COLOR[item.disposition]
  const confColor = item.confidence === 'high' ? '#0E9F6E' : item.confidence === 'medium' ? '#FFDB15' : '#F94500'

  const onDecide = (id: string, disposition: Disposition) => {
    setItem(prev => prev ? { ...prev, disposition } : prev)
    setOpen(false)
  }

  return (
    <AppShell role="customer" userName="Sarah Mitchell" orgName="Mitchell Estate">
      <div className="mb-6 flex items-center gap-3 text-[#6B6B6B]">
        <Link href="/portal/inventory" className="label hover:text-[#0A0A0A]">← Inventory</Link>
        <span className="label">/</span>
        <span className="label">{item.id}</span>
      </div>

      <PageHeader
        eyebrow={`${item.room} · ${item.category}`}
        title={item.name}
        badge={
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5"
            style={{ background: `${dispoColor}15`, border: `1px solid ${dispoColor}` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: dispoColor }} />
            <span className="label" style={{ color: dispoColor }}>{DISPOSITION_LABEL[item.disposition]}</span>
          </span>
        }
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn btn-outline" data-testid="item-stop-sell">Stop-Sell / Hold</button>
            <button className="btn btn-ink" onClick={() => setOpen(true)} data-testid="item-decide">
              Change Decision →
            </button>
          </div>
        }
      />

      {/* Pricing trio */}
      <div className="grid grid-cols-3 gap-0 mb-12 border-b border-[#E0E0E0]" data-testid="item-pricing">
        <Stat title="Cash Offer" value={item.cashOffer ? fmt(item.cashOffer) : '—'} color="#FFDB15" sub="If sold to platform" />
        <Stat title="Managed Estimate" value={item.estimateLow ? `${fmt(item.estimateLow)}–${fmt(item.estimateHigh)}` : '—'} color="#826DEE" sub="After channel fees" />
        <Stat title="Your Floor" value={item.floorPrice ? fmt(item.floorPrice) : 'Not set'} color="#0A0A0A" sub="Lowest acceptable" />
      </div>

      {/* Two-column: AI evidence + Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        {/* Evidence + comps */}
        <div className="lg:col-span-2 border-t border-[#E0E0E0] pt-10" data-testid="item-evidence">
          <span className="label block mb-2" style={{ color: '#826DEE' }}>● AI Appraisal — Evidence Snapshot</span>
          <h2 className="display-md mb-3" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>How we priced this.</h2>
          <p className="body-light mb-6" style={{ fontSize: 14 }}>{item.aiRationale}</p>

          {/* Confidence + status row */}
          <div className="grid grid-cols-3 gap-0 border-y border-[#E0E0E0] mb-8">
            <div className="py-4 pr-4 border-r border-[#E0E0E0]">
              <span className="label block mb-1.5">Confidence</span>
              <span className="label" style={{ color: confColor, fontSize: 12 }}>● {item.confidence.toUpperCase()}</span>
            </div>
            <div className="py-4 px-4 border-r border-[#E0E0E0]">
              <span className="label block mb-1.5">Status</span>
              <span className="label" style={{ fontSize: 12 }}>{STATUS_LABEL[item.status]}</span>
            </div>
            <div className="py-4 pl-4">
              <span className="label block mb-1.5">Snapshot</span>
              <span className="label tabular" style={{ fontSize: 11 }}>{item.evidenceSnapshot ?? '—'}</span>
            </div>
          </div>

          {/* Comps */}
          <span className="label block mb-3">Comparable Sales</span>
          {item.comps.length === 0 ? (
            <p className="body-light" style={{ fontSize: 13 }}>No comparable sales were used. Item flagged for human review or low velocity.</p>
          ) : (
            <div className="border-t border-[#E0E0E0]">
              {item.comps.map((c, i) => (
                <div key={i} className="border-b border-[#E0E0E0] py-3 grid grid-cols-1 md:grid-cols-12 gap-2 md:items-center" data-testid={`comp-${i}`}>
                  <div className="md:col-span-2"><span className="label">{c.source}</span></div>
                  <div className="md:col-span-7"><span className="body-light text-[#0A0A0A]" style={{ fontSize: 14 }}>{c.title}</span></div>
                  <div className="md:col-span-2"><span className="label">{c.date}</span></div>
                  <div className="md:col-span-1 md:text-right"><span className="tabular text-[#0A0A0A]" style={{ fontSize: 14 }}>{fmt(c.price)}</span></div>
                </div>
              ))}
            </div>
          )}

          {/* Channels */}
          {item.channels && item.channels.length > 0 && (
            <div className="mt-8 border-t border-[#E0E0E0] pt-6" data-testid="item-channels">
              <span className="label block mb-3">Listing Channels</span>
              <div className="flex flex-wrap gap-2">
                {item.channels.map(ch => (
                  <span key={ch} className="label px-3 py-2 border border-[#E0E0E0]">{ch}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Audit / Human Validation */}
        <div className="border-t border-[#E0E0E0] pt-10" data-testid="item-audit">
          <span className="label block mb-2" style={{ color: item.humanReviewed ? '#0E9F6E' : '#FFDB15' }}>
            ● {item.humanReviewed ? 'Human Validated' : 'Awaiting Validation'}
          </span>
          <h2 className="display-md mb-4" style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)' }}>Trust Receipt</h2>
          {item.humanReviewed && item.reviewer ? (
            <div className="border-y border-[#E0E0E0] py-4 mb-4">
              <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{item.reviewer.name}</span>
              <span className="label block mt-1">{item.reviewer.role}</span>
              <span className="label block mt-1.5">Reviewed {item.reviewer.date}</span>
              <p className="body-light mt-3" style={{ fontSize: 13 }}>{item.reviewer.rationale}</p>
            </div>
          ) : (
            <p className="body-light mb-4" style={{ fontSize: 13 }}>
              A specialist secondary review is recommended for this item before final sale or donation.
            </p>
          )}

          {/* Audit timeline */}
          <span className="label block mb-3 mt-6">Audit Trail</span>
          <ol className="border-l border-[#E0E0E0] pl-4 ml-1">
            {[
              { label: 'AI evidence snapshot frozen', date: item.evidenceSnapshot ?? '—', color: '#826DEE' },
              ...(item.humanReviewed && item.reviewer ? [{ label: 'Human validation', date: item.reviewer.date, color: '#0E9F6E' }] : []),
              { label: 'Photos captured', date: '2026-04-19', color: '#FFDB15' },
              { label: 'Catalog created', date: '2026-04-18', color: '#FF99DC' },
            ].map((e, i) => (
              <li key={i} className="relative pl-4 pb-5 last:pb-0">
                <span
                  className="absolute -left-[20px] top-1 w-2 h-2 rounded-full"
                  style={{ background: e.color }}
                />
                <span className="block text-[#0A0A0A]" style={{ fontSize: 13 }}>{e.label}</span>
                <span className="label tabular">{e.date}</span>
              </li>
            ))}
          </ol>

          {/* Flags */}
          {item.flags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#E0E0E0]">
              <span className="label block mb-3" style={{ color: '#F94500' }}>● Risk Flags</span>
              <div className="flex flex-col gap-2">
                {item.flags.map(f => (
                  <span key={f} className="label px-2 py-1.5" style={{ background: '#FFDB1520', color: '#7B6800', border: '1px solid #FFDB1580' }}>
                    {f.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Storage block */}
      {item.disposition === 'store' && item.storageLocation && (
        <div className="border-t border-[#E0E0E0] pt-10" data-testid="item-storage">
          <span className="label block mb-2" style={{ color: '#FF99DC' }}>● In Storage</span>
          <h2 className="display-md mb-4" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>{item.storageLocation}</h2>
          <p className="body-light mb-4" style={{ fontSize: 14 }}>
            Bonded climate-controlled storage. Adjustable monthly. You can sell, donate, or release this item from storage at any time.
          </p>
          <div className="flex gap-3">
            <button className="btn btn-outline" data-testid="item-storage-list">List from Storage</button>
            <button className="btn btn-outline" data-testid="item-storage-cash">Take Cash Offer</button>
            <button className="btn btn-outline" data-testid="item-storage-release">Release to Family</button>
          </div>
        </div>
      )}

      <DecisionSheet item={open ? item : null} onClose={() => setOpen(false)} onDecide={onDecide} />
    </AppShell>
  )
}

function Stat({ title, value, color, sub }: { title: string; value: string; color: string; sub: string }) {
  return (
    <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: color }}>
      <span className="label block mb-3">{title}</span>
      <span
        className="block tabular"
        style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', lineHeight: 1, color }}
      >
        {value}
      </span>
      <span className="label mt-3 block">{sub}</span>
    </div>
  )
}
