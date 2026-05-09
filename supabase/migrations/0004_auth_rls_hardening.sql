-- Estate Liquidity Platform — Auth + RLS Hardening
-- Migration 0004: Production-grade role-scoped access for the customer portal.
--
-- Companion to:
--   * supabase/migrations/0003_estate_liquidity_core.sql
--   * src/lib/data/auth.ts            (auth-aware server helpers)
--   * src/app/api/portal/_helpers.ts  (route authorization)
--
-- Design principles:
--   * RLS is the **last** line of defense. API routes ALSO authorize.
--   * Service role bypasses RLS — used only from server contexts that have
--     already authorized the actor.
--   * Append-only invariants on trust_receipts and ledger_entries are kept;
--     the existing trigger on trust_receipts is preserved.
--   * Demo mode (no Supabase env) does not run this migration; demo writes
--     never touch the database.
--
-- This migration is additive and idempotent — safe to re-run.

BEGIN;

-- ============================================================
-- ENUM: platform role
-- ============================================================
DO $$ BEGIN
  CREATE TYPE el_platform_role AS ENUM (
    'customer','ops','expert','admin','partner'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_membership_role AS ENUM (
    'owner','viewer','ops','expert','partner'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- user_profiles  — one row per Supabase auth user
-- ============================================================
-- Note: we don't FK to auth.users to keep this migration runnable in environments
-- where the auth schema isn't accessible to the migration role. The application
-- enforces user_id matches auth.uid() on insert.
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  email text,
  display_name text,
  platform_role el_platform_role NOT NULL DEFAULT 'customer',
  is_admin boolean NOT NULL DEFAULT false,
  org_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(platform_role);

-- ============================================================
-- case_memberships  — connects auth users to estate_cases with a role
-- ============================================================
CREATE TABLE IF NOT EXISTS case_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id text NOT NULL REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  role el_membership_role NOT NULL DEFAULT 'owner',
  invited_by uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, case_id, role)
);
CREATE INDEX IF NOT EXISTS idx_case_memberships_user ON case_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_case_memberships_case ON case_memberships(case_id);

-- ============================================================
-- expert_assignments  — which expert (auth user) is assigned to which item
-- ============================================================
CREATE TABLE IF NOT EXISTS expert_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  expert_id text REFERENCES expert_profiles(expert_id) ON DELETE SET NULL,
  item_id text REFERENCES inventory_items(item_id) ON DELETE CASCADE,
  case_id text REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  active boolean NOT NULL DEFAULT true,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);
CREATE INDEX IF NOT EXISTS idx_expert_assignments_user ON expert_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_expert_assignments_item ON expert_assignments(item_id);

-- ============================================================
-- partner_assignments  — which partner sees what (charity, channel, fulfillment)
-- ============================================================
CREATE TABLE IF NOT EXISTS partner_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  partner_kind text NOT NULL,                 -- charity | channel | fulfillment | dealer
  partner_ref text,                            -- e.g. CH-001, channel slug
  case_id text REFERENCES estate_cases(case_id) ON DELETE CASCADE,
  active boolean NOT NULL DEFAULT true,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, case_id, partner_kind, partner_ref)
);
CREATE INDEX IF NOT EXISTS idx_partner_assignments_user ON partner_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_assignments_case ON partner_assignments(case_id);

-- ============================================================
-- Actor identity columns on existing tables (additive, NULL-safe)
-- ============================================================
-- Each "decision/event" record gets an optional auth user_id alongside
-- the existing free-form `actor` text. This way historical seed rows
-- continue to work and the application can backfill auth identity going
-- forward.
ALTER TABLE item_decisions    ADD COLUMN IF NOT EXISTS actor_user_id uuid;
ALTER TABLE offer_decisions   ADD COLUMN IF NOT EXISTS actor_user_id uuid;
ALTER TABLE trust_receipts    ADD COLUMN IF NOT EXISTS actor_user_id uuid;
ALTER TABLE ops_events        ADD COLUMN IF NOT EXISTS actor_user_id uuid;
ALTER TABLE ledger_entries    ADD COLUMN IF NOT EXISTS actor_user_id uuid;
ALTER TABLE expert_queue_items ADD COLUMN IF NOT EXISTS actor_user_id uuid;
ALTER TABLE capture_checklist_state ADD COLUMN IF NOT EXISTS actor_user_id uuid;
ALTER TABLE donation_preferences ADD COLUMN IF NOT EXISTS actor_user_id uuid;
ALTER TABLE estate_cases      ADD COLUMN IF NOT EXISTS owner_user_id uuid;

