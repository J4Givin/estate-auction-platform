# Estate Liquidity Platform — Launch Readiness Checklist

Last updated by the visual-QA + production-readiness pass on
`estate-liquidity-ux-command-center` (PR #1).

This is the canonical answer to "what's done, what needs a real
environment to verify, and what's left." Each line is one decision.

## ✅ Completed (in-tree, verifiable from this branch)

### UX / mobile-native portal
- [x] Mobile-native customer portal (capture, inventory, offers, ledger,
      donations, appraisal, experts, channels, compliance, statements,
      receipts, item detail).
- [x] Ops command center (`/ops`, `/ops/command`, `/ops/insights`,
      `/ops/audit`, jobs, queue, publish, returns, fulfillment, messages,
      offers).
- [x] AppShell drawer/sidebar with dead-link cleanup so RSC prefetch
      doesn't 404 (verified by Playwright run, errors=0).
- [x] Mobile fixes from this pass:
      - capture checklist toggles bumped from 24×24 → 44×44 (native tap
        target).
      - ledger filter chips get `min-width: 44px` (no more 25-px-wide
        "All"/"Fee").
      - demo-mode middleware no longer crashes when Supabase env is
        missing (was returning 500 on every page).

### Data layer
- [x] Supabase schema migrations (`supabase/migrations/0003`–`0007`).
- [x] Live readers/writers in `src/lib/data/*` with demo fallback.
- [x] Seed data covering customer, ops, QA, partner, admin views.
- [x] Sample-data fixtures so the entire app browses end-to-end with no
      Supabase project attached.

### Auth & safety
- [x] Auth/RLS hardening (migration 0004).
- [x] Counter-offer case authorization on every portal write.
- [x] CSRF / origin protection (`src/app/api/portal/_security.ts`).
- [x] Denied-action audit logging (migration 0005).
- [x] Durable rate limiter with Upstash adapter
      (`src/app/api/portal/_rate-limit.ts`).
- [x] `/ops/audit` console reads denied-action audit rows.

### Idempotency
- [x] Centralized helper at `src/app/api/portal/_idempotency.ts` covering
      reserve / replay / in-progress / failed-retry / different-hash
      conflict / cookie-secret response sanitization, with an in-memory
      demo store and a Postgres-backed prod store.
- [x] Migration 0006 creates `idempotency_keys` with the unique index,
      RLS lockdown, and `updated_at` trigger.
- [x] **Migration 0007 (new this pass)** adds
      `cleanup_expired_idempotency_keys(max_rows)` SECURITY DEFINER
      function for scheduled pruning.
- [x] **Cleanup runners (new this pass):**
      - `scripts/idempotency-cleanup.mjs` — host crontab / GitHub
        Actions runner; exits 0 with a notice when no service-role key
        is present.
      - `src/app/api/cron/idempotency-cleanup/route.ts` — Vercel-cron
        compatible HTTP route, gated by `CRON_SECRET`.
- [x] **Vitest unit tests (new this pass)** in
      `tests/unit/idempotency.test.ts`:
      18 tests covering hash stability, key extraction, replay,
      in-progress conflict, different-hash conflict, failed retry, scope
      isolation, body-key fallback. Run with `npm test`.

### Visual QA & layout
- [x] **Playwright visual QA harness (new this pass)** at
      `tests/visual/`:
      - 18 routes × 5 viewports = 90 cases.
      - Captures full-page screenshots, console errors, 404s, horizontal
        overflow, sticky-bar obstruction, and mobile tap-target audit.
      - Output under `tests/visual/output/` (gitignored). JSON report at
        `tests/visual/output/findings.json`.
      - Run with `npm run qa:visual` against any base URL via
        `QA_BASE_URL`.
      - **Latest run on this branch: 90/90 passed, 0 errors.** 171
        advisory tap-target warnings, all on inline text links — not
        functional issues.

### Smoke tests
- [x] **Demo smoke test (new this pass):** `scripts/smoke-demo.mjs`
      verifies `/api/portal/data-mode` reports `demo`, all listed pages
      render 200, and an idempotency replay round-trip on
      `/api/portal/offers/accept` returns the cached envelope with
      `Idempotent-Replay: true`. **10/10 passing.**
- [x] **Live smoke test (new this pass):** `scripts/smoke-live.mjs`
      mirrors the demo script but expects `mode: supabase`. Skips
      gracefully (exit 0) when `SMOKE_BASE_URL` is unset, so demo CI
      doesn't flip red.
- [x] **`/api/portal/data-mode` endpoint (new this pass)** — server-side
      authoritative answer for monitors and CI.

### Docs
- [x] `docs/auth-rls.md`
- [x] `docs/backend-data-layer.md`
- [x] `docs/idempotency.md`
- [x] `docs/live-verification.md`
- [x] `docs/manual-qa-checklist.md`
- [x] `docs/responsive-qa.md`
- [x] **This file (`docs/launch-readiness-checklist.md`)**

## 🟡 Needs live environment verification (cannot be confirmed in-tree)

These all *should* work — they have unit and demo coverage — but a real
Supabase project + deploy is required to sign them off.

- [ ] Apply migrations 0003–0007 to a real Supabase project.
- [ ] Run `supabase/seed/*` against that project.
- [ ] Sign in as a real customer / ops / QA / admin user and verify RLS
      blocks cross-account reads/writes.
- [ ] Run `SMOKE_BASE_URL=https://… SMOKE_AUTH_COOKIE=… npm run
      smoke:live` against the deploy and confirm all 6 checks pass.
- [ ] Configure Upstash REST URL/token in env, confirm rate limiter
      switches off the in-process fallback, hit `/api/portal/*` >limit
      and observe 429 + audit row.
- [ ] Force a CSRF/origin failure and confirm the denied-action audit
      row lands.
- [ ] Drive an idempotency replay end-to-end through the real
      `idempotency_keys` table, including a concurrent two-writer race
      to confirm the unique index prevents duplicate work.
- [ ] Schedule the cleanup: either pg_cron schedule from
      migration 0007's commented block, or a Vercel cron entry that
      hits `/api/cron/idempotency-cleanup` with a `CRON_SECRET`.
- [ ] Browser bundle audit: confirm `.next/static/**` does not contain
      `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, or any non-`NEXT_PUBLIC_*`
      env. (`grep -r "$(echo $SUPABASE_SERVICE_ROLE_KEY)" .next/static`
      should return nothing.)

## 🔴 Remaining recommended phases

These are real product/engineering scopes, not single-PR cleanups. Each
warrants its own design.

1. **Real AI appraisal orchestration** — replace the simulated AI panel
   with a queue + worker hitting an inference provider, with confidence
   thresholds and human-review fallback already wired into the schema.
2. **Expert marketplace workflow** — booking, scope-of-work,
   deliverables, payouts. Schema stubs exist; UX stubs exist; the
   transactional layer doesn't.
3. **Photo / camera capture + PII redaction** — the `/portal/capture`
   page is UI-only. Needs a native bridge or PWA media capture, plus a
   server-side PII redactor (faces, IDs, addresses).
4. **Marketplace channel integrations** — eBay, Chairish, 1stDibs,
   etc. Channel matrix is in place; OAuth + listing payloads + status
   webhooks are not.
5. **Payments / payout processor** — Stripe Connect is wired for
   bidder side; seller-side payouts and tax forms are scaffolded only.
6. **Tax / donation receipt generation** — `/portal/receipts` renders
   the data; the PDF render + signed-URL delivery + 8283/8282
   compliance flow does not exist.
7. **Warehouse / fulfillment ops** — `/ops/fulfillment` lists orders;
   no scanner, manifest, or carrier handoff yet.
8. **Notification system** — email/SMS/push for offer events, capture
   gaps, expert messages. Outbox table exists; the dispatcher does not.
9. **Monitoring / SIEM** — denied-action audit feeds an internal
   console; export to Datadog / Splunk / Snowflake is not wired.
10. **Accessibility audit** — automated axe pass + manual screen-reader
    pass on the 18 portal/ops routes.
11. **Penetration test** — third-party engagement covering authn, RLS,
    CSRF, IDOR, rate-limit bypasses, idempotency replay attacks.
12. **Production deployment pipeline** — preview-per-PR, migration
    gating, secret rotation runbook, on-call rotation.

## Recommended next phase

**Live verification** (the 🟡 list above). Everything in green is
shippable on the same code path that demo runs on; the only thing left
between this branch and a real beta is a Supabase project, a deploy URL,
and one operator to walk the live smoke test.

After that: phase **3** (photo capture + PII) blocks real customer
intake more than anything else, and is the highest-impact remaining
piece of UX.
