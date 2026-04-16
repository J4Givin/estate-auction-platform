import { z } from "zod";

// ============================================================
// Enums (matching DB enums)
// ============================================================
export type UserRole = "admin" | "seller" | "bidder" | "viewer";

export type LotStatus =
  | "draft"
  | "queued"
  | "live_bidding"
  | "closing"
  | "sold_pending_payment"
  | "reserve_not_met"
  | "canceled"
  | "voided"
  | "paid"
  | "fulfillment"
  | "completed";

export type OrderStatus = "pending_payment" | "paid" | "canceled" | "refunded";

// ============================================================
// DB Row Types
// ============================================================
export interface User {
  id: string;
  email: string;
  display_name: string | null;
  stripe_customer_id: string | null;
  payment_verified: boolean;
  banned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Org {
  id: string;
  name: string;
  stripe_account_id: string | null;
  created_at: string;
}

export interface OrgMembership {
  org_id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Show {
  id: string;
  org_id: string | null;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  stream_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Lot {
  id: string;
  org_id: string | null;
  show_id: string | null;
  title: string;
  description: string | null;
  condition_notes: string | null;
  media_urls: string[];
  appraisal_value_cents: number | null;
  start_price_cents: number;
  reserve_price_cents: number | null;
  bid_increment_cents: number;
  status: LotStatus;
  soft_close_enabled: boolean;
  soft_close_window_seconds: number;
  soft_close_extend_seconds: number;
  opens_at: string | null;
  closes_at: string | null;
  closed_at: string | null;
  winner_user_id: string | null;
  winning_bid_id: string | null;
  current_high_bid_id: string | null;
  last_bid_seq: number;
  last_event_no: number;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  lot_id: string;
  bidder_user_id: string;
  org_id: string | null;
  amount_cents: number;
  sequence_no: number;
  idempotency_key: string;
  client_session_id: string | null;
  client_sent_at: string | null;
  server_received_at: string;
  created_at: string;
}

export interface AuctionEvent {
  id: string;
  lot_id: string;
  org_id: string | null;
  event_no: number;
  event_type: string;
  actor_user_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface Order {
  id: string;
  lot_id: string;
  org_id: string | null;
  buyer_user_id: string;
  amount_cents: number;
  status: OrderStatus;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LotSnapshot {
  id: string;
  lot_id: string;
  snapshot_type: string;
  occurred_at: string;
  payload: Record<string, unknown>;
}

export interface OutboxEvent {
  id: string;
  lot_id: string | null;
  channel: string;
  event_type: string;
  payload: Record<string, unknown>;
  published: boolean;
  retry_count: number;
  created_at: string;
  published_at: string | null;
}

// ============================================================
// API Response Types
// ============================================================
export interface ApiError {
  requestId: string;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiSuccess<T> {
  data: T;
  requestId: string;
}

// ============================================================
// Zod Schemas
// ============================================================
export const ZPlaceBidRequest = z.object({
  amountCents: z.number().int().positive(),
  idempotencyKey: z.string().min(8),
  clientSessionId: z.string().min(8).optional(),
  clientSentAt: z.string().datetime().optional(),
});
export type PlaceBidRequest = z.infer<typeof ZPlaceBidRequest>;

export const ZCreateLotRequest = z.object({
  orgId: z.string().uuid(),
  showId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  conditionNotes: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  appraisalValueCents: z.number().int().positive().optional(),
  startPriceCents: z.number().int().positive().default(100),
  reservePriceCents: z.number().int().positive().optional(),
  bidIncrementCents: z.number().int().positive().default(100),
  softCloseEnabled: z.boolean().default(true),
  softCloseWindowSeconds: z.number().int().positive().default(30),
  softCloseExtendSeconds: z.number().int().positive().default(30),
});
export type CreateLotRequest = z.infer<typeof ZCreateLotRequest>;

export const ZCreateShowRequest = z.object({
  orgId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  streamUrl: z.string().url().optional(),
});
export type CreateShowRequest = z.infer<typeof ZCreateShowRequest>;

export const ZCloseRequest = z.object({
  actorUserId: z.string().uuid().optional(),
});
export type CloseRequest = z.infer<typeof ZCloseRequest>;

// ============================================================
// Ably Event Types
// ============================================================
export const ZAuctionEvent = z.object({
  id: z.string().uuid(),
  lotId: z.string().uuid(),
  eventNo: z.number().int(),
  eventType: z.string(),
  payload: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
});
export type AuctionEventMessage = z.infer<typeof ZAuctionEvent>;

export const ZLotState = z.object({
  id: z.string().uuid(),
  status: z.string(),
  currentHighBidAmountCents: z.number().nullable(),
  currentHighBidderUserId: z.string().nullable(),
  closesAt: z.string().nullable(),
  lastEventNo: z.number().int(),
  lastBidSeq: z.number().int(),
  bidCount: z.number().int(),
});
export type LotStateMessage = z.infer<typeof ZLotState>;
