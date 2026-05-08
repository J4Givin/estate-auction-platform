#!/usr/bin/env node
/**
 * Live-mode smoke test.
 *
 * Run against a deploy that is wired to a real Supabase project. Uses
 * the same checks as smoke-demo.mjs but expects `mode === "supabase"`
 * and exercises an idempotency replay round-trip against the real DB.
 *
 * Required env:
 *   SMOKE_BASE_URL                   — full URL of the running app
 *
 * Optional env:
 *   SMOKE_AUTH_COOKIE                — value of the supabase auth cookie
 *                                      so authenticated routes work
 *   SMOKE_CSRF_TOKEN                 — CSRF token if your env enforces it
 *   SMOKE_CASE_ID                    — case id used in the idempotent POST
 *   SMOKE_OFFER_ID                   — offer id used in the idempotent POST
 *   SMOKE_REQUIRE_AUTH=1             — fail if portal pages return 401/302
 *
 * Without SMOKE_BASE_URL the script exits 0 with a notice (so demo CI
 * doesn't flip red) and prints the exact runbook command.
 */

import process from 'node:process'

const BASE = (process.env.SMOKE_BASE_URL || '').replace(/\/+$/, '')

if (!BASE) {
  console.log(
    '[smoke-live] SMOKE_BASE_URL not set — skipping live smoke test.\n' +
      '\n' +
      '  To run live smoke tests:\n' +
      '    1. Apply migrations 0003–0007 to your Supabase project\n' +
      '    2. Deploy the portal with NEXT_PUBLIC_SUPABASE_URL,\n' +
      '       NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY\n' +
      '       set in the runtime env\n' +
      '    3. Sign in once in a browser and copy the supabase auth cookie\n' +
      '    4. Run:\n' +
      '         SMOKE_BASE_URL=https://your-deploy.vercel.app \\\n' +
      '         SMOKE_AUTH_COOKIE="sb-xyz-auth-token=..." \\\n' +
      '         npm run smoke:live\n' +
      '\n' +
      '  See docs/live-supabase-runbook.md for the full sequence.',
  )
  process.exit(0)
}

const COOKIE = process.env.SMOKE_AUTH_COOKIE || ''
const CSRF = process.env.SMOKE_CSRF_TOKEN || ''
const REQUIRE_AUTH = process.env.SMOKE_REQUIRE_AUTH === '1'

const failures = []
let passed = 0

function check(name, ok, detail = '') {
  if (ok) {
    passed++
    console.log(`  PASS  ${name}`)
  } else {
    failures.push(`${name}${detail ? ' — ' + detail : ''}`)
    console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`)
  }
}

async function get(path) {
  return fetch(BASE + path, {
    headers: { Accept: 'application/json,text/html', Cookie: COOKIE },
    redirect: 'manual',
  })
}

async function postJson(path, body, extraHeaders = {}) {
  const r = await fetch(BASE + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: COOKIE,
      ...(CSRF ? { 'x-csrf-token': CSRF } : {}),
      ...extraHeaders,
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  let json = null
  try {
    json = await r.json()
  } catch {}
  return { status: r.status, json, headers: r.headers }
}

console.log(`[smoke-live] target = ${BASE}`)
console.log(`[smoke-live] auth cookie = ${COOKIE ? 'present' : 'MISSING (auth-gated routes will redirect)'}`)
console.log(`[smoke-live] csrf token  = ${CSRF ? 'present' : 'absent (only needed if origin mismatch)'}`)
console.log('')

// 1. Data-mode endpoint reports supabase.
{
  const r = await get('/api/portal/data-mode')
  check('GET /api/portal/data-mode → 200', r.status === 200, `status=${r.status}`)
  if (r.status === 200) {
    const j = await r.json().catch(() => ({}))
    check(
      'data-mode reports supabase',
      j.mode === 'supabase' && j.supabaseConfigured === true,
      `mode=${j.mode} supabaseConfigured=${j.supabaseConfigured}`,
    )
  }
}

// 2. Portal pages render. Auth redirect (302) is allowed unless
// SMOKE_REQUIRE_AUTH=1 is set, in which case we expect a fully
// authenticated session (200).
for (const p of ['/portal', '/portal/inventory', '/portal/offers', '/ops']) {
  const r = await get(p)
  if (REQUIRE_AUTH) {
    check(`GET ${p} → 200 (authenticated)`, r.status === 200, `status=${r.status}`)
  } else {
    check(`GET ${p} → not 5xx`, r.status < 500, `status=${r.status}`)
  }
}

// 3. CSRF / origin protection — same-origin POST without CSRF should
// either succeed (cookie auth + same-origin) or fail with 4xx, never 5xx.
{
  const r = await postJson('/api/portal/data-mode', {})
  check(
    'POST /api/portal/data-mode (read-only endpoint) returns sane status',
    r.status >= 200 && r.status < 500,
    `status=${r.status}`,
  )
}

// 4. Idempotency replay round-trip against the real DB.
const KEY = `smoke-live-${Date.now()}-${Math.random().toString(36).slice(2)}`
const body = {
  caseId: process.env.SMOKE_CASE_ID || 'CASE-DEMO-1',
  offerId: process.env.SMOKE_OFFER_ID || 'OFFER-DEMO-1',
  actor: 'Smoke Test',
}
const headers = { 'Idempotency-Key': KEY }

const first = await postJson('/api/portal/offers/accept', body, headers)
check(
  'idempotency: first POST returns a non-5xx response',
  first.status < 500,
  `status=${first.status}`,
)

const second = await postJson('/api/portal/offers/accept', body, headers)
check(
  'idempotency: second POST returns same status as first',
  second.status === first.status,
  `first=${first.status} second=${second.status}`,
)

const replayHeader = second.headers.get('idempotent-replay') || second.headers.get('Idempotent-Replay')
const idempStatus = second.headers.get('idempotency-status') || second.headers.get('Idempotency-Status')
check(
  'idempotency: replay marker present',
  replayHeader === 'true' || idempStatus === 'replayed',
  `Idempotent-Replay=${replayHeader} Idempotency-Status=${idempStatus}`,
)

// 5. Bodies should be byte-equivalent on replay.
if (first.json && second.json) {
  const a = JSON.stringify(first.json)
  const b = JSON.stringify(second.json)
  check('idempotency: replay body matches original', a === b, a === b ? '' : 'first ≠ second')
}

console.log(`\n[smoke-live] passed=${passed} failed=${failures.length}`)
if (failures.length) {
  console.log('Failures:' + failures.map((f) => `\n  - ${f}`).join(''))
  console.log('\nTroubleshooting:')
  console.log('  - data-mode != supabase  →  env vars missing on the deploy')
  console.log('  - 401/302 on /portal     →  SMOKE_AUTH_COOKIE missing or expired')
  console.log('  - replay marker absent   →  migration 0006 not applied or')
  console.log('                              idempotency middleware bypassed')
  console.log('  See docs/live-supabase-runbook.md for the full diagnostic flow.')
  process.exit(1)
}
process.exit(0)
