/**
 * Read-path data access for the customer portal.
 *
 * Each function attempts a Supabase-backed query when env is configured,
 * otherwise returns the sample-data snapshot the demo experience uses.
 *
 * The functions are safe to call from server components, client components,
 * and route handlers — Supabase work is deferred behind `isSupabaseConfigured`
 * so the bundle stays tree-shakable in demo mode.
 *
 * NOTE: All Supabase calls go through `getServerSupabase()` which is marked
 * `server-only`. If a reader is invoked from a client bundle by mistake,
 * the build fails fast — by design.
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
import { listSessionReceipts } from './trust'
import {
  rowToCashOffer,
  rowToCharity,
  rowToComplianceCheck,
  rowToEstateCase,
  rowToExpert,
  rowToExpertQueue,
  rowToInventoryItem,
  rowToLearningMetric,
  rowToLedgerEntry,
  rowToOpsEvent,
  rowToRoomCapture,
  rowToStatement,
  rowToTrustReceipt,
  rowsToAppraisalRun,
  rowsToChannelMatrix,
  rowsToOfferStack,
} from './mappers'

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
    if (Array.isArray(v) && v.length === 0) return fallback
    return v
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[data] supabase read failed, using sample data:', (err as Error).message)
    }
    return fallback
  }
}

async function sb() {
  const { getServerSupabase } = await import('./supabase-server')
  return getServerSupabase()
}

/* ─── Portal overview / case ─── */

export async function getPortalOverview(caseId: string = DEFAULT_CASE_ID) {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const [{ data: caseRow }, { data: itemRows }] = await Promise.all([
        client.from('estate_cases').select('*').eq('case_id', caseId).maybeSingle(),
        client.from('inventory_items').select('status,disposition').eq('case_id', caseId),
      ])
      if (!caseRow) return null
      const items = (itemRows ?? []) as Array<{ status: string; disposition: string }>
      const aggregates = {
        total: items.length,
        cataloged: items.filter(i => i.status !== 'captured').length,
        approved: items.filter(i => ['authenticated', 'listed', 'sold'].includes(i.status)).length,
        listed: items.filter(i => i.status === 'listed').length,
        sold: items.filter(i => i.status === 'sold').length,
        stored: items.filter(i => i.status === 'stored').length,
        donated: items.filter(i => i.status === 'donated').length,
        held: items.filter(i => i.status === 'on_hold').length,
      }
      const estateCase = rowToEstateCase(caseRow as Record<string, unknown>, aggregates)
      if (!estateCase) return null
      return {
        mode: getDataMode(),
        case: estateCase,
        balance: ASSET_BALANCE,
        riskFlags: RISK_FLAGS,
      }
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
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data, error } = await client.from('estate_cases').select('*').eq('case_id', caseId).maybeSingle()
      if (error || !data) return null
      return rowToEstateCase(data as Record<string, unknown>)
    },
    sampleEstateCase(),
  )
}

/* ─── Inventory ─── */

export async function getInventoryItems(caseId: string = DEFAULT_CASE_ID): Promise<InventoryItem[]> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data, error } = await client
        .from('inventory_items')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true })
      if (error || !data) return null
      return data.map(rowToInventoryItem)
    },
    INVENTORY,
  )
}

export async function getItemDetail(itemId: string): Promise<InventoryItem | undefined> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return undefined
      const { data, error } = await client.from('inventory_items').select('*').eq('item_id', itemId).maybeSingle()
      if (error || !data) return undefined
      return rowToInventoryItem(data as Record<string, unknown>)
    },
    INVENTORY.find(i => i.id === itemId),
  )
}

/* ─── Offers ─── */

export async function getOffers(caseId: string = DEFAULT_CASE_ID): Promise<CashOffer[]> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data, error } = await client
        .from('cash_offers')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
      if (error || !data) return null
      return data.map(rowToCashOffer)
    },
    CASH_OFFERS,
  )
}

