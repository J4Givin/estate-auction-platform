/**
 * Reports whether the running instance is in `demo` (in-memory sample
 * data) or `supabase` (live database) mode. Useful for smoke tests and
 * the ops console banner.
 *
 * Returns no secrets. The boolean here is also derivable client-side
 * from the absence of NEXT_PUBLIC_SUPABASE_URL — this endpoint is the
 * authoritative server-side answer for monitors and CI.
 */

import { NextResponse } from 'next/server'

import { isSupabaseConfigured } from '@/lib/data/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    mode: isSupabaseConfigured() ? 'supabase' : 'demo',
    supabaseConfigured: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  })
}
