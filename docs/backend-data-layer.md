# Backend Data Layer

The estate liquidity customer portal is fronted by a typed data-access layer
in [`src/lib/data`](../src/lib/data). It transparently switches between
Supabase-backed reads/writes and the in-repo demo dataset based on
environment configuration, so the app stays deployable with or without
production credentials.

## Modes

| Env vars present | Mode | Behavior |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `supabase` | Readers attempt Supabase queries; writers persist via `SUPABASE_SERVICE_ROLE_KEY`. Failures fall back gracefully. |
| Either missing | `demo` | All readers return `src/lib/sample-data.ts`; writers append to an in-memory ring of trust receipts and return deterministic mocks. |

`getDataMode()` and `isSupabaseConfigured()` are the single source of truth
for the rest of the app — never gate UI on raw `process.env` reads.

## Modules

| File | Responsibility |
| --- | --- |
| `env.ts` | Configuration detection and the `DataMode` type. |
| `types.ts` | Re-exports sample-data domain types and adds input/result envelopes for write actions and AI hooks. |
| `supabase-server.ts` | **Server-only** Supabase client factory (`'server-only'` import). Returns a service-role client when configured, anon client otherwise. Never imported into client bundles. |
| `mappers.ts` | Snake_case → camelCase row → domain mappers. The single boundary where shape translation happens. |
| `readers.ts` | `getPortalOverview`, `getEstateCase`, `getInventoryItems`, `getItemDetail`, `getOffers`, `getOfferStack`, `getLedger`, `getStatements`, `getDonations`, `getAppraisalRuns`, `getAppraisalRunForItem`, `getExperts`, `getCaptureState`, `getChannelRecommendations`, `getChannelMatrixForItem`, `getComplianceState`, `getOpsCommand`, `getInsights`, `getConcierge`, `getTrustReceipts`. Each runs a real Supabase query when configured, falls back to demo data on null/empty/error, and never throws. |
| `actions.ts` | Validated write actions: `acceptCashOffer`, `counterOffer`, `setFloorPrice`, `changeDisposition`, `stopSell`, `requestPayout`, `updateDonationRouting`, `assignExpertReview`, `updateCaptureChecklist`, `requestStatement`. Every action validates input via zod, persists the domain row (insert + side-effect update), appends a trust receipt, and returns a `WriteResult`. |
| `trust.ts` | Append-only `createTrustReceipt`. In Supabase mode the row is INSERTed (with `case_id`); the database trigger blocks UPDATE/DELETE. In demo mode receipts are kept in a session ring. |
| `ai.ts` | Integration hooks for AI orchestration: `createAppraisalRun`, `enqueueAgentStage`, `persistEvidenceSnapshot`, `requireHumanValidation`, `generateListingDraft`, `scoreChannelFit`, `createTrustReceipt`. Stubs persist when Supabase is configured. |
| `hooks.ts` | Client-side React hooks (`usePortalOverview`, `useInventory`, `useItemDetail`, `useOffers`, `useLedger`, `useDonations`, etc.) that seed with demo data and refresh from Supabase on mount. |

## Schema

See [`supabase/migrations/0003_estate_liquidity_core.sql`](../supabase/migrations/0003_estate_liquidity_core.sql).

Tables added:

- `estate_cases`
- `inventory_items`
- `item_decisions` (append-only)
- `appraisal_runs`, `appraisal_stages`, `appraisal_evidence`
- `cash_offers`, `offer_components`, `offer_decisions`
- `trust_receipts` (append-only via trigger)
- `ledger_entries`
- `donation_preferences`
- `expert_profiles`, `expert_queue_items`
- `capture_rooms`, `capture_checklist_state`
- `compliance_checks`
- `ops_events`
- `channel_recommendations`
- `learning_metrics`, `learning_experiments`
- `listing_drafts`

JSONB columns hold flexible agent payloads (`appraisal_stages.payload`),
channel scoring (`channel_recommendations.scoring`), and case metadata.
Indexes cover the read patterns the portal actually issues: `case_id`,
`item_id`, `status`, `created_at`, queue `state`.

RLS policies are scaffolded as comments at the bottom of the migration.
Enabling them is a deployment-time decision once auth context is wired
through to the readers.

## Trust receipts are append-only

`createTrustReceipt` never updates or deletes. The schema enforces this
at the DB layer with a `BEFORE UPDATE OR DELETE` trigger that raises
`trust_receipts is append-only`. If you need to retract a prior assertion,
write a new receipt referencing the old one — the audit trail must remain
complete.

Every `actions.*` mutation writes a receipt with:

- `actor` and `approverRole`
- `what` (action), `why` (rationale), `evidence` (snapshot refs)
- `immutableSnapshotId`
- `disputeUrl` where the customer can challenge

## API routes

Write actions are exposed under `/api/portal/*`:

