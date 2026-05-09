/**
 * Supabase configuration helpers.
 *
 * The portal data layer is designed to gracefully fall back to
 * shipped sample data when Supabase env vars are not configured.
 * This file is the single source of truth for "are we live or demo?".
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && anon && url.length > 0 && anon.length > 0)
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/** Mode label for diagnostics/UI badges. */
export type DataMode = 'supabase' | 'demo'

export function getDataMode(): DataMode {
  return isSupabaseConfigured() ? 'supabase' : 'demo'
}
