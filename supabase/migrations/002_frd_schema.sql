-- Estate Auction Platform — FRD v1.1 Schema
-- Migration 002: Full-service estate liquidation tables
-- Depends on: 001_initial_schema.sql (users, orgs, org_memberships, shows, lots,
--             bids, auction_events, orders, lot_snapshots, outbox_events)

BEGIN;

-- ============================================================
-- ENUM TYPES (prefixed with frd_ to avoid Sprint-1 conflicts)
-- ============================================================

CREATE TYPE frd_lead_status AS ENUM (
  'new', 'contacted', 'qualified', 'scheduled', 'disqualified'
);

CREATE TYPE frd_job_status AS ENUM (
  'scheduled', 'onsite_capture', 'processing', 'review',
  'customer_approval', 'publishing', 'active_selling',
  'fulfillment', 'payout_pending', 'closed', 'hold', 'cancelled'
);

CREATE TYPE frd_job_strategy AS ENUM ('sell_fast', 'max_value');

CREATE TYPE frd_authority_doc_type AS ENUM (
  'executor_letter', 'trust_document', 'poa', 'court_order',
  'death_certificate', 'other'
);

CREATE TYPE frd_authority_doc_status AS ENUM (
  'pending', 'verified', 'needs_review', 'rejected'
);

CREATE TYPE frd_item_condition AS ENUM ('A', 'B', 'C', 'D');

CREATE TYPE frd_item_disposition AS ENUM (
  'sell', 'keep', 'donate', 'trash', 'auction'
);

CREATE TYPE frd_auth_status AS ENUM (
  'not_required', 'pending', 'in_progress', 'authenticated', 'inconclusive'
);

CREATE TYPE frd_catalog_item_status AS ENUM (
  'draft', 'pending_review', 'qa_required', 'approved',
  'listed', 'sold', 'hold', 'removed'
);

CREATE TYPE frd_channel AS ENUM (
  'storefront', 'ebay', 'facebook', 'etsy', 'offerup', 'auction'
);

CREATE TYPE frd_channel_listing_status AS ENUM (
  'draft', 'queued', 'published', 'edited', 'delisted',
  'error', 'suspended'
);

CREATE TYPE frd_pricing_event_type AS ENUM (
  'schedule', 'manual', 'promo', 'floor_enforced'
);

CREATE TYPE frd_comp_source AS ENUM (
  'ebay_sold', 'sothebys', 'christies', 'liveauctioneers', 'manual'
);

CREATE TYPE frd_fulfillment_type AS ENUM ('ship', 'pickup');

CREATE TYPE frd_sale_order_status AS ENUM (
  'created', 'paid', 'packed', 'shipped', 'delivered', 'closed',
  'return_requested', 'returned'
);

CREATE TYPE frd_ledger_entry_type AS ENUM (
  'sale', 'fee', 'adjustment', 'refund', 'payout', 'reserve'
);

CREATE TYPE frd_payout_status AS ENUM (
  'pending_settlement', 'eligible', 'queued', 'sent', 'reconciled'
);

CREATE TYPE frd_dispute_type AS ENUM (
  'ownership', 'damage', 'chargeback', 'return', 'legal_hold', 'prohibited'
);

CREATE TYPE frd_dispute_status AS ENUM (
  'open', 'investigating', 'hold', 'resolved', 'closed'
);

CREATE TYPE frd_partner_type AS ENUM (
  'realtor', 'mover', 'storage_facility', 'senior_transition',
  'probate_attorney', 'fiduciary', 'direct', 'other'
);

CREATE TYPE frd_partner_status AS ENUM ('active', 'inactive', 'pending');

CREATE TYPE frd_referral_status AS ENUM (
  'submitted', 'contacted', 'converted', 'paid', 'rejected'
);

CREATE TYPE frd_message_direction AS ENUM ('inbound', 'outbound');

CREATE TYPE frd_offer_status AS ENUM (
  'pending', 'accepted', 'countered', 'declined', 'expired'
);

-- ============================================================
-- SHARED TRIGGER FUNCTION: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION frd_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. LEADS
-- ============================================================

