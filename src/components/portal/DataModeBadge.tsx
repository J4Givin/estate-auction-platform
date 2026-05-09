/**
 * DataModeBadge — subtle developer/admin indicator showing whether the
 * portal is reading from live Supabase or the demo fallback dataset.
 *
 * Renders nothing in production unless the user has explicitly opted in
 * via the `?devbadge=1` query string. The goal is to help engineering
 * and operations confirm data wiring without ever undermining customer
 * trust on the public portal.
 */

'use client'

import { useSyncExternalStore } from 'react'

function subscribeBadgeQuery(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}

function getBadgeQuery(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return params.get('devbadge') === '1'
}

export function DataModeBadge({ mode }: { mode: 'supabase' | 'demo' }) {
  const isDev = process.env.NODE_ENV !== 'production'
  const queryForced = useSyncExternalStore(
    subscribeBadgeQuery,
    getBadgeQuery,
    () => false,
  )
  if (!isDev && !queryForced) return null

  const isLive = mode === 'supabase'
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 50,
        fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, monospace)',
        fontSize: 10,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '4px 8px',
        borderRadius: 999,
        backgroundColor: isLive ? 'rgba(14,159,110,0.10)' : 'rgba(130,109,238,0.10)',
        color: isLive ? '#0E9F6E' : '#826DEE',
        border: `1px solid ${isLive ? 'rgba(14,159,110,0.4)' : 'rgba(130,109,238,0.4)'}`,
        backdropFilter: 'blur(6px)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {isLive ? '● Supabase live' : '○ Demo data'}
    </div>
  )
}
