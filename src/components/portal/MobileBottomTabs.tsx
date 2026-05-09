'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * Native-feeling bottom tab nav for the customer portal.
 *
 * Renders mobile-only (md:hidden). Sits at the very bottom of the
 * viewport, safe-area aware. Coexists with `MobileBottomBar` /
 * `MobileActionBar`: action bars float directly above this tab strip
 * (see `BOTTOM_TABS_HEIGHT` consumed by AppShell to compose offsets).
 *
 * Tap targets are 56px tall (well over 44px). Active state uses the
 * customer accent color and `aria-current="page"`. The four primary
 * routes match the brief: Overview, Inventory, Offers, Ledger.
 */

interface TabDef {
  href: string
  label: string
  icon: (active: boolean) => React.ReactElement
  testId: string
}

const ACCENT = '#826DEE'

function iconStroke(active: boolean) {
  return active ? ACCENT : '#6B6B6B'
}

const TABS: TabDef[] = [
  {
    href: '/portal',
    label: 'Overview',
    testId: 'mobile-tab-overview',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <path d="M3 11.5L12 4l9 7.5" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    href: '/portal/inventory',
    label: 'Inventory',
    testId: 'mobile-tab-inventory',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="13" />
        <path d="M3.5 10h17" />
        <path d="M9 6V4h6v2" />
      </svg>
    ),
  },
  {
    href: '/portal/offers',
    label: 'Offers',
    testId: 'mobile-tab-offers',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <path d="M4 7h16v10H4z" />
        <path d="M8 11h2" />
        <path d="M14 13h2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    href: '/portal/ledger',
    label: 'Ledger',
    testId: 'mobile-tab-ledger',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <path d="M5 4h11l3 3v13H5z" />
        <path d="M8 10h8" />
        <path d="M8 14h8" />
        <path d="M8 18h5" />
      </svg>
    ),
  },
]

/** Height (px) of the bottom-tab strip excluding safe-area inset. */
export const BOTTOM_TABS_HEIGHT = 60

export function MobileBottomTabs() {
  const pathname = usePathname() ?? ''

  return (
    <nav
      aria-label="Portal sections"
      data-testid="mobile-bottom-tabs"
      className="md:hidden fixed left-0 right-0 bottom-0 z-50 bg-white border-t border-[#E0E0E0]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="grid grid-cols-4">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== '/portal' && pathname.startsWith(tab.href + '/')) ||
            // Keep Overview active only on exact match so /portal/inventory
            // doesn't double-light Overview + Inventory.
            (tab.href === '/portal' && pathname === '/portal')
          return (
            <li key={tab.href} className="contents">
              <Link
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                data-testid={tab.testId}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 tap-target',
                  'transition-colors duration-150',
                )}
                style={{
                  minHeight: BOTTOM_TABS_HEIGHT,
                  color: isActive ? ACCENT : '#6B6B6B',
                  // Subtle active rail at the top edge so the tab reads
                  // selected even with no fill change.
                  boxShadow: isActive ? `inset 0 2px 0 ${ACCENT}` : undefined,
                }}
              >
                {tab.icon(isActive)}
                <span
                  className="label"
                  style={{
                    fontSize: 9,
                    color: isActive ? ACCENT : '#6B6B6B',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MobileBottomTabs
