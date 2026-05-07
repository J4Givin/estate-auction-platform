'use client'

import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { LEARNING_METRICS, PLATFORM_LEARNINGS, EXPERIMENTS } from '@/lib/sample-data'

export default function OpsInsightsPage() {
  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Estate Liquidity Ops">
      <PageHeader
        eyebrow="Data Moat"
        title="What the platform learned."
        subtitle="Proprietary learning loop — appraiser accuracy, price realization, sell-through, time-to-sale, channel lift, donation conversion, dispute rate, NPS, and active experiments."
      />

      {/* Learning metrics grid */}
      <SectionCard title="Learning Loop Metrics" description="Last 90 days, net of seasonality.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-[#E0E0E0]" data-testid="learning-metrics">
          {LEARNING_METRICS.map(m => (
            <div key={m.id} className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: m.color }} data-testid={`metric-${m.id}`}>
              <span className="label block mb-2.5">{m.label}</span>
              <span
                className="block tabular"
                style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)', lineHeight: 1, color: m.color }}
              >
                {m.value}
              </span>
              <span className="label mt-2 block" style={{ color: m.trend.up ? '#0E9F6E' : '#F94500' }}>
                {m.trend.up ? '↑' : '↓'} {Math.abs(m.trend.pct)}%
              </span>
              <span className="body-light block mt-1.5" style={{ fontSize: 12 }}>{m.description}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Platform learnings */}
      <SectionCard title="What we learned this quarter" description="Insights produced by the network. These shape pricing curves, channel routing, and donation prompts.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLATFORM_LEARNINGS.map(l => (
            <div key={l.id} className="border border-[#E0E0E0] bg-white p-5" data-testid={`learning-${l.id}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="label" style={{ color: l.color }}>● Insight</span>
                <span className="label tabular">conf {Math.round(l.confidence * 100)}%</span>
              </div>
              <h4 className="text-[#0A0A0A] font-medium mb-2" style={{ fontSize: 15 }}>{l.title}</h4>
              <p className="body-light" style={{ fontSize: 13 }}>{l.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Experiments */}
      <SectionCard title="Active Experiments" description="Pricing curves, channel routing, donation prompts.">
        <div className="border border-[#E0E0E0] bg-white">
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 sm:px-6 py-3 border-b border-[#F0F0F0]">
            <span className="label col-span-5">Experiment</span>
            <span className="label col-span-2">Status</span>
            <span className="label col-span-3">Cohort</span>
            <span className="label col-span-2 text-right">Uplift</span>
          </div>
          {EXPERIMENTS.map(e => (
            <div key={e.id} className="border-b border-[#F0F0F0] last:border-b-0 px-4 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-12 gap-3" data-testid={`experiment-${e.id}`}>
              <div className="md:col-span-5">
                <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{e.name}</span>
                <span className="label">{e.id}</span>
              </div>
              <div className="md:col-span-2"><span className="label" style={{ color: e.color }}>● {e.status}</span></div>
              <div className="md:col-span-3"><span className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>{e.cohort}</span></div>
              <div className="md:col-span-2 md:text-right"><span className="tabular text-[#0A0A0A]" style={{ fontSize: 13 }}>{e.uplift}</span></div>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  )
}
