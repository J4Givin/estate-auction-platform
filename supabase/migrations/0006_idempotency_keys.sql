-- Estate Liquidity Platform — Idempotency Keys
-- Migration 0006: At-most-once execution for portal write routes.
--
-- Companion to:
--   * src/app/api/portal/_idempotency.ts (centralized helper)
--   * docs/idempotency.md                (operator/runbook reference)
--
-- Design principles:
--   * Every state-changing portal route may carry an `Idempotency-Key`
--     header. If present, the helper reserves the key BEFORE the business
--     write, and replays the cached response on duplicates. Routes still
--     work without a key, preserving backwards compatibility.
--   * The reserved row records a SHA-256 hash of (method + path + JCS-like
--     normalized body). Raw bodies, headers, cookies, and secrets are NEVER
--     stored. The cached response body is the JSON envelope our route
--     returned — same exposure as a first-time HTTP response.
--   * Uniqueness is bound to (idempotency_key, scope, actor_user_id).
--     `scope` is the route key (e.g. `offer:accept`) and `actor_user_id` is
--     null for unauthenticated/demo callers — a deterministic pseudo-uuid
--     (all-zeros) keeps the unique index honest.
--   * Rows expire after `expires_at` (24h by default). A scheduled cleanup
--     can prune them; the helper itself does not depend on expiration to
--     enforce uniqueness.
--   * Service-role-only inserts/updates. RLS allows admin/ops SELECT for
--     forensic queries; nobody else can read.
--
-- This migration is additive and idempotent — safe to re-run.

BEGIN;

-- ============================================================
-- ENUM: idempotency status
-- ============================================================
DO $$ BEGIN
  CREATE TYPE el_idempotency_status AS ENUM (
    'processing',
    'completed',
    'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- idempotency_keys
-- ============================================================
CREATE TABLE IF NOT EXISTS idempotency_keys (
  idempotency_row_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  expires_at         timestamptz NOT NULL DEFAULT now() + interval '24 hours',

  -- Key + scope. The helper composes scope from a stable route slug like
  -- "offer:accept" so two routes can never collide on the same UUID key.
  idempotency_key    text NOT NULL,
  scope              text NOT NULL,

  -- Actor binding. `actor_user_id` is null for unauthenticated/demo
  -- callers; the unique index uses COALESCE so duplicate keys from anon
  -- callers still collide deterministically.
  actor_user_id      uuid,
  actor_label        text,

  -- SHA-256 hex of (method + path + normalized body). 64 chars.
  request_hash       text NOT NULL,

  -- Lifecycle.
  status             el_idempotency_status NOT NULL DEFAULT 'processing',
  response_status    smallint,
  response_body      jsonb,

  -- Optional resource refs for forensic indexing.
  case_id            text,
  item_id            text,
  offer_id           text
);

-- Uniqueness: a given (key, scope, actor) reserves exactly one slot.
-- COALESCE folds null actor into a sentinel uuid so anon collisions still
-- trigger the unique-violation path the helper relies on.
CREATE UNIQUE INDEX IF NOT EXISTS idempotency_keys_unique_idx
  ON idempotency_keys (
    idempotency_key,
    scope,
    COALESCE(actor_user_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

CREATE INDEX IF NOT EXISTS idempotency_keys_expires_at_idx ON idempotency_keys (expires_at);
CREATE INDEX IF NOT EXISTS idempotency_keys_actor_user_id_idx ON idempotency_keys (actor_user_id);
CREATE INDEX IF NOT EXISTS idempotency_keys_case_id_idx ON idempotency_keys (case_id);
CREATE INDEX IF NOT EXISTS idempotency_keys_item_id_idx ON idempotency_keys (item_id);

-- ============================================================
-- updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION idempotency_keys_set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER idempotency_keys_set_updated_at_trg
    BEFORE UPDATE ON idempotency_keys
    FOR EACH ROW EXECUTE FUNCTION idempotency_keys_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- RLS: admin/ops can read; nobody can write via end-user JWT.
-- ============================================================
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS idempotency_keys_select_admin_ops ON idempotency_keys;
CREATE POLICY idempotency_keys_select_admin_ops
  ON idempotency_keys FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
        AND (up.is_admin = true OR up.platform_role IN ('admin','ops'))
    )
  );

DROP POLICY IF EXISTS idempotency_keys_no_user_insert ON idempotency_keys;
CREATE POLICY idempotency_keys_no_user_insert
  ON idempotency_keys FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS idempotency_keys_no_user_update ON idempotency_keys;
CREATE POLICY idempotency_keys_no_user_update
  ON idempotency_keys FOR UPDATE
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS idempotency_keys_no_user_delete ON idempotency_keys;
CREATE POLICY idempotency_keys_no_user_delete
  ON idempotency_keys FOR DELETE
  USING (false);

COMMIT;
