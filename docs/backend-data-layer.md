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
| `readers.ts` | `getPortalOverview`, `getInventoryItems`, `getItemDetail`, `getOffers`, `getOfferStack`, `getLedger`, `getStatements`, `getDonations`, `getAppraisalRuns`, `getExperts`, `getCaptureState`, `getChannelRecommendations`, `getComplianceState`, `getOpsCommand`, `getInsights`, `getConcierge`, `getTrustReceipts`. Each tries Supabase, falls back to demo data, and never throws. |
| `actions.ts` | Validated write actions: `acceptCashOffer`, `counterOffer`, `setFloorPrice`, `changeDisposition`, `stopSell`, `requestPayout`, `updateDonationRouting`, `assignExpertReview`, `updateCaptureChecklist`. Every action emits a trust receipt as a side effect. |
| `trust.ts` | Append-only `createTrustReceipt`. In Supabase mode the row is INSERTed; the database trigger blocks UPDATE/DELETE. In demo mode receipts are kept in a session ring. |
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

## Next integration points

1. Replace the `null`-returning bodies in `readers.ts` with concrete Supabase
   queries once tables are populated. The fallback wrapper is already in
   place — no UI change is needed.
2. Enable RLS and add tenant-scoped policies (commented examples in the
   migration).
3. Hook the AI orchestrator into `ai.createAppraisalRun` →
   `ai.enqueueAgentStage` → `ai.persistEvidenceSnapshot` →
   `ai.requireHumanValidation`.
4. Wire Stripe / ACH to the payout-request handler.
5. Promote `expert_queue_items` SLA breaches to ops events automatically.
