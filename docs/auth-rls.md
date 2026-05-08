# Estate Liquidity Platform — Auth & RLS Reference

This document covers the production-grade authorization layer added in
migration `0004_auth_rls_hardening.sql` and the matching server helpers in
`src/lib/data/auth.ts`.

> **Demo mode is preserved.** When Supabase env vars are missing, the data
> layer falls back to bundled sample data and the auth layer returns a
> deterministic "demo actor". No request that worked in demo mode breaks.

---

## 1. Role model

| Platform role | Who                                  | Default scope |
|---------------|--------------------------------------|---------------|
| `customer`    | Estate owner / executor / heir       | Their own case(s) — read + write decisions, payouts, donation routing, statements |
| `ops`         | Internal operations                  | All cases they hold a `case_memberships` row for, plus broad ops/event surfaces |
| `expert`      | Appraiser / authentication specialist| Items they have an active `expert_assignments` row for; can author appraisal evidence and update queue items |
| `admin`       | Internal full-access operator        | Everything (`is_admin = true` OR `platform_role = 'admin'`) |
| `partner`     | Charity, channel, fulfillment, dealer| Records explicitly mapped via `partner_assignments`; no ledger access |

Role lives in `user_profiles.platform_role` (enum `el_platform_role`).
`user_profiles.is_admin` is a convenience flag mirrored into the RLS helpers.

## 2. Membership model

Three small tables connect `auth.users.id` → estate records:

- **`case_memberships`** — `(user_id, case_id, role)` where role is one of
  `owner | viewer | ops | expert | partner`. The "owner" role is the path the
  customer takes; "ops" is the in-house operator with case-level write access.
- **`expert_assignments`** — `(user_id, item_id, case_id, active)`. An expert
  can read assigned items + author expert-review evidence and queue updates.
- **`partner_assignments`** — `(user_id, partner_kind, partner_ref, case_id, active)`.
  Lets a charity (`partner_kind='charity'`, `partner_ref='CH-001'`) see only
  donation routing rows for the cases routed to it.

Every record-of-record has an additive `actor_user_id` column populated by
the API layer when an authenticated user takes the action. The historical
free-form `actor` text is preserved for human readability.

## 3. RLS policy summary

Tables with RLS enabled and a one-line policy summary:

| Table                       | Read                                                    | Write                                                                  |
|-----------------------------|---------------------------------------------------------|------------------------------------------------------------------------|
| `estate_cases`              | case member, ops, admin                                 | UPDATE only by `owner` membership / ops / admin                        |
| `inventory_items`           | case member, ops, admin, assigned expert                | UPDATE only by `owner` / ops / admin                                   |
| `item_decisions`            | item-readers                                            | INSERT only by `owner` / ops / admin or assigned expert                |
| `appraisal_runs`            | item-readers                                            | service-role / ops only                                                |
| `appraisal_stages`          | inherits `appraisal_runs` read                          | service-role / ops only                                                |
| `appraisal_evidence`        | scoped item/case readers + ops/admin/expert             | INSERT by ops / admin / expert (customers cannot author)               |
| `cash_offers`               | case member                                             | UPDATE by case owner / ops / admin                                     |
| `offer_components`          | inherits `cash_offers`                                  | service-role only                                                      |
| `offer_decisions`           | case member                                             | INSERT by case owner / ops / admin                                     |
| `trust_receipts`            | item/case readers + admin                               | INSERT by case owner / ops / admin / assigned expert; UPDATE/DELETE blocked by trigger |
| `ledger_entries`            | case member (NOT partners), ops, admin                  | INSERT by ops / admin / case owner                                     |
| `statements`                | case member                                             | INSERT by case owner / ops / admin                                     |
| `donation_preferences`      | case member + assigned charity partner                  | INSERT/UPDATE by case owner / ops / admin                              |
| `expert_profiles`           | public (marketplace listing)                            | service-role only                                                      |
| `expert_queue_items`        | item readers + assigned expert + ops/admin              | INSERT by ops/admin/case-owner; UPDATE by expert/ops/admin             |
| `capture_rooms`             | case member                                             | UPDATE by case owner / ops / admin                                     |
| `capture_checklist_state`   | inherits capture_rooms                                  | upsert by case owner / ops / admin                                     |
| `compliance_checks`         | case member                                             | INSERT by ops / admin                                                  |
| `ops_events`                | case member or ops/admin                                | INSERT by ops/admin/case-owner                                         |
| `channel_recommendations`   | item readers                                            | service-role only                                                      |
| `listing_drafts`            | item readers                                            | INSERT by ops/admin/case-owner                                         |

