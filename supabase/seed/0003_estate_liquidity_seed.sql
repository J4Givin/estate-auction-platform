-- Estate Liquidity Platform — Seed Data
-- Companion to: supabase/migrations/0003_estate_liquidity_core.sql
--
-- Idempotent: every INSERT uses ON CONFLICT DO NOTHING (or DO UPDATE for
-- mutable fields), so this script is safe to re-run during development.
--
-- The seed mirrors the in-app demo (Mitchell Estate, JOB-2026-0418) closely
-- enough that the customer portal renders the same story whether reading
-- from Supabase or the bundled sample dataset.

BEGIN;

-- ============================================================
-- estate_cases
-- ============================================================
INSERT INTO estate_cases (
  case_id, estate_name, primary_contact, charity_id, charity_name,
  cash_offer_available_cents, cash_offer_expires,
  estimated_net_low_cents, estimated_net_high_cents,
  proceeds_to_date_cents, reserved_for_fees_cents, available_for_payout_cents,
  donations_to_date_cents, storage_monthly_cost_cents, status, metadata
) VALUES (
  'JOB-2026-0418', 'Mitchell Estate', 'Sarah Mitchell', 'CH-001', 'Habitat for Humanity Greater LA',
  2265000, '2026-05-09T00:00:00Z',
  2840000, 4120000,
  1482000, 223000, 941000,
  118000, 8400, 'active',
  jsonb_build_object('region', 'Los Angeles', 'pickup_window', '2026-05-04')
)
ON CONFLICT (case_id) DO UPDATE SET
  estate_name = EXCLUDED.estate_name,
  charity_name = EXCLUDED.charity_name,
  updated_at = now();

-- ============================================================
-- inventory_items (15 representative items spanning categories)
-- ============================================================
INSERT INTO inventory_items (
  item_id, case_id, name, room, category,
  estimate_low_cents, estimate_high_cents, cash_offer_cents, floor_price_cents,
  status, disposition, confidence, ai_rationale, human_reviewed, reviewer,
  comps, flags, channels, donation_suggested, storage_location, evidence_snapshot
) VALUES
('ITM-1041', 'JOB-2026-0418', 'Tiffany Studios Favrile Glass Lamp', 'Library', 'Lighting / Art Glass',
  980000, 1420000, 760000, 900000,
  'human_review', 'sell_managed', 'medium',
  'Form, patina, and base mark match Tiffany Studios c.1905. AI flagged shade leading for closer inspection — comps span $9,400–$14,800 over the last 18 months.',
  true, jsonb_build_object('name','Helena Choe, ASA','role','Senior Appraiser — Art Glass','date','2026-04-30','rationale','Authenticated. Recommend reserve at $9,000.'),
  '[{"source":"Christies","title":"Tiffany Studios Daffodil Lamp","price":13200,"date":"2026-02-14"},{"source":"Sothebys","title":"Tiffany Studios Favrile, 18in","price":11400,"date":"2026-01-09"}]'::jsonb,
  ARRAY['HIGH_VALUE','AUTHENTICATION_REQUIRED'],
  ARRAY['House Auction','Live Show','1stDibs'],
  false, NULL, 'snapshot-2026-04-30T14:21Z'),

('ITM-1042', 'JOB-2026-0418', 'Continental Silver Candelabra, Pair', 'Dining Room', 'Silver / Hollowware',
  180000, 260000, 145000, 170000,
  'authenticated', 'sell_managed', 'high',
  'Hallmarks consistent with Austrian silver, c.1890. Weight, condition, and patina photographed. 12 comps in last 24 months.',
  true, jsonb_build_object('name','Jonas Park','role','Decorative Arts QA','date','2026-04-29','rationale','Hallmarks verified.'),
  '[]'::jsonb, ARRAY[]::text[], ARRAY['1stDibs','House Auction'], false, NULL, 'snapshot-2026-04-29T11:01Z'),

('ITM-1043', 'JOB-2026-0418', 'Victorian Wingback Armchair', 'Sitting Room', 'Furniture',
  220000, 280000, 180000, 150000,
  'listed', 'sell_managed', 'high',
  'Period-correct mid-19th-century English wingback. Reupholstery c.1990s. Comps cluster $2,200–$2,800.',
  true, jsonb_build_object('name','Marcus Rivers','role','Furniture Specialist','date','2026-04-26','rationale','Authentic period frame.'),
  '[]'::jsonb, ARRAY[]::text[], ARRAY['Chairish','1stDibs','Facebook MP'], false, NULL, 'snapshot-2026-04-26T10:18Z'),

('ITM-1044', 'JOB-2026-0418', 'Vintage Skeleton Pocket Watch', 'Study Safe', 'Watches',
  180000, 240000, 170000, 160000,
  'sold', 'sell_managed', 'high',
  'Mechanical skeleton movement, period-correct. Comps cluster $1,800–$2,400.',
  true, jsonb_build_object('name','Inez Kotov','role','Horology — WOSTEP','date','2026-04-26','rationale','Movement verified.'),
  '[]'::jsonb, ARRAY[]::text[], ARRAY['eBay'], false, NULL, NULL),

('ITM-1045', 'JOB-2026-0418', 'Crystal Candelabra Chandelier', 'Foyer', 'Lighting',
  320000, 480000, 270000, 300000,
  'human_review', 'sell_managed', 'low',
  'Continental cut crystal chandelier, possibly Baccarat-style, c.1900–30. Maker verification pending.',
  false, NULL, '[]'::jsonb, ARRAY['CRATING_REQUIRED'], ARRAY['1stDibs','House Auction'], false, NULL, NULL),

