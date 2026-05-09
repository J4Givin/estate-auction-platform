/**
 * Auth-aware actor context for the estate liquidity data layer.
 *
 * Goal: every server route / data-layer write resolves a normalized
 * `ActorContext` describing who is acting, what platform role they hold,
 * which cases they belong to, and whether we are in demo or live mode.
 *
 * Safety properties:
 *   * Reads the Supabase session via `@supabase/ssr` cookie helper — works
 *     in both Route Handlers and Server Components.
 *   * Never imports the service-role key. Membership lookups use the same
 *     SSR client (anon + user JWT), which is RLS-protected.
 *   * Falls back gracefully when Supabase isn't configured — returns the
 *     deterministic demo actor so seed flows and previews keep working.
 *   * Does NOT throw — callers receive a `mode: 'demo'` actor when no
 *     session is present in live mode either, and decide whether to 401.
 *
 * This file is server-only. Do NOT import from client components.
 *
 * The `next/headers` import is dynamic so it never enters a client bundle —
 * Next.js will fail the build if a client component reaches it.
 */

import { isSupabaseConfigured, getDataMode, type DataMode } from './env'

export type PlatformRole = 'customer' | 'ops' | 'expert' | 'admin' | 'partner'
export type MembershipRole = 'owner' | 'viewer' | 'ops' | 'expert' | 'partner'

export interface CaseMembership {
  caseId: string
  role: MembershipRole
}

export interface ActorContext {
  mode: DataMode
  /** True when a real authenticated Supabase user backs this context. */
  authenticated: boolean
  userId: string | null
  email: string | null
  displayName: string | null
  /** Platform role from `user_profiles.platform_role`. Defaults to 'customer'. */
  platformRole: PlatformRole
  /** Convenience flag mirroring `user_profiles.is_admin || platform_role === 'admin'`. */
  isAdmin: boolean
  /** Cases this actor can read (owner / ops / expert / partner). */
  memberships: CaseMembership[]
  /** Convenience set of caseIds the actor can read. */
  caseIds: string[]
  /** Item-level expert assignments. */
  itemIds: string[]
  /**
   * Free-form actor label for trust receipts / decision rows. Prefers email,
   * then displayName, then the literal "demo-actor" so audit logs always
   * have a value.
   */
  actorLabel: string
}

const DEMO_ACTOR: ActorContext = {
  mode: 'demo',
  authenticated: false,
  userId: null,
  email: null,
  displayName: 'Demo Actor',
  platformRole: 'customer',
  isAdmin: false,
  memberships: [{ caseId: 'JOB-2026-0418', role: 'owner' }],
  caseIds: ['JOB-2026-0418'],
  itemIds: [],
  actorLabel: 'demo-actor',
}

/**
 * Returns the deterministic demo actor. Useful for tests and for
 * preserving demo behavior when env vars are missing.
 */
export function getDemoActor(): ActorContext {
  return { ...DEMO_ACTOR }
}

/**
 * Resolve the current actor for a server-side context (route handler or
 * server component). Never throws.
 *
 * Order of resolution:
 *   1. If Supabase env vars are missing → demo actor (mode: 'demo').
 *   2. If a Supabase session is present → resolve profile + memberships
 *      via the user's RLS-scoped client.
 *   3. Otherwise → "anonymous live" actor (authenticated: false, mode: 'supabase'),
 *      so callers can decide whether to 401.
 */
export async function getActorContext(): Promise<ActorContext> {
  const mode: DataMode = getDataMode()

  if (!isSupabaseConfigured()) {
    return getDemoActor()
  }

  // Dynamically import so this file doesn't pull cookie/SSR helpers into
  // any client bundle that accidentally imports demo helpers.
  let supabase: Awaited<ReturnType<typeof createSsrClient>> | null = null
  try {
    supabase = await createSsrClient()
  } catch {
    // SSR cookie helper failed (e.g. called outside a request scope).
    return { ...getDemoActor(), mode }
  }

  if (!supabase) {
    return { ...getDemoActor(), mode }
  }

  const { data: userResult, error: userError } = await supabase.auth.getUser()
  if (userError || !userResult?.user) {
    return {
      mode,
      authenticated: false,
      userId: null,
      email: null,
      displayName: null,
      platformRole: 'customer',
      isAdmin: false,
      memberships: [],
      caseIds: [],
      itemIds: [],
      actorLabel: 'anonymous',
    }
  }

  const user = userResult.user

  // Profile (best-effort; missing profile → defaults).
  let platformRole: PlatformRole = 'customer'
  let displayName: string | null = (user.user_metadata?.full_name as string | undefined) ?? null
  let isAdmin = false
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('platform_role,is_admin,display_name')
      .eq('user_id', user.id)
      .maybeSingle()
    if (profile) {
      platformRole = (profile.platform_role as PlatformRole) ?? platformRole
      isAdmin = Boolean(profile.is_admin) || platformRole === 'admin'
      displayName = (profile.display_name as string) ?? displayName
    }
  } catch {
    /* ignore — default role is fine */
  }

  const memberships: CaseMembership[] = []
  const caseIdSet = new Set<string>()
  const itemIdSet = new Set<string>()

  // Case memberships
  try {
    const { data: rows } = await supabase
      .from('case_memberships')
      .select('case_id,role')
      .eq('user_id', user.id)
    for (const row of rows ?? []) {
      memberships.push({ caseId: row.case_id as string, role: row.role as MembershipRole })
      caseIdSet.add(row.case_id as string)
    }
  } catch {
    /* ignore */
  }

  // Expert assignments
  try {
    const { data: rows } = await supabase
      .from('expert_assignments')
      .select('case_id,item_id,active')
      .eq('user_id', user.id)
      .eq('active', true)
    for (const row of rows ?? []) {
      if (row.case_id) {
        memberships.push({ caseId: row.case_id as string, role: 'expert' })
        caseIdSet.add(row.case_id as string)
      }
      if (row.item_id) itemIdSet.add(row.item_id as string)
    }
  } catch {
    /* ignore */
  }

  // Partner assignments
  try {
    const { data: rows } = await supabase
      .from('partner_assignments')
      .select('case_id,active')
      .eq('user_id', user.id)
      .eq('active', true)
    for (const row of rows ?? []) {
      if (row.case_id) {
        memberships.push({ caseId: row.case_id as string, role: 'partner' })
        caseIdSet.add(row.case_id as string)
      }
    }
  } catch {
    /* ignore */
  }

  return {
    mode,
    authenticated: true,
    userId: user.id,
    email: user.email ?? null,
    displayName,
    platformRole,
    isAdmin,
    memberships,
    caseIds: Array.from(caseIdSet),
    itemIds: Array.from(itemIdSet),
    actorLabel: user.email ?? displayName ?? user.id,
  }
}