The helper functions used in policies are SQL `SECURITY DEFINER` and
defined in the same migration:

- `el_is_admin()`
- `el_user_role()`
- `el_user_case_ids()`
- `el_can_read_case(case_id)` / `el_can_write_case(case_id)`
- `el_can_read_item(item_id)`

Append-only invariant on `trust_receipts` is enforced by the
`trust_receipts_no_update` trigger (`BEFORE UPDATE OR DELETE → RAISE EXCEPTION`)
introduced in migration 0003 — this is **unchanged** by 0004.

## 4. Service-role usage rules

The service-role key bypasses every RLS policy. The platform uses it for:

1. **Server-side reads** behind already-authorized API endpoints (existing
   pattern in `src/lib/data/supabase-server.ts`).
2. **Onboarding / case provisioning** scripts that create the initial
   `estate_cases`, `case_memberships`, and `user_profiles` rows.
3. **Background AI / appraisal pipelines** that need to write
   `appraisal_runs`, `appraisal_stages`, `appraisal_evidence`,
   `channel_recommendations`, and `listing_drafts` without per-user JWT.

It is **never** sent to the browser. The build relies on Next's behavior of
only inlining `NEXT_PUBLIC_*` variables; `SUPABASE_SERVICE_ROLE_KEY` is
intentionally not prefixed.

The auth-aware helper `getActorContext()` does not use the service-role
client — it reads the Supabase session via the SSR cookie helper, so all
profile / membership lookups go through the user's own JWT and are
themselves RLS-protected.

## 5. Test user setup

`auth.users` cannot be created via plain SQL in hosted Supabase, so the
practical flow is:

1. Open the Supabase Dashboard → **Authentication → Users → Add user**.
   Create five test users with these emails:
   - `customer.demo@example.com`
   - `ops.demo@example.com`
   - `expert.demo@example.com`
   - `admin.demo@example.com`
   - `partner.charity@example.com`
2. Capture the `auth.users.id` UUIDs from the dashboard (or
   `select id, email from auth.users where email like '%@example.com'`).
3. Open `supabase/seed/0004_auth_rls_test_users.sql` and substitute the
   placeholder UUIDs (`00000000-...`) with the real IDs from step 2.
4. Run the modified seed file via `psql` or the Supabase SQL editor.

The seed wires:

- customer → `case_memberships(JOB-2026-0418, owner)`
- ops → `case_memberships(JOB-2026-0418, ops)`
- expert → `expert_assignments(ITM-1041)`
- admin → `user_profiles.is_admin = true`
- charity partner → `partner_assignments(charity, CH-001, JOB-2026-0418)`

## 6. Manual security test checklist

Sign in as each user and verify the following. Each step has the exact
SQL or API call to run.

### Customer A vs Customer B isolation

```sql
-- as customer A (JOB-2026-0418)
SELECT case_id, estate_name FROM estate_cases;            -- expect 1 row
SELECT item_id FROM inventory_items;                      -- only items in JOB-2026-0418

-- as customer B (no membership on JOB-2026-0418)
SELECT case_id FROM estate_cases WHERE case_id = 'JOB-2026-0418'; -- expect 0 rows
```

### Customer cannot edit appraisal evidence directly

```sql
-- as customer
INSERT INTO appraisal_evidence (snapshot_id, subject_type, subject_id, payload)
VALUES ('snap_test', 'item', 'ITM-1041', '{}'::jsonb);
-- expect: ERROR  permission denied / RLS policy violation
```

### Expert sees only assigned items

```sql
-- as expert (assigned to ITM-1041)
SELECT item_id FROM inventory_items;                       -- contains ITM-1041
INSERT INTO item_decisions (item_id, decision_type, payload, actor)
VALUES ('ITM-1041', 'expert_review', '{"verdict":"genuine"}', 'expert.demo');
-- expect: success

-- as expert, attempt other item
SELECT * FROM inventory_items WHERE item_id = 'ITM-1042';  -- 0 rows (unless case-readable)
```

### Partner cannot see ledger