('ITM-1046', 'JOB-2026-0418', 'Floral Damask Armchair Pair', 'Sitting Room', 'Furniture',
  130000, 180000, 110000, 100000,
  'sold', 'sell_managed', 'high',
  'Pair of damask-upholstered armchairs in good condition.',
  false, NULL, '[]'::jsonb, ARRAY[]::text[], ARRAY['Chairish'], false, NULL, NULL),

('ITM-1047', 'JOB-2026-0418', 'Scholar''s Roll-Top Desk', 'Library', 'Furniture',
  280000, 360000, 240000, 220000,
  'stored', 'store', 'medium',
  'Late 19th century walnut scholar''s desk; one drawer pull replaced.',
  true, jsonb_build_object('name','Marcus Rivers','role','Furniture Specialist','date','2026-04-22','rationale','Period correct, store for spring auction.'),
  '[]'::jsonb, ARRAY[]::text[], ARRAY['House Auction'], false, 'LA-04 Bay 12', NULL),

('ITM-1048', 'JOB-2026-0418', 'Mid-Century Walnut Dresser', 'Bedroom', 'Furniture',
  90000, 120000, 80000, 70000,
  'sold', 'sell_managed', 'high',
  'MCM walnut six-drawer dresser. Original hardware.',
  false, NULL, '[]'::jsonb, ARRAY[]::text[], ARRAY['Chairish'], false, NULL, NULL),

('ITM-1049', 'JOB-2026-0418', 'Estate Linens Lot', 'Bedroom', 'Textiles / Donation',
  4000, 9000, 0, 0,
  'donated', 'donate', 'medium',
  'Mixed cotton/linen estate textiles. Low velocity for resale.',
  false, NULL, '[]'::jsonb, ARRAY[]::text[], ARRAY['Donation'], true, NULL, NULL),

('ITM-1050', 'JOB-2026-0418', 'Family Photographs', 'Library', 'Personal / Locked',
  0, 0, 0, 0,
  'on_hold', 'keep', 'high',
  'Customer-flagged sentimental personal property. Stop-sell.',
  true, jsonb_build_object('name','Sarah Mitchell','role','Estate Owner','date','2026-04-21','rationale','Sentimental — keep.'),
  '[]'::jsonb, ARRAY['STOP_SELL','PII_REDACTED'], ARRAY[]::text[], false, NULL, NULL),

('ITM-1051', 'JOB-2026-0418', 'Antique Persian Rug, Tabriz', 'Sitting Room', 'Rugs',
  420000, 680000, 360000, 380000,
  'authenticated', 'sell_managed', 'medium',
  'Tabriz workshop rug, c.1920. Wear consistent with age.',
  true, jsonb_build_object('name','Yara Idrissi','role','Rugs & Textiles — ORRA','date','2026-04-30','rationale','Region/age confirmed.'),
  '[]'::jsonb, ARRAY[]::text[], ARRAY['1stDibs','House Auction'], false, NULL, NULL),

('ITM-1052', 'JOB-2026-0418', 'Sterling Coffee Service', 'Dining Room', 'Silver / Hollowware',
  140000, 200000, 110000, 130000,
  'listed', 'sell_managed', 'high',
  'Five-piece sterling coffee service, mid-20th-century.',
  false, NULL, '[]'::jsonb, ARRAY[]::text[], ARRAY['1stDibs','House Auction'], false, NULL, NULL),

('ITM-1053', 'JOB-2026-0418', 'Oriental Porcelain Vase', 'Library', 'Ceramics',
  70000, 110000, 60000, 60000,
  'ai_review', 'undecided', 'low',
  'Possible Qing dynasty famille rose vase. Authentication required.',
  false, NULL, '[]'::jsonb, ARRAY['AUTHENTICATION_REQUIRED'], ARRAY[]::text[], false, NULL, NULL),

('ITM-1054', 'JOB-2026-0418', 'Estate Cookware', 'Kitchen', 'Household / Donation',
  2000, 5000, 0, 0,
  'captured', 'donate', 'medium',
  'Mixed copper, stainless, and cast iron pieces. Donation candidate.',
  false, NULL, '[]'::jsonb, ARRAY[]::text[], ARRAY['Donation'], true, NULL, NULL),

('ITM-1055', 'JOB-2026-0418', 'Brass Library Lamps, Pair', 'Library', 'Lighting',
  60000, 90000, 50000, 50000,
  'captured', 'sell_managed', 'medium',
  'Pair of period brass library lamps. Rewired.',
  false, NULL, '[]'::jsonb, ARRAY[]::text[], ARRAY['1stDibs','Facebook MP'], false, NULL, NULL)
ON CONFLICT (item_id) DO UPDATE SET
  status = EXCLUDED.status,
  disposition = EXCLUDED.disposition,
  cash_offer_cents = EXCLUDED.cash_offer_cents,
  floor_price_cents = EXCLUDED.floor_price_cents,
  human_reviewed = EXCLUDED.human_reviewed,
  updated_at = now();

-- ============================================================
-- cash_offers + components
-- ============================================================
INSERT INTO cash_offers (
  offer_id, case_id, scope, scope_label, amount_cents,
  managed_net_low_cents, managed_net_high_cents, reserves_cents,
  item_count, expires, payout_eta, description, status
) VALUES
('OFR-22-A', 'JOB-2026-0418', 'estate', 'Whole-Estate Buyout', 2265000,
  2840000, 4120000, 190000, 47, '2026-05-09T00:00:00Z',
  '1–2 business days',
  'Single net-cash offer for full cataloged inventory. Funded escrow; 3-day pickup window.',
  'live'),
