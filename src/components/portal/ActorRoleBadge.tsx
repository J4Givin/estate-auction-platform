/**
 * ActorRoleBadge — server component that surfaces the resolved actor's
 * platform role + auth state alongside the data-mode indicator.
 *
 * Strict rules:
 *   * Renders nothing in production unless `?devbadge=1` (handled by
 *     `DataModeBadge`'s gating downstream).
 *   * Reads `getActorContext()` server-side, so it never leaks profile
 *     data into the client bundle.
 *   * Customer-trust language: when the badge is hidden, customers see
 *     the unaltered native-app polish.
 */

import { getActorContext } from '@/lib/data/auth'

import { DataModeBadge } from './DataModeBadge'

export async function ActorRoleBadge() {
  const ctx = await getActorContext()
  const isDev = process.env.NODE_ENV !== 'production'

  // Always include the existing DataModeBadge (which has its own dev gating).
  return (
    <>
      <DataModeBadge mode={ctx.mode} />
      {isDev ? (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            bottom: 8,
            right: 132,
            zIndex: 50,
            fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, monospace)',
            fontSize: 10,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '4px 8px',
            borderRadius: 999,
            backgroundColor: ctx.authenticated
              ? 'rgba(14,159,110,0.10)'
              : 'rgba(244,114,114,0.10)',
            color: ctx.authenticated ? '#0E9F6E' : '#F47272',
            border: `1px solid ${
              ctx.authenticated ? 'rgba(14,159,110,0.4)' : 'rgba(244,114,114,0.4)'
            }`,
            backdropFilter: 'blur(6px)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {ctx.authenticated
            ? `● ${ctx.platformRole}${ctx.isAdmin ? ' · admin' : ''}`
            : '○ anon'}
        </div>
      ) : null}
    </>
  )
}