```sql
-- as charity partner
SELECT * FROM ledger_entries LIMIT 1;                      -- expect 0 rows
SELECT * FROM donation_preferences WHERE charity_id = 'CH-001'; -- expect rows
```

### Ops can update operational fields

```sql
-- as ops
UPDATE inventory_items SET status = 'on_hold' WHERE item_id = 'ITM-1041';
-- expect: 1 row updated
```

### Admin sees everything

```sql
-- as admin
SELECT count(*) FROM estate_cases;        -- all rows
SELECT count(*) FROM ledger_entries;      -- all rows
SELECT count(*) FROM trust_receipts;      -- all rows
```

### Trust receipts cannot be updated or deleted

```sql
-- as ANY user, including admin and service role
UPDATE trust_receipts SET title = 'tampered' WHERE receipt_id = 'TR-...';
-- expect: ERROR  trust_receipts is append-only
DELETE FROM trust_receipts WHERE receipt_id = 'TR-...';
-- expect: ERROR  trust_receipts is append-only
```

### API authorization: 401 / 403

```bash
# Without Supabase session, in live mode (`NEXT_PUBLIC_SUPABASE_URL` set):
curl -s -X POST https://<host>/api/portal/payouts/request \
  -H 'content-type: application/json' \
  -d '{"caseId":"JOB-2026-0418","amount":100,"actor":"x"}'
# expect: 401 {"ok":false,"error":"Not authenticated", ...}

# With a session for a user who has no membership on JOB-2026-0418:
# expect: 403 {"ok":false,"error":"You cannot request a payout for this case", ...}

# In demo mode (no env vars): the route always succeeds with mode: "demo".
```

## 7. Common 401 / 403 troubleshooting

- **401 "Not authenticated" in live mode.** Cookies aren't reaching the
  route. Confirm the request goes through the Next middleware and that
  the browser has a `sb-access-token` cookie. The middleware in
  `src/lib/supabase/middleware.ts` runs `supabase.auth.getUser()` on every
  request; if it fails, the cookie is missing or expired.
- **403 even though the user is signed in.** The user has no
  `case_memberships` row for the requested `caseId`, or their
  `user_profiles.platform_role` is wrong. Run:
  ```sql
  SELECT platform_role, is_admin FROM user_profiles WHERE user_id = auth.uid();
  SELECT case_id, role FROM case_memberships WHERE user_id = auth.uid();
  ```
- **Empty result set in production but data exists.** Almost always RLS.
  Use the service-role client (server-only) or the test users above to
  confirm the row is present, then verify the policy predicate matches the
  user's profile.
- **`trust_receipts is append-only` when the migration runs twice.**
  Expected. Re-running migration 0003 is idempotent — UPDATE/DELETE on
  any row will always be blocked by design.

## 8. Production deployment checklist

- [ ] Apply migrations 0003 and 0004 in order.
- [ ] Verify RLS is enabled: `SELECT relrowsecurity FROM pg_class WHERE relname IN
      ('estate_cases','inventory_items','trust_receipts',...);` — all `t`.
- [ ] Create the production `user_profiles` rows for any internal staff
      with the correct `platform_role`.
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is set on the server runtime
      and absent from the browser bundle (`grep -r SUPABASE_SERVICE .next/static`
      should return nothing).
- [ ] Hit each `/api/portal/*` write route with curl as an unauthorized
      user; confirm 401/403.
- [ ] Run the seven manual security test checks in §6 against staging.
- [ ] Confirm the demo build still works locally with no env vars set.

---

## 9. Counter-offer authorization (offer → case resolution)

`POST /api/portal/offers/counter` (and `…/offers/accept`) historically took
the caller's `offerId` and only required *some* authenticated user. RLS
caught the rest: a customer in case A literally could not write a
`offer_decisions` row tagged with case B because the `WITH CHECK`
predicate would reject it.

That worked, but the failure surfaced as a Supabase RLS error rather than
a clean `403`. To produce the right HTTP code without leaking RLS error
strings, the route now resolves the offer's parent case **before** the
write:

1. `resolveOfferCaseId(offerId)` — server-side lookup against
   `cash_offers.case_id`, mirrors the existing `resolveItemCaseId(itemId)`.
2. `authorize(actor, c => canWriteCase(c, caseId))` — produces a clean
   `401`/`403` with no DB error in the body.
3. The action then runs and the DB-side RLS policy is the second line of
   defense.