('OFR-22-B', 'JOB-2026-0418', 'lot', 'Furniture Lot · 11 items', 486000,
  620000, 880000, 24000, 11, '2026-05-07T00:00:00Z',
  '1 business day',
  'Cash offer for the furniture-only lot — sitting room, library, bedroom.',
  'live'),
('OFR-22-C', 'JOB-2026-0418', 'item', 'Tiffany Studios Lamp · ITM-1041', 760000,
  930000, 1280000, 60000, 1, '2026-05-05T00:00:00Z',
  'Same day on signed waiver',
  'Direct buyout for the authenticated Tiffany lamp. Requires authentication waiver release.',
  'expiring')
ON CONFLICT (offer_id) DO UPDATE SET
  amount_cents = EXCLUDED.amount_cents,
  status = EXCLUDED.status,
  updated_at = now();

DELETE FROM offer_components
  WHERE offer_id IN ('OFR-22-A','OFR-22-B','OFR-22-C');
INSERT INTO offer_components (offer_id, label, value_cents, pct, detail, color, position) VALUES
('OFR-22-A','Comp Floor',1890000,0.55,'Bottom of 12-month auction comps, weighted by category.','#826DEE',1),
('OFR-22-A','Velocity Premium',240000,0.10,'Cash-now liquidity premium vs 60–90 day managed sale.','#FFDB15',2),
('OFR-22-A','Authentication Buffer',-120000,-0.05,'Reserve held against pending Tiffany authentication.','#F94500',3),
('OFR-22-A','Storage Burden Discount',-80000,-0.03,'Discounted for items requiring crating/insurance.','#FF99DC',4),
('OFR-22-A','Channel Fee Avoidance',335000,0.13,'Customer avoids 12–18% channel commission.','#0E9F6E',5),
('OFR-22-B','Comp Floor',410000,0.66,'Chairish + 1stDibs + Facebook MP closes.','#826DEE',1),
('OFR-22-B','Velocity Premium',60000,0.10,'Furniture is high-handling; cash beats long lists.','#FFDB15',2),
('OFR-22-B','Channel Fee Avoidance',38000,0.06,'Avoids platform commissions.','#0E9F6E',3),
('OFR-22-B','Logistics Discount',-22000,-0.04,'Cost to pull, pack, and reposition pieces.','#FF99DC',4),
('OFR-22-C','Authenticated Comps Floor',840000,0.92,'Christies + Heritage 12-month median.','#826DEE',1),
('OFR-22-C','Authentication Buffer',-60000,-0.07,'Held until Helena Choe physical inspection clears.','#F94500',2),
('OFR-22-C','Insurance Crating Discount',-20000,-0.02,'Crating + freight risk priced in.','#FF99DC',3);

-- ============================================================
-- ledger entries (recent activity)
-- ============================================================
INSERT INTO ledger_entries (entry_id, case_id, item_id, type, description, channel, gross_cents, fee_cents, net_cents, created_at) VALUES
('L-201','JOB-2026-0418','ITM-1044','sale','Skeleton Pocket Watch — eBay #1920','eBay',205000,30800,174200,'2026-04-30T18:00:00Z'),
('L-202','JOB-2026-0418','ITM-1048','sale','Mid-Century Walnut Dresser — Chairish','Chairish',95000,14200,80800,'2026-04-29T16:11:00Z'),
('L-203','JOB-2026-0418','ITM-1046','sale','Floral Damask Armchairs — Chairish','Chairish',145000,21700,123300,'2026-04-27T15:18:00Z'),
('L-204','JOB-2026-0418',NULL,'storage','Storage — LA-04 monthly fee',NULL,0,8400,-8400,'2026-04-26T00:00:00Z'),
('L-205','JOB-2026-0418','ITM-1049','donation','Donation receipt — Habitat for Humanity',NULL,0,0,0,'2026-04-25T15:00:00Z'),
('L-206','JOB-2026-0418','ITM-1042','sale','Continental Silver Pair — 1stDibs','1stDibs',240000,36000,204000,'2026-04-22T11:42:00Z'),
('L-207','JOB-2026-0418',NULL,'payout','Payout to bank ****6201',NULL,0,0,-650000,'2026-04-20T09:14:00Z'),
('L-208','JOB-2026-0418','ITM-1043','sale','Victorian Wingback — Chairish','Chairish',220000,33000,187000,'2026-04-15T18:00:00Z')
ON CONFLICT (entry_id) DO NOTHING;

-- ============================================================
-- statements
-- ============================================================
INSERT INTO statements (statement_id, case_id, period, generated_at, net_cents, status, download_url) VALUES
('STMT-2026-04','JOB-2026-0418','April 2026','2026-05-01T00:00:00Z',941000,'ready','#'),
('STMT-2026-03','JOB-2026-0418','March 2026','2026-04-01T00:00:00Z',652000,'ready','#'),
('STMT-2026-02','JOB-2026-0418','February 2026','2026-03-01T00:00:00Z',418000,'ready','#')
ON CONFLICT (statement_id) DO NOTHING;

