-- Estate Auction Platform — Sprint-1 Schema
-- v1.1 — Canonical counters, append-only enforcement, outbox pattern

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('admin', 'seller', 'bidder', 'viewer');
CREATE TYPE lot_status AS ENUM (
  'draft','queued','live_bidding','closing',
  'sold_pending_payment','reserve_not_met','canceled','voided',
  'paid','fulfillment','completed'
);
CREATE TYPE order_status AS ENUM ('pending_payment','paid','canceled','refunded');

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text,
  stripe_customer_id text,
  payment_verified boolean NOT NULL DEFAULT false,
  banned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ORGS (tenancy)
-- ============================================================
CREATE TABLE orgs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  stripe_account_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE org_memberships (
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, user_id, role)
);

-- ============================================================
-- SHOWS
-- ============================================================
CREATE TABLE shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES orgs(id),
  title text NOT NULL,
  description text,
  scheduled_at timestamptz,
  stream_url text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- LOTS
-- ============================================================
CREATE TABLE lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES orgs(id),
  show_id uuid REFERENCES shows(id),
  title text NOT NULL,
  description text,
  condition_notes text,
  media_urls text[] DEFAULT '{}',
  appraisal_value_cents bigint,
  start_price_cents bigint NOT NULL DEFAULT 100,
  reserve_price_cents bigint,
  bid_increment_cents bigint NOT NULL DEFAULT 100,
  status lot_status NOT NULL DEFAULT 'draft',
  soft_close_enabled boolean NOT NULL DEFAULT true,
  soft_close_window_seconds integer NOT NULL DEFAULT 30,
  soft_close_extend_seconds integer NOT NULL DEFAULT 30,
  opens_at timestamptz,
  closes_at timestamptz,
  closed_at timestamptz,
  winner_user_id uuid REFERENCES users(id),
  winning_bid_id uuid, -- FK added after bids table
  current_high_bid_id uuid,
  last_bid_seq bigint NOT NULL DEFAULT 0,
  last_event_no bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lots_org_status ON lots(org_id, status);
CREATE INDEX idx_lots_show ON lots(show_id);
CREATE INDEX idx_lots_closes_at ON lots(closes_at) WHERE status = 'live_bidding';

-- ============================================================
-- BIDS
-- ============================================================
CREATE TABLE bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE RESTRICT,
  bidder_user_id uuid NOT NULL REFERENCES users(id),
  org_id uuid REFERENCES orgs(id),
  amount_cents bigint NOT NULL,
  sequence_no bigint NOT NULL,
  idempotency_key text NOT NULL,
  client_session_id text,
  client_sent_at timestamptz,
  server_received_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lot_id, sequence_no),
  UNIQUE (lot_id, idempotency_key)
);

CREATE INDEX idx_bids_lot ON bids(lot_id, amount_cents DESC, server_received_at ASC);

-- ============================================================
-- ADD winning_bid FK now that bids table exists
-- ============================================================
ALTER TABLE lots ADD CONSTRAINT lots_winning_bid_fk
  FOREIGN KEY (winning_bid_id) REFERENCES bids(id);

-- ============================================================
-- AUCTION EVENTS (append-only)
-- ============================================================
CREATE TABLE auction_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE RESTRICT,
  org_id uuid REFERENCES orgs(id),
  event_no bigint NOT NULL,
  event_type text NOT NULL,
  actor_user_id uuid REFERENCES users(id),
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lot_id, event_no)
);

CREATE INDEX idx_auction_events_lot ON auction_events(lot_id, event_no ASC);

-- Append-only trigger: forbid UPDATE and DELETE on auction_events
CREATE OR REPLACE FUNCTION prevent_auction_events_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'auction_events is append-only: UPDATE and DELETE are forbidden';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auction_events_no_update
  BEFORE UPDATE ON auction_events
  FOR EACH ROW EXECUTE FUNCTION prevent_auction_events_mutation();

CREATE TRIGGER trg_auction_events_no_delete
  BEFORE DELETE ON auction_events
  FOR EACH ROW EXECUTE FUNCTION prevent_auction_events_mutation();

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid NOT NULL UNIQUE REFERENCES lots(id),
  org_id uuid REFERENCES orgs(id),
  buyer_user_id uuid NOT NULL REFERENCES users(id),
  amount_cents bigint NOT NULL,
  status order_status NOT NULL DEFAULT 'pending_payment',
  stripe_payment_intent_id text UNIQUE,
  stripe_charge_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- LOT SNAPSHOTS (immutable, dispute-ready)
-- ============================================================
CREATE TABLE lot_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  snapshot_type text NOT NULL, -- 'opened' | 'closed' | 'manual'
  occurred_at timestamptz NOT NULL DEFAULT now(),
  payload jsonb NOT NULL
);

CREATE INDEX idx_lot_snapshots_lot_time ON lot_snapshots(lot_id, occurred_at DESC);

-- Append-only trigger: forbid UPDATE and DELETE on lot_snapshots
CREATE OR REPLACE FUNCTION prevent_lot_snapshots_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'lot_snapshots is append-only: UPDATE and DELETE are forbidden';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lot_snapshots_no_update
  BEFORE UPDATE ON lot_snapshots
  FOR EACH ROW EXECUTE FUNCTION prevent_lot_snapshots_mutation();

CREATE TRIGGER trg_lot_snapshots_no_delete
  BEFORE DELETE ON lot_snapshots
  FOR EACH ROW EXECUTE FUNCTION prevent_lot_snapshots_mutation();

-- ============================================================
-- OUTBOX EVENTS (for reliable event publishing)
-- ============================================================
CREATE TABLE outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid REFERENCES lots(id),
  channel text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  published boolean NOT NULL DEFAULT false,
  retry_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE INDEX idx_outbox_unpublished ON outbox_events(created_at) WHERE published = false;
