'use client'

import { useState } from 'react'
import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { AppraisalPipeline } from '@/components/portal/AppraisalPipeline'
import { ExpertCard } from '@/components/portal/ExpertCard'
import { TrustReceipt } from '@/components/portal/TrustReceipt'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import {
  CATEGORY_RUBRICS,
} from '@/lib/sample-data'
import {
  useAppraisalRuns,
  useExperts,
  useTrustReceipts,
  useEstateCase,
} from '@/lib/data/hooks'

export default function AppraisalPage() {
  const runsQuery = useAppraisalRuns()
  const expertsQuery = useExperts()
  const trust = useTrustReceipts()
  const estate = useEstateCase()
  const APPRAISAL_RUNS = runsQuery.data
  const EXPERTS = expertsQuery.data.experts
  const EXPERT_QUEUE = expertsQuery.data.queue
  const ASSET_BALANCE = { cashAvailable: estate.data.availableForPayout }

  const [activeRun, setActiveRun] = useState<string | undefined>(APPRAISAL_RUNS[0]?.itemId)
  const run = APPRAISAL_RUNS.find(r => r.itemId === activeRun) ?? APPRAISAL_RUNS[0]
  const reviewers = run
    ? EXPERTS.filter(e => e.specialty.toLowerCase().includes(run.category.toLowerCase().split(' ')[0]) || e.specialty.includes('Coordinator'))
    : []
  const appraisalReceipts = trust.data.filter(r => r.kind === 'appraisal' || r.kind === 'authentication')

  return (
    <AppShell
      role="customer"
      userName="Sample User"
      orgName="Sample Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Get Estimate" primaryHref="/portal/capture" />}
    >
      <PageHeader
        eyebrow="AI Appraisal Pipeline"
        title="How we price."
        subtitle="Eight specialized agents — classify, condition, provenance, comps, liquidity, fraud, strategy, and final confidence — produce every estimate. Anything risky routes to a human specialist."
      />

      {/* Run picker */}
      <div className="scroll-x flex gap-2 mb-6 -mx-4 px-4" data-testid="appraisal-run-picker">
        {APPRAISAL_RUNS.map(r => {
          const active = r.itemId === activeRun
          return (
            <button
              key={r.itemId}
              onClick={() => setActiveRun(r.itemId)}
              className="label whitespace-nowrap px-4 py-2.5 border transition-colors"
              style={
                active
                  ? { background: '#0A0A0A', borderColor: '#0A0A0A', color: '#FFFFFF' }
                  : { borderColor: '#E0E0E0', color: '#6B6B6B' }
              }
              data-testid={`run-pick-${r.itemId}`}
            >
              {r.itemName}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          {run && <AppraisalPipeline run={run} />}
        </div>
        <div className="flex flex-col gap-6">
          <SectionCard title="Specialist on call" className="!mb-0 !pt-0 border-0">
            {reviewers.length > 0 && <ExpertCard expert={reviewers[0]} />}
          </SectionCard>
          <SectionCard title="Authentication receipt" className="!mb-0 !pt-0 border-0">
            {appraisalReceipts.length > 0 && <TrustReceipt receipt={appraisalReceipts[0]} compact />}
          </SectionCard>
        </div>
      </div>

      {/* CATEGORY RUBRICS */}
      <SectionCard
        title="Category Rubrics"
        description="Different goods, different signals. The platform applies a category-specific playbook to every item."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORY_RUBRICS.map(r => (
            <div
              key={r.category}
              className="border border-[#E0E0E0] bg-white p-4 sm:p-5"
              data-testid={`rubric-${r.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}
            >
              <span className="label block mb-1.5" style={{ color: '#826DEE' }}>● {r.category}</span>
              <span className="block text-[#0A0A0A] font-medium mb-3" style={{ fontSize: 14 }}>
                Human-trigger above ${r.humanTriggerThreshold.toLocaleString()}
              </span>
              <div className="grid grid-cols-1 gap-3" style={{ fontSize: 12 }}>
                <RubricList label="Factors" items={r.factors} />
                <RubricList label="Primary Signals" items={r.primarySignals} color="#0E9F6E" />
                <RubricList label="Red Flags" items={r.redFlags} color="#F94500" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* EXPERT QUEUE PREVIEW */}
      <SectionCard
        title="Expert Review Queue"
        description="Every triggered review with category, value, SLA, and assignment state."
      >
        <div className="border border-[#E0E0E0] bg-white">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 border-b border-[#F0F0F0]">
            <span className="label col-span-4">Item</span>
            <span className="label col-span-2">Category</span>
            <span className="label col-span-2">Estimate</span>
            <span className="label col-span-2">State</span>
            <span className="label col-span-2 text-right">SLA</span>
          </div>
          {EXPERT_QUEUE.map(q => (
            <div
              key={q.id}
              className="border-b border-[#F0F0F0] last:border-b-0 px-4 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4"
              data-testid={`queue-row-${q.id}`}
            >
              <div className="md:col-span-4">
                <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{q.itemName}</span>
                <span className="label block mt-0.5">{q.itemId}</span>
              </div>
              <div className="md:col-span-2"><span className="label">{q.category}</span></div>
              <div className="md:col-span-2"><span className="tabular text-[#0A0A0A]" style={{ fontSize: 13 }}>${q.estimateLow.toLocaleString()}–${q.estimateHigh.toLocaleString()}</span></div>
              <div className="md:col-span-2"><StateLabel state={q.state} /></div>
              <div className="md:col-span-2 md:text-right">
                <span
                  className="label tabular"
                  style={{ color: q.hoursOpen > q.slaHours ? '#F94500' : q.hoursOpen > q.slaHours * 0.7 ? '#FFDB15' : '#0E9F6E' }}
                >
                  {q.hoursOpen}h / {q.slaHours}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  )
}

function RubricList({ label, items, color }: { label: string; items: string[]; color?: string }) {
  return (
    <div>
      <span className="label block mb-1" style={{ color }}>{label}</span>
      <ul className="flex flex-wrap gap-1.5">
        {items.map(i => (
          <li key={i} className="label px-2 py-1" style={{ background: '#F5F5F5', color: '#0A0A0A' }}>{i}</li>
        ))}
      </ul>
    </div>
  )
}

function StateLabel({ state }: { state: string }) {
  const c =
    state === 'verified' ? '#0E9F6E' :
    state === 'in_review' ? '#FFDB15' :
    state === 'assigned' ? '#826DEE' :
    state === 'escalated' ? '#F94500' :
    '#6B6B6B'
  return <span className="label" style={{ color: c }}>● {state.replace(/_/g, ' ')}</span>
}
