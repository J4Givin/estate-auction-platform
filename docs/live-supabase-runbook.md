# Live Supabase Runbook

End-to-end procedure for promoting the estate liquidity portal from
demo mode to a live Supabase project. Designed to be runnable in 30
minutes by an operator who has shell access, a fresh Supabase project,
and a Vercel deploy of this repo.

This runbook is the source of truth for `npm run smoke:live`.

---

## 0. Prerequisites

- A Supabase project (Pro or Team tier recommended for connection
  pooling). Note its project URL and anon/service role keys.
- The Supabase CLI **or** a `psql` client with `SUPABASE_DB_URL`
  exported (Connection string from Supabase → Project Settings →
  Database → Connection string → URI).
- A deploy URL for the portal (e.g. `https://estate.example.com` or a
  Vercel preview).
- `openssl` (for generating `PORTAL_AUDIT_SALT`).

---

## 1. Apply migrations 0003 → 0007

Run them in numeric order. Each is idempotent on a clean schema; on a
re-applied database, drop the relevant tables first.

```sh
psql "$SUPABASE_DB_URL" \
  -f supabase/migrations/001_initial_schema.sql \
  -f supabase/migrations/002_frd_schema.sql \
  -f supabase/migrations/0003_estate_liquidity_core.sql \
  -f supabase/migrations/0004_auth_rls_hardening.sql \
  -f supabase/migrations/0005_denied_action_audit.sql \
  -f supabase/migrations/0006_idempotency_keys.sql \
  -f supabase/migrations/0007_idempotency_cleanup.sql
```

Verify:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- expect: cases, inventory_items, offers, ledger_entries,
-- audit_events, idempotency_keys, profiles, memberships, ...
```

---

## 2. Seed demo data (optional but recommended for first run)

```sh
psql "$SUPABASE_DB_URL" -f supabase/seed/0003_estate_liquidity_seed.sql
psql "$SUPABASE_DB_URL" -f supabase/seed/0004_auth_rls_test_users.sql
```

The first seed creates `CASE-DEMO-1`, sample inventory, and one open
offer. The second creates the test users referenced in RLS checks.

---

## 3. Configure deploy env

Set these in your deploy provider (Vercel → Project → Settings →
Environment Variables, or your platform equivalent). Restart the
deploy after saving.

| Variable | Required? | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | From Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only; required for write paths |
| `PORTAL_AUDIT_SALT` | recommended | `openssl rand -hex 32` |
| `PORTAL_TRUSTED_ORIGINS` | optional | Comma-separated extra origins |
| `UPSTASH_REDIS_REST_URL` | optional | Enables durable rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | optional | Pair with the URL above |

---

## 4. Create auth users + memberships

In Supabase → Auth → Users, invite or create:

- one **customer** (e.g. `sarah@example.com`)
- one **ops** (e.g. `ops@example.com`)
- one **admin** (e.g. `admin@example.com`)

Then attach memberships so RLS knows their roles. Replace the UUIDs
with the ones from `auth.users` after creation:

```sql
INSERT INTO memberships (user_id, case_id, role) VALUES
  ('<sarah-uuid>', 'CASE-DEMO-1', 'customer'),
  ('<ops-uuid>',   'CASE-DEMO-1', 'ops'),
  ('<admin-uuid>', 'CASE-DEMO-1', 'admin');
```

---

## 5. Verify data mode reports `supabase`

```sh
curl -s https://your-deploy.example.com/api/portal/data-mode | jq
# expect: { "mode": "supabase", "supabaseConfigured": true, ... }
```

If you see `mode: "demo"`, the env vars did not propagate to the
deploy. Re-check step 3 and trigger a fresh build.

---

## 6. Run smoke:live

Sign in as the customer in a browser, copy the supabase auth cookie
(DevTools → Application → Cookies → `sb-<project>-auth-token`), and
run:

```sh
SMOKE_BASE_URL=https://your-deploy.example.com \
SMOKE_AUTH_COOKIE="sb-xxxx-auth-token=eyJ..." \
SMOKE_CASE_ID=CASE-DEMO-1 \
SMOKE_OFFER_ID=OFFER-DEMO-1 \
npm run smoke:live
```

Expected output: every check `PASS`, exit 0.

If you see a redirect (`status=302`) on `/portal`, the auth cookie has
expired or was not copied correctly. Re-sign-in in a fresh window.

To force authenticated-only checks (so a missed cookie produces a
clear failure), add `SMOKE_REQUIRE_AUTH=1`.

---

## 7. Verify idempotency replay

After step 6, a `smoke-live-…` row should exist:

```sql
SELECT idempotency_key, scope, status, response_status,
       created_at, expires_at
FROM idempotency_keys
WHERE idempotency_key LIKE 'smoke-live-%'
ORDER BY created_at DESC
LIMIT 5;
```

The same key should show one row, with `status = 'completed'` and a
`response_status` matching the smoke output.

---

## 8. Verify audit events

```sql
SELECT created_at, event_type, status_code, route, reason
FROM audit_events
WHERE created_at > now() - interval '15 minutes'
ORDER BY created_at DESC;
```

You should see entries for the smoke POSTs (and any denied requests
during your manual exploration).

---

## 9. Verify RLS works

In SQL Editor:

```sql
-- A non-admin customer should NOT see audit_events / idempotency_keys.
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '<sarah-uuid>';
SELECT count(*) FROM audit_events;       -- expect 0
SELECT count(*) FROM idempotency_keys;   -- expect 0

-- An admin should see them.
SET LOCAL "request.jwt.claim.sub" = '<admin-uuid>';
SELECT count(*) FROM audit_events;       -- expect > 0 if there were denials
```

---

## 10. (Optional) Verify Upstash rate limiting

If `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set,
hammer a write route 20× in 60 s:

```sh
for i in $(seq 1 20); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://your-deploy.example.com/api/portal/items/ITM-101/floor \
    -H "Content-Type: application/json" \
    -H "Idempotency-Key: $(uuidgen)" \
    --cookie "$SMOKE_AUTH_COOKIE" \
    -d '{"floorPrice":1200,"actor":"smoke"}'
done
```

You should see `429` for the over-limit calls, and a corresponding
audit event with `event_type = 'rate_limit_exceeded'`.

---

## 11. Static preflight (no live deploy)

`npm run verify:live-ready` is a no-network preflight that confirms
the repo is *ready* to be smoke-tested live. Use it in CI before
spending Supabase resources on a deploy.

---

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `data-mode: demo` after env set | Build cache; redeploy with cleared cache |
| `/portal` returns 302 in smoke | Auth cookie missing/expired |
| Replay header absent | Migration 0006 not applied, or middleware bypassed |
| `supabase service role` errors | Service role key set in client env by mistake |
| Rate limit never trips | Upstash env vars missing → in-memory limiter, single-instance only |
| RLS allows non-admin reads | Migration 0004 not applied, or `service_role` key reaching the browser |

For deeper failures, capture the audit log slice for the relevant
window and share it alongside the smoke output:

```sql
COPY (
  SELECT * FROM audit_events
  WHERE created_at > now() - interval '30 minutes'
) TO STDOUT WITH CSV HEADER;
```
