/**
 * Domain types for the estate liquidity platform data layer.
 *
 * These re-export and extend the existing sample-data types so the rest of
 * the app (already coupled to those shapes) keeps working unchanged while
 * we add Supabase-backed loading underneath.
 */

export type {
  Disposition,
  ItemStatus,
  Confidence,
  Comp,
  InventoryItem,
  CashOffer,
  LedgerEntry,
  Charity,
  AgentStage,
  AgentState,
  AppraisalAgent,
  AppraisalRun,
  CategoryRubric,
  ExpertStatus,
  Expert,
  ExpertQueueState,
  ExpertQueueRow,
  OfferComponent,
  OfferStackEntry,
  AssetBalance,
  CaptureState,
  RoomCapture,
  ReceiptKind,
  TrustReceiptData,
  ChannelOption,
  ChannelMatrixForItem,
  OpsEventKind,
  OpsEvent,
  LearningMetric,
  SafetyLevel,
  ComplianceCheck,
  ConciergeState,
  ConciergeMember,
  Statement,
} from '@/lib/sample-data'

import type { Disposition, ItemStatus, ReceiptKind } from '@/lib/sample-data'

/* ─── Estate cases / portfolio summary (stable view-shape) ─── */

export interface EstateCase {
  jobId: string
  estateName: string
  itemsTotal: number
  itemsCataloged: number
  itemsApproved: number
  itemsListed: number
  itemsSold: number
  itemsStored: number
  itemsDonated: number
  itemsHeld: number
  estimatedNetLow: number
  estimatedNetHigh: number
  cashOfferAvailable: number
  cashOfferExpires: string
  proceedsToDate: number
  reservedForFees: number
  availableForPayout: number
  donationsToDate: number
  charityName: string
  storageItems: number
  storageMonthlyCost: number
  riskFlags: number
  pendingApprovals: number
}

/* ─── Inputs for write actions / mutations ─── */

export interface AcceptOfferInput {
  offerId: string
  caseId?: string
  actor: string
}

export interface SetFloorPriceInput {
  itemId: string
  floorPrice: number
  actor: string
}

export interface ChangeDispositionInput {
  itemId: string
  disposition: Disposition
  actor: string
  reason?: string
}

export interface StopSellInput {
  itemId: string
  reason: string
  actor: string
  legalHold?: boolean
}

export interface CreateTrustReceiptInput {
  kind: ReceiptKind
  itemId?: string
  caseId?: string
  title: string
  what: string
  why: string
  evidence?: string[]
  approver: string
  approverRole: string
  immutableSnapshotId?: string
  disputeUrl?: string
}

export interface RequestPayoutInput {
  caseId: string
  amount: number
  destination?: string
  actor: string
}

export interface UpdateDonationRoutingInput {
  caseId: string
  charityId: string
  actor: string
}

export interface AssignExpertInput {
  itemId: string
  expertId?: string
  notes?: string
  actor: string
}

export interface UpdateCaptureChecklistInput {
  roomId: string
  checklistItemId: string
  done: boolean
  actor: string
}

export interface CounterOfferInput {
  offerId: string
  counterAmount: number
  message?: string
  actor: string
}

export interface RequestStatementInput {
  caseId: string
  period: string
  actor: string
}

/* ─── Generic write result envelope ─── */

export interface WriteResult<T = Record<string, unknown>> {
  ok: boolean
  mode: 'supabase' | 'demo'
  data?: T
  error?: string
  /** Trust receipt id created as a side effect of the action, if any. */
  trustReceiptId?: string
}

/* ─── AI integration hooks ─── */

export interface AppraisalRunInput {
  itemId: string
  itemName?: string
  category?: string
  startedBy: string
}

export interface AgentStageInput {
  runId: string
  stage: import('@/lib/sample-data').AgentStage
  payload?: Record<string, unknown>
}

export interface EvidenceSnapshotInput {
  subjectType: 'item' | 'case' | 'offer' | 'capture' | 'expert_review'
  subjectId: string
  payload: Record<string, unknown>
}

export interface ListingDraftInput {
  itemId: string
  channel: string
}

export interface ChannelFitScoreInput {
  itemId: string
  channels: string[]
}

export type ItemId = string
export type CaseId = string
export type ItemStatusFilter = ItemStatus | 'all'
