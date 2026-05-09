/**
 * Scheduled idempotency cleanup (Vercel cron-compatible).
 *
 * Wire-up:
 *   - Schedule in vercel.json:
 *       { "crons": [{ "path": "/api/cron/idempotency-cleanup", "schedule": "17 * * * *" }] }
 *   - Vercel sets the `Authorization: Bearer <CRON_SECRET>` header on
 *     every invocation. Set CRON_SECRET in your project env so this
 *     route accepts it.
 *
 * Without Supabase credentials this route exits 200 with a notice — demo
 * deploys can keep the schedule wired up without erroring.
 *
 * The actual prune is driven by the SQL function
 * `cleanup_expired_idempotency_keys` (see migration 0007).
 */

import { NextResponse } from 'next/server'

import { isSupabaseConfigured } from '@/lib/data/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_BATCH = 10_000
const HARD_LIMIT_PASSES = 20

export async function GET(req: Request) {
  // Guard against drive-by traffic. Vercel cron always supplies the bearer.
  const expected = process.env.CRON_SECRET
  if (expected) {
    const got = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
    if (got !== expected) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: 'supabase_not_configured',
      message: 'Demo mode — in-memory idempotency store prunes implicitly.',
    })
  }

  const { getServerSupabase } = await import('@/lib/data/supabase-server')
  const sb = await getServerSupabase()
  if (!sb) {
    return NextResponse.json({ ok: false, reason: 'supabase_unavailable' }, { status: 503 })
  }

  let totalDeleted = 0
  let passes = 0
  for (passes = 1; passes <= HARD_LIMIT_PASSES; passes++) {
    const { data, error } = await sb.rpc('cleanup_expired_idempotency_keys', { max_rows: DEFAULT_BATCH })
    if (error) {
      return NextResponse.json(
        { ok: false, reason: 'rpc_error', detail: error.message, totalDeleted, passes },
        { status: 500 },
      )
    }
    const deleted = typeof data === 'number' ? data : 0
    totalDeleted += deleted
    if (deleted < DEFAULT_BATCH) break
  }

  return NextResponse.json({ ok: true, totalDeleted, passes })
}