export async function getOfferStack(caseId: string = DEFAULT_CASE_ID) {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data: offers, error: offerErr } = await client
        .from('cash_offers')
        .select('*')
        .eq('case_id', caseId)
        .in('status', ['live', 'expiring'])
      if (offerErr || !offers || offers.length === 0) return null
      const offerIds = offers.map(o => (o as Record<string, unknown>).offer_id as string)
      const { data: comps } = await client
        .from('offer_components')
        .select('*')
        .in('offer_id', offerIds)
      return rowsToOfferStack(offers as Record<string, unknown>[], (comps ?? []) as Record<string, unknown>[])
    },
    OFFER_STACK,
  )
}

/* ─── Ledger / statements ─── */

export async function getLedger(caseId: string = DEFAULT_CASE_ID): Promise<LedgerEntry[]> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data, error } = await client
        .from('ledger_entries')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
        .limit(200)
      if (error || !data) return null
      return data.map(rowToLedgerEntry)
    },
    LEDGER,
  )
}

export async function getStatements(caseId: string = DEFAULT_CASE_ID): Promise<Statement[]> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data, error } = await client
        .from('statements')
        .select('*')
        .eq('case_id', caseId)
        .order('generated_at', { ascending: false })
        .limit(24)
      if (error || !data) return null
      return data.map(rowToStatement)
    },
    STATEMENTS,
  )
}

/* ─── Donations ─── */

export async function getDonations(caseId: string = DEFAULT_CASE_ID): Promise<{
  charities: Charity[]
  donatedItems: InventoryItem[]
}> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const [{ data: prefs }, { data: items }] = await Promise.all([
        client.from('donation_preferences').select('*').eq('case_id', caseId),
        client.from('inventory_items').select('*').eq('case_id', caseId).eq('disposition', 'donate'),
      ])
      if (!prefs || prefs.length === 0) return null
      return {
        charities: prefs.map(rowToCharity),
        donatedItems: (items ?? []).map(rowToInventoryItem),
      }
    },
    {
      charities: CHARITIES,
      donatedItems: INVENTORY.filter(i => i.disposition === 'donate'),
    },
  )
}

/* ─── Appraisal runs ─── */

export async function getAppraisalRuns(caseId: string = DEFAULT_CASE_ID): Promise<AppraisalRun[]> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data: itemRows } = await client.from('inventory_items').select('item_id').eq('case_id', caseId)
      const itemIds = (itemRows ?? []).map(r => (r as Record<string, unknown>).item_id as string)
      const runQuery = itemIds.length > 0
        ? client.from('appraisal_runs').select('*').in('item_id', itemIds).order('started_at', { ascending: false })
        : client.from('appraisal_runs').select('*').order('started_at', { ascending: false }).limit(20)
      const { data: runs } = await runQuery
      if (!runs || runs.length === 0) return null
      const runIds = runs.map(r => (r as Record<string, unknown>).run_id as string)
      const { data: stages } = await client.from('appraisal_stages').select('*').in('run_id', runIds)
      return runs.map(r => rowsToAppraisalRun(r as Record<string, unknown>, (stages ?? []) as Record<string, unknown>[]))
    },
    APPRAISAL_RUNS,
  )
}

export async function getAppraisalRunForItem(itemId: string): Promise<AppraisalRun | undefined> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return undefined
      const { data: run } = await client
        .from('appraisal_runs')
        .select('*')
        .eq('item_id', itemId)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (!run) return undefined
      const runId = (run as Record<string, unknown>).run_id as string
      const { data: stages } = await client.from('appraisal_stages').select('*').eq('run_id', runId)
      return rowsToAppraisalRun(run as Record<string, unknown>, (stages ?? []) as Record<string, unknown>[])
    },
    APPRAISAL_RUNS.find(r => r.itemId === itemId),
  )
}

/* ─── Experts / review queue ─── */

