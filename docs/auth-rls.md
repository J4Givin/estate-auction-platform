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

---

## 6. CSRF / origin protection (migration 0005)

Portal API routes rely on Supabase cookie auth, which means a malicious
site could attempt cross-site requests that ride a victim's session
cookie. To close that gap, every state-changing `/api/portal/*` route
now runs a CSRF/origin check **before** any business logic, via the
centralized helper `src/app/api/portal/_security.ts`.

### What it checks

Only enforced on `POST | PATCH | PUT | DELETE`. `GET / HEAD / OPTIONS`
are passed through.

1. **Fetch Metadata wins when present.** If the browser sends
   `Sec-Fetch-Site: cross-site`, the request is blocked with `403`.
   `same-origin`, `same-site`, and `none` (direct navigation, curl) are
   allowed.
2. **Origin must match (or be trusted).** When `Origin` is present, it
   must equal the request's canonical origin
   (`X-Forwarded-Proto://X-Forwarded-Host`, falling back to `Host`) or
   appear in `PORTAL_TRUSTED_ORIGINS`.
3. **Missing Origin + missing Fetch Metadata = allowed.** This is the
   server-to-server / curl posture. Real browsers send `Origin` on
   state-changing methods, so this is intentionally a forgiving default
   for tooling, not a bypass for browsers.

### `PORTAL_TRUSTED_ORIGINS`

Comma-separated list of additional origins that are allowed to issue
state-changing requests with their own `Origin` header (for example, an
internal admin panel hosted on a different domain, or a Vercel preview
URL that needs to call production):

```bash
PORTAL_TRUSTED_ORIGINS="https://admin.example.com,https://preview.example.com"
```

Set this in your Vercel project as an environment variable for the
`Production` and `Preview` environments. Leave it empty for local dev —
same-origin checks are sufficient when you call `localhost:3000` from
itself.

### Denial response

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "ok": false,
  "error": "Cross-site or untrusted-origin request blocked",
  "reason": "cross-site-fetch-metadata"
}
```

`reason` is one of:

- `cross-site-fetch-metadata` — `Sec-Fetch-Site: cross-site`
- `origin-mismatch` — `Origin` header does not match request origin and
  is not in `PORTAL_TRUSTED_ORIGINS`
- `origin-not-trusted` — reserved for future use

## 7. Denied-action audit log (migration 0005)

Successful writes already have rich provenance via `item_decisions`,
`offer_decisions`, `ledger_entries`, and `trust_receipts`. The new
`audit_events` table captures the **denials** that those tables can't
see: 401 / 403 / 429 / CSRF blocks. This is the SIEM-style trail an
operator or auditor needs to see who tried what and was bounced.

### Table

`supabase/migrations/0005_denied_action_audit.sql` introduces:

| Column            | Notes                                                     |
|-------------------|-----------------------------------------------------------|
| `audit_event_id`  | uuid PK                                                   |
| `created_at`      | timestamptz                                               |
| `event_type`      | enum: `auth_required | forbidden | rate_limited | csrf_blocked` |
| `severity`        | enum: `info | warn | critical`                            |
| `route`           | request path (e.g. `/api/portal/payouts/request`)         |
| `method`          | HTTP method                                               |
| `status_code`     | 401 / 403 / 429                                           |
| `actor_user_id`   | Supabase user id when authenticated                       |
| `actor_label`     | email / display name fallback                             |
| `case_id`         | scoped resource when known                                |
| `item_id`         | scoped resource when known                                |
| `offer_id`        | scoped resource when known                                |
| `ip_hash`         | salted SHA-256 prefix (16 hex chars), never raw IP        |
| `user_agent_hash` | salted SHA-256 prefix (16 hex chars), never raw UA        |
| `reason`          | short operator-facing string                              |
| `metadata`        | jsonb (rate-limit category, csrf detail, etc.)            |

The table is **append-only** (UPDATE/DELETE blocked by trigger), with
RLS that allows `admin` / `ops` to SELECT and blocks all user INSERTs.
Writes go through the service-role server helper because denied
requests may not have a valid user JWT.

### Helper

`src/app/api/portal/_audit.ts` exposes:

- `logDeniedAction(req, input)` — low-level, never throws
- `auditAuthzDenied(req, { status, actor, reason, ... })`
- `auditRateLimited(req, { actor, denied, ... })`
- `auditCsrfDenied(req, { denied, actor })`

These are wired into `_helpers.ts` so the route-side call sites
(`rejectAuthz(...)`, `enforceRateLimit(...)`, `enforceCsrf(...)`)
automatically persist an audit event on denial. **Audit failures never
break the user-facing route response** — every write is wrapped in
try/catch and falls back to a structured `console.warn` line.

### `PORTAL_AUDIT_SALT`

Server-only env var. Used as a salt for IP / user-agent SHA-256 hashes:

```bash
PORTAL_AUDIT_SALT="long-random-string-rotated-with-secret-rotation"
```

Without a salt, hashes are still stable across requests but trivially
reversible. Set this in production. Rotating the salt invalidates
previous correlation but does not affect any table state.

### What is intentionally NOT logged

- Cookies (Supabase session, anything else)
- `Authorization` headers / bearer tokens
- Service-role keys
- Raw request bodies (would leak PII for offers, donations, payouts)
- Raw IP addresses or full user-agents — only salted hash prefixes
- Email addresses are stored in `actor_label` only because the actor
  has already been authenticated by Supabase; partner / cross-org
  identifiers are never inferred or attached

If a future security review needs body-level forensic logging, do it
at the load balancer / WAF tier with proper retention — not in
application code.

## 8. Manual verification checklist (CSRF + audit)

Run against `next dev`:

1. **Same-origin POST succeeds.** Submit any portal write from
   `http://localhost:3000` itself; expect `200`.
