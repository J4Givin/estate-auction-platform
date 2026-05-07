'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    { label: 'Catalog',   href: '/ops/catalog' },
    { label: 'Insights',  href: '/ops/insights' },
    { label: 'Listings',  href: '/ops/listings' },
  ],
  qa: [
    { label: 'Queue',     href: '/qa' },
    { label: 'Review',    href: '/qa/review' },
    { label: 'Approved',  href: '/qa/approved' },
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
    <div className={cn('border-t border-[#E0E0E0] pt-10 mb-14', className)}>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h3
            className="text-[#0A0A0A]"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              fontSize: 'clamp(1.4rem, 3vw, 2.8rem)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h3>
          {(description || subtitle) && <p className="body-light mt-2">{description || subtitle}</p>}
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
    <div className="border-b border-[#E0E0E0] pb-12 mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {eyebrow && <span className="label block mb-3" style={{ color: '#826DEE' }}>{eyebrow}</span>}
        <div className="flex items-center gap-3 flex-wrap">
          <h1
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 6vw, 6rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="body-light mt-3 max-w-lg">{subtitle}</p>}
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

export function AppShell({ children, role = 'customer', userName = 'User', orgName, pageTitle, bottomBar }: AppShellProps) {
  const pathname = usePathname()
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.customer
  const accent = ROLE_ACCENT[role] ?? '#826DEE'
  const roleLabel = ROLE_LABEL[role] ?? 'Portal'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Top Rail ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0]">
        <div className="h-14 px-6 sm:px-8 md:px-12 lg:px-16 flex items-center gap-6">

          {/* Role accent dot + brand */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-3">
            <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="label text-[#0A0A0A]">Estate Liquidity</span>
            <span className="label text-[#6B6B6B] hidden sm:block">/ {roleLabel}</span>
          </Link>

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
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden tap-target"
              aria-label="Toggle navigation"
            >
              <div className="flex flex-col gap-[5px]">
                <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E0E0E0] bg-white px-6 sm:px-8 py-6 flex flex-col gap-1">
            {navItems.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="tap-target flex items-center gap-3 border-b border-[#F5F5F5]"
                  style={{ color: isActive ? accent : '#0A0A0A' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: isActive ? accent : '#E0E0E0' }} />
                  <span className="label">{item.label}</span>
                </Link>
              )
            })}
            <Link href="/" onClick={() => setMobileMenuOpen(false)}
              className="label text-[#6B6B6B] mt-3 flex items-center gap-2 tap-target">
              ← Back to Home
            </Link>
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <main className="flex-1 pt-14" style={{ paddingBottom: bottomBar ? 'calc(env(safe-area-inset-bottom) + 80px)' : undefined }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 md:py-20 lg:py-24">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom bar slot ── */}
      {bottomBar}

      {/* ── Footer ── */}
      <footer className="border-t border-[#E0E0E0] py-6 px-6 sm:px-8 md:px-12 lg:px-16" style={{ paddingBottom: bottomBar ? 'calc(env(safe-area-inset-bottom) + 80px)' : undefined }}>
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="label text-[#BDBDBD]">© 2025 Estate Liquidity Platform</span>
          <Link href="/" className="label text-[#826DEE] hover:underline">← Public Site</Link>
        </div>
      </footer>
    </div>
  )
}

export default AppShell
