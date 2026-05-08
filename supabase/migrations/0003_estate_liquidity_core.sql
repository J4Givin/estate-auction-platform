-- Estate Liquidity Platform — Customer Portal Core Schema
-- Migration 0003: Tables backing the elite customer portal data layer
-- Companion to: src/lib/data/*
--
-- Design principles:
--   * One row per case / item / event; JSONB used for flexible agent + scoring payloads.
--   * Trust receipts and ledger entries are append-only (no UPDATE / DELETE in app code).
--   * Indexes target the read patterns the customer portal exercises most:
--     case_id, item_id, status, created_at, queue state.
--
-- This migration runs additively; it does not touch sprint-1/FRD tables.

BEGIN;

-- ============================================================
-- ENUM types
-- ============================================================

DO $$ BEGIN
  CREATE TYPE el_disposition AS ENUM (
    'undecided','sell_managed','sell_to_platform','store','donate','keep','dispose'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_item_status AS ENUM (
    'captured','ai_review','human_review','authenticated','listed',
    'sold','donated','stored','on_hold'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_confidence AS ENUM ('high','medium','low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_offer_status AS ENUM ('live','expiring','accepted','declined','countered');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_ledger_type AS ENUM (
    'sale','fee','reserve','payout','payout_request','donation','storage','refund'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_receipt_kind AS ENUM (
    'appraisal','listing','price_drop','donation','payout',
    'disposal','stop_sell','authentication','storage'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_agent_stage AS ENUM (
    'classify','condition','provenance','comps','liquidity','fraud','strategy','final'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_agent_state AS ENUM ('queued','running','done','human_review','blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_expert_status AS ENUM ('available','in_review','unavailable');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_expert_queue_state AS ENUM ('needed','assigned','in_review','verified','escalated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_capture_state AS ENUM ('incomplete','ready_for_ai','ai_review','human_review_required');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_safety_level AS ENUM ('green','yellow','red');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- estate_cases
-- ============================================================
CREATE TABLE IF NOT EXISTS estate_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text UNIQUE NOT NULL,         -- e.g. JOB-2026-0418
  estate_name text NOT NULL,
  org_id uuid,
  primary_contact text,
  charity_id text,
  cash_offer_available_cents bigint DEFAULT 0,
  cash_offer_expires timestamptz,
  estimated_net_low_cents bigint DEFAULT 0,
  estimated_net_high_cents bigint DEFAULT 0,
  proceeds_to_date_cents bigint DEFAULT 0,
  reserved_for_fees_cents bigint DEFAULT 0,
  available_for_payout_cents bigint DEFAULT 0,
  donations_to_date_cents bigint DEFAULT 0,
  storage_monthly_cost_cents bigint DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_estate_cases_status ON estate_cases(status);
CREATE INDEX IF NOT EXISTS idx_estate_cases_created_at ON estate_cases(created_at DESC);
ALTER TABLE estate_cases ADD COLUMN IF NOT EXISTS charity_name text;

-- ============================================================
-- inventory_items
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text UNIQUE NOT NULL,         -- e.g. ITM-1041
  case_id text NOT NULL REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  name text NOT NULL,
  room text,
  category text,
  estimate_low_cents bigint,
  estimate_high_cents bigint,
  cash_offer_cents bigint,
  floor_price_cents bigint,
  status el_item_status NOT NULL DEFAULT 'captured',
  disposition el_disposition NOT NULL DEFAULT 'undecided',
  confidence el_confidence,
  ai_rationale text,
  human_reviewed boolean NOT NULL DEFAULT false,
  reviewer jsonb,
  comps jsonb NOT NULL DEFAULT '[]'::jsonb,
  flags text[] NOT NULL DEFAULT '{}',
  channels text[] NOT NULL DEFAULT '{}',
  donation_suggested boolean NOT NULL DEFAULT false,
  storage_location text,
  evidence_snapshot text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inventory_items_case ON inventory_items(case_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_status ON inventory_items(status);
CREATE INDEX IF NOT EXISTS idx_inventory_items_disposition ON inventory_items(disposition);
CREATE INDEX IF NOT EXISTS idx_inventory_items_created_at ON inventory_items(created_at DESC);

-- ============================================================
-- item_decisions  (append-only)
-- ============================================================
CREATE TABLE IF NOT EXISTS item_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL REFERENCES inventory_items(item_id) ON DELETE CASCADE,
  decision_type text NOT NULL,          -- floor_price | disposition | stop_sell | counter ...
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor text NOT NULL,
  decided_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_item_decisions_item ON item_decisions(item_id, decided_at DESC);
CREATE INDEX IF NOT EXISTS idx_item_decisions_type ON item_decisions(decision_type);

-- ============================================================
-- appraisal_runs / stages / evidence
-- ============================================================
CREATE TABLE IF NOT EXISTS appraisal_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id text UNIQUE NOT NULL,
  item_id text REFERENCES inventory_items(item_id) ON DELETE SET NULL,
  item_name text,
  category text,
  started_by text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'queued',
  final_confidence numeric(4,3),
  final_estimate_low_cents bigint,
  final_estimate_high_cents bigint,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_appraisal_runs_item ON appraisal_runs(item_id);
CREATE INDEX IF NOT EXISTS idx_appraisal_runs_status ON appraisal_runs(status);
CREATE INDEX IF NOT EXISTS idx_appraisal_runs_started ON appraisal_runs(started_at DESC);

CREATE TABLE IF NOT EXISTS appraisal_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id text UNIQUE NOT NULL,
  run_id text NOT NULL REFERENCES appraisal_runs(run_id) ON DELETE CASCADE,
  stage el_agent_stage NOT NULL,
  state el_agent_state NOT NULL DEFAULT 'queued',
  confidence numeric(4,3),
  output text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  next_action text,
  human_trigger text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  queued_at timestamptz NOT NULL DEFAULT now(),
  ran_at timestamptz,
  duration_ms integer
);
CREATE INDEX IF NOT EXISTS idx_appraisal_stages_run ON appraisal_stages(run_id);
CREATE INDEX IF NOT EXISTS idx_appraisal_stages_state ON appraisal_stages(state);
ALTER TABLE appraisal_stages ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE appraisal_stages ADD COLUMN IF NOT EXISTS one_line text;

CREATE TABLE IF NOT EXISTS appraisal_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id text UNIQUE NOT NULL,
  subject_type text NOT NULL,           -- item | case | offer | capture | expert_review
  subject_id text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_appraisal_evidence_subject ON appraisal_evidence(subject_type, subject_id);

-- ============================================================
-- cash_offers / offer_components / offer_decisions
-- ============================================================
CREATE TABLE IF NOT EXISTS cash_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id text UNIQUE NOT NULL,
  case_id text REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  scope text NOT NULL,                  -- estate | lot | category | item
  scope_label text NOT NULL,
  amount_cents bigint NOT NULL,
  managed_net_low_cents bigint,
  managed_net_high_cents bigint,
  reserves_cents bigint DEFAULT 0,
  item_count integer NOT NULL DEFAULT 0,
  expires timestamptz,
  payout_eta text,
  description text,
  status el_offer_status NOT NULL DEFAULT 'live',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cash_offers_case ON cash_offers(case_id);
CREATE INDEX IF NOT EXISTS idx_cash_offers_status ON cash_offers(status);
CREATE INDEX IF NOT EXISTS idx_cash_offers_expires ON cash_offers(expires);

CREATE TABLE IF NOT EXISTS offer_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id text NOT NULL REFERENCES cash_offers(offer_id) ON DELETE CASCADE,
  label text NOT NULL,
  value_cents bigint NOT NULL,
  pct numeric(6,3),
  detail text,
  color text,
  position integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_offer_components_offer ON offer_components(offer_id);

CREATE TABLE IF NOT EXISTS offer_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id text NOT NULL REFERENCES cash_offers(offer_id) ON DELETE CASCADE,
  case_id text,
  decision text NOT NULL,               -- accepted | declined | countered
  counter_amount_cents bigint,
  message text,
  actor text NOT NULL,
  decided_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_offer_decisions_offer ON offer_decisions(offer_id, decided_at DESC);

-- ============================================================
-- trust_receipts (APPEND-ONLY)
-- ============================================================
CREATE TABLE IF NOT EXISTS trust_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id text UNIQUE NOT NULL,
  kind el_receipt_kind NOT NULL,
  item_id text,
  case_id text,
  title text NOT NULL,
  what text NOT NULL,
  why text NOT NULL,
  evidence text[] NOT NULL DEFAULT '{}',
  approver text NOT NULL,
  approver_role text NOT NULL,
  immutable_snapshot_id text,
  dispute_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trust_receipts_item ON trust_receipts(item_id);
CREATE INDEX IF NOT EXISTS idx_trust_receipts_case ON trust_receipts(case_id);
CREATE INDEX IF NOT EXISTS idx_trust_receipts_kind ON trust_receipts(kind);
CREATE INDEX IF NOT EXISTS idx_trust_receipts_created_at ON trust_receipts(created_at DESC);

-- Enforce append-only at the database level: block UPDATE / DELETE.
CREATE OR REPLACE FUNCTION trust_receipts_block_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'trust_receipts is append-only';
END $$;

DROP TRIGGER IF EXISTS trust_receipts_no_update ON trust_receipts;
CREATE TRIGGER trust_receipts_no_update
  BEFORE UPDATE OR DELETE ON trust_receipts
  FOR EACH ROW EXECUTE FUNCTION trust_receipts_block_mutation();

-- ============================================================
-- ledger_entries (append-only)
-- ============================================================
CREATE TABLE IF NOT EXISTS ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id text UNIQUE,
  case_id text REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  item_id text REFERENCES inventory_items(item_id) ON DELETE SET NULL,
  type el_ledger_type NOT NULL,
  description text,
  channel text,
  gross_cents bigint NOT NULL DEFAULT 0,
  fee_cents bigint NOT NULL DEFAULT 0,
  net_cents bigint NOT NULL DEFAULT 0,
  actor text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ledger_case ON ledger_entries(case_id);
CREATE INDEX IF NOT EXISTS idx_ledger_type ON ledger_entries(type);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at ON ledger_entries(created_at DESC);

-- ============================================================
-- donation_preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS donation_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text NOT NULL REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  charity_id text NOT NULL,
  charity_name text,
  ein text,
  selected boolean NOT NULL DEFAULT true,
  actor text,
  selected_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_donation_preferences_case ON donation_preferences(case_id);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_donation_preferences_case_charity
  ON donation_preferences(case_id, charity_id);
-- Optional metadata for richer charity rendering
ALTER TABLE donation_preferences ADD COLUMN IF NOT EXISTS mission text;
ALTER TABLE donation_preferences ADD COLUMN IF NOT EXISTS tax_receipts integer NOT NULL DEFAULT 0;
ALTER TABLE donation_preferences ADD COLUMN IF NOT EXISTS total_routed_cents bigint NOT NULL DEFAULT 0;

-- ============================================================
-- expert_profiles / expert_queue_items
-- ============================================================
CREATE TABLE IF NOT EXISTS expert_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id text UNIQUE NOT NULL,
  name text NOT NULL,
  specialty text,
  credential text,
  rating numeric(3,2),
  reviews_count integer NOT NULL DEFAULT 0,
  accuracy numeric(4,3),
  response_time text,
  status el_expert_status NOT NULL DEFAULT 'available',
  bio text,
  region text,
  hourly_rate_cents bigint,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_status ON expert_profiles(status);

CREATE TABLE IF NOT EXISTS expert_queue_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id text UNIQUE,
  item_id text REFERENCES inventory_items(item_id) ON DELETE CASCADE,
  expert_id text REFERENCES expert_profiles(expert_id) ON DELETE SET NULL,
  state el_expert_queue_state NOT NULL DEFAULT 'needed',
  sla_hours integer NOT NULL DEFAULT 48,
  notes text,
  actor text,
  queued_at timestamptz NOT NULL DEFAULT now(),
  assigned_at timestamptz,
  resolved_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_expert_queue_state ON expert_queue_items(state);
CREATE INDEX IF NOT EXISTS idx_expert_queue_item ON expert_queue_items(item_id);

-- ============================================================
-- capture_rooms / capture_checklist_state
-- ============================================================
CREATE TABLE IF NOT EXISTS capture_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text UNIQUE NOT NULL,
  case_id text REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  name text NOT NULL,
  items_expected integer DEFAULT 0,
  items_captured integer DEFAULT 0,
  coverage_score numeric(4,3) DEFAULT 0,
  missing_angles text[] NOT NULL DEFAULT '{}',
  quality_issues text[] NOT NULL DEFAULT '{}',
  pii_redacted integer NOT NULL DEFAULT 0,
  status el_capture_state NOT NULL DEFAULT 'incomplete',
  last_captured_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_capture_rooms_case ON capture_rooms(case_id);
CREATE INDEX IF NOT EXISTS idx_capture_rooms_status ON capture_rooms(status);

CREATE TABLE IF NOT EXISTS capture_checklist_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL REFERENCES capture_rooms(room_id) ON DELETE CASCADE,
  checklist_item_id text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  actor text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(room_id, checklist_item_id)
);
CREATE INDEX IF NOT EXISTS idx_capture_checklist_room ON capture_checklist_state(room_id);

-- ============================================================
-- compliance_checks
-- ============================================================
CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id text UNIQUE NOT NULL,
  case_id text REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  area text NOT NULL,
  state el_safety_level NOT NULL DEFAULT 'green',
  label text NOT NULL,
  detail text,
  evidence text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_compliance_case ON compliance_checks(case_id);
CREATE INDEX IF NOT EXISTS idx_compliance_state ON compliance_checks(state);

-- ============================================================
-- ops_events
-- ============================================================
CREATE TABLE IF NOT EXISTS ops_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE,
  case_id text REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  item_id text REFERENCES inventory_items(item_id) ON DELETE SET NULL,
  kind text NOT NULL,
  title text NOT NULL,
  detail text,
  status text NOT NULL DEFAULT 'ok',     -- ok | attention | blocked
  owner text,
  evidence text[] NOT NULL DEFAULT '{}',
  ts timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ops_events_case ON ops_events(case_id);
CREATE INDEX IF NOT EXISTS idx_ops_events_kind ON ops_events(kind);
CREATE INDEX IF NOT EXISTS idx_ops_events_ts ON ops_events(ts DESC);

-- ============================================================
-- channel_recommendations
-- ============================================================
CREATE TABLE IF NOT EXISTS channel_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text REFERENCES inventory_items(item_id) ON DELETE CASCADE,
  channel text NOT NULL,
  fit_score numeric(4,3),
  expected_days integer,
  expected_net_cents bigint,
  fee_pct numeric(5,4),
  policy_risk text,
  fulfillment_burden text,
  best_for text,
  notes text,
  recommended boolean NOT NULL DEFAULT false,
  scoring jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_channel_reco_item ON channel_recommendations(item_id);
CREATE INDEX IF NOT EXISTS idx_channel_reco_recommended ON channel_recommendations(recommended);

-- ============================================================
-- learning_metrics + experiments
-- ============================================================
CREATE TABLE IF NOT EXISTS learning_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id text UNIQUE NOT NULL,
  label text NOT NULL,
  value text,
  trend_up boolean,
  trend_pct numeric(6,2),
  description text,
  color text,
  measured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_learning_metrics_measured ON learning_metrics(measured_at DESC);

CREATE TABLE IF NOT EXISTS learning_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id text UNIQUE NOT NULL,
  name text NOT NULL,
  status text NOT NULL,
  uplift text,
  cohort text,
  color text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- statements (case-scoped financial statements)
-- ============================================================
CREATE TABLE IF NOT EXISTS statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id text UNIQUE NOT NULL,
  case_id text REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  period text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  net_cents bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ready',
  download_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_statements_case ON statements(case_id);
CREATE INDEX IF NOT EXISTS idx_statements_generated ON statements(generated_at DESC);

-- ============================================================
-- listing_drafts (AI generated)
-- ============================================================
CREATE TABLE IF NOT EXISTS listing_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id text UNIQUE NOT NULL,
  item_id text REFERENCES inventory_items(item_id) ON DELETE CASCADE,
  channel text NOT NULL,
  title text,
  description text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  approved_by text
);
CREATE INDEX IF NOT EXISTS idx_listing_drafts_item ON listing_drafts(item_id);

-- ============================================================
-- RLS scaffolding (commented for opt-in)
-- ============================================================
-- ALTER TABLE estate_cases       ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_items    ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE item_decisions     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cash_offers        ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE offer_decisions    ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE trust_receipts     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ledger_entries     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE donation_preferences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE expert_queue_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE capture_rooms      ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE compliance_checks  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ops_events         ENABLE ROW LEVEL SECURITY;
--
-- Example policy (tenant-scoped read, server-only writes via service role):
--   CREATE POLICY est_case_owner_read ON estate_cases FOR SELECT
--     USING (org_id IN (SELECT org_id FROM org_memberships WHERE user_id = auth.uid()));

COMMIT;