-- ============================================================
-- donation_preferences (charities)
-- ============================================================
INSERT INTO donation_preferences (case_id, charity_id, charity_name, ein, mission, selected, tax_receipts, total_routed_cents, actor)
VALUES
('JOB-2026-0418','CH-001','Habitat for Humanity Greater LA','95-1234567','Affordable housing & home repair', true, 3, 118000,'Sarah Mitchell'),
('JOB-2026-0418','CH-002','Goodwill Southern California','95-7654321','Workforce development & job training', false, 0, 0,'Sarah Mitchell'),
('JOB-2026-0418','CH-003','LA Family Housing','95-9876543','Ending homelessness through housing', false, 0, 0,'Sarah Mitchell')
ON CONFLICT (case_id, charity_id) DO UPDATE SET
  charity_name = EXCLUDED.charity_name,
  selected = EXCLUDED.selected,
  total_routed_cents = EXCLUDED.total_routed_cents;

-- ============================================================
-- expert_profiles + expert_queue
-- ============================================================
INSERT INTO expert_profiles (expert_id, name, specialty, credential, rating, reviews_count, accuracy, response_time, status, bio, region, hourly_rate_cents) VALUES
('EXP-01','Helena Choe, ASA','Art Glass · Tiffany · Galle','ASA Senior Appraiser',4.9,412,0.96,'< 4h','in_review','Twenty-year specialist in late-19th-century American art glass and lighting.','Pacific',18000),
('EXP-02','Jonas Park','Decorative Arts · Silver','Decorative Arts QA',4.7,286,0.93,'< 6h','available','Hallmark verification on Continental, English, and American silver.','East Coast',14000),
('EXP-03','Marcus Rivers','Furniture · Period & MCM','Senior Furniture Specialist',4.8,530,0.95,'< 3h','available','Period American + European furniture, specializing in joinery analysis.','Pacific',15000),
('EXP-04','Inez Kotov','Horology · Vintage Watches','WOSTEP Certified',4.9,318,0.97,'< 2h','available','Mechanical movement verification + period correctness.','Mountain',20000),
('EXP-05','Yara Idrissi','Rugs & Textiles','ORRA Member',4.6,174,0.91,'< 8h','available','Persian, Turkish, and Caucasian rug attribution + dating.','East Coast',16000),
('EXP-06','Devon Bao','Jewelry · GIA','GIA GG',4.8,402,0.94,'< 5h','unavailable','Stone identification, treatment disclosure, and natural-vs-lab analysis.','Pacific',22000),
('EXP-07','Sarah Chen','Estate Coordinator · Concierge','Estate Coordinator',4.9,612,0.99,'< 1h','available','White-glove executor and family liaison; manages stop-sell, locks, and family-only items.','Pacific',9500)
ON CONFLICT (expert_id) DO UPDATE SET
  rating = EXCLUDED.rating,
  status = EXCLUDED.status;

INSERT INTO expert_queue_items (queue_id, item_id, expert_id, state, sla_hours, notes, queued_at, assigned_at) VALUES
('EQ-01','ITM-1041','EXP-01','in_review',24,'Authentication; physical inspection requested.','2026-04-30T14:21:00Z','2026-04-30T14:22:00Z'),
('EQ-02','ITM-1045',NULL,'needed',48,'Maker verification.','2026-05-02T08:34:00Z',NULL),
('EQ-03','ITM-1051','EXP-05','assigned',36,'Region/age secondary opinion.','2026-05-02T10:14:00Z','2026-05-02T10:15:00Z'),
('EQ-04','ITM-1053',NULL,'needed',48,'Authentication required for porcelain.','2026-05-01T09:10:00Z',NULL)
ON CONFLICT (queue_id) DO NOTHING;

-- ============================================================
-- capture_rooms + capture_checklist
-- ============================================================
INSERT INTO capture_rooms (room_id, case_id, name, items_expected, items_captured, coverage_score, missing_angles, quality_issues, pii_redacted, status, last_captured_at) VALUES
('RC-01','JOB-2026-0418','Library',8,8,0.96,ARRAY[]::text[],ARRAY[]::text[],2,'ready_for_ai','2026-04-29T16:22:00Z'),
('RC-02','JOB-2026-0418','Dining Room',6,6,0.92,ARRAY['Underside of candelabra'],ARRAY[]::text[],0,'ready_for_ai','2026-04-29T14:01:00Z'),
('RC-03','JOB-2026-0418','Sitting Room',5,5,0.89,ARRAY['Frame back of armchair pair'],ARRAY['Soft focus on Photo 3'],1,'ai_review','2026-04-29T11:18:00Z'),
('RC-04','JOB-2026-0418','Foyer',3,3,0.78,ARRAY['Crystal chandelier — top angle','Maker mark close-up'],ARRAY['Glare on prisms'],0,'human_review_required','2026-04-30T08:34:00Z'),
('RC-05','JOB-2026-0418','Bedroom',9,4,0.42,ARRAY['Closet contents','Vanity drawers','Under bed'],ARRAY['3 photos < 1080p'],0,'incomplete','2026-04-28T19:44:00Z'),
('RC-06','JOB-2026-0418','Garage',12,0,0,ARRAY['Entire room'],ARRAY[]::text[],0,'incomplete',NULL),
('RC-07','JOB-2026-0418','Study Safe',2,2,0.95,ARRAY[]::text[],ARRAY[]::text[],4,'ready_for_ai','2026-04-26T09:22:00Z')
ON CONFLICT (room_id) DO UPDATE SET
  items_captured = EXCLUDED.items_captured,
  coverage_score = EXCLUDED.coverage_score,
  status = EXCLUDED.status;

