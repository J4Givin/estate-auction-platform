# Portal Write Idempotency

This document explains how the estate-liquidity portal enforces at-most-once
execution for state-changing write actions, what clients should send, and how
operators can audit/replay events.

## Goals

- A retried write (network blip, double-click, mobile bounce) MUST NOT cause a
  second business-side mutation.
- Replays return the **exact same response** the first call produced.
- Replaying a key with a *different* request body is a **conflict**, not a
  silent overwrite.
- Idempotency is defense-in-depth on top of CSRF, authz, and rate limiting —
  if the persistence layer is unavailable, requests still succeed.

## Wire protocol

### Header (preferred)

```
POST /api/portal/offers/accept
Idempotency-Key: 8a3f3c54-3b8e-4f2c-9a01-7c0a6c0c5b71
Content-Type: application/json

{ "offerId": "OFR-12", "actor": "Sarah Mitchell" }
```

### Body fallback

If a tool can't send custom headers, the same key may be passed as
`idempotencyKey` in the JSON body. The server strips it before hashing the
request fingerprint so it doesn't pollute the hash.

### Without a key

Routes still work without a key (existing clients are unaffected). The server
will tag the response with `Idempotency-Status: bypassed` so audit/ops can
spot writes that bypass protection.

## Response semantics

| Situation | Status | Headers | Body |
|---|---|---|---|
| First successful call | route-defined (usually 200) | `Idempotency-Status: reserved` | route response |
| Replay, same body | route's original status | `Idempotent-Replay: true`, `Idempotency-Status: replayed` | cached response |
| Replay, different body | 409 | `Idempotency-Status: conflict` | `{ error, reason: "idempotency_key_reused_with_different_request" }` |
| Replay while still processing | 409 | `Idempotency-Status: in-progress`, `Retry-After: 2` | `{ error, reason: "idempotency_key_in_progress" }` |
| Persistence layer unavailable | route-defined | `Idempotency-Status: degraded` | route response (no idempotency enforced) |
| No key supplied | route-defined | `Idempotency-Status: bypassed` | route response (no idempotency enforced) |

A previously-failed request with the same key + same body is allowed to retry
(the row is reset to `processing`). Different body → conflict.

## Server architecture

```
src/app/api/portal/_idempotency.ts   # helper
src/app/api/portal/_helpers.ts       # beginIdempotency() wrapper
supabase/migrations/0006_idempotency_keys.sql
```

### Route order

```
1. enforceCsrf            cheap, no DB
2. parse + validate body  early reject on bad input
3. resolveActor           Supabase auth (RLS-scoped)
4. authorize              authz against case/item scope
5. enforceRateLimit       per-actor sliding window
6. beginIdempotency       reserve / replay / conflict
7. business write         actions.ts / trust.ts
8. idem.done(...)         persists cached response
```

Idempotency runs **after** rate limiting on purpose: an attacker without a
valid actor can't burn idempotency rows in the table. We tolerate the (very
small) cost of an extra DB write per legitimate request.

### Privacy

- Only a SHA-256 hash of (METHOD + path + normalized body) is stored. Raw
  request bodies, cookies, auth headers, and the key value itself are never
  stored.
- Cached `response_body` is the same JSON envelope the route would return on
  a fresh request. Routes must not put secrets in their successful response.
- A `sanitizeResponseForCache` belt-and-suspenders strip drops keys matching
  `cookie|authorization|secret|token|password` from the cached envelope.

### Demo mode

When Supabase env vars are absent, the helper uses an in-process map on
`globalThis` with the same semantics. Demo flows can therefore demonstrate
replay/conflict end-to-end without a database.

### Failure posture

Any DB failure during `beginIdempotency` degrades **open** — the route runs
without idempotency protection and tags the response with
`Idempotency-Status: degraded`. A transient blip should not break legitimate
customer writes.

## Client integration

The client helper at `src/lib/portal-client.ts` exposes:

- `newIdempotencyKey()` → UUID generated per click. Must be created at the
  moment of the user action (inside an `onClick` / async handler) so a
  retried fetch shares a key but distinct user clicks do not.
- `portalWrite(path, body, { idempotencyKey })` → thin `fetch` wrapper that
  always sends JSON and the `Idempotency-Key` header.

The helper does **not** persist keys to `localStorage`, `sessionStorage`,
`indexedDB`, or cookies. Idempotency keys are ephemeral; they live only in
component state/refs.

## Routes covered

All 11 portal write routes:

- `POST /api/portal/offers/accept` — scope `offer:accept`
- `POST /api/portal/offers/counter` — scope `offer:counter`
- `POST /api/portal/items/[itemId]/floor` — scope `item:floor`
- `POST /api/portal/items/[itemId]/disposition` — scope `item:disposition`
- `POST /api/portal/items/[itemId]/stop-sell` — scope `item:stop-sell`
- `POST /api/portal/items/[itemId]/expert-review` — scope `item:expert-review`
- `POST /api/portal/payouts/request` — scope `payout:request`
- `POST /api/portal/donations/routing` — scope `donation:routing`
- `POST /api/portal/capture/checklist` — scope `capture:checklist`
- `POST /api/portal/statements/request` — scope `statement:request`
- `POST /api/portal/trust-receipts` — scope `trust-receipt:create`

## Schema

See `supabase/migrations/0006_idempotency_keys.sql`. Highlights:

- Primary table `idempotency_keys`.
- Unique index on `(idempotency_key, scope, COALESCE(actor_user_id, '00…00'))`.
- `expires_at` defaults to 24h from creation; rows can be safely pruned by a
  scheduled job.
- RLS:
  - `SELECT` allowed for admin/ops profiles only.
  - `INSERT/UPDATE/DELETE` policies all `false` for end-user JWTs — only the
    service-role server helper can mutate the table.

## Smoke tests

Local (demo mode), with the dev server up:

```sh
KEY=$(uuidgen)

# First call → 200 (or whatever the route returns)
curl -i -X POST http://localhost:3000/api/portal/offers/accept \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -H "Sec-Fetch-Site: same-origin" \
  --cookie "demo=1" \
  -d '{"offerId":"OFR-12","actor":"Sarah"}'

# Replay → 200, Idempotent-Replay: true
curl -i -X POST http://localhost:3000/api/portal/offers/accept \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -H "Sec-Fetch-Site: same-origin" \
  --cookie "demo=1" \
  -d '{"offerId":"OFR-12","actor":"Sarah"}'

# Conflict (different body) → 409
curl -i -X POST http://localhost:3000/api/portal/offers/accept \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -H "Sec-Fetch-Site: same-origin" \
  --cookie "demo=1" \
  -d '{"offerId":"OFR-99","actor":"Sarah"}'
```

CSRF / origin protection still applies — these examples include
`Sec-Fetch-Site: same-origin` so the request passes the same-site gate when
issued from outside a browser.

## Migration order

Apply in numeric order:

```
001_initial_schema.sql
002_frd_schema.sql
0003_estate_liquidity_core.sql
0004_auth_rls_hardening.sql
0005_denied_action_audit.sql
0006_idempotency_keys.sql      <-- new
```

Each migration is additive and idempotent (DO blocks / IF NOT EXISTS).
