# Live Supabase Verification — Smoke Tests

The portal supports two modes:

- **Demo mode** — no Supabase env vars set. The data layer reads from
  `src/lib/sample-data.ts` and writes are persisted in in-memory stores
  on `globalThis`.
- **Live mode** — `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` set. Optionally
  `SUPABASE_SERVICE_ROLE_KEY` for server bypass of RLS.

Detection lives in `src/lib/data/env.ts:isSupabaseConfigured()`.

## Static / build-level verification (always runs)

These checks are part of every CI build:

- [x] `npx tsc --noEmit` — clean.
- [x] `npm run build` — clean (warnings about `middleware → proxy` and
      Turbopack workspace root are pre-existing and unrelated).
- [x] No `SUPABASE_SERVICE_ROLE_KEY` reference outside server-only files
      (`src/lib/supabase/server.ts`, `src/lib/data/supabase-server.ts`,
      `src/lib/data/env.ts`, the outbox publisher route, and docs).
- [x] No `'use client'` file imports `getServerSupabase` or any module
      that imports `node:crypto` / `next/headers`.
- [x] `getServerSupabase` dynamically imports `@supabase/supabase-js`
      inside the function body — keeps the demo-mode bundle tiny.
- [x] All write routes consult `getActorContext()` first; no route
      trusts client-supplied actor identity.
- [x] Migrations are numerically ordered:
      `001 → 002 → 0003 → 0004 → 0005 → 0006`.

## Live mode smoke tests

When you have a real Supabase project + service role key set, run these
end-to-end smoke tests against `next dev` to verify the full path.

### 1. Apply migrations

```sh
psql "$SUPABASE_DB_URL" \
  -f supabase/migrations/001_initial_schema.sql \
  -f supabase/migrations/002_frd_schema.sql \
  -f supabase/migrations/0003_estate_liquidity_core.sql \
  -f supabase/migrations/0004_auth_rls_hardening.sql \
  -f supabase/migrations/0005_denied_action_audit.sql \
  -f supabase/migrations/0006_idempotency_keys.sql
```

### 2. Optional: seed demo data

```sh
psql "$SUPABASE_DB_URL" -f supabase/seed/0003_estate_liquidity_seed.sql
```

### 3. Launch portal with live env

```sh
NEXT_PUBLIC_SUPABASE_URL=… \
NEXT_PUBLIC_SUPABASE_ANON_KEY=… \
SUPABASE_SERVICE_ROLE_KEY=… \
PORTAL_AUDIT_SALT=$(openssl rand -hex 32) \
  npm run dev
```

The data-mode badge in the bottom-right corner should read **Supabase**.

### 4. Reader path

```sh
# Should return a non-empty list of inventory items from your seed.
curl -i http://localhost:3000/portal/inventory
```

### 5. Writer path with idempotency

```sh
KEY=$(uuidgen)
curl -i -X POST http://localhost:3000/api/portal/items/ITM-101/floor \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -H "Sec-Fetch-Site: same-origin" \
  --cookie "$YOUR_SUPABASE_AUTH_COOKIE" \
  -d '{"floorPrice": 1200, "actor": "qa-bot"}'

# Replay — should return the same body with Idempotent-Replay: true
curl -i -X POST http://localhost:3000/api/portal/items/ITM-101/floor \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -H "Sec-Fetch-Site: same-origin" \
  --cookie "$YOUR_SUPABASE_AUTH_COOKIE" \
  -d '{"floorPrice": 1200, "actor": "qa-bot"}'
```

### 6. Audit table

```sql
-- Recent denials (auth/csrf/rate-limit)
SELECT created_at, event_type, status_code, route, reason
FROM audit_events
ORDER BY created_at DESC
LIMIT 20;

-- Idempotency state for a key (admin/ops session required for SELECT)
SELECT idempotency_key, scope, status, response_status, created_at, expires_at
FROM idempotency_keys
WHERE idempotency_key = '<your-key>';
```

### 7. RLS sanity checks

```sql
-- A non-admin user should NOT be able to read audit_events / idempotency_keys.
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '<some-non-admin-uuid>';
SELECT count(*) FROM audit_events;       -- expect 0
SELECT count(*) FROM idempotency_keys;   -- expect 0

-- An admin user should see them.
SET LOCAL "request.jwt.claim.sub" = '<an-admin-uuid>';
SELECT count(*) FROM audit_events;       -- expect > 0 if denials happened
```

## Limitations

- The autonomous build environment for this branch does not have live
  Supabase credentials, so the **smoke tests above were not executed
  end-to-end** in this phase. The static / build / typecheck steps were
  run and are clean.
- `npm run build` is the closest reproducible signal that the live path
  compiles correctly (the Supabase-server module is dynamically imported
  but still type-checked).
