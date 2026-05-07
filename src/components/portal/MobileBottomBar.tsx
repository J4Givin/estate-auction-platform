'use client'

import Link from 'next/link'
import { fmt } from '@/lib/sample-data'

interface Props {
  cashAvailable: number
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

/**
 * Sticky mobile-first action bar that mimics a native financial app.
 * Hidden on desktop where the desktop CTAs are already visible in the header.
 */
export function MobileBottomBar({
  cashAvailable,
  primaryHref = '/portal/offers',
  primaryLabel = 'Take Cash',
  secondaryHref = '/portal/concierge',
  secondaryLabel = 'Concierge',
}: Props) {
  return (
    <div
      className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-white border-t border-[#E0E0E0]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
      data-testid="mobile-bottom-bar"
      aria-label="Primary actions"
    >
      <div className="flex items-stretch h-[64px]">
        <div className="flex-1 px-4 py-2 border-r border-[#E0E0E0] flex flex-col justify-center">
          <span className="label block mb-0.5">Cash now</span>
          <span
            className="tabular text-[#0A0A0A]"
            style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: '1.4rem', lineHeight: 1 }}
            data-testid="mobile-bar-cash"
          >
            {fmt(cashAvailable)}
          </span>
        </div>
        <Link
          href={secondaryHref}
          className="px-4 flex items-center justify-center label tap-target border-r border-[#E0E0E0] text-[#0A0A0A]"
          data-testid="mobile-bar-secondary"
        >
          {secondaryLabel}
        </Link>
        <Link
          href={primaryHref}
          className="px-5 flex items-center justify-center label tap-target text-white"
          style={{ background: '#FFDB15', color: '#0A0A0A', fontWeight: 700 }}
          data-testid="mobile-bar-primary"
        >
          {primaryLabel} →
        </Link>
      </div>
    </div>
  )
}