INSERT INTO capture_checklist_state (room_id, checklist_item_id, done, actor, updated_at) VALUES
('RC-01','cap-front',true,'Sarah Mitchell','2026-04-29T16:22:00Z'),
('RC-01','cap-back',true,'Sarah Mitchell','2026-04-29T16:22:00Z'),
('RC-01','cap-mark',true,'Sarah Mitchell','2026-04-29T16:22:00Z'),
('RC-02','cap-front',true,'Sarah Mitchell','2026-04-29T14:01:00Z'),
('RC-02','cap-mark',true,'Sarah Mitchell','2026-04-29T14:01:00Z'),
('RC-05','cap-front',true,'Sarah Mitchell','2026-04-28T19:44:00Z'),
('RC-05','cap-back',false,'Sarah Mitchell','2026-04-28T19:44:00Z')
ON CONFLICT (room_id, checklist_item_id) DO UPDATE SET
  done = EXCLUDED.done,
  updated_at = EXCLUDED.updated_at;

-- ============================================================
-- compliance_checks
-- ============================================================
INSERT INTO compliance_checks (check_id, case_id, area, state, label, detail, evidence) VALUES
('CC-1','JOB-2026-0418','Authority & Consent','green','Authority documents on file','Letters Testamentary verified 2026-04-18. Customer authorization signed.',ARRAY['Letters Testamentary','Authorization e-sign 2026-04-18']),
('CC-2','JOB-2026-0418','Identity / KYC','green','Identity verified','KYC complete via partner. Beneficiary on payout matches signer.',ARRAY['KYC reference KY-9981']),
('CC-3','JOB-2026-0418','Restricted / Prohibited','green','0 prohibited matches','Zero firearm, ivory, hazardous, or restricted-material flags in catalog.',ARRAY['Auto-screen v1.7','47 items scanned']),
('CC-4','JOB-2026-0418','Luxury Authentication','yellow','1 authentication pending','Tiffany lamp at specialist for in-person authentication.',ARRAY['Helena Choe assignment']),
('CC-5','JOB-2026-0418','Provenance Documentation','green','Provenance recorded','Family acquisition notes captured for high-value items.',ARRAY['Notes uploaded for ITM-1041, ITM-1051']),
('CC-6','JOB-2026-0418','PII Redaction','green','PII redaction active','286 photos auto-redacted (faces, addresses, account numbers).',ARRAY['Redaction engine v2.4']),
('CC-7','JOB-2026-0418','Tax Documentation','green','1099 + 8283 prep','Year-end forms scaffolded; donation 8283 thresholds tracked per item.',ARRAY['IRS form scaffold']),
('CC-8','JOB-2026-0418','Legal Hold','green','No legal hold active','Estate not flagged in litigation registry.',ARRAY['Registry check 2026-04-30']),
('CC-9','JOB-2026-0418','Dispute / Evidence Pack','green','Evidence packs ready','Per-item evidence pack generation enabled.',ARRAY['Receipts: 7 generated this estate'])
ON CONFLICT (check_id) DO UPDATE SET
  state = EXCLUDED.state,
  detail = EXCLUDED.detail,
  updated_at = now();

-- ============================================================
-- ops_events
-- ============================================================
INSERT INTO ops_events (event_id, case_id, item_id, kind, title, detail, status, owner, evidence, ts) VALUES
('OE-101','JOB-2026-0418',NULL,'pickup_scheduled','Pickup scheduled — Mitchell Estate','Crew of 2 dispatched 2026-05-04 09:00. Climate truck reserved.','ok','Alex Rivera',ARRAY['Route confirmed','COI on file'],'2026-05-02T11:00:00Z'),
('OE-102','JOB-2026-0418','ITM-1041','authentication_started','Authentication started — Tiffany Lamp','Helena Choe (ASA) on-site appointment booked 2026-05-05.','attention','Helena Choe',ARRAY['Snapshot snap_4c91d22','Specialist contract on file'],'2026-05-02T09:15:00Z'),
('OE-103','JOB-2026-0418','ITM-1042','custody_transfer','Chain of custody — Silver Candelabra','Tagged ITM-1042-A/B. Sealed in tamper-evident bags.','ok',NULL,ARRAY['Tag photo','Crew manifest'],'2026-04-29T14:11:00Z'),
('OE-104','JOB-2026-0418','ITM-1047','storage_logged','Storage logged — Scholar''s Desk','Bay LA-04 / 12. Climate range 18–22°C.','ok',NULL,ARRAY[]::text[],'2026-04-22T15:31:00Z'),
('OE-105','JOB-2026-0418','ITM-1043','packing_evidence','Packing evidence — Wingback Armchair','6-photo packing record uploaded prior to ship.','ok',NULL,ARRAY['6 packing photos','Pad map'],'2026-04-26T17:00:00Z'),
('OE-106','JOB-2026-0418','ITM-1043','channel_published','Listings live — Chairish + 1stDibs + Facebook MP','3 channels live within 14 minutes. Auto-attribution applied.','ok',NULL,ARRAY[]::text[],'2026-04-27T10:18:00Z'),
('OE-107','JOB-2026-0418','ITM-1045','exception','Exception — Crystal Chandelier','Maker verification missing. Listing hold; crating dependency.','attention','Yara Idrissi',ARRAY[]::text[],'2026-04-30T08:34:00Z'),
('OE-108','JOB-2026-0418','ITM-1046','return_requested','Return — Damask Armchair Pair','Buyer reports stain transfer. Photos requested.','attention','Returns desk',ARRAY[]::text[],'2026-04-30T16:40:00Z'),
('OE-109','JOB-2026-0418',NULL,'reconciliation','Daily reconciliation','Stripe + eBay + Chairish settle file matched. 0 variance.','ok',NULL,ARRAY[]::text[],'2026-05-01T23:55:00Z'),
('OE-110','JOB-2026-0418','ITM-1050','stop_sell','Stop-sell — Family Photographs','Customer-requested lock from sale.','ok',NULL,ARRAY[]::text[],'2026-04-21T12:11:00Z')
ON CONFLICT (event_id) DO NOTHING;

