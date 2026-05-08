'use client'

import Link from 'next/link'
import { fmt } from '@/lib/sample-data'

interface Props {
  cashAvailable: number
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  /**
   * Optional eyebrow above the cash value. Useful when a route wants
   * the bar to read like "Filtered total" / "Selected items" rather
   * than the global cash balance.
   */
  label?: string
  /**
   * Override the displayed scalar. Useful when the primary action is
   * not "Take cash" and showing the global balance would be misleading.
   */
  valueOverride?: string
}

/**
 * Sticky mobile-first action bar that mimics a native financial app.
 * Hidden on desktop where the desktop CTAs are already visible in the
 * header. Safe-area aware, 44px+ tap targets, tabular numbers, single
 * primary action on the right with secondary tucked left.
 */
export function MobileBottomBar({
  cashAvailable,
  primaryHref = '/portal/offers',
  primaryLabel = 'Take Cash',
  secondaryHref = '/portal/concierge',
  secondaryLabel = 'Concierge',
  label = 'Cash now',
  valueOverride,
}: Props) {
  const value = valueOverride ?? fmt(cashAvailable)
  return (
    <div
      className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-white border-t border-[#E0E0E0]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
      data-testid="mobile-bottom-bar"
      role="region"
      aria-label="Primary actions"
    >
      <div className="flex items-stretch h-[64px]">
        <div className="flex-1 min-w-0 px-4 py-2 border-r border-[#E0E0E0] flex flex-col justify-center">
          <span className="label block mb-0.5" style={{ fontSize: 9 }}>{label}</span>
          <span
            className="tabular text-[#0A0A0A] truncate"
            style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: '1.4rem', lineHeight: 1 }}
            data-testid="mobile-bar-cash"
          >
            {value}
          </span>
        </div>
        <Link
          href={secondaryHref}
          className="px-4 flex items-center justify-center label tap-target border-r border-[#E0E0E0] text-[#0A0A0A]"
          data-testid="mobile-bar-secondary"
          style={{ minWidth: 88 }}
        >
          {secondaryLabel}
        </Link>
        <Link
          href={primaryHref}
          className="px-5 flex items-center justify-center label tap-target"
          style={{ background: '#FFDB15', color: '#0A0A0A', fontWeight: 700, minWidth: 124 }}
          data-testid="mobile-bar-primary"
        >
          {primaryLabel} →
        </Link>
      </div>
    </div>
  )
}
