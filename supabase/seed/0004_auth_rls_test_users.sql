-- Estate Liquidity Platform — Auth/RLS Test User Seed Helpers
-- Companion to: supabase/migrations/0004_auth_rls_hardening.sql
--
-- Supabase Auth users cannot be created via plain SQL in hosted environments.
-- The recommended flow is:
--   1. Create test users through the Supabase Dashboard / CLI / Admin API.
--   2. Capture their `auth.users.id` UUIDs.
--   3. Run the snippets below to link them to user_profiles + memberships.
--
-- The placeholder UUIDs (`00000000-0000-0000-0000-...`) MUST be replaced with
-- the real auth.users.id values from your project before running. The script
-- is a no-op without that substitution because the UNIQUE indexes will
-- collide on duplicates.
--
-- This file is *optional*. The application + demo mode never need it; it
-- exists to give a manual security test plan a quick reproducible setup.

BEGIN;

-- ----------------------------------------------------------------
-- 1) Customer (estate owner) — sees only JOB-2026-0418
-- ----------------------------------------------------------------
INSERT INTO user_profiles (user_id, email, display_name, platform_role, is_admin)
VALUES ('00000000-0000-0000-0000-000000000001',
        'customer.demo@example.com', 'Sarah Mitchell', 'customer', false)
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  platform_role = EXCLUDED.platform_role;

INSERT INTO case_memberships (user_id, case_id, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'JOB-2026-0418', 'owner')
ON CONFLICT (user_id, case_id, role) DO NOTHING;

-- ----------------------------------------------------------------
-- 2) Ops operator — sees + writes assigned cases
-- ----------------------------------------------------------------
INSERT INTO user_profiles (user_id, email, display_name, platform_role, is_admin)
VALUES ('00000000-0000-0000-0000-000000000002',
        'ops.demo@example.com', 'Maya Ops', 'ops', false)
ON CONFLICT (user_id) DO UPDATE SET platform_role = EXCLUDED.platform_role;

INSERT INTO case_memberships (user_id, case_id, role)
VALUES ('00000000-0000-0000-0000-000000000002', 'JOB-2026-0418', 'ops')
ON CONFLICT (user_id, case_id, role) DO NOTHING;

-- ----------------------------------------------------------------
-- 3) Expert appraiser — sees + reviews ITM-1041 only
-- ----------------------------------------------------------------
INSERT INTO user_profiles (user_id, email, display_name, platform_role, is_admin)
VALUES ('00000000-0000-0000-0000-000000000003',
        'expert.demo@example.com', 'Devi Patel', 'expert', false)
ON CONFLICT (user_id) DO UPDATE SET platform_role = EXCLUDED.platform_role;

INSERT INTO expert_assignments (user_id, item_id, case_id, active)
VALUES ('00000000-0000-0000-0000-000000000003', 'ITM-1041', 'JOB-2026-0418', true)
ON CONFLICT (user_id, item_id) DO UPDATE SET active = true;

-- ----------------------------------------------------------------
-- 4) Admin — full access
-- ----------------------------------------------------------------
INSERT INTO user_profiles (user_id, email, display_name, platform_role, is_admin)
VALUES ('00000000-0000-0000-0000-000000000004',
        'admin.demo@example.com', 'Alex Admin', 'admin', true)
ON CONFLICT (user_id) DO UPDATE SET
  is_admin = true, platform_role = 'admin';

-- ----------------------------------------------------------------
-- 5) Partner (charity) — only sees its own donation routing
-- ----------------------------------------------------------------
INSERT INTO user_profiles (user_id, email, display_name, platform_role, is_admin)
VALUES ('00000000-0000-0000-0000-000000000005',
        'partner.charity@example.com', 'Habitat Liaison', 'partner', false)
ON CONFLICT (user_id) DO UPDATE SET platform_role = EXCLUDED.platform_role;

INSERT INTO partner_assignments (user_id, partner_kind, partner_ref, case_id, active)
VALUES ('00000000-0000-0000-0000-000000000005', 'charity', 'CH-001', 'JOB-2026-0418', true)
ON CONFLICT (user_id, case_id, partner_kind, partner_ref) DO UPDATE SET active = true;

COMMIT;
