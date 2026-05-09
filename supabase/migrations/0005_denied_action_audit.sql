-- Estate Liquidity Platform — Denied-Action Audit Logging
-- Migration 0005: Persistent audit trail for security-relevant denials.
--
-- Companion to:
--   * src/app/api/portal/_audit.ts    (centralized audit helper)
--   * src/app/api/portal/_security.ts (CSRF/origin enforcement)
--   * docs/auth-rls.md                (operator/runbook reference)
--
-- Design principles:
--   * The audit table records DENIALS (401/403/429/CSRF), NOT every action.
--     Successful writes already have rich provenance via item_decisions,
--     offer_decisions, ledger_entries, and trust_receipts.
--   * No secrets, cookies, auth headers, or raw request bodies are stored.
--     Identifiers (case_id, item_id, offer_id) are stored when available;
--     IP and user-agent are stored as truncated/hash values from the app.
--   * Writes go through the service-role server helper because denied
--     requests may not have a valid user JWT.
--   * The table is append-only by trigger (UPDATE/DELETE blocked) so an
--     attacker who somehow lands a write cannot tamper with prior rows.
--
-- This migration is additive and idempotent — safe to re-run.

BEGIN;

-- ============================================================
-- ENUM: denied-action event type
-- ============================================================
DO $$ BEGIN
  CREATE TYPE el_audit_event_type AS ENUM (
    'auth_required',
    'forbidden',
    'rate_limited',
    'csrf_blocked'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE el_audit_severity AS ENUM (
    'info',
    'warn',
    'critical'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- audit_events
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_events (
  audit_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),

  event_type    el_audit_event_type NOT NULL,
  severity      el_audit_severity   NOT NULL DEFAULT 'warn',

  -- Request context (no secrets, no full PII).
  route         text NOT NULL,
  method        text NOT NULL,
  status_code   smallint NOT NULL,

  -- Best-effort actor context (may be null when unauthenticated).
  actor_user_id uuid,
  actor_label   text,

  -- Affected resource (may be null when not yet resolved).
  case_id       text,
  item_id       text,
  offer_id      text,

  -- Privacy-conscious identifiers — see _audit.ts for the hashing policy.
  ip_hash         text,
  user_agent_hash text,

  -- Free-form short reason + structured metadata for forensic queries.
  reason   text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS audit_events_created_at_idx       ON audit_events (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_event_type_idx       ON audit_events (event_type);
CREATE INDEX IF NOT EXISTS audit_events_actor_user_id_idx    ON audit_events (actor_user_id);
CREATE INDEX IF NOT EXISTS audit_events_case_id_idx          ON audit_events (case_id);
CREATE INDEX IF NOT EXISTS audit_events_route_idx            ON audit_events (route);

-- ============================================================
-- Append-only invariant
-- ============================================================
CREATE OR REPLACE FUNCTION audit_events_append_only() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only';
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER audit_events_no_update
    BEFORE UPDATE ON audit_events
    FOR EACH ROW EXECUTE FUNCTION audit_events_append_only();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER audit_events_no_delete
    BEFORE DELETE ON audit_events
    FOR EACH ROW EXECUTE FUNCTION audit_events_append_only();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- RLS: lock down to admin/ops reads, service-role-only writes.
-- ============================================================
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Admins / ops can read; everyone else gets nothing.
DROP POLICY IF EXISTS audit_events_select_admin_ops ON audit_events;
CREATE POLICY audit_events_select_admin_ops
  ON audit_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
        AND (up.is_admin = true OR up.platform_role IN ('admin','ops'))
    )
  );

-- No INSERT policy for end-users — service role bypasses RLS for writes.
DROP POLICY IF EXISTS audit_events_no_user_insert ON audit_events;
CREATE POLICY audit_events_no_user_insert
  ON audit_events FOR INSERT
  WITH CHECK (false);

COMMIT;
