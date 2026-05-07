'use client'

import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { SAFETY_COLOR, SAFETY_GLYPH } from '@/lib/sample-data'
import { useCompliance, useEstateCase } from '@/lib/data/hooks'

export default function CompliancePage() {
  const complianceQuery = useCompliance()
  const estate = useEstateCase()
  const COMPLIANCE_CHECKS = complianceQuery.data
  const ASSET_BALANCE = { cashAvailable: estate.data.availableForPayout }

  return (
    <AppShell
      role="customer"
      userName="Sarah Mitchell"
      orgName="Mitchell Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Generate Pack" primaryHref="/portal/compliance#pack" />}
    >
      <PageHeader
        eyebrow="Compliance & Safety"
        title="What's protected."
        subtitle="Authority, identity, prohibited goods, luxury authentication, provenance, PII, tax forms, legal hold, and dispute evidence — all visible and traceable."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12" data-testid="compliance-grid">
        {COMPLIANCE_CHECKS.map(c => (
          <div key={c.id} className="border border-[#E0E0E0] bg-white p-5" data-testid={`compliance-card-${c.id}`}>
            <div className="flex items-start gap-3 mb-3">
              <span
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium"
                style={{ background: SAFETY_COLOR[c.state], fontSize: 13 }}
                aria-label={c.state}
              >
                {SAFETY_GLYPH[c.state]}
              </span>
              <div>
                <span className="label block mb-0.5">{c.area}</span>
                <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{c.label}</span>
              </div>
            </div>
            <p className="body-light mb-3" style={{ fontSize: 13 }}>{c.detail}</p>
            <ul className="flex flex-wrap gap-1.5 pt-3 border-t border-[#F0F0F0]">
              {c.evidence.map((e, i) => (
                <li key={i} className="label px-2 py-1" style={{ background: '#F5F5F5', color: '#0A0A0A' }}>{e}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Authority + Provenance */}
      <SectionCard title="Authority & Authorization" description="Who's allowed to make decisions on this estate.">
        <div className="border border-[#E0E0E0] bg-white">
          {[
            { who: 'Sarah Mitchell', role: 'Executor', authority: 'Letters Testamentary 2026-04-18', status: 'green' as const },
            { who: 'David Mitchell', role: 'Co-executor', authority: 'Co-signed authorization 2026-04-18', status: 'green' as const },
            { who: 'Estate Liquidity Platform', role: 'Service provider', authority: 'Customer authorization e-sign', status: 'green' as const },
          ].map(p => (
            <div key={p.who} className="border-b border-[#F0F0F0] last:border-b-0 px-4 sm:px-6 py-4 flex items-center gap-3" data-testid={`authority-${p.who.split(' ')[0].toLowerCase()}`}>
              <span className="w-2 h-2 rounded-full" style={{ background: SAFETY_COLOR[p.status] }} />
              <div className="flex-1 min-w-0">
                <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{p.who}</span>
                <span className="label">{p.role} · {p.authority}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Evidence pack */}
      <div id="pack" className="border border-[#0A0A0A] bg-white" data-testid="evidence-pack">
        <div className="px-5 sm:px-7 py-5 bg-[#0A0A0A] text-white flex items-start justify-between gap-3 flex-col sm:flex-row">
          <div>
            <span className="label-dark block mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>● Evidence Pack</span>
            <h4 className="text-white" style={{ fontSize: 18, fontWeight: 500 }}>Generate a dispute, audit, or family-record bundle.</h4>
            <p className="text-white/70 mt-1.5" style={{ fontSize: 13 }}>
              Includes: appraisal snapshots, comp screenshots, photos pre/post-redaction, expert credentials, channel publish logs, sale records, and tax receipts.
            </p>
          </div>
          <button className="btn btn-yellow flex-shrink-0" data-testid="generate-evidence-pack">Generate pack →</button>
        </div>
      </div>
    </AppShell>
  )
}
