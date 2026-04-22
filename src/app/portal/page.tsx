"use client";

import { AppShell, PageHeader, SectionCard, StatCard } from '@/components/layout/AppShell'

export default function PortalPage() {
  return (
    <AppShell role="customer" userName="Sarah Johnson" orgName="Johnson Estate">
      {/* Page header */}
      <div className="border-b border-[#E0E0E0] pb-14 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="label block mb-3">Client Portal</span>
          <h1 className="display-lg" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>Johnson Estate.</h1>
          <span className="label mt-3 block" style={{ color: '#826DEE' }}>● Active</span>
        </div>
        <a href="#" className="btn btn-ink self-start md:self-end">Book Another Scan</a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-16 border-b border-[#E0E0E0]">
        <StatCard title="Estimated Items" value="52" color="sapphire" />
        <StatCard title="Items Approved" value="38" color="emerald" />
        <StatCard title="Active Listings" value="29" color="gold" />
        <StatCard title="Total Earned" value="$4,820" delta="12% this week" deltaUp={true} color="amethyst" />
      </div>

      <SectionCard title="Recent Activity" description="Latest updates on your estate.">
        <div className="flex flex-col">
          {[
            { label: '12 items approved and published to storefront', time: '2 hrs ago', color: '#826DEE' },
            { label: 'Victorian writing desk sold — $480 net', time: '5 hrs ago', color: '#FFDB15' },
            { label: 'Authentication complete on Tiffany lamp', time: '1 day ago', color: '#FF99DC' },
            { label: 'Offer received on mid-century sofa — review now', time: '1 day ago', color: '#F94500' },
            { label: '3 items flagged for QA review', time: '2 days ago', color: '#826DEE' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 border-b border-[#E0E0E0] py-4">
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: item.color }} />
              <span className="body-light flex-1">{item.label}</span>
              <span className="label flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  )
}
