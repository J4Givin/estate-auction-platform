'use client'

import { useState } from 'react'
import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { ExpertCard } from '@/components/portal/ExpertCard'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { useExperts, useEstateCase } from '@/lib/data/hooks'

export default function ExpertsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'available' | 'in_review' | 'unavailable'>('all')

  const expertsQuery = useExperts()
  const estate = useEstateCase()
  const EXPERTS = expertsQuery.data.experts
  const EXPERT_QUEUE = expertsQuery.data.queue
  const ASSET_BALANCE = { cashAvailable: estate.data.availableForPayout }

  const filtered = EXPERTS.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false
    if (search && !`${e.name} ${e.specialty}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <AppShell
      role="customer"
      userName="Sample User"
      orgName="Sample Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Request Specialist" primaryHref="/portal/experts" />}
    >
      <PageHeader
        eyebrow="Expert Marketplace"
        title="Human Specialists."
        subtitle="Credentialed art-glass, watch, jewelry, furniture, and rug specialists. Their accuracy, response time, and validation history are visible on every item."
      />

      {/* Queue summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-10 border-b border-[#E0E0E0]" data-testid="experts-queue-summary">
        {[
          { l: 'In Review', c: EXPERT_QUEUE.filter(q => q.state === 'in_review').length, color: '#FFDB15' },
          { l: 'Assigned', c: EXPERT_QUEUE.filter(q => q.state === 'assigned').length, color: '#826DEE' },
          { l: 'Verified', c: EXPERT_QUEUE.filter(q => q.state === 'verified').length, color: '#0E9F6E' },
          { l: 'Escalated', c: EXPERT_QUEUE.filter(q => q.state === 'escalated').length, color: '#F94500' },
        ].map(s => (
          <div key={s.l} className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: s.color }}>
            <span className="label block mb-2.5">{s.l}</span>
            <span
              className="block tabular"
              style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1, color: s.color }}
            >
              {s.c}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="border-t border-[#E0E0E0] py-6 mb-8 flex flex-col gap-4">
        <div className="scroll-x flex gap-2 -mx-4 px-4 pb-1">
          {(['all', 'available', 'in_review', 'unavailable'] as const).map(f => {
            const active = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="label whitespace-nowrap px-4 py-2.5 border transition-colors"
                style={
                  active
                    ? { background: '#0A0A0A', borderColor: '#0A0A0A', color: '#FFFFFF' }
                    : { borderColor: '#E0E0E0', color: '#6B6B6B' }
                }
                data-testid={`expert-filter-${f}`}
              >
                {f === 'all' ? 'All' : f.replace(/_/g, ' ')}
              </button>
            )
          })}
        </div>
        <input
          placeholder="Search by name or specialty…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#E0E0E0] focus:border-[#0A0A0A] px-4 py-3"
          data-testid="experts-search"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {filtered.map(e => (
          <ExpertCard key={e.id} expert={e} onAssign={() => alert(`${e.name} assigned to next eligible item.`)} />
        ))}
      </div>

      {/* Live queue */}
      <SectionCard
        title="Live Review Queue"
        description="Items currently under specialist review across the platform."
      >
        <div className="border border-[#E0E0E0] bg-white">
          {EXPERT_QUEUE.map(q => {
            const expert = EXPERTS.find(e => e.id === q.expertId)
            const overSla = q.hoursOpen > q.slaHours
            return (
              <div
                key={q.id}
                className="border-b border-[#F0F0F0] last:border-b-0 px-4 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-3"
                data-testid={`live-queue-${q.id}`}
              >
                <div className="md:col-span-5">
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{q.itemName}</span>
                  <span className="label block mt-0.5">{q.itemId} · {q.category}</span>
                  {q.notes && <span className="body-light block mt-1.5" style={{ fontSize: 12 }}>{q.notes}</span>}
                </div>
                <div className="md:col-span-3">
                  <span className="label block">Reviewer</span>
                  <span className="block text-[#0A0A0A]" style={{ fontSize: 13 }}>{expert?.name ?? '— pending assignment'}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="label block">State</span>
                  <span className="label" style={{
                    color: q.state === 'verified' ? '#0E9F6E' : q.state === 'in_review' ? '#FFDB15' : q.state === 'escalated' ? '#F94500' : q.state === 'assigned' ? '#826DEE' : '#6B6B6B',
                  }}>
                    ● {q.state.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <span className="label block">SLA</span>
                  <span className="tabular" style={{ fontSize: 13, color: overSla ? '#F94500' : '#0A0A0A' }}>
                    {q.hoursOpen}h / {q.slaHours}h
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </AppShell>
  )
}