In demo mode all of this short-circuits to "allow" so seeded flows still
work without env vars.

The same pattern hardens `/api/portal/offers/accept`: when the caller does
not supply a `caseId`, we resolve it from the offer row rather than
trusting the absence as "no scope".

## 10. Rate limiting for portal write routes

All `/api/portal/*` write routes now flow through a centralized rate
limiter at `src/app/api/portal/_rate-limit.ts`. The shape:

- **Sliding-window counter** keyed by `<category>:<actorKey>`.
- **`actorKey`** prefers the authenticated `userId`; falls back to the
  inbound `x-forwarded-for` / `x-real-ip` header in live mode and to a
  deterministic `demo:<actorLabel>` token in demo mode.
- **Per-category limits.** Money-movement and trust receipts are the
  tightest; the capture checklist is loosest because it fires on every
  field tap during a walkthrough.

| Category        | Default limit | Window | Routes                                                             |
|-----------------|---------------|--------|--------------------------------------------------------------------|
| `offer`         | 20            | 60 s   | `offers/accept`, `offers/counter`                                  |
| `item-write`    | 60            | 60 s   | `items/[itemId]/floor`, `…/disposition`, `…/stop-sell`             |
| `expert-review` | 30            | 60 s   | `items/[itemId]/expert-review`                                     |
| `payout`        | 5             | 60 s   | `payouts/request`                                                  |
| `donation`      | 10            | 60 s   | `donations/routing`                                                |
| `capture`       | 240           | 60 s   | `capture/checklist`                                                |
| `statement`     | 10            | 60 s   | `statements/request`                                               |
| `trust-receipt` | 30            | 60 s   | `trust-receipts`                                                   |

When a limit is hit the route returns:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42
Content-Type: application/json

{
  "ok": false,
  "error": "Too many requests. Please slow down and try again shortly.",
  "category": "payout",
  "retryAfterSeconds": 42,
  "limit": 5
}
```

Each limit hit also writes one `[rate-limit] denied …` line to server
logs — a minimal, dependency-free observability hook. Production
deployments should pipe this to a real logger / SIEM.

### ⚠️ Production caveat — single instance only

The bucket map lives in process memory (`globalThis.__portalRateLimitBuckets`).
On any multi-instance deployment (Vercel Functions, multiple Node
containers, Lambda concurrency) every instance keeps its own copy and the
effective per-user limit is `instances × limit`. Before relying on this
in production, replace the in-memory bucket store with one of:

- **Upstash Redis** (`@upstash/ratelimit`) — drop-in token bucket / sliding
  window with a hosted Redis. Simplest path on Vercel.
- **Self-hosted Redis** behind the API runtime — same library as above
  but pointing at your own Redis.
- **Supabase RPC** that does an atomic `INSERT … ON CONFLICT DO UPDATE`
  on a `rate_limit_buckets` table keyed by `(category, actor_key, window_start)`.
  Stays inside the existing trust boundary at the cost of a DB round-trip
  per write.

The shape of `enforceRateLimit(category, req, ctx)` is designed so the
swap is a one-file change: every route handler keeps the same call site.

### Manual verification checklist (rate limiting + counter-offer auth)

Run against `next dev`:

1. **Counter-offer requires case write access (live mode).** Sign in as
   user A who owns case `JOB-1`. POST
   `/api/portal/offers/counter` with an `offerId` whose `case_id` is
   `JOB-2`. Expect `403` with reason
   `"You do not have write access to the case for this offer"`.
2. **Counter-offer succeeds for the case owner.** Repeat as the owner of
   case `JOB-2`. Expect `200` with `ok: true`.
3. **Demo mode counter-offer.** Unset `NEXT_PUBLIC_SUPABASE_URL`,
   restart, POST a counter-offer. Expect `200` and a deterministic
   response.
4. **Payout request 429.** As a signed-in case owner, fire `POST
   /api/portal/payouts/request` six times within a minute. Expect the
   sixth to return `429` with `Retry-After`.
5. **Capture checklist tolerates burst.** As ops, fire 100 checklist
   updates back-to-back. Expect all `200` (limit is 240/min).
6. **Trust receipt log line on deny.** Fire >30 trust receipts in a
   minute and confirm a `[rate-limit] denied category=trust-receipt`
   line appears in server logs.

When all six pass the gap is closed for single-instance dev; production
still needs the durable backing store described above.