2. **Cross-site Fetch Metadata blocks.** Curl with
   `-H 'Sec-Fetch-Site: cross-site'` to any portal write route;
   expect `403` with `reason: cross-site-fetch-metadata`. In live
   mode, verify a row appears in `audit_events` with
   `event_type='csrf_blocked'`.
3. **Origin mismatch blocks.** Curl with
   `-H 'Origin: https://attacker.example'` to a portal write route;
   expect `403` with `reason: origin-mismatch`. Audit row recorded.
4. **Trusted origin allowed.** Set
   `PORTAL_TRUSTED_ORIGINS="https://attacker.example"`, restart, replay
   request 3; expect `200`. (Then revert.)
5. **Curl with no `Origin` header succeeds.** Confirm tooling traffic
   still works for ops/seed scripts.
6. **Repeated payout returns 429 + audit row.** Fire six payout
   requests within a minute; the sixth returns `429` and an
   `audit_events` row with `event_type='rate_limited'` and
   `metadata.category='payout'` is written.
7. **Unauthorized user → 403 + audit row.** Sign in as a user with no
   case access; POST a payout. Expect `403` and an `audit_events` row
   with `event_type='forbidden'` and `actor_user_id` populated.
8. **Anonymous user → 401 + audit row.** Without a session, POST a
   payout in live mode. Expect `401` and an `audit_events` row with
   `event_type='auth_required'` and `actor_user_id IS NULL`.
9. **Demo mode does not crash.** Unset `NEXT_PUBLIC_SUPABASE_URL`,
   restart, drive any portal write. Expect `200` and a
   structured `[audit] …` console line if any deny path triggers
   (e.g. CSRF). No DB write is attempted.

### Sample curl commands

```bash
# Cross-site Sec-Fetch-Site (should 403)
curl -i -X POST http://localhost:3000/api/portal/payouts/request \
  -H 'Content-Type: application/json' \
  -H 'Sec-Fetch-Site: cross-site' \
  -d '{"caseId":"JOB-2026-0418","amount":1000,"actor":"demo"}'

# Origin mismatch (should 403)
curl -i -X POST http://localhost:3000/api/portal/payouts/request \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://attacker.example' \
  -d '{"caseId":"JOB-2026-0418","amount":1000,"actor":"demo"}'

# Same-origin (should 200 in demo mode)
curl -i -X POST http://localhost:3000/api/portal/payouts/request \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:3000' \
  -d '{"caseId":"JOB-2026-0418","amount":1000,"actor":"demo"}'
```

## 9. Production deployment notes

In addition to migrating `0005_denied_action_audit.sql`:

- Set `PORTAL_AUDIT_SALT` (server-only).
- Set `PORTAL_TRUSTED_ORIGINS` to the canonical production origin(s)
  if you serve admin / preview from a different host.
- Pipe `[audit]` console lines into your log aggregator / SIEM. The
  format is `[audit] <event_type> status=… route=… method=… actor=… reason=…`.
- Replace the in-memory rate-limit bucket store (see Section 5).
- Periodically vacuum `audit_events` retention to your compliance
  window — the table is append-only by trigger, but operator ops
  (TRUNCATE via service role) are still possible if needed.
