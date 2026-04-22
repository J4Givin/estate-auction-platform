"use client";

import Link from "next/link";
import { AppShell, PageHeader, SectionCard, StatCard } from '@/components/layout/AppShell'
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  return (
    <AppShell role="admin" userName="Admin" orgName="Estate Liquidity">
      <PageHeader
        title="Administration"
        subtitle="System overview, disputes, user management, and platform health."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-16 border-b border-[#E0E0E0]">
        <StatCard title="Total Users" value="48" color="violet" />
        <StatCard title="Active Jobs" value="12" color="yellow" />
        <StatCard title="Revenue MTD" value="$68.4k" delta="14% vs prior" deltaUp={true} color="vermillion" />
        <StatCard title="Partner Count" value="7" color="pink" />
      </div>

      <SectionCard title="Admin Modules" description="Quick access to system management.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {[
            { href: '/admin/users', title: 'User Management', desc: 'RBAC roles and permissions', color: '#826DEE' },
            { href: '/admin/policies', title: 'Policies', desc: 'Prohibited items, floors, disclosures', color: '#FF99DC' },
            { href: '/admin/channels', title: 'Channels', desc: 'Marketplace credentials & health', color: '#FFDB15' },
            { href: '/admin/disputes', title: 'Disputes', desc: 'Open disputes & legal holds', color: '#F94500' },
            { href: '/admin/analytics', title: 'Analytics', desc: 'Sell-through, labor, channel perf', color: '#826DEE' },
            { href: '/admin/audit', title: 'Audit Log', desc: 'Immutable action history', color: '#6B6B6B' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="border-t border-l border-[#E0E0E0] p-6 flex flex-col gap-2 hover:bg-[#F5F5F5] transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full" style={{ background: link.color }} />
                <span className="display-md text-[#0A0A0A]" style={{ fontSize: '1.25rem' }}>{link.title}</span>
              </div>
              <span className="body-light">{link.desc}</span>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="System Alerts" description="Recent platform issues requiring attention.">
        <div className="flex flex-col">
          {[
            { msg: 'Dispute opened — Rivera Estate ownership claim', time: '1h ago', color: '#F94500' },
            { msg: 'Channel error: eBay rate limit reached', time: '3h ago', color: '#F94500' },
            { msg: '2 items prohibited — ivory figurines flagged', time: '5h ago', color: '#FFDB15' },
            { msg: 'Ledger adjustment requires dual approval', time: '6h ago', color: '#FFDB15' },
          ].map((alert, i) => (
            <div key={i} className="flex items-start gap-4 border-b border-[#E0E0E0] py-4">
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: alert.color }} />
              <span className="body-light flex-1">{alert.msg}</span>
              <span className="label flex-shrink-0">{alert.time}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Channel Health" description="Marketplace connectivity status.">
        <div className="flex flex-col">
          {[
            { name: 'Storefront', ok: true },
            { name: 'eBay', ok: false },
            { name: 'Facebook Marketplace', ok: true },
            { name: 'Etsy', ok: true },
            { name: 'OfferUp', ok: true },
          ].map(ch => (
            <div key={ch.name} className="flex items-center justify-between border-b border-[#E0E0E0] py-4">
              <span className="body-light">{ch.name}</span>
              <Badge variant={ch.ok ? 'emerald' : 'ruby'}>{ch.ok ? 'Healthy' : 'Error'}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  )
}
