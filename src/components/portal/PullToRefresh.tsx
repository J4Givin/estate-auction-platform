'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Lightweight, mobile-only pull-to-refresh wrapper.
 *
 * Engages only when:
 *   - the user is on a touch device (pointerType: touch)
 *   - the document is scrolled to the absolute top
 *   - the gesture is primarily vertical (defeats horizontal rails)
 *   - viewport is mobile (md:hidden visual; we still attach the listener
 *     but the indicator is hidden ≥ md so desktop is harmless)
 *
 * Honours `prefers-reduced-motion`: when true, the indicator is shown
 * without a transform animation and refresh fires identically.
 *
 * Default refresh = `router.refresh()`. Pages that need to revalidate
 * client-side data hooks may pass an `onRefresh` async callback instead.
 *
 * No external gesture libraries; ~3 KB component.
 */

const TRIGGER_DISTANCE = 72 // px before release fires refresh
const MAX_PULL = 110 // px clamp so users can't tug forever
const MIN_VERTICAL_RATIO = 1.4 // dy must dominate dx by this much

export interface PullToRefreshProps {
  children: React.ReactNode
  /**
   * Called when the gesture crosses the trigger threshold and is
   * released. Defaults to `router.refresh()` if omitted.
   * Should resolve when the underlying data has been re-fetched.
   */
  onRefresh?: () => void | Promise<void>
  /**
   * If true the wrapper is inert. Useful for routes that should opt out
   * (e.g. modal-heavy pages where the gesture would conflict).
   */
  disabled?: boolean
  /**
   * Subtle eyebrow displayed in the indicator. Defaults to a branded
   * estate-liquidity copy line.
   */
  label?: string
}

export function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
  label = 'Estate ledger',
}: PullToRefreshProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number | null>(null)
  const startXRef = useRef<number | null>(null)
  const trackingRef = useRef(false)
  const reducedMotionRef = useRef(false)

  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // Capture reduced-motion once on mount; updates honoured via listener.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  const triggerRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      if (onRefresh) {
        await onRefresh()
      } else {
        router.refresh()
        // Give the user a brief moment of "Refreshing…" feedback even
        // when router.refresh() is synchronous-feeling.
        await new Promise((r) => setTimeout(r, 450))
      }
    } finally {
      setRefreshing(false)
      setPull(0)
    }
  }, [onRefresh, router])

  useEffect(() => {
    if (disabled) return
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (refreshing) return
      // Only engage when the document is at the top.
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      if (scrollTop > 0) {
        trackingRef.current = false
        return
      }
      const t = e.touches[0]
      startYRef.current = t.clientY
      startXRef.current = t.clientX
      trackingRef.current = true
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!trackingRef.current || refreshing) return
      const startY = startYRef.current
      const startX = startXRef.current
      if (startY == null || startX == null) return

      const t = e.touches[0]
      const dy = t.clientY - startY
      const dx = Math.abs(t.clientX - startX)

      if (dy <= 0) {
        if (pull !== 0) setPull(0)
        return
      }
      // Defeat horizontal rails: require vertical to dominate.
      if (dx > 8 && Math.abs(dy) / Math.max(dx, 1) < MIN_VERTICAL_RATIO) {
        trackingRef.current = false
        if (pull !== 0) setPull(0)
        return
      }

      // Resistance curve so the pull feels native (gets harder near max).
      const resisted = Math.min(MAX_PULL, dy * 0.55)
      setPull(resisted)
    }

    const onTouchEnd = () => {
      if (!trackingRef.current) {
        startYRef.current = null
        startXRef.current = null
        return
      }
      trackingRef.current = false
      startYRef.current = null
      startXRef.current = null
      if (pull >= TRIGGER_DISTANCE) {
        void triggerRefresh()
      } else if (pull > 0) {
        setPull(0)
      }
    }

    // passive:true keeps scrolling smooth — we never preventDefault here.
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [pull, refreshing, disabled, triggerRefresh])

  const armed = pull >= TRIGGER_DISTANCE
  const indicatorVisible = pull > 8 || refreshing
  const indicatorTranslate = refreshing
    ? Math.max(pull, 56)
    : pull
  const useTransition = !reducedMotionRef.current

  return (
    <div ref={containerRef} className="relative" data-testid="pull-to-refresh">
      {/* Indicator — mobile only. Sits above the page content, never
          pushes layout (absolute / pointer-events:none). */}
      <div
        className="md:hidden pointer-events-none absolute left-0 right-0 top-0 flex justify-center"
        aria-hidden={!indicatorVisible}
        style={{
          transform: `translateY(${indicatorTranslate - 56}px)`,
          transition: useTransition && !trackingRef.current
            ? 'transform 220ms ease-out, opacity 180ms ease-out'
            : undefined,
          opacity: indicatorVisible ? 1 : 0,
          zIndex: 30,
        }}
      >
        <div
          className="border border-[#E0E0E0] bg-white px-4 py-2 flex items-center gap-2"
          style={{ minHeight: 44 }}
          data-testid="pull-to-refresh-indicator"
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: armed || refreshing ? '#826DEE' : '#BDBDBD',
              transition: useTransition ? 'background 150ms ease-out' : undefined,
            }}
          />
          <span className="label" style={{ fontSize: 10, color: '#0A0A0A' }}>
            {refreshing
              ? `Refreshing ${label}…`
              : armed
              ? 'Release to refresh'
              : 'Pull to refresh'}
          </span>
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${pull * 0.4}px)`,
          transition:
            useTransition && !trackingRef.current && !refreshing
              ? 'transform 220ms ease-out'
              : undefined,
          // Only translate when actually pulling; avoids creating a
          // stacking context full-time which can interfere with sticky
          // descendants.
          willChange: pull > 0 || refreshing ? 'transform' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default PullToRefresh
