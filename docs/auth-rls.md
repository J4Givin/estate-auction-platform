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
