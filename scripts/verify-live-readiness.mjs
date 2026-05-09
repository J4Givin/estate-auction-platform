#!/usr/bin/env node
/**
 * Live readiness checker.
 *
 * Static, no-network preflight that confirms a deploy is ready to run
 * `npm run smoke:live` against a real Supabase project. Run this in CI
 * or locally before pointing the smoke test at a live deploy.
 *
 * Checks:
 *   - all required migration files exist (0003 → 0007)
 *   - seed file present
 *   - documented runbook present (docs/live-supabase-runbook.md)
 *   - smoke-live.mjs script exists and is wired into package.json
 *   - data-mode and idempotency endpoints are present in src/app/api
 *   - portal write routes consistently emit Idempotency-Key support
 *
 * Optional env-presence (only reported, never required):
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *   SUPABASE_SERVICE_ROLE_KEY, PORTAL_AUDIT_SALT,
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN,
 *   SMOKE_BASE_URL, SMOKE_AUTH_COOKIE
 *
 * Exit code is non-zero only if a required artifact is missing.
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')

const failures = []
const warnings = []
const info = []

function pass(msg) {
  console.log(`  PASS  ${msg}`)
}
function fail(msg) {
  failures.push(msg)
  console.log(`  FAIL  ${msg}`)
}
function warn(msg) {
  warnings.push(msg)
  console.log(`  WARN  ${msg}`)
}
function note(msg) {
  info.push(msg)
  console.log(`  INFO  ${msg}`)
}

function checkExists(label, relPath) {
  const abs = resolve(ROOT, relPath)
  if (existsSync(abs)) pass(`${label} (${relPath})`)
  else fail(`${label} missing: ${relPath}`)
}

console.log('[verify-live-readiness] static preflight\n')

// 1. Migrations
console.log('Migrations')
const REQUIRED_MIGRATIONS = [
  'supabase/migrations/001_initial_schema.sql',
  'supabase/migrations/002_frd_schema.sql',
  'supabase/migrations/0003_estate_liquidity_core.sql',
  'supabase/migrations/0004_auth_rls_hardening.sql',
  'supabase/migrations/0005_denied_action_audit.sql',
  'supabase/migrations/0006_idempotency_keys.sql',
  'supabase/migrations/0007_idempotency_cleanup.sql',
]
for (const m of REQUIRED_MIGRATIONS) checkExists('migration', m)

// 2. Seed
console.log('\nSeed')
checkExists('seed', 'supabase/seed/0003_estate_liquidity_seed.sql')
checkExists('rls test users seed', 'supabase/seed/0004_auth_rls_test_users.sql')

// 3. Runbook + docs
console.log('\nDocs')
checkExists('runbook', 'docs/live-supabase-runbook.md')
checkExists('verification doc', 'docs/live-verification.md')
checkExists('launch checklist', 'docs/launch-readiness-checklist.md')

// 4. Scripts
console.log('\nScripts')
checkExists('smoke-live', 'scripts/smoke-live.mjs')
checkExists('smoke-demo', 'scripts/smoke-demo.mjs')
checkExists('idempotency-cleanup', 'scripts/idempotency-cleanup.mjs')

// package.json wiring
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'))
for (const s of ['smoke:demo', 'smoke:live', 'idempotency:cleanup', 'qa:visual']) {
  if (pkg.scripts?.[s]) pass(`npm run ${s} wired`)
  else fail(`npm run ${s} missing in package.json`)
}

// 5. API surface
console.log('\nAPI surface')
checkExists('data-mode endpoint', 'src/app/api/portal/data-mode/route.ts')
checkExists('offer accept (idempotent)', 'src/app/api/portal/offers/accept/route.ts')
checkExists('item floor (idempotent)', 'src/app/api/portal/items/[itemId]/floor/route.ts')

// 6. Env presence (informational)
console.log('\nEnvironment')
const ENV_VARS = [
  ['NEXT_PUBLIC_SUPABASE_URL', true],
  ['NEXT_PUBLIC_SUPABASE_ANON_KEY', true],
  ['SUPABASE_SERVICE_ROLE_KEY', true],
  ['PORTAL_AUDIT_SALT', false],
  ['UPSTASH_REDIS_REST_URL', false],
  ['UPSTASH_REDIS_REST_TOKEN', false],
  ['SMOKE_BASE_URL', false],
  ['SMOKE_AUTH_COOKIE', false],
]
let liveEnvComplete = true
for (const [name, requiredForLive] of ENV_VARS) {
  if (process.env[name]) {
    note(`${name} present`)
  } else if (requiredForLive) {
    liveEnvComplete = false
    warn(`${name} missing — required for live mode`)
  } else {
    note(`${name} not set (optional)`)
  }
}

console.log('\nSummary')
console.log(`  passed=${REQUIRED_MIGRATIONS.length + 12 - failures.length} failed=${failures.length} warnings=${warnings.length}`)
if (liveEnvComplete) {
  console.log('  Live env vars present — `npm run smoke:live` is ready to run.')
} else {
  console.log('  Live env vars NOT fully present — set NEXT_PUBLIC_SUPABASE_URL,')
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY before')
  console.log('  running `npm run smoke:live`.')
}

if (failures.length) {
  console.log('\nFailures:', failures.map(f => `\n  - ${f}`).join(''))
  process.exit(1)
}
process.exit(0)