-- ============================================================
-- channel_recommendations
-- ============================================================
DELETE FROM channel_recommendations
  WHERE item_id IN ('ITM-1041','ITM-1043','ITM-1049','ITM-1051','ITM-1052');
INSERT INTO channel_recommendations (item_id, channel, fit_score, expected_days, expected_net_cents, fee_pct, policy_risk, fulfillment_burden, best_for, notes, recommended) VALUES
('ITM-1041','House Auction',0.92,32,1120000,0.18,'low','medium','Authenticated, high-value art','Reserve $9,000. Live + online bidders.',true),
('ITM-1041','1stDibs',0.81,84,1010000,0.20,'low','medium','Trade-buyer reach, premium price','Slow but premium pricing.',false),
('ITM-1041','eBay',0.45,28,840000,0.13,'medium','high','Mass reach','Counterfeit risk requires authenticity guarantee.',false),
('ITM-1041','Direct Buyout',0.74,1,760000,0,'low','low','Speed','Same-day cash on signed waiver.',false),
('ITM-1043','Chairish',0.88,24,188000,0.20,'low','medium','Designers + collectors','Strong fit; ships via white glove.',true),
('ITM-1043','1stDibs',0.74,60,208000,0.20,'low','medium','Premium dealers','Higher net but slower.',false),
('ITM-1043','Facebook MP',0.62,12,150000,0.05,'low','high','Local pickup','Local-only fast cash.',false),
('ITM-1043','House Auction',0.40,35,170000,0.18,'low','medium','Lot-style bundling','Furniture clears strong in lot auctions.',false),
('ITM-1049','Donation',0.95,3,0,0,'low','low','Hard-to-sell goods','Tax receipt + impact report.',true),
('ITM-1049','Etsy',0.42,90,11000,0.13,'low','high','Vintage textile collectors','Slow and labor-heavy.',false),
('ITM-1049','Facebook MP',0.35,60,8000,0.05,'low','high','Local lots','Volume is low; donation likely better.',false),
('ITM-1051','1stDibs',0.86,72,440000,0.20,'low','medium','Trade buyers','Premium net.',true),
('ITM-1051','House Auction',0.71,30,380000,0.18,'low','medium','Lot bundling','Good fallback.',false),
('ITM-1052','1stDibs',0.78,60,160000,0.20,'low','medium','Silver collectors','Steady demand.',true),
('ITM-1052','House Auction',0.62,28,140000,0.18,'low','medium','Auction',NULL,false);

-- ============================================================
-- learning_metrics + experiments
-- ============================================================
INSERT INTO learning_metrics (metric_id, label, value, trend_up, trend_pct, description, color, measured_at) VALUES
('M-1','AI Appraiser Accuracy','94.2%',true,1.8,'AI estimate vs realized price within ±15%.','#826DEE','2026-05-01T00:00:00Z'),
('M-2','Price Realization','102%',true,3.4,'Realized / mid-estimate, last 90 days.','#0E9F6E','2026-05-01T00:00:00Z'),
('M-3','Sell-Through (90d)','74%',true,2.1,'Items sold within 90 days of list.','#FFDB15','2026-05-01T00:00:00Z'),
('M-4','Time-to-Sale (median)','38d',false,-4.6,'Days from list to clear.','#FF99DC','2026-05-01T00:00:00Z'),
('M-5','Channel Lift (auction vs MP)','+18%',true,0.9,'Net premium from auction routing for high-value items.','#826DEE','2026-05-01T00:00:00Z'),
('M-6','Donation Conversion','46%',true,6.2,'Of low-velocity items routed to charity.','#0E9F6E','2026-05-01T00:00:00Z'),
('M-7','Dispute Rate','0.6%',false,-0.3,'Disputed sales / total cleared.','#F94500','2026-05-01T00:00:00Z'),
('M-8','Customer NPS','78',true,4,'Net Promoter Score, last 60 days.','#826DEE','2026-05-01T00:00:00Z')
ON CONFLICT (metric_id) DO UPDATE SET
  value = EXCLUDED.value,
  trend_up = EXCLUDED.trend_up,
  trend_pct = EXCLUDED.trend_pct,
  measured_at = EXCLUDED.measured_at;

INSERT INTO learning_experiments (experiment_id, name, status, uplift, cohort, color, started_at) VALUES
('EX-1','Price drop curve v3 (5/10/15)','live','+3.1% net','320 listings','#0E9F6E','2026-04-15T00:00:00Z'),
('EX-2','Donation suggestion threshold $150','live','+12% donation conversion','180 candidates','#0E9F6E','2026-04-01T00:00:00Z'),
('EX-3','Channel routing for furniture > $1.5K','analyzing','pending','64 items','#FFDB15','2026-04-22T00:00:00Z'),
('EX-4','Cash-offer velocity premium tweak','paused','inconclusive','210 offers','#6B6B6B','2026-03-15T00:00:00Z')
ON CONFLICT (experiment_id) DO UPDATE SET
  status = EXCLUDED.status,
  uplift = EXCLUDED.uplift;