-- ============================================================
-- Helper SECURITY DEFINER functions
-- ============================================================
-- These let RLS policies short-circuit cleanly without recursive policy lookups.

CREATE OR REPLACE FUNCTION el_is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin OR platform_role = 'admin'
     FROM user_profiles WHERE user_id = auth.uid() LIMIT 1),
    false
  );
$$;

CREATE OR REPLACE FUNCTION el_user_role()
RETURNS el_platform_role
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT platform_role FROM user_profiles WHERE user_id = auth.uid() LIMIT 1),
    'customer'::el_platform_role
  );
$$;

CREATE OR REPLACE FUNCTION el_user_case_ids()
RETURNS TABLE(case_id text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cm.case_id FROM case_memberships cm WHERE cm.user_id = auth.uid()
  UNION
  SELECT ea.case_id FROM expert_assignments ea WHERE ea.user_id = auth.uid() AND ea.case_id IS NOT NULL
  UNION
  SELECT pa.case_id FROM partner_assignments pa WHERE pa.user_id = auth.uid() AND pa.case_id IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION el_can_read_case(p_case_id text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR EXISTS (SELECT 1 FROM el_user_case_ids() x WHERE x.case_id = p_case_id);
$$;

CREATE OR REPLACE FUNCTION el_can_write_case(p_case_id text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR EXISTS (
      SELECT 1 FROM case_memberships cm
      WHERE cm.user_id = auth.uid()
        AND cm.case_id = p_case_id
        AND cm.role IN ('owner','ops')
    );
$$;

CREATE OR REPLACE FUNCTION el_can_read_item(p_item_id text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR EXISTS (
      SELECT 1 FROM inventory_items ii
      WHERE ii.item_id = p_item_id
        AND el_can_read_case(ii.case_id)
    )
    OR EXISTS (
      SELECT 1 FROM expert_assignments ea
      WHERE ea.user_id = auth.uid()
        AND ea.item_id = p_item_id
        AND ea.active
    );
$$;

-- ============================================================
-- Enable RLS on auth tables
-- ============================================================
ALTER TABLE user_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_memberships    ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_assignments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_profiles_self_read ON user_profiles;
CREATE POLICY user_profiles_self_read ON user_profiles
  FOR SELECT USING (user_id = auth.uid() OR el_is_admin());

DROP POLICY IF EXISTS user_profiles_self_upsert ON user_profiles;
CREATE POLICY user_profiles_self_upsert ON user_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS user_profiles_self_update ON user_profiles;
CREATE POLICY user_profiles_self_update ON user_profiles
  FOR UPDATE USING (user_id = auth.uid() OR el_is_admin())
  WITH CHECK (user_id = auth.uid() OR el_is_admin());

DROP POLICY IF EXISTS case_memberships_visibility ON case_memberships;
CREATE POLICY case_memberships_visibility ON case_memberships
  FOR SELECT USING (user_id = auth.uid() OR el_is_admin() OR el_user_role() IN ('ops','admin'));

DROP POLICY IF EXISTS expert_assignments_visibility ON expert_assignments;
CREATE POLICY expert_assignments_visibility ON expert_assignments
  FOR SELECT USING (user_id = auth.uid() OR el_is_admin() OR el_user_role() IN ('ops','admin'));

DROP POLICY IF EXISTS partner_assignments_visibility ON partner_assignments;
CREATE POLICY partner_assignments_visibility ON partner_assignments
  FOR SELECT USING (user_id = auth.uid() OR el_is_admin() OR el_user_role() IN ('ops','admin'));

-- ============================================================
-- Enable RLS on core tables
-- ============================================================
ALTER TABLE estate_cases       ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_decisions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_runs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_stages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_offers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_components   ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_decisions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_receipts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE statements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_rooms      ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_checklist_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_drafts     ENABLE ROW LEVEL SECURITY;
-- learning_metrics + learning_experiments stay open (internal-only telemetry).

-- ============================================================
-- estate_cases policies
-- ============================================================
DROP POLICY IF EXISTS estate_cases_read ON estate_cases;
CREATE POLICY estate_cases_read ON estate_cases
  FOR SELECT USING (el_can_read_case(case_id));

DROP POLICY IF EXISTS estate_cases_write ON estate_cases;
CREATE POLICY estate_cases_write ON estate_cases
  FOR UPDATE USING (el_can_write_case(case_id))
  WITH CHECK (el_can_write_case(case_id));

-- (Inserts of new estate_cases happen via service role onboarding flows.)

-- ============================================================
-- inventory_items policies
-- ============================================================
DROP POLICY IF EXISTS inventory_items_read ON inventory_items;
CREATE POLICY inventory_items_read ON inventory_items
  FOR SELECT USING (el_can_read_case(case_id) OR el_can_read_item(item_id));

DROP POLICY IF EXISTS inventory_items_write ON inventory_items;
CREATE POLICY inventory_items_write ON inventory_items
  FOR UPDATE USING (el_can_write_case(case_id))
  WITH CHECK (el_can_write_case(case_id));

-- ============================================================
-- item_decisions policies (append-only via app code)
-- ============================================================
DROP POLICY IF EXISTS item_decisions_read ON item_decisions;
CREATE POLICY item_decisions_read ON item_decisions
  FOR SELECT USING (el_can_read_item(item_id));

DROP POLICY IF EXISTS item_decisions_insert ON item_decisions;
CREATE POLICY item_decisions_insert ON item_decisions
  FOR INSERT WITH CHECK (
    el_can_write_case(
      (SELECT case_id FROM inventory_items ii WHERE ii.item_id = item_decisions.item_id)
    )
    OR (
      el_user_role() = 'expert'
      AND EXISTS (
        SELECT 1 FROM expert_assignments ea
        WHERE ea.user_id = auth.uid() AND ea.item_id = item_decisions.item_id AND ea.active
      )
    )
  );

-- ============================================================
-- appraisal_* policies — internal/expert authoring, customer read via case
-- ============================================================
DROP POLICY IF EXISTS appraisal_runs_read ON appraisal_runs;
CREATE POLICY appraisal_runs_read ON appraisal_runs
  FOR SELECT USING (
    item_id IS NULL OR el_can_read_item(item_id)
  );

DROP POLICY IF EXISTS appraisal_stages_read ON appraisal_stages;
CREATE POLICY appraisal_stages_read ON appraisal_stages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appraisal_runs r
      WHERE r.run_id = appraisal_stages.run_id
        AND (r.item_id IS NULL OR el_can_read_item(r.item_id))
    )
  );

DROP POLICY IF EXISTS appraisal_evidence_read ON appraisal_evidence;
CREATE POLICY appraisal_evidence_read ON appraisal_evidence
  FOR SELECT USING (
    el_is_admin()
    OR (subject_type = 'item' AND el_can_read_item(subject_id))
    OR (subject_type = 'case' AND el_can_read_case(subject_id))
    OR el_user_role() IN ('ops','admin','expert')
  );

-- Customers cannot author appraisal evidence directly. Service role / expert
-- review flows handle inserts.
DROP POLICY IF EXISTS appraisal_evidence_expert_insert ON appraisal_evidence;
CREATE POLICY appraisal_evidence_expert_insert ON appraisal_evidence
  FOR INSERT WITH CHECK (
    el_user_role() IN ('expert','ops','admin')
  );

-- ============================================================
-- cash_offers / offer_components / offer_decisions policies
-- ============================================================
DROP POLICY IF EXISTS cash_offers_read ON cash_offers;
CREATE POLICY cash_offers_read ON cash_offers
  FOR SELECT USING (case_id IS NULL OR el_can_read_case(case_id));

DROP POLICY IF EXISTS cash_offers_update ON cash_offers;
CREATE POLICY cash_offers_update ON cash_offers
  FOR UPDATE USING (case_id IS NULL OR el_can_write_case(case_id))
  WITH CHECK (case_id IS NULL OR el_can_write_case(case_id));

DROP POLICY IF EXISTS offer_components_read ON offer_components;
CREATE POLICY offer_components_read ON offer_components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cash_offers co
      WHERE co.offer_id = offer_components.offer_id
        AND (co.case_id IS NULL OR el_can_read_case(co.case_id))
    )
  );

