'use client'

import { AppShell, PageHeader, SectionCard } from '@/components/layout/AppShell'
import { MobileBottomBar } from '@/components/portal/MobileBottomBar'
import { STATEMENTS, ASSET_BALANCE, fmt } from '@/lib/sample-data'

export default function StatementsPage() {
  return (
    <AppShell
      role="customer"
      userName="Sample User"
      orgName="Sample Estate"
      bottomBar={<MobileBottomBar cashAvailable={ASSET_BALANCE.cashAvailable} primaryLabel="Request Statement" primaryHref="/portal/statements" />}
    >
      <PageHeader
        eyebrow="Statements"
        title="Monthly reports."
        subtitle="A bank-grade statement of every sale, fee, reserve, donation, and payout. Downloadable any time."
      />

      <div className="border border-[#E0E0E0] bg-white" data-testid="statements-list">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 sm:px-6 py-3 border-b border-[#F0F0F0]">
          <span className="label col-span-3">Period</span>
          <span className="label col-span-3">Generated</span>
          <span className="label col-span-3 text-right">Net</span>
          <span className="label col-span-3 text-right">Status</span>
        </div>
        {STATEMENTS.map(s => (
          <div
            key={s.id}
            className="border-b border-[#F0F0F0] last:border-b-0 px-4 sm:px-6 py-4 md:grid md:grid-cols-12 md:gap-3 md:items-center"
            data-testid={`statement-${s.id}`}
          >
            {/* Mobile: title row + meta row + action row */}
            <div className="md:col-span-3 flex items-center justify-between md:block">
              <div className="min-w-0">
                <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{s.period}</span>
                <span className="label">{s.id}</span>
              </div>
              <span
                className="md:hidden tabular flex-shrink-0 text-right"
                style={{
                  fontFamily: 'var(--font-display-family)',
                  fontWeight: 900,
                  fontSize: 17,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {fmt(s.net)}
              </span>
            </div>
            <div className="hidden md:block md:col-span-3"><span className="tabular text-[#6B6B6B]" style={{ fontSize: 13 }}>{s.generated}</span></div>
            <div className="hidden md:block md:col-span-3 md:text-right"><span className="tabular text-[#0A0A0A]" style={{ fontSize: 14 }}>{fmt(s.net)}</span></div>
            <div className="md:col-span-3 md:text-right mt-3 md:mt-0 flex md:block items-center justify-between">
              <span className="md:hidden label">{s.generated}</span>
              {s.status === 'ready' ? (
                <a
                  href={s.downloadUrl}
                  className="label tap-target px-4 inline-flex items-center border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                  data-testid={`download-${s.id}`}
                  style={{ minHeight: 36 }}
                >
                  Download PDF →
                </a>
              ) : (
                <span className="label" style={{ color: '#FFDB15' }}>● Generating</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Tax Documents" description="1099s and donation 8283s when thresholds are met.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#E0E0E0] bg-white p-5" data-testid="tax-1099">
            <span className="label block mb-1.5" style={{ color: '#826DEE' }}>● 1099-K</span>
            <span className="block text-[#0A0A0A] font-medium mb-1" style={{ fontSize: 14 }}>2026 — auto-prepared</span>
            <p className="body-light" style={{ fontSize: 13 }}>Reports gross payment volume to the IRS for sellers above threshold.</p>
          </div>
          <div className="border border-[#E0E0E0] bg-white p-5" data-testid="tax-8283">
            <span className="label block mb-1.5" style={{ color: '#0E9F6E' }}>● Form 8283</span>
            <span className="block text-[#0A0A0A] font-medium mb-1" style={{ fontSize: 14 }}>Donation deductions</span>
            <p className="body-light" style={{ fontSize: 13 }}>Generated automatically when donated items cross IRS reporting thresholds.</p>
          </div>
        </div>
      </SectionCard>
    </AppShell>
  )
}
