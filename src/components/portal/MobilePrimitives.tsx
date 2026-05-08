'use client'

/**
 * Mobile-native primitives shared across portal + ops routes.
 *
 * These keep mobile UX consistent with the editorial design language
 * (zero radius, hairline borders, mono labels) while addressing the
 * native-app patterns the portal depends on:
 *   - safe-area aware sticky bars
 *   - thumb-friendly tap targets (>= 44px)
 *   - segmented controls for filter rails
 *   - financial action rows that read like a banking app
 *   - swipe-rail affordance / scroll hints
 *
 * All components are mobile-first; nothing here regresses desktop —
 * helpers either render only on mobile (`md:hidden`) or scale up
 * cleanly via tailwind responsive utilities.
 */

import React from 'react'
import { cn } from '@/lib/utils'

/* ---- SafeAreaSpacer ----------------------------------------- */

/**
 * Reserves a fixed spacer that respects iOS / Android safe-area insets.
 * Use at the bottom of a route that mounts a sticky action bar so the
 * page content can always scroll past it.
 */
export function SafeAreaSpacer({
  height = 80,
  className,
}: {
  height?: number
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('md:hidden', className)}
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  )
}

/* ---- MobileSegmentedControl --------------------------------- */

interface SegmentOption<T extends string> {
  key: T
  label: string
  count?: number
}

/**
 * Horizontal-scrolling pill rail with snap. Defaults to chip rendering
 * but degrades to a flat row on tablet+. Tap targets are >= 44px tall.
 */