DROP POLICY IF EXISTS offer_decisions_read ON offer_decisions;
CREATE POLICY offer_decisions_read ON offer_decisions
  FOR SELECT USING (
    case_id IS NULL OR el_can_read_case(case_id)
  );

DROP POLICY IF EXISTS offer_decisions_insert ON offer_decisions;
CREATE POLICY offer_decisions_insert ON offer_decisions
  FOR INSERT WITH CHECK (
    case_id IS NULL OR el_can_write_case(case_id)
  );

-- ============================================================
-- trust_receipts — append-only, broadly readable to scoped users
-- ============================================================
DROP POLICY IF EXISTS trust_receipts_read ON trust_receipts;
CREATE POLICY trust_receipts_read ON trust_receipts
  FOR SELECT USING (
    el_is_admin()
    OR (item_id IS NOT NULL AND el_can_read_item(item_id))
    OR (case_id IS NOT NULL AND el_can_read_case(case_id))
    OR (item_id IS NULL AND case_id IS NULL AND el_user_role() IN ('ops','admin'))
  );

DROP POLICY IF EXISTS trust_receipts_insert ON trust_receipts;
CREATE POLICY trust_receipts_insert ON trust_receipts
  FOR INSERT WITH CHECK (
    -- A user can append a receipt scoped to a case/item they can write to
    (case_id IS NOT NULL AND el_can_write_case(case_id))
    OR (item_id IS NOT NULL AND el_can_read_item(item_id) AND el_user_role() IN ('ops','admin','expert','customer'))
    OR el_is_admin()
  );