export async function getExperts(): Promise<{ experts: Expert[]; queue: ExpertQueueRow[] }> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const [{ data: experts }, { data: queue }, { data: items }] = await Promise.all([
        client.from('expert_profiles').select('*'),
        client.from('expert_queue_items').select('*').order('queued_at', { ascending: false }),
        client.from('inventory_items').select('item_id,name,category,estimate_low_cents,estimate_high_cents'),
      ])
      if (!experts || experts.length === 0) return null
      const itemMap = new Map<string, Record<string, unknown>>()
      for (const it of items ?? []) {
        const r = it as Record<string, unknown>
        itemMap.set(String(r.item_id), r)
      }
      const queueRows = (queue ?? []).map(q => {
        const qr = q as Record<string, unknown>
        const it = itemMap.get(String(qr.item_id ?? ''))
        return rowToExpertQueue({
          ...qr,
          item_name: it?.name ?? '',
          category: it?.category ?? '',
          estimate_low_cents: it?.estimate_low_cents ?? 0,
          estimate_high_cents: it?.estimate_high_cents ?? 0,
        })
      })
      return { experts: experts.map(rowToExpert), queue: queueRows }
    },
    { experts: EXPERTS, queue: EXPERT_QUEUE },
  )
}

/* ─── Capture rooms ─── */

export async function getCaptureState(caseId: string = DEFAULT_CASE_ID): Promise<{
  rooms: RoomCapture[]
  checklist: typeof CAPTURE_CHECKLIST
}> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data: rooms } = await client
        .from('capture_rooms')
        .select('*')
        .eq('case_id', caseId)
        .order('name', { ascending: true })
      if (!rooms || rooms.length === 0) return null
      return { rooms: rooms.map(rowToRoomCapture), checklist: CAPTURE_CHECKLIST }
    },
    { rooms: ROOM_CAPTURE, checklist: CAPTURE_CHECKLIST },
  )
}

/* ─── Channels ─── */

export async function getChannelRecommendations(caseId: string = DEFAULT_CASE_ID): Promise<{
  matrix: ChannelMatrixForItem[]
  health: typeof CHANNEL_HEALTH
}> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data: items } = await client
        .from('inventory_items')
        .select('item_id,name,category')
        .eq('case_id', caseId)
      const itemIds = (items ?? []).map(i => (i as Record<string, unknown>).item_id as string)
      if (itemIds.length === 0) return null
      const { data: channels } = await client
        .from('channel_recommendations')
        .select('*')
        .in('item_id', itemIds)
      if (!channels || channels.length === 0) return null
      return {
        matrix: rowsToChannelMatrix(
          channels as Record<string, unknown>[],
          (items ?? []) as Record<string, unknown>[],
        ),
        health: CHANNEL_HEALTH,
      }
    },
    { matrix: CHANNEL_MATRIX, health: CHANNEL_HEALTH },
  )
}

export async function getChannelMatrixForItem(itemId: string): Promise<ChannelMatrixForItem | undefined> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return undefined
      const [{ data: item }, { data: channels }] = await Promise.all([
        client.from('inventory_items').select('item_id,name,category').eq('item_id', itemId).maybeSingle(),
        client.from('channel_recommendations').select('*').eq('item_id', itemId),
      ])
      if (!item || !channels || channels.length === 0) return undefined
      const matrix = rowsToChannelMatrix(
        channels as Record<string, unknown>[],
        [item as Record<string, unknown>],
      )
      return matrix[0]
    },
    CHANNEL_MATRIX.find(m => m.itemId === itemId),
  )
}

/* ─── Compliance ─── */

export async function getComplianceState(caseId: string = DEFAULT_CASE_ID): Promise<ComplianceCheck[]> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data, error } = await client
        .from('compliance_checks')
        .select('*')
        .eq('case_id', caseId)
        .order('updated_at', { ascending: false })
      if (error || !data) return null
      return data.map(rowToComplianceCheck)
    },
    COMPLIANCE_CHECKS,
  )
}

