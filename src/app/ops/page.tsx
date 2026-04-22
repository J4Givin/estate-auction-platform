"use client";

import Link from "next/link";
import { AppShell, PageHeader, SectionCard, StatCard } from '@/components/layout/AppShell'

export default function OpsDashboard() {
  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Estate Liquidity Ops">
      <PageHeader
        title="Operations"
        subtitle="Active queue, SLA status, and recent jobs."
        actions={
          <Link href="/ops/queue" className="btn btn-ink">Open Queue</Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-16 border-b border-[#E0E0E0]">
        <StatCard title="Active Jobs" value="4" color="violet" />
        <StatCard title="Pending QA" value="14" color="yellow" />
        <StatCard title="Items Cataloged" value="186" color="pink" />
        <StatCard title="Revenue MTD" value="$12.4k" delta="8% vs last month" deltaUp={true} color="vermillion" />
      </div>

      <SectionCard title="SLA Alerts" description="Items approaching or past service level targets.">
        <div className="flex flex-col">
          {[
            { label: 'Tiffany Studios Lamp #SKU-3F2A — QA Review overdue', time: '3h 12m', color: '#F94500' },
            { label: 'Message from buyer — eBay #1920 — past SLA', time: '2h 45m', color: '#F94500' },
            { label: 'Offer review — Sapphire necklace — expiring soon', time: '1h 58m', color: '#FFDB15' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 border-b border-[#E0E0E0] py-4">
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: item.color }} />
              <span className="body-light flex-1">{item.label}</span>
              <span className="label flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recent Jobs" description="Latest estate engagements.">
        <div className="flex flex-col">
          {[
            { client: 'Johnson Estate', status: 'Active Selling', items: 52, color: '#826DEE' },
            { client: 'Rivera Family Trust', status: 'In Review', items: 31, color: '#FFDB15' },
            { client: 'Chen Probate', status: 'Processing', items: 18, color: '#FF99DC' },
            { client: 'Martinez Downsizing', status: 'Scheduled', items: 0, color: '#6B6B6B' },
          ].map((job, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-[#E0E0E0] py-4">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: job.color }} />
              <span className="body-light flex-1">{job.client}</span>
              <span className="label">{job.status}</span>
              <span className="label">{job.items || '—'} items</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  )
}