-- UPDATE/DELETE remain blocked by trust_receipts_block_mutation trigger from 0003.

-- ============================================================
-- ledger_entries — read scoped, no UPDATE/DELETE policy (insert-only)
-- ============================================================
DROP POLICY IF EXISTS ledger_entries_read ON ledger_entries;
CREATE POLICY ledger_entries_read ON ledger_entries
  FOR SELECT USING (
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR (case_id IS NOT NULL AND el_can_read_case(case_id) AND el_user_role() <> 'partner')
  );

DROP POLICY IF EXISTS ledger_entries_insert ON ledger_entries;
CREATE POLICY ledger_entries_insert ON ledger_entries
  FOR INSERT WITH CHECK (
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR (case_id IS NOT NULL AND el_can_write_case(case_id))
  );

-- ============================================================
-- statements — case-scoped read, customer/ops can request
-- ============================================================
DROP POLICY IF EXISTS statements_read ON statements;
CREATE POLICY statements_read ON statements
  FOR SELECT USING (case_id IS NULL OR el_can_read_case(case_id));

DROP POLICY IF EXISTS statements_insert ON statements;
CREATE POLICY statements_insert ON statements
  FOR INSERT WITH CHECK (case_id IS NULL OR el_can_write_case(case_id));

-- ============================================================
-- donation_preferences — customer + ops + admin
-- ============================================================
DROP POLICY IF EXISTS donation_prefs_read ON donation_preferences;
CREATE POLICY donation_prefs_read ON donation_preferences
  FOR SELECT USING (
    el_can_read_case(case_id)
    OR EXISTS (
      SELECT 1 FROM partner_assignments pa
      WHERE pa.user_id = auth.uid()
        AND pa.partner_kind = 'charity'
        AND pa.partner_ref = donation_preferences.charity_id
    )
  );

DROP POLICY IF EXISTS donation_prefs_write ON donation_preferences;
CREATE POLICY donation_prefs_write ON donation_preferences
  FOR INSERT WITH CHECK (el_can_write_case(case_id));

DROP POLICY IF EXISTS donation_prefs_update ON donation_preferences;
CREATE POLICY donation_prefs_update ON donation_preferences
  FOR UPDATE USING (el_can_write_case(case_id))
  WITH CHECK (el_can_write_case(case_id));

-- ============================================================
-- expert_profiles — broadly readable (marketplace listing)
-- ============================================================
DROP POLICY IF EXISTS expert_profiles_read ON expert_profiles;
CREATE POLICY expert_profiles_read ON expert_profiles
  FOR SELECT USING (true);

-- ============================================================
-- expert_queue_items — case scoped + assigned expert
-- ============================================================
DROP POLICY IF EXISTS expert_queue_read ON expert_queue_items;
CREATE POLICY expert_queue_read ON expert_queue_items
  FOR SELECT USING (
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR (item_id IS NOT NULL AND el_can_read_item(item_id))
    OR EXISTS (
      SELECT 1 FROM expert_assignments ea
      WHERE ea.user_id = auth.uid() AND ea.item_id = expert_queue_items.item_id AND ea.active
    )
  );

DROP POLICY IF EXISTS expert_queue_insert ON expert_queue_items;
CREATE POLICY expert_queue_insert ON expert_queue_items
  FOR INSERT WITH CHECK (
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR (item_id IS NOT NULL AND el_can_write_case(
      (SELECT case_id FROM inventory_items ii WHERE ii.item_id = expert_queue_items.item_id)
    ))
  );