- `POST /api/portal/offers/accept` — `{ offerId, caseId?, actor }`
- `POST /api/portal/offers/counter` — `{ offerId, counterAmount, message?, actor }`
- `POST /api/portal/items/[itemId]/disposition` — `{ disposition, actor, reason? }`
- `POST /api/portal/items/[itemId]/floor` — `{ floorPrice, actor }`
- `POST /api/portal/items/[itemId]/stop-sell` — `{ reason, actor, legalHold? }`
- `POST /api/portal/items/[itemId]/expert-review` — `{ expertId?, notes?, actor }`
- `POST /api/portal/payouts/request` — `{ caseId, amount, destination?, actor }`
- `POST /api/portal/donations/routing` — `{ caseId, charityId, actor }`
- `POST /api/portal/capture/checklist` — `{ roomId, checklistItemId, done, actor }`
- `POST /api/portal/statements/request` — `{ caseId, period, actor }`
- `POST /api/portal/trust-receipts` — generic receipt insertion

Every handler validates inputs with zod (in `actions.ts`) and returns a
`WriteResult` envelope: `{ ok, mode, data?, error?, trustReceiptId? }`.

## Demo mode behavior

- `getDataMode()` returns `'demo'`.
- All readers return the snapshots in `src/lib/sample-data.ts`.
- Trust receipts created during the session are prepended to the in-memory
  ring and returned by subsequent `getTrustReceipts()` calls.
- Write actions return `ok: true` with deterministic shapes so the UI can
  render confirmation/affordances without a backend.

## Bringing up live Supabase mode

### 1. Set environment

```bash
cp .env.local.example .env.local
# fill in:
#   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
#   SUPABASE_SERVICE_ROLE_KEY=...     # server-only — never exposed to client
```

The service role key is loaded **only** by `src/lib/supabase/server.ts` and
`src/lib/data/supabase-server.ts`. Both files are server-only — Next.js will
fail the build if any client component imports them.

### 2. Apply the migration

Using the Supabase CLI:

```bash
# From repo root:
supabase link --project-ref <ref>
supabase db push
# or, for a single migration file:
psql "$DATABASE_URL" -f supabase/migrations/0003_estate_liquidity_core.sql
```

Migrations 001/002/003 are independent — running 003 alone is safe.

### 3. Seed the demo scenario

```bash
psql "$DATABASE_URL" -f supabase/seed/0003_estate_liquidity_seed.sql
```

The seed is idempotent (`ON CONFLICT DO NOTHING` / `DO UPDATE`), so it is safe
to re-run during development. It populates:

- 1 estate case (Mitchell Estate / `JOB-2026-0418`)
- 7 capture rooms + checklist state
- 15 inventory items across categories (lighting, silver, furniture, watch, rugs, ceramics, textiles, donation candidates, locked items)
- 3 cash offers + 12 offer components
- 8 ledger entries + 3 statements
- 3 charity donation preferences
- 7 expert profiles + 4 queue items
- 2 appraisal runs + 16 stages
- 9 compliance checks + 10 ops events
- 15 channel recommendations across 5 items
- 8 learning metrics + 4 experiments
- 7 trust receipts (audit trail)

### 4. Verify live mode

Start the app and open `/portal/admin/data-status` (or any portal page). The
data-mode badge in the developer dock will show **`Supabase live`** if the env
vars are loaded. If a query returns empty/error, you'll see **`Demo fallback`**
instead — check the server console for the warning.

You can also confirm at the API level:

```bash
curl http://localhost:3000/api/portal/trust-receipts \
  -X POST -H 'content-type: application/json' \
  -d '{"kind":"appraisal","title":"Smoke test","what":"x","why":"y","approver":"dev","approverRole":"dev"}'
# response.mode === "supabase" → live; "demo" → fallback
```

### 5. Common troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Pages still show demo data after env set | Dev server caching | Restart `next dev`. |
| `relation "estate_cases" does not exist` | Migration not applied | Run step 2. |
| `permission denied for table` | Service role key missing | Set `SUPABASE_SERVICE_ROLE_KEY`. Anon key alone cannot write. |
| `trust_receipts is append-only` | Tried to UPDATE/DELETE | By design — write a new receipt instead. |
| Empty inventory page in live mode | No rows for case_id | Seed not run, or wrong `case_id`. |
| Service role key leaked to client | Imported `supabase-server.ts` from a client component | Move usage server-side; the `'server-only'` import will block the build. |

## Next integration points

1. Enable RLS and add tenant-scoped policies (commented examples in the
   migration).
2. Hook the AI orchestrator into `ai.createAppraisalRun` →
   `ai.enqueueAgentStage` → `ai.persistEvidenceSnapshot` →
   `ai.requireHumanValidation`.
3. Wire Stripe / ACH to the payout-request handler.
4. Promote `expert_queue_items` SLA breaches to ops events automatically.
