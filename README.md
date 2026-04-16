# Estate Auction Platform

A production-grade live commerce platform for estate auctions — built with Next.js 14, Supabase, Ably, and Stripe Connect.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Realtime**: Ably (WebSocket channels with gap detection + polling fallback)
- **Payments**: Stripe Connect Express (destination charges, `capture_method=manual`)
- **Validation**: Zod
- **Auth**: Supabase Auth (JWT)
- **Deployment**: Vercel

## Architecture

### Lot State Machine (Server-Authoritative)

```
draft → queued → live_bidding → closing → sold_pending_payment | reserve_not_met | canceled | voided
sold_pending_payment → paid → fulfillment → completed
```

- Bids accepted ONLY in `live_bidding` state
- `closing` is a write barrier — no new bids
- Soft close extends `closes_at` but never changes state
- All state transitions are server-authoritative

### Bid Acceptance Algorithm

The bid route is the critical path. It uses a deterministic algorithm:

1. Lock lot row with `SELECT FOR UPDATE`
2. Validate lot status, closing time, bidder eligibility
3. Compute minimum required bid: `max(start_price, high_bid + increment)`
4. Idempotency check via `(lot_id, idempotency_key)` UNIQUE constraint
5. Increment canonical counters (`last_bid_seq`, `last_event_no`)
6. Insert bid, auction event, and soft-close extension if applicable
7. Write outbox events (NEVER publish to Ably inside the transaction)

### Close Algorithm

Winner determined by: `ORDER BY amount_cents DESC, server_received_at ASC, sequence_no ASC`

This ensures deterministic resolution: highest bid wins; ties broken by earliest server receipt, then by sequence number.

### Realtime (Ably)

Client reducer rules:
- Track `lastEventNo` per lot
- Sequential event (eventNo == lastEventNo + 1): apply and increment
- Duplicate/stale (eventNo <= lastEventNo): ignore
- Gap (eventNo > lastEventNo + 1): fetch from `/api/lots/:id/events?afterEventNo=`
- Falls back to polling if Ably unavailable

### Outbox Pattern

All mutations write events to `outbox_events` within the same DB transaction. A background worker publishes to Ably and marks them delivered. Retries up to 5 times; DLQ for poison events.

### Multi-Tenant

Every query includes `org_id` scoping. Every mutation verifies the acting user has a membership in the target org.

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/J4Givin/estate-auction-platform.git
cd estate-auction-platform
npm install
```

### 2. Environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `ABLY_API_KEY` | Ably API key |
| `NEXT_PUBLIC_ABLY_CLIENT_ID` | Ably client ID prefix |
| `NEXTAUTH_SECRET` | Random secret for auth |
| `NEXTAUTH_URL` | `http://localhost:3000` for local |

### 3. Database migration

Run the migration against your Supabase database:

```bash
# Using Supabase CLI
supabase db push

# Or manually via psql
psql $DATABASE_URL -f supabase/migrations/001_initial_schema.sql
```

### 4. Start development server

```bash
npm run dev
```

Open http://localhost:3000.

## Stripe Connect Setup

1. Create a Stripe account and enable Connect
2. Set your Stripe keys in `.env.local`
3. Navigate to `/onboarding/seller` to onboard an org
4. Configure your webhook endpoint: `https://your-domain.com/api/stripe/webhook`
5. Set up webhook for events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.dispute.created`

## Ably Setup

1. Create an Ably account
2. Create an app and get the API key
3. Set `ABLY_API_KEY` in `.env.local`
4. Token-based auth is handled via `/api/ably/token`

## Deployment to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Set all environment variables in Vercel project settings
4. Deploy — `vercel.json` is pre-configured

## Project Structure

```
├── supabase/migrations/     # PostgreSQL DDL
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Register, login
│   │   │   ├── orgs/        # Org CRUD + members
│   │   │   ├── shows/       # Show CRUD
│   │   │   ├── lots/        # Lot CRUD + start/bid/close/events
│   │   │   ├── ably/        # Token endpoint
│   │   │   ├── stripe/      # Connect onboard + webhook
│   │   │   └── outbox/      # Event publisher worker
│   │   ├── auth/            # Login/register pages
│   │   ├── dashboard/       # Org dashboard
│   │   ├── shows/           # Shows list + detail + live host view
│   │   ├── lots/            # Lot creation + detail + live bidder view
│   │   ├── onboarding/      # Stripe seller onboarding
│   │   └── admin/           # Admin panel
│   ├── components/
│   │   ├── auction/         # BidInput, BidHistory, LotCard, CountdownTimer
│   │   ├── layout/          # Navbar, Sidebar
│   │   └── ui/              # Radix + CVA primitives
│   ├── hooks/               # useAuction, useLot, useOrg
│   ├── lib/                 # Supabase clients, utils
│   └── types/               # TypeScript types + Zod schemas
├── .env.local.example
├── vercel.json
└── package.json
```

## Key Design Decisions

- **No ORM**: Raw Supabase queries for control over transaction isolation
- **Append-only tables**: `auction_events` and `lot_snapshots` have triggers preventing UPDATE/DELETE
- **Outbox pattern**: Ensures no realtime events lost if API crashes post-commit
- **Canonical counters**: `last_bid_seq` and `last_event_no` on the lot row provide gap-free sequencing
- **Manual capture**: Stripe PaymentIntents use `capture_method=manual` to hold funds without charging

## Sprint-1 Checklist

- [x] Deterministic bid acceptance under concurrency
- [x] Deterministic and idempotent close algorithm
- [x] Soft-close extends `closes_at` without changing state
- [x] Stripe webhook replay safety
- [x] Outbox with retries and DLQ
- [x] Append-only enforcement via triggers
- [x] Tenant scoping on all reads/writes
- [x] Realtime gap detection with resync
