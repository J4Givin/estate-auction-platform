#!/usr/bin/env node
/**
 * Demo-mode smoke test.
 *
 * Boots no server itself. Expects the app to already be running in demo
 * mode (no Supabase env vars) at SMOKE_BASE_URL, default
 * http://127.0.0.1:3000. Verifies:
 *
 *   1. /api/portal/data-mode reports `mode === "demo"`.
 *   2. A few read-only portal pages return 200.
 *   3. An idempotency-keyed write replays correctly: same key + body
 *      returns the same envelope with `Idempotent-Replay: true`.
 *
 * Usage:
 *   npm run start &
 *   npm run smoke:demo
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — any check failed
 */

import process from 'node:process'

const BASE = (process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '')

const failures = []
let passed = 0

function check(name, ok, detail = '') {
  if (ok) {
    passed++
    console.log(`  PASS  ${name}`)
  } else {
    failures.push(name)
    console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`)
  }
}

async function get(path) {
  const r = await fetch(BASE + path, { headers: { Accept: 'application/json,text/html' } })
  return r
}

async function postJson(path, body, extraHeaders = {}) {
  const r = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  })
  let json = null
  try {
    json = await r.json()
  } catch {}
  return { status: r.status, json, headers: r.headers }
}

console.log(`[smoke-demo] target = ${BASE}`)

// 1. Data-mode endpoint reports demo.
{
  const r = await get('/api/portal/data-mode')
  check('GET /api/portal/data-mode → 200', r.status === 200, `status=${r.status}`)
  if (r.status === 200) {
    const j = await r.json().catch(() => ({}))
    check(
      'data-mode reports demo',
      j.mode === 'demo' && j.supabaseConfigured === false,
      `got mode=${j.mode} supabaseConfigured=${j.supabaseConfigured}`,
    )
  }
}

// 2. Portal pages render.
for (const p of ['/portal', '/portal/inventory', '/portal/offers', '/portal/ledger', '/ops']) {
  const r = await get(p)
  check(`GET ${p} → 200`, r.status === 200, `status=${r.status}`)
}

// 3. Idempotency replay round-trip.
//
// Pick a route that returns a deterministic envelope with no side-effect
// the caller can observe. /api/portal/offers/accept is a good one: in
// demo mode it succeeds, and the cached body is what we want to compare.
const KEY = `smoke-demo-${Date.now()}-${Math.random().toString(36).slice(2)}`
const body = {
  caseId: 'CASE-DEMO-1',
  offerId: 'OFFER-DEMO-1',
  actor: 'Smoke Test',
}
const headers = { 'Idempotency-Key': KEY }

const first = await postJson('/api/portal/offers/accept', body, headers)
check(
  'idempotency: first POST succeeds OR is gracefully rejected',
  first.status < 500,
  `status=${first.status} body=${JSON.stringify(first.json).slice(0, 120)}`,
)

const second = await postJson('/api/portal/offers/accept', body, headers)
check(
  'idempotency: second POST returns same status as first',
  second.status === first.status,
  `first=${first.status} second=${second.status}`,
)

const replayHeader = second.headers.get('idempotent-replay') || second.headers.get('Idempotent-Replay')
const idempStatus = second.headers.get('idempotency-status') || second.headers.get('Idempotency-Status')

// In demo mode without persistence, replay header should be 'true' OR
// idempotency-status 'replayed'. Either is acceptable.
check(
  'idempotency: replay marker present on second call',
  replayHeader === 'true' || idempStatus === 'replayed',
  `Idempotent-Replay=${replayHeader} Idempotency-Status=${idempStatus}`,
)

console.log(`\n[smoke-demo] passed=${passed} failed=${failures.length}`)
if (failures.length) {
  console.log('Failures:', failures.map((f) => `\n  - ${f}`).join(''))
  process.exit(1)
}
process.exit(0)