-- ============================================================
-- appraisal_runs + stages (Tiffany lamp + Crystal chandelier)
-- ============================================================
INSERT INTO appraisal_runs (run_id, item_id, item_name, category, started_by, started_at, status, final_confidence, final_estimate_low_cents, final_estimate_high_cents) VALUES
('run_tiffany_1041','ITM-1041','Tiffany Studios Favrile Glass Lamp','Lighting / Art Glass','Estate Liquidity Appraisal Engine v3.2','2026-04-30T14:18:00Z','done',0.78,980000,1420000),
('run_chandelier_1045','ITM-1045','Crystal Candelabra Chandelier','Lighting','Estate Liquidity Appraisal Engine v3.2','2026-04-30T08:38:00Z','human_review',0.61,320000,480000)
ON CONFLICT (run_id) DO UPDATE SET status = EXCLUDED.status;

DELETE FROM appraisal_stages WHERE run_id IN ('run_tiffany_1041','run_chandelier_1045');
INSERT INTO appraisal_stages (stage_id, run_id, stage, state, confidence, output, evidence, next_action, human_trigger, ran_at, duration_ms, title, one_line) VALUES
('stg_t1','run_tiffany_1041','classify','done',0.94,'Tiffany Studios Daffodil-form lamp, c.1905. 99% match on signature mark.', '["Bronze base mark T.S. NEW YORK","Favrile leaded shade signature","Form match: Daffodil 18in"]'::jsonb, NULL, NULL,'2026-04-30T14:18:21Z',1800,'Classifier','Identifies category, maker, period.'),
('stg_t2','run_tiffany_1041','condition','human_review',0.62,'Body sound. Leading near top rim should be inspected in person.', '["Photo 4/8 shows leading anomaly","No fractures detected","Patina consistent with age"]'::jsonb, 'Specialist physical inspection scheduled.','Leading anomaly above $5K item — escalates to art glass specialist.','2026-04-30T14:18:30Z',2300,'Condition Inspector','Evaluates wear, repairs, breakage.'),
('stg_t3','run_tiffany_1041','provenance','done',0.71,'Verbal family provenance, no public auction history. Acceptable.', '["Family acquisition note 1968","No prior public sale record","No registry hit"]'::jsonb, NULL, NULL,'2026-04-30T14:18:45Z',1200,'Provenance Tracer','Looks for chain-of-ownership, paperwork, registry.'),
('stg_t4','run_tiffany_1041','comps','done',0.83,'12-month median $11,400. Range $9,400–$14,800.', '["Christies Feb 2026: $13,200","Sothebys Jan 2026: $11,400","Heritage Nov 2025: $9,800"]'::jsonb, NULL, NULL,'2026-04-30T14:18:55Z',3100,'Comp Builder','Pulls comparable sales across auction houses + marketplaces.'),
('stg_t5','run_tiffany_1041','liquidity','done',0.74,'~62 days expected sale. Auction recommended as primary.', '["Sell-through 78% in 90 days","Best velocity at house auction","1stDibs slow but premium"]'::jsonb, NULL, NULL,'2026-04-30T14:19:01Z',1400,'Liquidity Modeler','Estimates time-to-sale and sell-through.'),
('stg_t6','run_tiffany_1041','fraud','human_review',0.55,'Authentication strongly recommended before listing.', '["Tiffany counterfeit risk: medium","Lead glass — no restricted materials","No prior fraud match"]'::jsonb, 'Helena Choe, ASA assigned (art glass).','High-value Tiffany — automatic specialist authentication.','2026-04-30T14:19:08Z',900,'Fraud / Risk Sentinel','Authentication risk, counterfeits, restricted material.'),
('stg_t7','run_tiffany_1041','strategy','done',0.81,'House auction primary, 1stDibs secondary. Reserve $9,000.', '["Auction lift +18% over marketplace","Reserve $9,000 protects floor","Crating + insurance required"]'::jsonb, NULL, NULL,'2026-04-30T14:19:14Z',1100,'Listing Strategist','Picks channel mix, pricing curve, donation candidacy.'),
('stg_t8','run_tiffany_1041','final','done',0.78,'Final: $9,800–$14,200. Medium-high confidence, pending physical authentication.', '["Authentication pending","Comps converge","Listing strategy clean"]'::jsonb, NULL, NULL,'2026-04-30T14:19:21Z',600,'Final Confidence','Aggregates all agents into one estimate + confidence.'),
('stg_c1','run_chandelier_1045','classify','done',0.84,'Continental cut crystal chandelier, possibly Baccarat-style, c.1900–30.', '["12-light continental form","Cut crystal prisms"]'::jsonb, NULL, NULL,'2026-04-30T08:38:14Z',1700,'Classifier','Identifies category, maker, period.'),
('stg_c2','run_chandelier_1045','condition','human_review',0.5,'Stable but fragile. Needs hands-on assessment.', '["Two prisms loose","Bobeche chips on arm 4"]'::jsonb, NULL, 'Mechanical handling required — crating/inspection prerequisite.','2026-04-30T08:38:23Z',2100,'Condition Inspector','Evaluates wear, repairs, breakage.'),
('stg_c3','run_chandelier_1045','provenance','done',0.4,'Provenance unclear. Likely unbranded continental piece.', '["No maker signature found","No registry record"]'::jsonb, 'Maker verification needed.', NULL,'2026-04-30T08:38:34Z',1400,'Provenance Tracer','Chain-of-ownership search.'),
('stg_c4','run_chandelier_1045','comps','done',0.76,'Range $4,200–$5,400. Median $4,600.', '["Sothebys Feb 2026: $4,600","1stDibs Dec 2025: $5,200"]'::jsonb, NULL, NULL,'2026-04-30T08:38:42Z',2700,'Comp Builder','Comparable sales.'),
('stg_c5','run_chandelier_1045','liquidity','done',0.59,'~84 days expected. Lower velocity.', '["90-day sell-through 64%","Crating burden lengthens timeline"]'::jsonb, NULL, NULL,'2026-04-30T08:38:49Z',1600,'Liquidity Modeler','Time-to-sale & sell-through.'),
('stg_c6','run_chandelier_1045','fraud','done',0.78,'No active risk flags.', '["No restricted materials","No counterfeit pattern"]'::jsonb, NULL, NULL,'2026-04-30T08:38:53Z',600,'Fraud / Risk Sentinel','Authentication risk.'),
('stg_c7','run_chandelier_1045','strategy','queued',0,'Strategy paused pending maker verification.', '[]'::jsonb, 'Awaiting human review.', NULL, NULL, NULL,'Listing Strategist','Channel + pricing.'),
('stg_c8','run_chandelier_1045','final','queued',0,'Pending — held at human review.', '[]'::jsonb, NULL, NULL, NULL, NULL,'Final Confidence','Aggregate.');