CREATE TABLE leads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status       frd_lead_status NOT NULL DEFAULT 'new',
  -- contact info
  first_name   text,
  last_name    text,
  email        text,
  phone        text,
  -- property info
  property_address  text,
  property_city     text,
  property_state    text,
  property_zip      text,
  property_type     text,
  estimated_items   integer,
  -- sourcing
  source       text,                 -- e.g. 'website', 'realtor', 'google_ads'
  referral_partner_id uuid,          -- FK added after partners table exists
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email) WHERE email IS NOT NULL;
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_referral_partner ON leads(referral_partner_id) WHERE referral_partner_id IS NOT NULL;

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 2. JOBS
-- ============================================================

CREATE TABLE jobs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id          uuid REFERENCES leads(id) ON DELETE SET NULL,
  org_id           uuid REFERENCES orgs(id) ON DELETE SET NULL,
  assigned_to      uuid REFERENCES users(id) ON DELETE SET NULL,
  status           frd_job_status NOT NULL DEFAULT 'scheduled',
  strategy         frd_job_strategy,
  -- coverage & item metrics
  coverage_score   numeric(5,2),      -- 0.00 – 100.00
  total_items      integer NOT NULL DEFAULT 0,
  items_cataloged  integer NOT NULL DEFAULT 0,
  items_listed     integer NOT NULL DEFAULT 0,
  items_sold       integer NOT NULL DEFAULT 0,
  -- financial totals (cents)
  gross_total_cents      bigint NOT NULL DEFAULT 0,
  fees_total_cents       bigint NOT NULL DEFAULT 0,
  net_total_cents        bigint NOT NULL DEFAULT 0,
  -- descriptive
  title            text,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_lead ON jobs(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX idx_jobs_assigned_to ON jobs(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_org ON jobs(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 3. JOB BOOKINGS
-- ============================================================

CREATE TABLE job_bookings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id           uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  scheduled_date   date NOT NULL,
  time_slot        text,             -- e.g. '09:00-12:00'
  -- address (may differ from lead property)
  address_line1    text NOT NULL,
  address_line2    text,
  city             text NOT NULL,
  state            text NOT NULL,
  zip              text NOT NULL,
  -- booking state
  confirmed        boolean NOT NULL DEFAULT false,
  reschedule_token text UNIQUE,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_bookings_job ON job_bookings(job_id);
CREATE INDEX idx_job_bookings_date ON job_bookings(scheduled_date);
CREATE INDEX idx_job_bookings_confirmed ON job_bookings(confirmed) WHERE confirmed = false;

CREATE TRIGGER trg_job_bookings_updated_at
  BEFORE UPDATE ON job_bookings
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 4. AUTHORITY DOCUMENTS
-- ============================================================

CREATE TABLE authority_documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  doc_type      frd_authority_doc_type NOT NULL,
  file_url      text NOT NULL,
  status        frd_authority_doc_status NOT NULL DEFAULT 'pending',
  verified_by   uuid REFERENCES users(id) ON DELETE SET NULL,
  verified_at   timestamptz,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_authority_documents_job ON authority_documents(job_id);
CREATE INDEX idx_authority_documents_status ON authority_documents(status);

CREATE TRIGGER trg_authority_documents_updated_at
  BEFORE UPDATE ON authority_documents
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 5. CATALOG ITEMS
-- ============================================================

CREATE TABLE catalog_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id           uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sku              text UNIQUE,
  title            text NOT NULL,
  description      text,
  category         text,
  room             text,
  -- condition & disposition
  condition        frd_item_condition,
  disposition      frd_item_disposition NOT NULL DEFAULT 'sell',
  -- media
  photos           jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- AI cataloging
  ai_confidence    float,
  -- pricing (cents)
  price_low_cents       bigint,
  price_med_cents       bigint,
  price_high_cents      bigint,
  price_floor_cents     bigint,
  price_list_cents      bigint,
  price_appraisal_cents bigint,
  -- flags
  is_high_value    boolean NOT NULL DEFAULT false,
  is_prohibited    boolean NOT NULL DEFAULT false,
  auth_required    boolean NOT NULL DEFAULT false,
  auth_status      frd_auth_status NOT NULL DEFAULT 'not_required',
  auth_notes       text,
  pickup_only      boolean NOT NULL DEFAULT false,
  -- bundling
  bundle_id        uuid,             -- self-referencing group identifier
  -- QA
  qa_assignee      uuid REFERENCES users(id) ON DELETE SET NULL,
  -- workflow
  status           frd_catalog_item_status NOT NULL DEFAULT 'draft',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_catalog_items_job ON catalog_items(job_id);
CREATE INDEX idx_catalog_items_status ON catalog_items(status);
CREATE INDEX idx_catalog_items_sku ON catalog_items(sku) WHERE sku IS NOT NULL;
CREATE INDEX idx_catalog_items_disposition ON catalog_items(disposition);
CREATE INDEX idx_catalog_items_category ON catalog_items(category) WHERE category IS NOT NULL;
CREATE INDEX idx_catalog_items_bundle ON catalog_items(bundle_id) WHERE bundle_id IS NOT NULL;
CREATE INDEX idx_catalog_items_qa_assignee ON catalog_items(qa_assignee) WHERE qa_assignee IS NOT NULL;
CREATE INDEX idx_catalog_items_high_value ON catalog_items(job_id) WHERE is_high_value = true;
CREATE INDEX idx_catalog_items_prohibited ON catalog_items(job_id) WHERE is_prohibited = true;

CREATE TRIGGER trg_catalog_items_updated_at
  BEFORE UPDATE ON catalog_items
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 6. CHANNEL LISTINGS
-- ============================================================

CREATE TABLE channel_listings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id  uuid NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  channel          frd_channel NOT NULL,
  status           frd_channel_listing_status NOT NULL DEFAULT 'draft',
  external_id      text,
  external_url     text,
  list_price_cents bigint,
  published_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_channel_listings_item ON channel_listings(catalog_item_id);
CREATE INDEX idx_channel_listings_channel ON channel_listings(channel);
CREATE INDEX idx_channel_listings_status ON channel_listings(status);
CREATE INDEX idx_channel_listings_external ON channel_listings(channel, external_id)
  WHERE external_id IS NOT NULL;

CREATE TRIGGER trg_channel_listings_updated_at
  BEFORE UPDATE ON channel_listings
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 7. PRICING EVENTS
-- ============================================================

CREATE TABLE pricing_events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id  uuid NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  event_type       frd_pricing_event_type NOT NULL,
  old_price_cents  bigint,
  new_price_cents  bigint NOT NULL,
  reason           text,
  triggered_by     uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pricing_events_item ON pricing_events(catalog_item_id);
CREATE INDEX idx_pricing_events_type ON pricing_events(event_type);
CREATE INDEX idx_pricing_events_created ON pricing_events(created_at);

CREATE TRIGGER trg_pricing_events_updated_at
  BEFORE UPDATE ON pricing_events
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 8. COMPS
-- ============================================================

CREATE TABLE comps (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id  uuid NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  source           frd_comp_source NOT NULL,
  title            text,
  sold_price_cents bigint,
  sold_date        date,
  condition        text,
  url              text,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_comps_item ON comps(catalog_item_id);
CREATE INDEX idx_comps_source ON comps(source);

CREATE TRIGGER trg_comps_updated_at
  BEFORE UPDATE ON comps
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 9. SALE ORDERS
-- ============================================================

CREATE TABLE sale_orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id     uuid NOT NULL REFERENCES catalog_items(id) ON DELETE RESTRICT,
  -- buyer info
  buyer_name          text,
  buyer_email         text,
  buyer_phone         text,
  -- channel & fulfillment
  channel             frd_channel,
  fulfillment_type    frd_fulfillment_type NOT NULL DEFAULT 'ship',
  status              frd_sale_order_status NOT NULL DEFAULT 'created',
  -- financials (cents)
  gross_cents         bigint NOT NULL DEFAULT 0,
  platform_fee_cents  bigint NOT NULL DEFAULT 0,
  shipping_cents      bigint NOT NULL DEFAULT 0,
  tax_cents           bigint NOT NULL DEFAULT 0,
  net_cents           bigint NOT NULL DEFAULT 0,
  -- shipping
  tracking_number     text,
  carrier             text,
  -- evidence
  evidence_photos     jsonb NOT NULL DEFAULT '[]'::jsonb,
  packing_slip_url    text,
  -- fraud
  fraud_check_status  text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sale_orders_item ON sale_orders(catalog_item_id);
CREATE INDEX idx_sale_orders_status ON sale_orders(status);
CREATE INDEX idx_sale_orders_buyer_email ON sale_orders(buyer_email) WHERE buyer_email IS NOT NULL;
CREATE INDEX idx_sale_orders_channel ON sale_orders(channel) WHERE channel IS NOT NULL;
CREATE INDEX idx_sale_orders_created ON sale_orders(created_at);

CREATE TRIGGER trg_sale_orders_updated_at
  BEFORE UPDATE ON sale_orders
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 10. LEDGER ENTRIES (append-only)
-- ============================================================

CREATE TABLE ledger_entries (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id                 uuid NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  entry_type             frd_ledger_entry_type NOT NULL,
  amount_cents           bigint NOT NULL,
  running_balance_cents  bigint NOT NULL,
  description            text,
  reference_id           uuid,        -- polymorphic ref to sale_order, payout, etc.
  approved_by            uuid REFERENCES users(id) ON DELETE SET NULL,
  dual_approved_by       uuid REFERENCES users(id) ON DELETE SET NULL,
  notes                  text,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ledger_entries_job ON ledger_entries(job_id);
CREATE INDEX idx_ledger_entries_type ON ledger_entries(entry_type);
CREATE INDEX idx_ledger_entries_reference ON ledger_entries(reference_id) WHERE reference_id IS NOT NULL;
CREATE INDEX idx_ledger_entries_created ON ledger_entries(created_at);

-- Append-only: forbid UPDATE and DELETE on ledger_entries
CREATE OR REPLACE FUNCTION frd_prevent_ledger_entries_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'ledger_entries is append-only: UPDATE and DELETE are forbidden';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ledger_entries_no_update
  BEFORE UPDATE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION frd_prevent_ledger_entries_mutation();

CREATE TRIGGER trg_ledger_entries_no_delete
  BEFORE DELETE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION frd_prevent_ledger_entries_mutation();

-- ============================================================
-- 11. PAYOUTS
-- ============================================================

CREATE TABLE payouts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id           uuid NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  status           frd_payout_status NOT NULL DEFAULT 'pending_settlement',
  amount_cents     bigint NOT NULL,
  method           text,             -- e.g. 'ach', 'check', 'wire'
  reference        text,             -- external payment reference
  sent_at          timestamptz,
  reconciled_at    timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payouts_job ON payouts(job_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_created ON payouts(created_at);

CREATE TRIGGER trg_payouts_updated_at
  BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 12. DISPUTES
-- ============================================================

CREATE TABLE disputes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id  uuid REFERENCES catalog_items(id) ON DELETE SET NULL,
  job_id           uuid REFERENCES jobs(id) ON DELETE SET NULL,
  dispute_type     frd_dispute_type NOT NULL,
  status           frd_dispute_status NOT NULL DEFAULT 'open',
  description      text,
  evidence_pack    jsonb NOT NULL DEFAULT '[]'::jsonb,
  stop_sell        boolean NOT NULL DEFAULT false,
  legal_hold       boolean NOT NULL DEFAULT false,
  resolution_notes text,
  resolved_by      uuid REFERENCES users(id) ON DELETE SET NULL,
  resolved_at      timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_disputes_item ON disputes(catalog_item_id) WHERE catalog_item_id IS NOT NULL;
CREATE INDEX idx_disputes_job ON disputes(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_type ON disputes(dispute_type);
CREATE INDEX idx_disputes_legal_hold ON disputes(job_id) WHERE legal_hold = true;
CREATE INDEX idx_disputes_stop_sell ON disputes(catalog_item_id) WHERE stop_sell = true;

CREATE TRIGGER trg_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 13. PARTNERS
-- ============================================================

CREATE TABLE partners (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type             frd_partner_type NOT NULL,
  -- contact info
  first_name       text,
  last_name        text,
  email            text,
  phone            text,
  company          text,
  -- terms
  commission_rate  numeric(5,4),     -- e.g. 0.0500 = 5%
  status           frd_partner_status NOT NULL DEFAULT 'pending',
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_partners_type ON partners(type);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_email ON partners(email) WHERE email IS NOT NULL;

CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- Now add the FK from leads to partners
ALTER TABLE leads
  ADD CONSTRAINT leads_referral_partner_fk
  FOREIGN KEY (referral_partner_id) REFERENCES partners(id) ON DELETE SET NULL;

-- ============================================================
-- 14. REFERRALS
-- ============================================================

CREATE TABLE referrals (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id       uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  job_id           uuid REFERENCES jobs(id) ON DELETE SET NULL,
  status           frd_referral_status NOT NULL DEFAULT 'submitted',
  referral_fee_cents bigint,
  paid_at          timestamptz,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_partner ON referrals(partner_id);
CREATE INDEX idx_referrals_job ON referrals(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX idx_referrals_status ON referrals(status);

CREATE TRIGGER trg_referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 15. AUDIT LOG (append-only)
-- ============================================================

CREATE TABLE audit_log (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type      text NOT NULL,
  entity_id        uuid NOT NULL,
  action           text NOT NULL,
  actor_user_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  old_values       jsonb,
  new_values       jsonb,
  ip_address       inet,
  user_agent       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_user_id) WHERE actor_user_id IS NOT NULL;
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- Append-only: forbid UPDATE and DELETE on audit_log
CREATE OR REPLACE FUNCTION frd_prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only: UPDATE and DELETE are forbidden';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_log_no_update
  BEFORE UPDATE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION frd_prevent_audit_log_mutation();

CREATE TRIGGER trg_audit_log_no_delete
  BEFORE DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION frd_prevent_audit_log_mutation();

-- ============================================================
-- 16. MESSAGES
-- ============================================================

CREATE TABLE messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id           uuid REFERENCES jobs(id) ON DELETE CASCADE,
  catalog_item_id  uuid REFERENCES catalog_items(id) ON DELETE SET NULL,
  direction        frd_message_direction NOT NULL,
  channel          text,             -- e.g. 'email', 'sms', 'in_app'
  sender_name      text,
  sender_contact   text,             -- email or phone
  subject          text,
  body             text,
  thread_id        text,
  sla_deadline     timestamptz,
  responded_at     timestamptz,
  template_used    text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_job ON messages(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX idx_messages_item ON messages(catalog_item_id) WHERE catalog_item_id IS NOT NULL;
CREATE INDEX idx_messages_thread ON messages(thread_id) WHERE thread_id IS NOT NULL;
CREATE INDEX idx_messages_direction ON messages(direction);
CREATE INDEX idx_messages_sla ON messages(sla_deadline) WHERE responded_at IS NULL AND sla_deadline IS NOT NULL;
CREATE INDEX idx_messages_created ON messages(created_at);

CREATE TRIGGER trg_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

-- ============================================================
-- 17. OFFERS
-- ============================================================

CREATE TABLE offers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id     uuid NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  -- buyer info
  buyer_name          text,
  buyer_email         text,
  buyer_phone         text,
  -- pricing (cents)
  offer_amount_cents  bigint NOT NULL,
  floor_price_cents   bigint,
  counter_amount_cents bigint,
  -- status
  status              frd_offer_status NOT NULL DEFAULT 'pending',
  approved_by         uuid REFERENCES users(id) ON DELETE SET NULL,
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_offers_item ON offers(catalog_item_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_buyer_email ON offers(buyer_email) WHERE buyer_email IS NOT NULL;
CREATE INDEX idx_offers_created ON offers(created_at);

CREATE TRIGGER trg_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION frd_set_updated_at();

COMMIT;