/* ─── Trust receipts ─── */

export async function getTrustReceipts(opts: { caseId?: string; itemId?: string } = {}): Promise<TrustReceiptData[]> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      let q = client.from('trust_receipts').select('*').order('created_at', { ascending: false }).limit(200)
      if (opts.itemId) q = q.eq('item_id', opts.itemId)
      else if (opts.caseId) q = q.eq('case_id', opts.caseId)
      const { data, error } = await q
      if (error || !data) return null
      return data.map(rowToTrustReceipt)
    },
    (() => {
      const all = listSessionReceipts()
      return opts.itemId ? all.filter(r => r.itemId === opts.itemId) : all
    })(),
  )
}

/* ─── Ops command center ─── */

export async function getOpsCommand(caseId: string = DEFAULT_CASE_ID): Promise<OpsEvent[]> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const { data, error } = await client
        .from('ops_events')
        .select('*')
        .eq('case_id', caseId)
        .order('ts', { ascending: false })
        .limit(100)
      if (error || !data) return null
      return data.map(rowToOpsEvent)
    },
    OPS_EVENTS,
  )
}

/* ─── Insights / data moat ─── */

export async function getInsights(): Promise<{
  metrics: LearningMetric[]
  learnings: typeof PLATFORM_LEARNINGS
  experiments: typeof EXPERIMENTS
}> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      const [{ data: metrics }, { data: experiments }] = await Promise.all([
        client.from('learning_metrics').select('*').order('measured_at', { ascending: false }).limit(24),
        client.from('learning_experiments').select('*').order('started_at', { ascending: false }).limit(24),
      ])
      if (!metrics || metrics.length === 0) return null
      return {
        metrics: metrics.map(rowToLearningMetric),
        learnings: PLATFORM_LEARNINGS,
        experiments: (experiments ?? []).map(e => {
          const er = e as Record<string, unknown>
          return {
            id: String(er.experiment_id ?? er.id ?? ''),
            name: String(er.name ?? ''),
            status: String(er.status ?? ''),
            uplift: String(er.uplift ?? ''),
            cohort: String(er.cohort ?? ''),
            color: String(er.color ?? '#0E9F6E'),
          }
        }) as typeof EXPERIMENTS,
      }
    },
    {
      metrics: LEARNING_METRICS,
      learnings: PLATFORM_LEARNINGS,
      experiments: EXPERIMENTS,
    },
  )
}

/* ─── Concierge ─── */

export async function getConcierge(caseId: string = DEFAULT_CASE_ID): Promise<{
  team: typeof CONCIERGE_TEAM
  timeline: typeof CONCIERGE_TIMELINE
}> {
  return tryOrFallback(
    async () => {
      const client = await sb()
      if (!client) return null
      // Concierge tables aren't in 0003 — pull a recent ops slice as a
      // lightweight timeline if rows exist; otherwise fall through to demo.
      const { data: events } = await client
        .from('ops_events')
        .select('event_id,title,ts,kind')
        .eq('case_id', caseId)
        .order('ts', { ascending: false })
        .limit(8)
      if (!events || events.length === 0) return null
      const timeline = events.map(e => {
        const er = e as Record<string, unknown>
        return {
          id: String(er.event_id ?? ''),
          date: String(er.ts ?? '').slice(0, 10),
          label: String(er.title ?? ''),
          kind: String(er.kind ?? 'event'),
          color: '#826DEE',
        }
      })
      return { team: CONCIERGE_TEAM, timeline: timeline as typeof CONCIERGE_TIMELINE }
    },
    { team: CONCIERGE_TEAM, timeline: CONCIERGE_TIMELINE },
  )
}

// Re-export the trust-receipt session helper so callers that already import
// from this module's location keep working.
export { TRUST_RECEIPTS as DEMO_TRUST_RECEIPTS }