DROP POLICY IF EXISTS expert_queue_update ON expert_queue_items;
CREATE POLICY expert_queue_update ON expert_queue_items
  FOR UPDATE USING (
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR EXISTS (
      SELECT 1 FROM expert_assignments ea
      WHERE ea.user_id = auth.uid() AND ea.item_id = expert_queue_items.item_id AND ea.active
    )
  )
  WITH CHECK (
    el_is_admin()
    OR el_user_role() IN ('ops','admin','expert')
  );

-- ============================================================
-- capture_rooms — case scoped
-- ============================================================
DROP POLICY IF EXISTS capture_rooms_read ON capture_rooms;
CREATE POLICY capture_rooms_read ON capture_rooms
  FOR SELECT USING (case_id IS NULL OR el_can_read_case(case_id));

DROP POLICY IF EXISTS capture_rooms_write ON capture_rooms;
CREATE POLICY capture_rooms_write ON capture_rooms
  FOR UPDATE USING (case_id IS NULL OR el_can_write_case(case_id))
  WITH CHECK (case_id IS NULL OR el_can_write_case(case_id));

DROP POLICY IF EXISTS capture_checklist_read ON capture_checklist_state;
CREATE POLICY capture_checklist_read ON capture_checklist_state
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM capture_rooms cr
      WHERE cr.room_id = capture_checklist_state.room_id
        AND (cr.case_id IS NULL OR el_can_read_case(cr.case_id))
    )
  );

DROP POLICY IF EXISTS capture_checklist_upsert ON capture_checklist_state;
CREATE POLICY capture_checklist_upsert ON capture_checklist_state
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM capture_rooms cr
      WHERE cr.room_id = capture_checklist_state.room_id
        AND (cr.case_id IS NULL OR el_can_write_case(cr.case_id))
    )
  );

DROP POLICY IF EXISTS capture_checklist_update ON capture_checklist_state;
CREATE POLICY capture_checklist_update ON capture_checklist_state
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM capture_rooms cr
      WHERE cr.room_id = capture_checklist_state.room_id
        AND (cr.case_id IS NULL OR el_can_write_case(cr.case_id))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM capture_rooms cr
      WHERE cr.room_id = capture_checklist_state.room_id
        AND (cr.case_id IS NULL OR el_can_write_case(cr.case_id))
    )
  );

-- ============================================================
-- compliance_checks / ops_events / channel_recommendations / listing_drafts
-- ============================================================
DROP POLICY IF EXISTS compliance_read ON compliance_checks;
CREATE POLICY compliance_read ON compliance_checks
  FOR SELECT USING (case_id IS NULL OR el_can_read_case(case_id));

DROP POLICY IF EXISTS compliance_write ON compliance_checks;
CREATE POLICY compliance_write ON compliance_checks
  FOR INSERT WITH CHECK (
    el_is_admin() OR el_user_role() IN ('ops','admin')
  );

DROP POLICY IF EXISTS ops_events_read ON ops_events;
CREATE POLICY ops_events_read ON ops_events
  FOR SELECT USING (
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR (case_id IS NOT NULL AND el_can_read_case(case_id))
  );

DROP POLICY IF EXISTS ops_events_insert ON ops_events;
CREATE POLICY ops_events_insert ON ops_events
  FOR INSERT WITH CHECK (
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR (case_id IS NOT NULL AND el_can_write_case(case_id))
  );

DROP POLICY IF EXISTS channel_reco_read ON channel_recommendations;
CREATE POLICY channel_reco_read ON channel_recommendations
  FOR SELECT USING (
    item_id IS NULL OR el_can_read_item(item_id)
  );

DROP POLICY IF EXISTS listing_drafts_read ON listing_drafts;
CREATE POLICY listing_drafts_read ON listing_drafts
  FOR SELECT USING (item_id IS NULL OR el_can_read_item(item_id));

DROP POLICY IF EXISTS listing_drafts_write ON listing_drafts;
CREATE POLICY listing_drafts_write ON listing_drafts
  FOR INSERT WITH CHECK (
    el_is_admin()
    OR el_user_role() IN ('ops','admin')
    OR (item_id IS NOT NULL AND el_can_write_case(
      (SELECT case_id FROM inventory_items ii WHERE ii.item_id = listing_drafts.item_id)
    ))
  );

-- ============================================================
-- Notes for operators
-- ============================================================
-- * The `service_role` key bypasses ALL of the above. Server-side admin and
--   onboarding flows continue to work transparently.
-- * The `anon` key sees nothing without a session, except expert_profiles
--   (intentionally public) and learning_* (telemetry-only).
-- * Every helper is SECURITY DEFINER + STABLE + search_path=public so
--   policies stay deterministic even when invoked across schemas.

COMMIT;
