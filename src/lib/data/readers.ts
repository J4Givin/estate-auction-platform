/**
 * Read-path data access for the customer portal.
 *
 * Each function attempts a Supabase-backed query when env is configured,
 * otherwise returns the sample-data snapshot the demo experience uses.
 *
 * The functions are safe to call from server components, client components,
 * and route handlers — Supabase work is deferred behind `isSupabaseConfigured`
 * so the bundle stays tree-shakable in demo mode.
 */

import {
  PORTFOLIO_SUMMARY,
  ASSET_BALANCE,
  INVENTORY,
  CASH_OFFERS,
  LEDGER,
  CHARITIES,
  RISK_FLAGS,
  APPRAISAL_RUNS,
  EXPERTS,
  EXPERT_QUEUE,
  ROOM_CAPTURE,
  CAPTURE_CHECKLIST,
  TRUST_RECEIPTS,
  CHANNEL_MATRIX,
  CHANNEL_HEALTH,
  OPS_EVENTS,
  LEARNING_METRICS,
  PLATFORM_LEARNINGS,
  EXPERIMENTS,
  COMPLIANCE_CHECKS,
  CONCIERGE_TEAM,
  CONCIERGE_TIMELINE,
  STATEMENTS,
  OFFER_STACK,
  type InventoryItem,
  type CashOffer,
  type LedgerEntry,
  type Charity,
  type AppraisalRun,
  type Expert,
  type ExpertQueueRow,
  type RoomCapture,
  type TrustReceiptData,
  type ChannelMatrixForItem,
  type OpsEvent,
  type LearningMetric,
  type ComplianceCheck,
  type Statement,
} from '@/lib/sample-data'

import type { EstateCase } from './types'
import { isSupabaseConfigured, getDataMode } from './env'

const DEFAULT_CASE_ID = PORTFOLIO_SUMMARY.jobId

/**
 * Build the EstateCase snapshot from the sample portfolio summary.
 * Kept private so the Supabase path can return the same shape.
 */
function sampleEstateCase(): EstateCase {
  const p = PORTFOLIO_SUMMARY
  return {
    jobId: p.jobId,
    estateName: p.estateName,
    itemsTotal: p.itemsTotal,
    itemsCataloged: p.itemsCataloged,
    itemsApproved: p.itemsApproved,
    itemsListed: p.itemsListed,
    itemsSold: p.itemsSold,
    itemsStored: p.itemsStored,
    itemsDonated: p.itemsDonated,
    itemsHeld: p.itemsHeld,
    estimatedNetLow: p.estimatedNetLow,
    estimatedNetHigh: p.estimatedNetHigh,
    cashOfferAvailable: p.cashOfferAvailable,
    cashOfferExpires: p.cashOfferExpires,
    proceedsToDate: p.proceedsToDate,
    reservedForFees: p.reservedForFees,
    availableForPayout: p.availableForPayout,
    donationsToDate: p.donationsToDate,
    charityName: p.charityName,
    storageItems: p.storageItems,
    storageMonthlyCost: p.storageMonthlyCost,
    riskFlags: p.riskFlags,
    pendingApprovals: p.pendingApprovals,
  }
}

/**
 * Try a Supabase query; on any failure (network, schema not yet migrated,
 * empty table) fall back to demo data. We never throw to callers — UI must
 * always render.
 */
async function tryOrFallback<T>(
  fn: () => Promise<T | null | undefined>,
  fallback: T,
): Promise<T> {
  if (!isSupabaseConfigured()) return fallback
  try {
    const v = await fn()
    if (v == null) return fallback
    return v
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[data] supabase read failed, using sample data:', (err as Error).message)
    }
    return fallback
  }
}

/* ─── Portal overview / case ─── */

export async function getPortalOverview(caseId: string = DEFAULT_CASE_ID) {
  return tryOrFallback(
    async () => {
      void caseId
      // Supabase shape: select case row and aggregate item counts/ledger sums.
      // Schema lives in supabase/migrations/0003_estate_liquidity_core.sql.
      // Once tables are populated, replace this stub with the real query.
      return null
    },
    {
      mode: getDataMode(),
      case: sampleEstateCase(),
      balance: ASSET_BALANCE,
      riskFlags: RISK_FLAGS,
    },
  )
}

export async function getEstateCase(caseId: string = DEFAULT_CASE_ID): Promise<EstateCase> {
  return tryOrFallback(async () => { void caseId; return null }, sampleEstateCase())
}

/* ─── Inventory ─── */

export async function getInventoryItems(caseId: string = DEFAULT_CASE_ID): Promise<InventoryItem[]> {
  return tryOrFallback(async () => { void caseId; return null }, INVENTORY)
}