export function MobileSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  testId,
  className,
}: {
  options: ReadonlyArray<SegmentOption<T>>
  value: T
  onChange: (next: T) => void
  ariaLabel?: string
  testId?: string
  className?: string
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'scroll-x flex gap-2 -mx-5 px-5 sm:-mx-0 sm:px-0 pb-1',
        className,
      )}
      data-testid={testId}
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {options.map(opt => {
        const active = opt.key === value
        return (
          <button
            key={opt.key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            className="label whitespace-nowrap px-4 py-2.5 border transition-colors"
            style={{
              minHeight: 44,
              scrollSnapAlign: 'start',
              ...(active
                ? { background: '#0A0A0A', borderColor: '#0A0A0A', color: '#FFFFFF' }
                : { borderColor: '#E0E0E0', color: '#6B6B6B', background: '#FFFFFF' }),
            }}
            data-testid={testId ? `${testId}-${opt.key}` : undefined}
          >
            {opt.label}
            {typeof opt.count === 'number' && (
              <span
                className="tabular ml-2"
                style={{ opacity: active ? 0.85 : 0.55, fontSize: 10 }}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ---- MobileActionBar --------------------------------------- */

/**
 * Generic sticky bottom bar wrapper. Consumers fill the inner row.
 * Always safe-area aware; never visible on desktop. Pair with
 * `<SafeAreaSpacer />` at the end of the page for clean scroll.
 */
export function MobileActionBar({
  children,
  testId = 'mobile-action-bar',
  ariaLabel = 'Primary actions',
}: {
  children: React.ReactNode
  testId?: string
  ariaLabel?: string
}) {
  return (
    <div
      className="md:hidden fixed left-0 right-0 z-40 bg-white border-t border-[#E0E0E0]"
      style={{
        // Stack above the portal bottom-tab nav when present.
        bottom: 'var(--portal-bar-bottom, 0px)',
        paddingBottom:
          'var(--portal-bar-pb, calc(env(safe-area-inset-bottom, 0px) + 8px))',
      }}
      role="region"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {children}
    </div>
  )
}

/* ---- FinancialActionRow ------------------------------------ */

/**
 * Banking-app row used inside `MobileActionBar`. Left side holds the
 * scalar (e.g. cash available); right side stacks 1–2 actions.
 */
export function FinancialActionRow({
  label,
  value,
  primary,
  secondary,
}: {
  label: string
  value: string
  primary: { label: string; href: string; testId?: string }
  secondary?: { label: string; href: string; testId?: string }
}) {
  return (
    <div className="flex items-stretch h-[64px]">
      <div className="flex-1 min-w-0 px-4 py-2 border-r border-[#E0E0E0] flex flex-col justify-center">
        <span className="label block mb-0.5">{label}</span>
        <span
          className="tabular text-[#0A0A0A] truncate"
          style={{ fontFamily: 'var(--font-display-family)', fontWeight: 900, fontSize: '1.4rem', lineHeight: 1 }}
        >
          {value}
        </span>
      </div>
      {secondary && (
        <a
          href={secondary.href}
          className="px-4 flex items-center justify-center label tap-target border-r border-[#E0E0E0] text-[#0A0A0A]"
          data-testid={secondary.testId}
        >
          {secondary.label}
        </a>
      )}
      <a
        href={primary.href}
        className="px-5 flex items-center justify-center label tap-target"
        style={{ background: '#FFDB15', color: '#0A0A0A', fontWeight: 700, minWidth: 120 }}
        data-testid={primary.testId}
      >
        {primary.label} →
      </a>
    </div>
  )
}

/* ---- SwipeHint --------------------------------------------- */

/**
 * Tiny mono caption that hints "swipe →" on horizontally-scrollable
 * content. Hidden on tablet+ so it doesn't bleed into desktop.
 */
export function SwipeHint({
  children = 'Swipe →',
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn('label md:hidden block mt-2 mb-1', className)}
      style={{ color: '#6B6B6B', fontSize: 9 }}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}

/* ---- MobileSheetTitle -------------------------------------- */

/**
 * Tight, native-feeling title row for sheets / drawers. Larger than
 * `label`, shorter than `display-md`, line-height tuned for 375w.
 */
export function MobileSheetTitle({
  eyebrow,
  title,
  meta,
}: {
  eyebrow?: string
  title: string
  meta?: string
}) {
  return (
    <div className="px-5 py-4 border-b border-[#E0E0E0]">
      {eyebrow && (
        <span className="label block mb-1.5" style={{ color: '#826DEE' }}>
          {eyebrow}
        </span>
      )}
      <h2
        className="text-[#0A0A0A]"
        style={{
          fontFamily: 'var(--font-display-family)',
          fontWeight: 900,
          fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h2>
      {meta && (
        <span className="label mt-2 block" style={{ color: '#6B6B6B' }}>
          {meta}
        </span>
      )}
    </div>
  )
}

/* ---- MobileStatRow ----------------------------------------- */

/**
 * Compact 2-up / 4-up stat tiles for the top of a portal page. Replaces
 * the older grid-cols-2/4 patterns with consistent vertical rhythm and
 * mono labels. Falls back to a wider grid on tablet+.
 */
export function MobileStatRow({
  stats,
  testId,
}: {
  stats: Array<{ label: string; value: string; sub?: string; color?: string }>
  testId?: string
}) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-[#E0E0E0]"
      data-testid={testId}
    >
      {stats.map((s, i) => {
        const c = s.color || '#0A0A0A'
        return (
          <div
            key={s.label + i}
            className="border-t-2 pt-5 sm:pt-7 pb-5 sm:pb-7 pr-3 sm:pr-6 pl-3 sm:pl-0"
            style={{ borderTopColor: c }}
          >
            <span className="label block mb-2.5" style={{ fontSize: 9 }}>{s.label}</span>
            <span
              className="block tabular"
              style={{
                fontFamily: 'var(--font-display-family)',
                fontWeight: 900,
                fontSize: 'clamp(1.35rem, 4vw, 2.2rem)',
                lineHeight: 1,
                color: c,
              }}
            >
              {s.value}
            </span>
            {s.sub && (
              <span className="label mt-2 block" style={{ fontSize: 9 }}>
                {s.sub}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
