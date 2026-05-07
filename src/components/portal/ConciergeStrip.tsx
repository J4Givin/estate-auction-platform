'use client'

import Link from 'next/link'
import { CONCIERGE_TEAM } from '@/lib/sample-data'

const STATE_DOT: Record<string, string> = {
  with_you: '#0E9F6E',
  available: '#826DEE',
  scheduled: '#FFDB15',
}
const STATE_LABEL: Record<string, string> = {
  with_you: 'On call now',
  available: 'Available',
  scheduled: 'Scheduled',
}

export function ConciergeStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="border border-[#E0E0E0] bg-white"
      data-testid="concierge-strip"
    >
      <div className="px-4 sm:px-6 py-4 border-b border-[#F0F0F0] flex items-start justify-between gap-3">
        <div>
          <span className="label block mb-1.5" style={{ color: '#826DEE' }}>● White-Glove Concierge</span>
          <h3 className="text-[#0A0A0A] font-medium leading-snug" style={{ fontSize: 15 }}>
            We&rsquo;ll handle it. You decide what&rsquo;s yours, what&rsquo;s sold, what&rsquo;s donated.
          </h3>
        </div>
        <Link
          href="/portal/concierge"
          className="label flex-shrink-0 tap-target px-3 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
          data-testid="concierge-open"
        >
          Talk to us →
        </Link>
      </div>
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {CONCIERGE_TEAM.map(m => (
            <div key={m.name} className="px-4 sm:px-5 py-4 border-b sm:border-b-0 sm:border-r border-[#F0F0F0] last:border-r-0 last:border-b-0">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                  style={{ background: m.avatarColor, fontSize: 13 }}
                >
                  {m.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <span className="block text-[#0A0A0A] font-medium" style={{ fontSize: 14 }}>{m.name}</span>
                  <span className="label">{m.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATE_DOT[m.state] }} />
                <span className="label" style={{ color: STATE_DOT[m.state] }}>
                  {STATE_LABEL[m.state]} {m.nextAvailable && m.state !== 'with_you' ? `· ${m.nextAvailable}` : ''}
                </span>
              </div>
              <p className="body-light" style={{ fontSize: 12 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
