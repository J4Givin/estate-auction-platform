/**
 * Centralized CSRF / Origin / Fetch-Metadata protection for portal write
 * routes. Defense-in-depth on top of Supabase auth + RLS + per-actor rate
 * limiting.
 *
 * Threat model:
 *   Portal API routes rely on cookie-based Supabase auth, which means a
 *   malicious site could attempt cross-site requests that ride the user's
 *   session cookie. We block those at the edge with origin and Fetch
 *   Metadata checks before any authz/business logic runs.
 *
 * Behavior:
 *   - Only enforces on state-changing methods: POST, PATCH, PUT, DELETE.
 *   - GET/HEAD/OPTIONS are allowed through unconditionally.
 *   - Same-origin requests pass.
 *   - Requests with `Sec-Fetch-Site: cross-site` are blocked.
 *   - Requests with `Sec-Fetch-Site: same-origin` / `same-site` / `none`
 *     pass (none = direct user navigation / curl).
 *   - When `Origin` is missing (e.g. server-to-server, curl) and Fetch
 *     Metadata is also absent, the request is allowed — same posture as
 *     standard same-site cookie defaults — and documented as such.
 *   - `PORTAL_TRUSTED_ORIGINS` (comma-separated) acts as an allowlist for
 *     additional non-same-origin callers (e.g. Vercel preview domains,
 *     internal admin tools).
 *   - Vercel/proxy-aware: derives the request origin from
 *     `X-Forwarded-Host` + `X-Forwarded-Proto` when present, falling back
 *     to `Host`.
 *
 * This file is server-only.
 */

import { NextResponse } from 'next/server'

const STATE_CHANGING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])

const ALLOWED_FETCH_SITE = new Set(['same-origin', 'same-site', 'none'])

export type CsrfDenyReason =
  | 'cross-site-fetch-metadata'
  | 'origin-mismatch'
  | 'origin-not-trusted'

export interface CsrfOk {
  ok: true
}

export interface CsrfDenied {
  ok: false
  reason: CsrfDenyReason
  detail: string
}

export type CsrfResult = CsrfOk | CsrfDenied

/**
 * Parse the `PORTAL_TRUSTED_ORIGINS` env var into a Set of normalized
 * origins. Values are origins like `https://admin.example.com` (no path).
 */
function getTrustedOrigins(): Set<string> {
  const raw = process.env.PORTAL_TRUSTED_ORIGINS ?? ''
  const out = new Set<string>()
  for (const candidate of raw.split(',')) {
    const v = candidate.trim()
    if (!v) continue
    try {
      const u = new URL(v)
      out.add(`${u.protocol}//${u.host}`)
    } catch {
      // ignore malformed entries
    }
  }
  return out
}

/**
 * Derive the canonical origin for the inbound request, taking common
 * proxy/Vercel headers into account. Returns a `protocol://host` string.
 */
function getRequestOrigin(req: Request): string | null {
  const headers = req.headers
  const forwardedHost = headers.get('x-forwarded-host')
  const forwardedProto = headers.get('x-forwarded-proto')
  const host = forwardedHost ?? headers.get('host')
  if (!host) {
    try {
      return new URL(req.url).origin
    } catch {
      return null
    }
  }
  const proto = forwardedProto ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https')
  return `${proto}://${host}`
}

/**
 * Pure CSRF check — used by `enforceCsrf` and unit tests.
 */
export function checkCsrf(req: Request): CsrfResult {
  const method = req.method.toUpperCase()
  if (!STATE_CHANGING_METHODS.has(method)) return { ok: true }

  const headers = req.headers
  const fetchSite = headers.get('sec-fetch-site')
  if (fetchSite) {
    const v = fetchSite.toLowerCase()
    if (!ALLOWED_FETCH_SITE.has(v)) {
      return {
        ok: false,
        reason: 'cross-site-fetch-metadata',
        detail: `Sec-Fetch-Site=${v}`,
      }
    }
    // Allowed Fetch Metadata signal — trust it.
    return { ok: true }
  }

  const origin = headers.get('origin')
  // Browsers omit Origin on same-origin GETs and on direct navigation;
  // for state-changing methods modern browsers DO send Origin. Tools like
  // curl may omit it entirely, which we permit so server-to-server and
  // local-dev traffic still works.
  if (!origin) return { ok: true }

  const requestOrigin = getRequestOrigin(req)
  if (requestOrigin && origin === requestOrigin) return { ok: true }

  const trusted = getTrustedOrigins()
  if (trusted.has(origin)) return { ok: true }

  return {
    ok: false,
    reason: 'origin-mismatch',
    detail: `origin=${origin}`,
  }
}

/**
 * Build a structured 403 response for a CSRF/origin denial. Mirrors the
 * shape of `rejectAuthz()` so clients can handle all denials uniformly.
 */
export function rejectCsrf(denied: CsrfDenied) {
  return NextResponse.json(
    {
      ok: false,
      error: 'Cross-site or untrusted-origin request blocked',
      reason: denied.reason,
    },
    { status: 403 },
  )
}

/**
 * Convenience: returns a NextResponse iff the request must be denied.
 *
 *   const blocked = enforceCsrf(req)
 *   if (blocked) return blocked
 *
 * Pair with `auditCsrfDenied(...)` from `_audit.ts` when you want to
 * persist the denial to the audit_events table.
 */
export function enforceCsrf(req: Request): { response: NextResponse; denied: CsrfDenied } | null {
  const result = checkCsrf(req)
  if (result.ok) return null
  return { response: rejectCsrf(result), denied: result }
}
