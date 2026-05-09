#!/usr/bin/env node
/**
 * Idempotency cleanup runner.
 *
 * Calls the `cleanup_expired_idempotency_keys` SQL function (see
 * supabase/migrations/0007_idempotency_cleanup.sql) using the service
 * role key, and prints the number of rows deleted. Intended to be run
 * from a scheduler — Vercel cron, GitHub Actions, a host crontab, or a
 * Supabase pg_cron job.
 *
 * Required env (any one form is fine):
 *   SUPABASE_URL                    — project URL
 *   SUPABASE_SERVICE_ROLE_KEY       — service-role key (NEVER ship to client)
 *
 * If credentials are missing, the script exits 0 with a clear notice
 * (so demo CI doesn't fail). Real failures exit 1.
 *
 * Usage:
 *   node scripts/idempotency-cleanup.mjs            # default 10000 rows
 *   IDEMPOTENCY_BATCH=50000 node scripts/idempotency-cleanup.mjs
 */

import process from 'node:process'

const url =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  ''

if (!url || !serviceKey) {
  console.log(
    '[idempotency-cleanup] No Supabase credentials configured — skipping.\n' +
      '  Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to run against a real project.\n' +
      '  In demo mode, expired keys are pruned implicitly by the in-memory store.',
  )
  process.exit(0)
}

const batch = Number(process.env.IDEMPOTENCY_BATCH || 10000)
if (!Number.isFinite(batch) || batch < 1) {
  console.error(`[idempotency-cleanup] Invalid IDEMPOTENCY_BATCH: ${process.env.IDEMPOTENCY_BATCH}`)
  process.exit(1)
}

const endpoint = `${url.replace(/\/+$/, '')}/rest/v1/rpc/cleanup_expired_idempotency_keys`

let totalDeleted = 0
let pass = 0
const HARD_LIMIT = 20

while (pass < HARD_LIMIT) {
  pass += 1
  const t0 = Date.now()
  let resp
  try {
    resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'params=single-object',
      },
      body: JSON.stringify({ max_rows: batch }),
    })
  } catch (err) {
    console.error(`[idempotency-cleanup] network error on pass ${pass}: ${err.message}`)
    process.exit(1)
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    console.error(`[idempotency-cleanup] HTTP ${resp.status} on pass ${pass}: ${text.slice(0, 400)}`)
    process.exit(1)
  }

  const deleted = Number(await resp.json().catch(() => 0)) || 0
  totalDeleted += deleted
  const ms = Date.now() - t0
  console.log(`[idempotency-cleanup] pass=${pass} deleted=${deleted} elapsed=${ms}ms`)

  if (deleted < batch) break
}

console.log(`[idempotency-cleanup] done — total_deleted=${totalDeleted} passes=${pass}`)
process.exit(0)
