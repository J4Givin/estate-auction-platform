/**
 * Server-side Supabase client factory for the estate liquidity data layer.
 *
 * Privileged — uses the service role key when available so server handlers
 * and server components can read past RLS without surfacing the key.
 *
 * Safety properties:
 *   - The service role key reads from `process.env.SUPABASE_SERVICE_ROLE_KEY`,
 *     which is **not** prefixed with `NEXT_PUBLIC_`, so Next.js will never
 *     inline it into client bundles.
 *   - The Supabase JS client itself is dynamically imported, so it is only
 *     pulled in when a reader/action is actually evaluated server-side.
 *   - On the browser `isSupabaseConfigured()` is still `true`, but the
 *     resulting client uses the anon key — never the service role.
 *   - All readers gate this behind `isSupabaseConfigured()` first, so the
 *     entire path tree-shakes cleanly in demo mode.
 */

import { isServiceRoleConfigured, isSupabaseConfigured } from './env'

type SupabaseLike = Awaited<ReturnType<typeof getServerSupabase>>

/**
 * Returns a Supabase client appropriate for server-side reads.
 *
 *   - Prefers service role (bypasses RLS, safe because we only ever call
 *     this from server route handlers / server components / data layer).
 *   - Falls back to anon when service role not present so dev environments
 *     with public RLS policies still work.
 *   - Returns `null` when Supabase isn't configured at all so callers can
 *     fall back to sample data without throwing.
 */
export async function getServerSupabase() {
  if (!isSupabaseConfigured()) return null
  const { createClient } = await import('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // The service role key is server-only; on the client it will be undefined,
  // and we transparently fall back to the anon key.
  const key = isServiceRoleConfigured()
    ? process.env.SUPABASE_SERVICE_ROLE_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export type { SupabaseLike }
