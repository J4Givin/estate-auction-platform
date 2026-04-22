"use client";

import Link from "next/link";
import { AppShell, PageHeader, SectionCard, StatCard } from '@/components/layout/AppShell'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function QADashboard() {
  return (
    <AppShell role="qa" userName="Maria Chen" orgName="QA & Appraisal">
      <PageHeader
        title="QA & Auth"
        subtitle="Review queue, authentication pipeline, and compliance flags."
        actions={
          <Link href="/qa/items/demo" className="btn btn-ink">Start Review</Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-16 border-b border-[#E0E0E0]">
        <StatCard title="Pending Reviews" value="18" color="violet" />
        <StatCard title="Approved Today" value="24" color="yellow" />
        <StatCard title="Flagged Items" value="2" color="vermillion" />
        <StatCard title="Avg Review Time" value="4.2m" color="pink" />
      </div>

      <SectionCard title="Review Queue" description="Items awaiting quality review and authentication.">
        <div className="flex flex-col">
          {[
            { id: 'ITEM001', title: 'Tiffany Studios Bronze Lamp', category: 'Lighting', value: '$2,400', confidence: 61, color: '#826DEE' },
            { id: 'ITEM002', title: '18k Gold Diamond Ring', category: 'Jewelry', value: '$3,800', confidence: 55, color: '#FFDB15' },
            { id: 'ITEM003', title: 'Edwardian Mahogany Secretary', category: 'Furniture', value: '$680', confidence: 72, color: '#FF99DC' },
            { id: 'ITEM004', title: 'Signed Watercolor — Landscape', category: 'Art', value: '$1,100', confidence: 48, color: '#F94500' },
            { id: 'ITEM005', title: 'Victorian Silver Tea Service', category: 'Silver', value: '$940', confidence: 67, color: '#826DEE' },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-[#E0E0E0] py-4">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <div className="flex-1 min-w-0">
                <span className="body-light block">{item.title}</span>
                <span className="label">{item.category} · {item.value} · {item.confidence}% confidence</span>
              </div>
              <Link href={`/qa/items/${item.id}`}>
                <Button variant="default" size="sm">Review</Button>
              </Link>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Authentication Queue" description="High-value items requiring provenance verification.">
        <div className="flex flex-col">
          {[
            { title: 'Art Deco Diamond Brooch', stage: 'Extra photos required', urgent: true },
            { title: 'Signed Picasso Lithograph', stage: 'Provenance review', urgent: true },
            { title: 'Rolex Datejust Watch', stage: 'Serial verification', urgent: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-[#E0E0E0] py-4">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.urgent ? '#F94500' : '#826DEE' }} />
              <div className="flex-1 min-w-0">
                <span className="body-light block">{item.title}</span>
                <span className="label">{item.stage}</span>
              </div>
              {item.urgent && <Badge variant="ruby">Urgent</Badge>}
              <Button variant={item.urgent ? "ruby" : "default"} size="sm">
                {item.urgent ? 'Review Now' : 'Continue'}
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Prohibited Flags" description="Items flagged by AI risk classifier require manual review.">
        <div className="flex items-center justify-between">
          <span className="body-light">2 items flagged — review before any action.</span>
          <Link href="/qa/prohibited">
            <Button variant="ruby" size="sm">Review Flags</Button>
          </Link>
        </div>
      </SectionCard>
    </AppShell>
  )
}
