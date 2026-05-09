'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MobileBottomTabs, BOTTOM_TABS_HEIGHT } from '@/components/portal/MobileBottomTabs'
import { PullToRefresh } from '@/components/portal/PullToRefresh'

/* ═══════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════ */
export type Role = 'customer' | 'ops' | 'qa' | 'admin' | 'partner'

// Role → nav items
const NAV_ITEMS: Record<string, { label: string; href: string }[]> = {
  customer: [
    { label: 'Overview',   href: '/portal' },
    { label: 'Inventory',  href: '/portal/inventory' },
    { label: 'Offers',     href: '/portal/offers' },
    { label: 'Appraisal',  href: '/portal/appraisal' },
    { label: 'Capture',    href: '/portal/capture' },
    { label: 'Channels',   href: '/portal/channels' },
    { label: 'Donations',  href: '/portal/donations' },
    { label: 'Ledger',     href: '/portal/ledger' },
    { label: 'Concierge',  href: '/portal/concierge' },
  ],
  ops: [
    { label: 'Dashboard', href: '/ops' },
    { label: 'Command',   href: '/ops/command' },
    { label: 'Jobs',      href: '/ops/jobs' },
    { label: 'Queue',     href: '/ops/queue' },
    { label: 'Publish',   href: '/ops/publish' },
    { label: 'Offers',    href: '/ops/offers' },
    { label: 'Insights',  href: '/ops/insights' },
    { label: 'Audit',     href: '/ops/audit' },
  ],
  qa: [
    { label: 'Queue',     href: '/qa' },
    { label: 'Prohibited', href: '/qa/prohibited' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users',     href: '/admin/users' },
    { label: 'Jobs',      href: '/admin/jobs' },
    { label: 'Finance',   href: '/admin/finance' },
    { label: 'Settings',  href: '/admin/settings' },
  ],
  partner: [
    { label: 'Overview',  href: '/partner' },
    { label: 'Referrals', href: '/partner/referrals' },
    { label: 'Reports',   href: '/partner/reports' },
  ],
}

const ROLE_ACCENT: Record<string, string> = {
  customer: '#826DEE',
  ops:      '#FFDB15',
  qa:       '#FF99DC',
  admin:    '#F94500',
  partner:  '#826DEE',
}

const ROLE_LABEL: Record<string, string> = {
  customer: 'Client Portal',
  ops:      'Operations',
  qa:       'Quality Assurance',
  admin:    'Administration',
  partner:  'Partner Portal',
}

/* ═══════════════════════════════════════
   SECTION CARD
   ═══════════════════════════════════════ */
export function SectionCard({ title, subtitle, description, action, actions, children, className, premium }: {
  title?: string
  subtitle?: string
  description?: string
  action?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  premium?: boolean
}) {
  return (
    <div className={cn('border-t border-[#E0E0E0] pt-6 sm:pt-10 mb-8 sm:mb-14', className)}>
      <div className="flex items-start justify-between mb-5 sm:mb-8 gap-3 sm:gap-4 flex-wrap">
        <div className="min-w-0">
          <h3
            className="text-[#0A0A0A]"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              // Tighten on mobile so section titles never collide with right-side actions.
              fontSize: 'clamp(1.2rem, 4vw, 2.8rem)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h3>
          {(description || subtitle) && (
            <p className="body-light mt-2" style={{ fontSize: 14 }}>{description || subtitle}</p>
          )}
        </div>
        {(action || actions) && <div className="flex-shrink-0">{action || actions}</div>}
      </div>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════ */
const STAT_COLOR_MAP: Record<string, string> = {
  emerald:    '#826DEE',
  amethyst:   '#826DEE',
  ruby:       '#F94500',
  gold:       '#FFDB15',
  sapphire:   '#826DEE',
  violet:     '#826DEE',
  yellow:     '#FFDB15',
  vermillion: '#F94500',
  pink:       '#FF99DC',
}

export function StatCard({ title, label, value, delta, deltaUp, color, subtitle, trend, icon: _icon }: {
  title?: string
  label?: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  color?: string
  subtitle?: string
  trend?: { value: string; up: boolean }
  icon?: React.ElementType
}) {
  const displayLabel = title || label || ''
  const accentColor = (color && STAT_COLOR_MAP[color]) || color || '#826DEE'

  return (
    <div className="border-t-2 pt-7 pb-7 pr-6" style={{ borderTopColor: accentColor }}>
      <span className="label block mb-4">{displayLabel}</span>
      <span
        className="block tabular"
        style={{
          fontFamily: 'var(--font-display-family)',
          fontWeight: 900,
          fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
          lineHeight: 1,
          color: accentColor,
        }}
      >
        {value}
      </span>
      {delta && (
        <span className="label mt-3 block" style={{ color: deltaUp ? '#826DEE' : '#F94500' }}>
          {deltaUp ? '↑' : '↓'} {delta}
        </span>
      )}
      {subtitle && <span className="label mt-2 block text-[#6B6B6B]">{subtitle}</span>}
      {trend && (
        <span className="label mt-2 block" style={{ color: trend.up ? '#826DEE' : '#F94500' }}>
          {trend.up ? '↑' : '↓'} {trend.value}
        </span>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   PAGE HEADER
   ═══════════════════════════════════════ */
export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
  eyebrow,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  badge?: React.ReactNode
  eyebrow?: string
}) {
  return (
    <div className="border-b border-[#E0E0E0] pb-6 sm:pb-12 mb-8 sm:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <span className="label block mb-2 sm:mb-3" style={{ color: '#826DEE' }}>{eyebrow}</span>}
        <div className="flex items-center gap-3 flex-wrap">
          <h1
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              // Tighten mobile sizing so big headlines don't cause horizontal pressure on 375w screens.
              fontSize: 'clamp(1.7rem, 7vw, 6rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="body-light mt-2 sm:mt-3 max-w-lg" style={{ fontSize: 14 }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════
   APP SHELL — top-rail nav
   ═══════════════════════════════════════ */
interface AppShellProps {
  children: React.ReactNode
  role?: Role | string
  userName?: string
  orgName?: string
  pageTitle?: string
  bottomBar?: React.ReactNode
}

export function AppShell({ children, role = 'customer', userName = 'User', orgName, pageTitle: _pageTitle, bottomBar }: AppShellProps) {
  const pathname = usePathname()
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.customer
  const accent = ROLE_ACCENT[role] ?? '#826DEE'
  const roleLabel = ROLE_LABEL[role] ?? 'Portal'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Bottom tabs are mobile-only and reserved for the customer portal.
  // They sit at the physical bottom of the viewport; sticky action bars
  // (financial bar etc.) stack directly above them.
  const showBottomTabs =
    role === 'customer' &&
    typeof pathname === 'string' &&
    pathname.startsWith('/portal')

  // Pull-to-refresh applies to data-heavy customer portal routes.
  // Detail / sheet-heavy routes (item detail, job nested routes) opt out
  // because their gesture surface conflicts with sheets and rails.
  const PTR_ALLOWED_ROUTES = new Set([
    '/portal',
    '/portal/inventory',
    '/portal/offers',
    '/portal/ledger',
    '/portal/donations',
    '/portal/appraisal',
    '/portal/experts',
    '/portal/capture',
    '/portal/channels',
    '/portal/compliance',
    '/portal/statements',
    '/portal/receipts',
  ])
  const enablePullToRefresh =
    role === 'customer' &&
    typeof pathname === 'string' &&
    PTR_ALLOWED_ROUTES.has(pathname)

  // Active label for the compact mobile header — gives the page a
  // clear, native-app "you are here" cue without consuming much room.
  const activeItem =
    [...navItems]
      .filter(i => pathname === i.href || pathname.startsWith(i.href + '/'))
      .sort((a, b) => b.href.length - a.href.length)[0] ?? navItems[0]

  // CSS vars consumed by MobileBottomBar / MobileActionBar so they can
  // sit above the bottom-tab strip when it's mounted, and absorb the
  // safe-area inset themselves when it isn't.
  const rootCssVars: React.CSSProperties = showBottomTabs
    ? ({
        ['--portal-bar-bottom' as string]: `calc(${BOTTOM_TABS_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        ['--portal-bar-pb' as string]: '8px',
      } as React.CSSProperties)
    : {}

  return (
    <div className="min-h-screen bg-white flex flex-col" style={rootCssVars}>

      {/* ── Top Rail ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0]" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="h-14 px-5 sm:px-8 md:px-12 lg:px-16 flex items-center gap-4 sm:gap-6">

          {/* Role accent dot + brand */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 sm:mr-3">
            <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="label text-[#0A0A0A]">Estate Liquidity</span>
            <span className="label text-[#6B6B6B] hidden sm:block">/ {roleLabel}</span>
          </Link>

          {/* Mobile-only active page label. Replaces the absent nav rail
              with a "you are here" breadcrumb that fits in a thumb glance. */}
          <span
            className="md:hidden label flex-1 truncate"
            style={{ color: accent }}
            data-testid="mobile-active-route"
          >
            / {activeItem?.label ?? roleLabel}
          </span>

          <div className="w-px h-4 bg-[#E0E0E0] hidden md:block" />

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-x-5 gap-y-1 flex-1 scroll-x overflow-x-auto" aria-label="Portal navigation">
            {navItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'label whitespace-nowrap transition-colors duration-150 tap-target',
                    isActive ? 'text-[#0A0A0A]' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'
                  )}
                  style={isActive ? { color: accent } : {}}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
              <span className="label">{orgName || userName}</span>
            </div>
            <Link href="/" className="btn btn-outline text-[9px] py-2 px-3 hidden md:inline-flex">← Home</Link>
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden tap-target -mr-2"
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <div className="flex flex-col gap-[5px]">
                <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile nav drawer + scrim — feels native, fills screen, easy to dismiss. */}
        {mobileMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-[#0A0A0A]/40 animate-fade-in"
              style={{ top: 'calc(56px + env(safe-area-inset-top, 0px))' }}
            />
            <div
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Portal navigation"
              className="md:hidden fixed left-0 right-0 z-50 border-t border-b border-[#E0E0E0] bg-white animate-fade-in"
              style={{ top: 'calc(56px + env(safe-area-inset-top, 0px))', maxHeight: 'calc(100vh - 56px - env(safe-area-inset-top, 0px))', overflowY: 'auto' }}
            >
              <div className="px-5 py-3 flex items-center justify-between border-b border-[#F0F0F0]">
                <span className="label" style={{ color: accent }}>● {roleLabel}</span>
                <span className="label">{orgName || userName}</span>
              </div>
              <nav className="flex flex-col" aria-label="Mobile navigation">
                {navItems.map(item => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 border-b border-[#F0F0F0]"
                      style={{
                        minHeight: 52,
                        background: isActive ? '#F5F5F5' : '#FFFFFF',
                        color: isActive ? accent : '#0A0A0A',
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: isActive ? accent : '#E0E0E0' }}
                      />
                      <span className="label" style={{ fontSize: 11 }}>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto label" style={{ color: accent }} aria-hidden="true">
                          ●
                        </span>
                      )}
                    </Link>
                  )
                })}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-5 border-b border-[#F0F0F0]"
                  style={{ minHeight: 52, color: '#6B6B6B' }}
                >
                  <span className="label">← Back to Home</span>
                </Link>
              </nav>
            </div>
          </>
        )}
      </header>

      {/* ── Content ── */}
      {/*
        Mobile bottom padding accounts for, in this stacking order:
          (a) sticky bottom-bar (~64px + 16px breathing room) — only when present
          (b) bottom-tab nav (60px) — only on portal customer routes
          (c) safe-area inset
        Desktop has no sticky bars so bottomBar padding is ignored at md+.
      */}
      <main
        className="flex-1"
        style={{
          paddingTop: 'calc(56px + env(safe-area-inset-top, 0px))',
          paddingBottom:
            bottomBar || showBottomTabs
              ? `calc(env(safe-area-inset-bottom, 0px) + ${
                  (bottomBar ? 88 : 0) + (showBottomTabs ? BOTTOM_TABS_HEIGHT : 0)
                }px)`
              : undefined,
        }}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 md:py-20 lg:py-24">
          {enablePullToRefresh ? (
            <PullToRefresh>{children}</PullToRefresh>
          ) : (
            children
          )}
        </div>
      </main>

      {/* ── Mobile bottom bar slot ──
          When portal bottom-tabs are present, push the action bar up so
          it sits directly above the tab strip. The CSS variable is set
          on <main> above and read by the bottom-bar primitives. */}
      {bottomBar}

      {/* ── Mobile bottom-tab nav — customer portal only ── */}
      {showBottomTabs && <MobileBottomTabs />}

      {/* ── Footer — hidden on mobile when a sticky bottom bar is mounted, since the bar is the action surface. */}
      <footer
        className={cn('border-t border-[#E0E0E0] py-6 px-5 sm:px-8 md:px-12 lg:px-16', bottomBar ? 'hidden md:block' : '')}
      >
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="label text-[#BDBDBD]">© 2025 Estate Liquidity Platform</span>
          <Link href="/" className="label text-[#826DEE] hover:underline">← Public Site</Link>
        </div>
      </footer>
    </div>
  )
}

export default AppShell