/**
 * Resolve actor for a route, given an explicit fallback actor label
 * (e.g. when the request body says `actor: "Sample User"` and the
 * caller is in demo mode without a session).
 */
export async function getActorContextWithFallback(fallbackLabel?: string | null): Promise<ActorContext> {
  const ctx = await getActorContext()
  if (!fallbackLabel) return ctx
  if (ctx.authenticated) return ctx
  return { ...ctx, actorLabel: fallbackLabel || ctx.actorLabel }
}

/* ────────────────────────────────────────────────────────────── */
/* Authorization predicates — used by API routes BEFORE writes.    */
/* They mirror the SQL RLS policies so we get clear 401/403 errors */
/* in app code without leaking RLS error strings to the client.    */
/* ────────────────────────────────────────────────────────────── */

export function canReadCase(ctx: ActorContext, caseId: string): boolean {
  if (ctx.isAdmin || ctx.platformRole === 'admin' || ctx.platformRole === 'ops') return true
  return ctx.caseIds.includes(caseId)
}

export function canWriteCase(ctx: ActorContext, caseId: string): boolean {
  if (ctx.isAdmin || ctx.platformRole === 'admin' || ctx.platformRole === 'ops') return true
  return ctx.memberships.some(
    (m) => m.caseId === caseId && (m.role === 'owner' || m.role === 'ops'),
  )
}

export function canReadItem(ctx: ActorContext, itemId: string, caseId?: string | null): boolean {
  if (ctx.isAdmin || ctx.platformRole === 'admin' || ctx.platformRole === 'ops') return true
  if (caseId && canReadCase(ctx, caseId)) return true
  return ctx.itemIds.includes(itemId)
}

export function canExpertWriteItem(ctx: ActorContext, itemId: string): boolean {
  return ctx.platformRole === 'expert' && ctx.itemIds.includes(itemId)
}

/**
 * Resolve the case id that owns an inventory item. Returns null when
 * Supabase isn't configured or the item is unknown — callers should treat
 * that as "no case membership required" only in demo mode.
 */
export async function resolveItemCaseId(itemId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const { getServerSupabase } = await import('./supabase-server')
    const sb = await getServerSupabase()
    if (!sb) return null
    const { data } = await sb
      .from('inventory_items')
      .select('case_id')
      .eq('item_id', itemId)
      .maybeSingle()
    return (data?.case_id as string | undefined) ?? null
  } catch {
    return null
  }
}

/**
 * Resolve the case id that owns a cash offer. Returns null when Supabase
 * isn't configured or the offer is unknown — callers should treat that as
 * "no case membership required" only in demo mode.
 *
 * Mirrors `resolveItemCaseId` so route handlers can authorize counter/accept
 * actions against actor membership before issuing the write, instead of
 * relying solely on RLS as a backstop.
 */
export async function resolveOfferCaseId(offerId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const { getServerSupabase } = await import('./supabase-server')
    const sb = await getServerSupabase()
    if (!sb) return null
    const { data } = await sb
      .from('cash_offers')
      .select('case_id')
      .eq('offer_id', offerId)
      .maybeSingle()
    return (data?.case_id as string | undefined) ?? null
  } catch {
    return null
  }
}

export type AuthzDecision =
  | { ok: true; ctx: ActorContext }
  | { ok: false; status: 401 | 403; reason: string; ctx: ActorContext }

/**
 * Demo mode short-circuit. In demo mode we always allow the write to keep
 * the preview UX working — the data layer handles writes deterministically.
 */
export function authorize(
  ctx: ActorContext,
  predicate: (ctx: ActorContext) => boolean,
  options?: { reason?: string; allowDemo?: boolean },
): AuthzDecision {
  const allowDemo = options?.allowDemo ?? true
  if (ctx.mode === 'demo' && allowDemo) return { ok: true, ctx }
  if (!ctx.authenticated) return { ok: false, status: 401, reason: 'Not authenticated', ctx }
  if (!predicate(ctx)) return { ok: false, status: 403, reason: options?.reason ?? 'Forbidden', ctx }
  return { ok: true, ctx }
}

/* ────────────────────────────────────────────────────────────── */
/* Internal: SSR client factory that honors RLS and reads cookies. */
/* Imported dynamically so demo paths never pull in `next/headers`.*/
/* ────────────────────────────────────────────────────────────── */

async function createSsrClient() {
  if (!isSupabaseConfigured()) return null
  try {
    const { createServerClient } = await import('@supabase/ssr')
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              )
            } catch {
              /* server component: cookie writes not supported */
            }
          },
        },
      },
    )
  } catch {
    return null
  }
}
