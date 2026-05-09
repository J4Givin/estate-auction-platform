-- Estate Liquidity Platform — Idempotency cleanup function
-- Migration 0007: Companion to 0006_idempotency_keys.sql
--
-- Adds a simple SECURITY DEFINER function that prunes expired
-- idempotency rows. Intended for a scheduled job (Supabase pg_cron,
-- Vercel cron, GitHub Actions, etc.) — see scripts/idempotency-cleanup.mjs
-- for a runner that talks to this function via the service-role key.
--
-- Why a function (vs. ad-hoc DELETE):
--   * RLS forbids end-user DELETE. A SECURITY DEFINER function lets a
--     scheduled service-role caller invoke it with a single grant.
--   * Returning the affected count makes the job observable in logs.
--   * Future tweaks (batch size, age multiplier, archive-before-delete)
--     stay encapsulated in one place.
--
-- This migration is additive and idempotent — safe to re-run.

BEGIN;

CREATE OR REPLACE FUNCTION cleanup_expired_idempotency_keys(
  max_rows integer DEFAULT 10000
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  deleted integer;
BEGIN
  -- Hard bound on how much we delete per call so a long backlog doesn't
  -- block the row for minutes. Caller can re-invoke until 0.
  WITH victims AS (
    SELECT idempotency_row_id
    FROM idempotency_keys
    WHERE expires_at < now()
    ORDER BY expires_at ASC
    LIMIT GREATEST(max_rows, 1)
  )
  DELETE FROM idempotency_keys k
  USING victims v
  WHERE k.idempotency_row_id = v.idempotency_row_id;

  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$;

COMMENT ON FUNCTION cleanup_expired_idempotency_keys(integer)
  IS 'Delete idempotency_keys rows past expires_at. Returns number deleted. Bounded by max_rows.';

-- Lock down execution: only service-role / postgres can call. End users
-- never need this; their queries are scoped by RLS.
REVOKE ALL ON FUNCTION cleanup_expired_idempotency_keys(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION cleanup_expired_idempotency_keys(integer) FROM authenticated;
REVOKE ALL ON FUNCTION cleanup_expired_idempotency_keys(integer) FROM anon;

COMMIT;

-- ─────────────────────────────────────────────────────────────────
-- Optional pg_cron schedule (uncomment in Supabase SQL editor if
-- pg_cron is enabled on your project):
--
--   SELECT cron.schedule(
--     'idempotency-cleanup-hourly',
--     '17 * * * *',
--     $$ SELECT cleanup_expired_idempotency_keys(50000); $$
--   );
-- ─────────────────────────────────────────────────────────────────