export async function getItemDetail(itemId: string): Promise<InventoryItem | undefined> {
  return tryOrFallback(async () => null, INVENTORY.find(i => i.id === itemId))
}

/* ─── Offers ─── */

export async function getOffers(caseId: string = DEFAULT_CASE_ID): Promise<CashOffer[]> {
  return tryOrFallback(async () => { void caseId; return null }, CASH_OFFERS)
}

export async function getOfferStack(caseId: string = DEFAULT_CASE_ID) {
  return tryOrFallback(async () => { void caseId; return null }, OFFER_STACK)
}

/* ─── Ledger / statements ─── */

export async function getLedger(caseId: string = DEFAULT_CASE_ID): Promise<LedgerEntry[]> {
  return tryOrFallback(async () => { void caseId; return null }, LEDGER)
}

export async function getStatements(caseId: string = DEFAULT_CASE_ID): Promise<Statement[]> {
  return tryOrFallback(async () => { void caseId; return null }, STATEMENTS)
}

/* ─── Donations ─── */

export async function getDonations(caseId: string = DEFAULT_CASE_ID): Promise<{
  charities: Charity[]
  donatedItems: InventoryItem[]
}> {
  return tryOrFallback(async () => { void caseId; return null }, {
    charities: CHARITIES,
    donatedItems: INVENTORY.filter(i => i.disposition === 'donate'),
  })
}

/* ─── Appraisal runs ─── */

export async function getAppraisalRuns(caseId: string = DEFAULT_CASE_ID): Promise<AppraisalRun[]> {
  return tryOrFallback(async () => { void caseId; return null }, APPRAISAL_RUNS)
}

export async function getAppraisalRunForItem(itemId: string): Promise<AppraisalRun | undefined> {
  return tryOrFallback(async () => null, APPRAISAL_RUNS.find(r => r.itemId === itemId))
}

/* ─── Experts / review queue ─── */

export async function getExperts(): Promise<{ experts: Expert[]; queue: ExpertQueueRow[] }> {
  return tryOrFallback(async () => null, { experts: EXPERTS, queue: EXPERT_QUEUE })
}

/* ─── Capture rooms ─── */

export async function getCaptureState(caseId: string = DEFAULT_CASE_ID): Promise<{
  rooms: RoomCapture[]
  checklist: typeof CAPTURE_CHECKLIST
}> {
  return tryOrFallback(async () => { void caseId; return null }, { rooms: ROOM_CAPTURE, checklist: CAPTURE_CHECKLIST })
}

/* ─── Channels ─── */

export async function getChannelRecommendations(caseId: string = DEFAULT_CASE_ID): Promise<{
  matrix: ChannelMatrixForItem[]
  health: typeof CHANNEL_HEALTH
}> {
  return tryOrFallback(async () => { void caseId; return null }, { matrix: CHANNEL_MATRIX, health: CHANNEL_HEALTH })
}

export async function getChannelMatrixForItem(itemId: string): Promise<ChannelMatrixForItem | undefined> {
  return tryOrFallback(async () => null, CHANNEL_MATRIX.find(m => m.itemId === itemId))
}

/* ─── Compliance ─── */

export async function getComplianceState(caseId: string = DEFAULT_CASE_ID): Promise<ComplianceCheck[]> {
  return tryOrFallback(async () => { void caseId; return null }, COMPLIANCE_CHECKS)
}

/* ─── Trust receipts ─── */

export async function getTrustReceipts(opts: { caseId?: string; itemId?: string } = {}): Promise<TrustReceiptData[]> {
  const all = TRUST_RECEIPTS
  const filtered = opts.itemId ? all.filter(r => r.itemId === opts.itemId) : all
  return tryOrFallback(async () => null, filtered)
}

/* ─── Ops command center ─── */

export async function getOpsCommand(caseId: string = DEFAULT_CASE_ID): Promise<OpsEvent[]> {
  return tryOrFallback(async () => { void caseId; return null }, OPS_EVENTS)
}

/* ─── Insights / data moat ─── */

export async function getInsights(): Promise<{
  metrics: LearningMetric[]
  learnings: typeof PLATFORM_LEARNINGS
  experiments: typeof EXPERIMENTS
}> {
  return tryOrFallback(async () => null, {
    metrics: LEARNING_METRICS,
    learnings: PLATFORM_LEARNINGS,
    experiments: EXPERIMENTS,
  })
}

/* ─── Concierge ─── */

export async function getConcierge(caseId: string = DEFAULT_CASE_ID): Promise<{
  team: typeof CONCIERGE_TEAM
  timeline: typeof CONCIERGE_TIMELINE
}> {
  return tryOrFallback(async () => { void caseId; return null }, { team: CONCIERGE_TEAM, timeline: CONCIERGE_TIMELINE })
}