-- ============================================================
-- trust_receipts (representative immutable trail)
-- ============================================================
INSERT INTO trust_receipts (receipt_id, kind, item_id, case_id, title, what, why, evidence, approver, approver_role, immutable_snapshot_id, dispute_url, created_at) VALUES
('TR-1041-A','appraisal','ITM-1041','JOB-2026-0418','AI appraisal — Tiffany Studios Favrile Lamp',
  'AI estimate $9,800–$14,200 produced, escalated to specialist for authentication.',
  'Eight-stage agent run flagged condition + counterfeit risk above $5K threshold.',
  ARRAY['Snapshot 2026-04-30T14:21Z','8 photos analyzed','12 comps','Helena Choe queued'],
  'Estate Liquidity Appraisal Engine v3.2','AI multi-agent + human-in-the-loop','snap_3a82f1c','/portal/items/ITM-1041','2026-04-30T14:19:21Z'),
('TR-1041-B','authentication','ITM-1041','JOB-2026-0418','Specialist authentication assigned',
  'Helena Choe, ASA assigned for in-person Tiffany authentication.',
  'AI flagged authentication-required + value > $5K.',
  ARRAY['Specialist credentials on file','Specialist accuracy 96% over 412 reviews'],
  'Helena Choe, ASA','Senior Appraiser — Art Glass','snap_4c91d22',NULL,'2026-04-30T14:21:00Z'),
('TR-1043-A','listing','ITM-1043','JOB-2026-0418','Listing published — Victorian Wingback Armchair',
  'Listed across Chairish + 1stDibs + Facebook Marketplace at $2,400 with floor $1,500.',
  'Comps at $2,200 (Chairish) and $2,600 (1stDibs); customer-set floor $1,500.',
  ARRAY['Channel matrix v1.4','2 active comps','Customer floor confirmed 2026-04-26'],
  'Marcus Rivers','Furniture Specialist','snap_5d12af0',NULL,'2026-04-27T10:18:00Z'),
('TR-1044-A','payout','ITM-1044','JOB-2026-0418','Sale + reserve hold — Skeleton Pocket Watch',
  'Sold $2,050 on eBay. $1,742 cleared. 7-day reserve $308.',
  'Standard reserve protects against return/chargeback per policy.',
  ARRAY['eBay order #1920','Buyer feedback 100%','Tracking confirmed'],
  'Estate Liquidity Settlement','Auto-reconciliation + Inez Kotov check','snap_6e21af8',NULL,'2026-04-30T18:00:00Z'),
('TR-1049-A','donation','ITM-1049','JOB-2026-0418','Donation routed — Estate Linens',
  'Routed to Habitat for Humanity Greater LA. Tax receipt scheduled.',
  'Low-velocity, low-margin items get more good as donations than open-market resale.',
  ARRAY['Habitat EIN 95-1234567','Customer-confirmed charity 2026-04-25','IRS 8283 thresholds checked'],
  'Sarah Chen','Estate Coordinator','snap_7f30c1d',NULL,'2026-04-25T15:00:00Z'),
('TR-1050-A','stop_sell','ITM-1050','JOB-2026-0418','Stop-sell / lock — Family Photographs',
  'Item locked. Removed from any future listing or donation routing.',
  'Customer flagged as sentimental personal property.',
  ARRAY['Customer ack 2026-04-21','PII redaction confirmed','No listing channel touched'],
  'Sarah Mitchell (Customer)','Estate Owner','snap_8a44b22',NULL,'2026-04-21T12:11:00Z'),
('TR-PAY-001','payout',NULL,'JOB-2026-0418','Payout — Bank ****6201',
  '$6,500 transferred to bank ****6201.',
  'Customer-requested withdrawal of available proceeds.',
  ARRAY['ACH trace 1920331','Same-day reconciliation'],
  'Estate Liquidity Treasury','Finance ops','snap_9b51e44',NULL,'2026-04-20T09:14:00Z')
ON CONFLICT (receipt_id) DO NOTHING;

COMMIT;
