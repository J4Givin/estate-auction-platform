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
    { label: 'Overview',  href: '/portal' },
    { label: 'My Jobs',   href: '/portal/jobs' },
    { label: 'Inventory', href: '/portal/inventory' },
    { label: 'Offers',    href: '/portal/offers' },
    { label: 'Ledger',    href: '/portal/ledger' },
  ],
  ops: [
    { label: 'Dashboard', href: '/ops' },
    { label: 'Jobs',      href: '/ops/jobs' },
    { label: 'Catalog',   href: '/ops/catalog' },
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
    <div className={cn("border-t border-[#E0E0E0] pt-8 mb-12", className)}>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h3 className="display-md text-[#0A0A0A]" style={{ fontSize: 'clamp(1.25rem, 3vw, 2.5rem)' }}>{title}</h3>
          {(description || subtitle) && <p className="body-light mt-1">{description || subtitle}</p>}
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
  emerald:  '#826DEE',
  amethyst: '#826DEE',
  ruby:     '#F94500',
  gold:     '#FFDB15',
  sapphire: '#826DEE',
  violet:   '#826DEE',
  yellow:   '#FFDB15',
  vermillion: '#F94500',
  pink:     '#FF99DC',
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
    <div className="border-t-2 pt-6 pb-6 pr-6" style={{ borderTopColor: accentColor }}>
      <span className="label block mb-3">{displayLabel}</span>
      <span className="display-md block" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: accentColor }}>{value}</span>
      {delta && (
        <span className="label mt-2 block" style={{ color: deltaUp ? '#826DEE' : '#F94500' }}>
          {deltaUp ? '↑' : '↓'} {delta}
        </span>
      )}
      {subtitle && (
        <span className="label mt-2 block text-[#6B6B6B]">{subtitle}</span>
      )}
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
    <div className="border-b border-[#E0E0E0] pb-10 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {eyebrow && <span className="label block mb-3" style={{ color: '#826DEE' }}>{eyebrow}</span>}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="display-lg" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="body-light mt-2">{subtitle}</p>}
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
}

export function AppShell({ children, role = 'customer', userName = 'User', orgName, pageTitle }: AppShellProps) {
  const pathname = usePathname()
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.customer
  const accent = ROLE_ACCENT[role] ?? '#826DEE'
  const roleLabel = ROLE_LABEL[role] ?? 'Portal'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Top Rail ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0]">
        <div className="h-14 px-8 md:px-16 lg:px-20 flex items-center gap-6">
          {/* Role accent dot + brand */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-4">
            <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="label text-[#0A0A0A]">Estate Liquidity</span>
            <span className="label text-[#6B6B6B] hidden sm:block">/ {roleLabel}</span>
          </Link>

          <div className="w-px h-4 bg-[#E0E0E0] hidden md:block" />

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            {navItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'label transition-colors duration-150',
                    isActive ? 'text-[#0A0A0A]' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'
                  )}
                  style={isActive ? { color: accent } : {}}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="label">{orgName || userName}</span>
            </div>
            <Link href="/" className="btn btn-outline text-[9px] py-2 px-3 hidden md:inline-flex">← Home</Link>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(v => !v)} className="md:hidden tap-target">
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
          <div className="md:hidden border-t border-[#E0E0E0] bg-white px-6 py-6 flex flex-col gap-4">
            {navItems.map(item => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="label text-sm"
                  style={{ color: isActive ? accent : '#0A0A0A' }}>
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <main className="flex-1 pt-14">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-20 py-16 md:py-20">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AppShell
