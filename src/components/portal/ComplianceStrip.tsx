'use client'

import Link from 'next/link'
import { COMPLIANCE_CHECKS, SAFETY_COLOR, SAFETY_GLYPH } from '@/lib/sample-data'

export function ComplianceStrip({ compact = false }: { compact?: boolean }) {
  const checks = compact ? COMPLIANCE_CHECKS.slice(0, 4) : COMPLIANCE_CHECKS
  return (
    <div className="border border-[#E0E0E0] bg-white" data-testid="compliance-strip">
      <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0] flex items-start justify-between gap-3">
        <div>
          <span className="label block mb-1.5" style={{ color: '#0E9F6E' }}>● Compliance &amp; Safety</span>
          <h3 className="text-[#0A0A0A] font-medium leading-snug" style={{ fontSize: 15 }}>
            Authority, identity, prohibited, authentication, PII, tax, legal, dispute.
          </h3>
        </div>
        <Link
          href="/portal/compliance"
          className="label flex-shrink-0 tap-target px-3 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
          data-testid="compliance-open"
        >
          View all →
        </Link>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        {checks.map(c => {
          const color = SAFETY_COLOR[c.state]
          return (
            <li
              key={c.id}
              className="px-4 sm:px-5 py-4 border-b border-[#F0F0F0] sm:border-r last:border-r-0"
              data-testid={`compliance-${c.id}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium"
                  style={{ background: color, fontSize: 12 }}
                  aria-label={c.state}
                >
                  {SAFETY_GLYPH[c.state]}
                </span>
                <div className="min-w-0">
                  <span className="label block mb-0.5">{c.area}</span>
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 13 }}>{c.label}</span>
                  <span className="body-light block mt-1" style={{ fontSize: 12 }}>{c.detail}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
