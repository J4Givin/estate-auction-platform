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
 *
 * Without SMOKE_BASE_URL the script exits 0 with a notice (so demo CI
 * doesn't flip red).
 */

import process from 'node:process'

const BASE = (process.env.SMOKE_BASE_URL || '').replace(/\/+$/, '')

if (!BASE) {
  console.log(
    '[smoke-live] SMOKE_BASE_URL not set — skipping live smoke test.\n' +
      '  Example:\n' +
      '    SMOKE_BASE_URL=https://your-deploy.vercel.app \\\n' +
      '    SMOKE_AUTH_COOKIE="sb-xyz-auth-token=..." \\\n' +
      '    npm run smoke:live',
  )
  process.exit(0)
}

const COOKIE = process.env.SMOKE_AUTH_COOKIE || ''
const CSRF = process.env.SMOKE_CSRF_TOKEN || ''

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
  return fetch(BASE + path, {
    headers: { Accept: 'application/json,text/html', Cookie: COOKIE },
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
  })
  let json = null
  try {
    json = await r.json()
  } catch {}
  return { status: r.status, json, headers: r.headers }
}

console.log(`[smoke-live] target = ${BASE}`)

// 1. Data-mode endpoint reports supabase.
{
  const r = await get('/api/portal/data-mode')
  check('GET /api/portal/data-mode → 200', r.status === 200, `status=${r.status}`)
  if (r.status === 200) {
    const j = await r.json().catch(() => ({}))
    check(
      'data-mode reports supabase',
      j.mode === 'supabase' && j.supabaseConfigured === true,
      `mode=${j.mode}`,
    )
  }
}

// 2. Portal pages render (200, not 5xx; auth may redirect to /auth/login
//    which is also OK — we only flag server errors).
for (const p of ['/portal', '/ops']) {
  const r = await get(p)
  check(`GET ${p} → not 5xx`, r.status < 500, `status=${r.status}`)
}

// 3. Idempotency replay round-trip against the real DB.
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

console.log(`\n[smoke-live] passed=${passed} failed=${failures.length}`)
if (failures.length) {
  console.log('Failures:', failures.map((f) => `\n  - ${f}`).join(''))
  process.exit(1)
}
process.exit(0)
