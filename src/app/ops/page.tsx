"use client";

import Link from "next/link";
import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { fmt } from '@/lib/sample-data'

const KPI = [
  { label: 'Active Jobs', value: '12', delta: '+2 this week', color: '#826DEE' },
  { label: 'Pending QA', value: '14', delta: '4 over SLA', color: '#FFDB15', warn: true },
  { label: 'Items In-Pipeline', value: '486', delta: '186 this month', color: '#FF99DC' },
  { label: 'Net Recovery MTD', value: '$248k', delta: '+12% vs last', color: '#0E9F6E' },
]

const QUEUES = [
  { label: 'New intakes — schedule walkthrough', count: 4, color: '#826DEE', href: '/ops/jobs' },
  { label: 'Capture review (room coverage)', count: 7, color: '#FFDB15', href: '/ops/queue' },
  { label: 'AI flagged — needs human appraisal', count: 11, color: '#F94500', href: '/qa' },
  { label: 'Authentication queue (high-value)', count: 3, color: '#0A0A0A', href: '/qa/auth' },
  { label: 'Pricing approval', count: 6, color: '#FF99DC', href: '/ops/catalog' },
  { label: 'Channel publish queue', count: 22, color: '#826DEE', href: '/ops/publish' },
  { label: 'Offers awaiting customer decision', count: 5, color: '#FFDB15', href: '/ops/offers' },
  { label: 'Returns & disputes', count: 2, color: '#F94500', href: '/ops/returns' },
]

export default function OpsDashboard() {
  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Estate Liquidity Ops">
      <PageHeader
        eyebrow="Operations"
        title="Command Center."
        subtitle="Active queue, SLA status, channel health, and net recovery — the operating room for the estate liquidity floor."
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/ops/queue" className="btn btn-outline" data-testid="ops-open-queue">Open Queue</Link>
            <Link href="/ops/jobs" className="btn btn-ink" data-testid="ops-new-job">New Job →</Link>
          </div>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-14 border-b border-[#E0E0E0]" data-testid="ops-kpi-grid">
        {KPI.map(k => (
          <div key={k.label} className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: k.color }}>
            <span className="label block mb-3">{k.label}</span>
            <span
              className="block tabular"
              style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', lineHeight: 1, color: k.warn ? '#F94500' : '#0A0A0A' }}
            >
              {k.value}
            </span>
            <span className="label mt-3 block" style={{ color: k.warn ? '#F94500' : '#6B6B6B' }}>{k.delta}</span>
          </div>
        ))}
      </div>

      {/* Queues + Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-14">
        <div className="lg:col-span-2 border-t border-[#E0E0E0] pt-10" data-testid="ops-queues">
          <span className="label block mb-2">Working Queues</span>
          <h3 className="display-md mb-6" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>What needs ops attention.</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {QUEUES.map(q => (
              <Link
                key={q.label}
                href={q.href}
                className="border-t border-[#E0E0E0] py-5 pr-3 group hover:bg-[#F5F5F5] transition-colors -mx-2 px-2"
                data-testid={`queue-${q.label.split(' ')[0].toLowerCase()}`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: q.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{q.label}</span>
                    <span className="label mt-1 block group-hover:text-[#0A0A0A] transition-colors">Open queue →</span>
                  </div>
                  <span
                    className="tabular flex-shrink-0"
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 900,
                      fontSize: '1.6rem',
                      lineHeight: 1,
                      color: q.color,
                    }}
                  >
                    {q.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E0E0E0] pt-10" data-testid="ops-sla">
          <span className="label block mb-2" style={{ color: '#F94500' }}>● SLA Alerts</span>
          <h3 className="display-md mb-4" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}>Past or near-target.</h3>
          <div className="flex flex-col">
            {[
              { label: 'Tiffany Lamp #ITM-1041 — auth review overdue', time: '3h 12m', color: '#F94500' },
              { label: 'eBay buyer message — past SLA', time: '2h 45m', color: '#F94500' },
              { label: 'Sapphire necklace offer — expiring soon', time: '1h 58m', color: '#FFDB15' },
              { label: 'Crystal Chandelier — needs human appraiser', time: '46m', color: '#FFDB15' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-[#E0E0E0] py-3.5">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: item.color }} />
                <span className="body-light flex-1" style={{ fontSize: 13 }}>{item.label}</span>
                <span className="label tabular flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent jobs + Channel health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14">
        <SectionCard title="Recent Jobs" description="Latest estate engagements.">
          <div className="flex flex-col" data-testid="ops-recent-jobs">
            {[
              { client: 'Mitchell Estate', status: 'Active Selling', items: 52, net: '$14.8k', color: '#0E9F6E' },
              { client: 'Rivera Family Trust', status: 'Cataloging', items: 31, net: '$2.1k', color: '#FFDB15' },
              { client: 'Chen Probate', status: 'Human Review', items: 18, net: '$0', color: '#F94500' },
              { client: 'Martinez Downsizing', status: 'Scheduled', items: 0, net: '—', color: '#6B6B6B' },
            ].map((job, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-[#E0E0E0] py-4">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: job.color }} />
                <span className="body-light flex-1 text-[#0A0A0A]" style={{ fontSize: 14 }}>{job.client}</span>
                <span className="label hidden sm:block">{job.status}</span>
                <span className="label">{job.items || '—'} items</span>
                <span className="tabular text-[#0A0A0A]" style={{ fontSize: 13 }}>{job.net}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Channel Health" description="Listings, errors, and latency across our six channels.">
          <div className="flex flex-col" data-testid="ops-channels">
            {[
              { ch: 'eBay', listings: 142, errors: 0, latency: '420ms', color: '#0E9F6E' },
              { ch: '1stDibs', listings: 38, errors: 0, latency: '690ms', color: '#0E9F6E' },
              { ch: 'Chairish', listings: 76, errors: 1, latency: '380ms', color: '#FFDB15' },
              { ch: 'Facebook MP', listings: 124, errors: 0, latency: '210ms', color: '#0E9F6E' },
              { ch: 'Etsy', listings: 22, errors: 2, latency: '520ms', color: '#F94500' },
              { ch: 'House Auction', listings: 18, errors: 0, latency: '—', color: '#0E9F6E' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-[#E0E0E0] py-3.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="body-light flex-1 text-[#0A0A0A]" style={{ fontSize: 14 }}>{c.ch}</span>
                <span className="label tabular">{c.listings} live</span>
                <span className="label tabular" style={{ color: c.errors > 0 ? '#F94500' : '#6B6B6B' }}>
                  {c.errors} err
                </span>
                <span className="label tabular hidden sm:inline">{c.latency}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Trust strip */}
      <SectionCard title="Trust & Safety" description="P0 controls — visible, enforced, audited.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-testid="ops-trust-strip">
          {[
            { l: 'Authority Documents', v: '12 verified · 0 pending', c: '#0E9F6E' },
            { l: 'PII Redaction Engine', v: 'Active · 286 photos', c: '#0E9F6E' },
            { l: 'Prohibited Blocks', v: '3 caught · 0 published', c: '#0E9F6E' },
            { l: 'Audit Log', v: 'Immutable · streaming', c: '#0E9F6E' },
          ].map(t => (
            <div key={t.l}>
              <span className="label block mb-1.5" style={{ color: t.c }}>● {t.l}</span>
              <span className="body-light text-[#0A0A0A]" style={{ fontSize: 13 }}>{t.v}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  )
}
