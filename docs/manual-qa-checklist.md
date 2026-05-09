# Estate Liquidity Platform — Manual QA Checklist

This checklist covers the security and durability paths added in the
`estate-liquidity-ux-command-center` branch. It is intended to be run by
hand after each release because the project intentionally does not yet
ship a test runner — see "Why no automated tests?" at the bottom.

> Pair this with the launch checklist in `docs/auth-rls.md`.

---

## 1. Demo mode (no Supabase, no Upstash)

Goal: confirm the public demo experience never breaks when no env is
configured.

1. Unset `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `UPSTASH_REDIS_REST_URL`,
   `UPSTASH_REDIS_REST_TOKEN`.
2. Run `npm run dev`.
3. Visit `/portal` — expect dashboard renders with sample data.
4. Visit `/ops/audit` — expect realistic demo audit events, KPI cards, and
   filters work. The "Demo events" badge should appear in the header.
5. From `/portal/offers` accept and counter an offer — expect 200 OK.
6. Tap accept rapidly (>20 in <60 s) — expect 429 with a
   `Retry-After` header eventually.

Pass: every page renders, no console errors mentioning missing env, no
500s in network tab.

---

## 2. CSRF / origin defenses

Goal: confirm cross-site write attempts are rejected before any state
mutates.

1. From a logged-in browser session, open DevTools Console on a page
   served by an unrelated origin (e.g. `https://example.com`).
2. Run:
   ```js
   await fetch('http://localhost:3000/api/portal/offers/accept', {
     method: 'POST',
     credentials: 'include',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ offerId: 'OFF-2026-001', actor: 'csrf-test' }),
   })
   ```
3. Expect HTTP 403 with `{ ok: false, reason: 'cross-site-fetch-metadata' }`.
4. In live Supabase mode, an `audit_events` row with
   `event_type='csrf_blocked'` should appear in `/ops/audit` within a
   few seconds.

---

## 3. Authz coverage

Goal: confirm portal routes return 401/403 with clean envelopes when an
unauthorized user tries to write.

1. As an unauthenticated user (clear cookies), call any portal write
   route — expect 401 and a structured error body.
2. As an authenticated `partner` user, call `/api/portal/offers/accept`
   for a case the partner is NOT a member of — expect 403 with
   `error: 'You do not have write access to the case for this offer'`.
3. In `/ops/audit`, both calls should appear with the matching event
   type and the correct case/offer scope.
4. Confirm there are NO 500 responses in any of these flows — RLS
   error strings must not leak.

---

## 4. Rate limiting — memory provider

Goal: confirm the in-memory provider keeps the existing
per-category behavior when no Upstash env is set.

1. Set the env so `selectProviderName()` returns `memory` (no
   `UPSTASH_REDIS_REST_URL`).
2. In a single browser session, accept-or-counter offers >20 times in
   <60 s. Expect a 429 response on the 21st attempt with a
   `Retry-After` header.
3. Wait for the window to elapse. Next request should succeed.
4. In `/ops/audit`, a `rate_limited` event should be present with
   `metadata.category=offer` and `metadata.limit=20`.

---

## 5. Rate limiting — Upstash provider

Goal: confirm the durable provider activates when env is configured and
that a transient Upstash failure degrades open without breaking the user.

1. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to a
   working Upstash Redis instance and restart `next dev`.
2. Make 21 accept calls within 60 s — expect 429 just like memory mode.
3. The 429 server log line should say `provider=upstash`.
4. Temporarily point `UPSTASH_REDIS_REST_URL` at a bogus host and make a
   request — server log should warn
   `[rate-limit] upstash transport failed — degrading open until recovery`
   and the request should succeed (degrade-open). Restore the env.
5. Run two `next dev` instances on different ports against the same
   Upstash credentials — verify the bucket is shared (the second
   instance enforces a 429 before its own 20 hits accumulate locally).

---

## 6. Audit console (`/ops/audit`)

Goal: confirm the security console renders, filters, and is privacy-safe.

1. Visit `/ops/audit`. KPI cards show counts and the "last Nh" window.
2. Change "Window" to 1h, 7d, 30d. URL updates and counts change.
3. Type `/api/portal/offers` in the route filter. Only matching rows
   stay visible.
4. Click an event card. The detail panel shows status, method, route,
   actor, IP/UA hashes, and metadata.
5. Inspect the page source — verify NO raw IPs, cookies, request
   bodies, or auth tokens appear. Hashes only.
6. As an authenticated non-admin user with live Supabase, the underlying
   `audit_events` SELECT should return 0 rows due to RLS — the page then
   falls back to the demo dataset (which is what the UX previewer wants
   anyway). Confirm the badge says "Demo events" not "Live audit_events".
7. As admin/ops with Supabase live, real denials triggered in steps
   2/3/4 above appear within a few seconds.

---

## 7. Append-only invariants

Goal: confirm trust receipts and audit events cannot be tampered with.

1. With service role + `psql`, run:
   ```sql
   UPDATE audit_events SET reason = 'tampered' WHERE audit_event_id = (
     SELECT audit_event_id FROM audit_events ORDER BY created_at DESC LIMIT 1
   );
   ```
   Expect: `ERROR: audit_events is append-only`.
2. Run:
   ```sql
   DELETE FROM audit_events;
   ```
   Expect the same error.
3. Repeat for `trust_receipts` (same trigger pattern).

---

## 8. Secret-leakage smoke check

1. `npm run build` and run `grep -r SUPABASE_SERVICE_ROLE_KEY .next/static`
   — expect zero hits.
2. Same for `UPSTASH_REDIS_REST_TOKEN`, `STRIPE_SECRET_KEY`,
   `PORTAL_AUDIT_SALT`.
3. View source on `/portal`, `/ops`, `/ops/audit` and search the
   bundle. Confirm no service-role-shaped JWTs (`eyJ…`) leak.

---

## Why no automated tests?

The project does not currently ship a test runner. Adding Vitest/Jest at
this point would add ~30 dev-deps and require new ESM/JSX configuration
plumbing for the App-Router-shaped modules under test, which is more
churn than the value gained for a single PR. The pure helpers added in
this branch (`checkCsrf`, `selectProviderName`, `actorRateKey`,
`filterAuditEvents`, `summarizeAuditEvents`, memory-provider
`consume`) are designed to be straight to retro-fit when the project
grows a runner — they take plain inputs, return plain outputs, and
have zero hidden state outside `globalThis` (which is reset-able via
`__resetRateLimitsForTests` and `__setRateLimitProviderForTests`).

When the team picks a runner the entry points to add first are:

- `_security.ts → checkCsrf` (origin / fetch-metadata branches)
- `_rate-limit.ts → selectProviderName` (env matrix)
- `_rate-limit.ts → memory provider consume()` (window reset, denial)
- `lib/data/audit.ts → filterAuditEvents / summarizeAuditEvents`

Until then, this manual checklist is the source of truth.
