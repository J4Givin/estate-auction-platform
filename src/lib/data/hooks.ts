'use client'

/**
 * Client-side React hooks that wrap the portal data readers.
 *
 * Each hook seeds itself with the existing sample-data snapshot so the UI
 * paints instantly (no skeleton flash in demo mode), then refreshes with
 * the Supabase-backed result on mount. This keeps the native-app feel of
 * the portal even when live data is wired up.
 */

import { useEffect, useState, useCallback } from 'react'

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
} from '@/lib/sample-data'
import {
  getPortalOverview,
  getInventoryItems,
  getItemDetail,
  getOffers,
  getOfferStack,
  getLedger,
  getDonations,
  getAppraisalRuns,
  getAppraisalRunForItem,
  getExperts,
  getCaptureState,
  getChannelRecommendations,
  getChannelMatrixForItem,
  getComplianceState,
  getOpsCommand,
  getInsights,
  getConcierge,
  getStatements,
  getTrustReceipts,
  getEstateCase,
} from './readers'
import { getDataMode, type DataMode } from './env'

interface AsyncState<T> {
  data: T
  loading: boolean
  error?: string
  mode: DataMode
  refresh: () => void
}

function useAsync<T>(seed: T, loader: () => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T>(seed)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>()
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loader()
      .then(d => {
        if (!cancelled) setData(d)
      })
      .catch(e => {
        if (!cancelled) setError((e as Error).message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  return { data, loading, error, mode: getDataMode(), refresh }
}

/* ─── seed snapshots ─── */

const seedOverview = {
  mode: getDataMode(),
  case: {
    jobId: PORTFOLIO_SUMMARY.jobId,
    estateName: PORTFOLIO_SUMMARY.estateName,
    itemsTotal: PORTFOLIO_SUMMARY.itemsTotal,
    itemsCataloged: PORTFOLIO_SUMMARY.itemsCataloged,
    itemsApproved: PORTFOLIO_SUMMARY.itemsApproved,
    itemsListed: PORTFOLIO_SUMMARY.itemsListed,
    itemsSold: PORTFOLIO_SUMMARY.itemsSold,
    itemsStored: PORTFOLIO_SUMMARY.itemsStored,
    itemsDonated: PORTFOLIO_SUMMARY.itemsDonated,
    itemsHeld: PORTFOLIO_SUMMARY.itemsHeld,
    estimatedNetLow: PORTFOLIO_SUMMARY.estimatedNetLow,
    estimatedNetHigh: PORTFOLIO_SUMMARY.estimatedNetHigh,
    cashOfferAvailable: PORTFOLIO_SUMMARY.cashOfferAvailable,
    cashOfferExpires: PORTFOLIO_SUMMARY.cashOfferExpires,
    proceedsToDate: PORTFOLIO_SUMMARY.proceedsToDate,
    reservedForFees: PORTFOLIO_SUMMARY.reservedForFees,
    availableForPayout: PORTFOLIO_SUMMARY.availableForPayout,
    donationsToDate: PORTFOLIO_SUMMARY.donationsToDate,
    charityName: PORTFOLIO_SUMMARY.charityName,
    storageItems: PORTFOLIO_SUMMARY.storageItems,
    storageMonthlyCost: PORTFOLIO_SUMMARY.storageMonthlyCost,
    riskFlags: PORTFOLIO_SUMMARY.riskFlags,
    pendingApprovals: PORTFOLIO_SUMMARY.pendingApprovals,
  },
  balance: ASSET_BALANCE,
  riskFlags: RISK_FLAGS,
}

export function usePortalOverview(caseId?: string) {
  return useAsync(seedOverview, () => getPortalOverview(caseId) as Promise<typeof seedOverview>)
}

export function useEstateCase(caseId?: string) {
  return useAsync(seedOverview.case, () => getEstateCase(caseId))
}

export function useInventory(caseId?: string) {
  return useAsync(INVENTORY, () => getInventoryItems(caseId))
}

export function useItemDetail(itemId: string) {
  return useAsync(INVENTORY.find(i => i.id === itemId), () => getItemDetail(itemId))
}

export function useOffers(caseId?: string) {
  return useAsync(CASH_OFFERS, () => getOffers(caseId))
}

export function useOfferStack(caseId?: string) {
  return useAsync(OFFER_STACK, () => getOfferStack(caseId))
}

export function useLedger(caseId?: string) {
  return useAsync(LEDGER, () => getLedger(caseId))
}

export function useStatements(caseId?: string) {
  return useAsync(STATEMENTS, () => getStatements(caseId))
}

export function useDonations(caseId?: string) {
  return useAsync(
    { charities: CHARITIES, donatedItems: INVENTORY.filter(i => i.disposition === 'donate') },
    () => getDonations(caseId),
  )
}

export function useAppraisalRuns(caseId?: string) {
  return useAsync(APPRAISAL_RUNS, () => getAppraisalRuns(caseId))
}

export function useAppraisalRun(itemId: string) {
  return useAsync(APPRAISAL_RUNS.find(r => r.itemId === itemId), () => getAppraisalRunForItem(itemId))
}

export function useExperts() {
  return useAsync({ experts: EXPERTS, queue: EXPERT_QUEUE }, () => getExperts())
}

export function useCaptureState(caseId?: string) {
  return useAsync({ rooms: ROOM_CAPTURE, checklist: CAPTURE_CHECKLIST }, () => getCaptureState(caseId))
}

export function useChannels(caseId?: string) {
  return useAsync({ matrix: CHANNEL_MATRIX, health: CHANNEL_HEALTH }, () => getChannelRecommendations(caseId))
}

export function useChannelMatrix(itemId: string) {
  return useAsync(CHANNEL_MATRIX.find(c => c.itemId === itemId), () => getChannelMatrixForItem(itemId))
}

export function useCompliance(caseId?: string) {
  return useAsync(COMPLIANCE_CHECKS, () => getComplianceState(caseId))
}

export function useOpsCommand(caseId?: string) {
  return useAsync(OPS_EVENTS, () => getOpsCommand(caseId))
}

export function useInsights() {
  return useAsync(
    { metrics: LEARNING_METRICS, learnings: PLATFORM_LEARNINGS, experiments: EXPERIMENTS },
    () => getInsights(),
  )
}

export function useConcierge(caseId?: string) {
  return useAsync({ team: CONCIERGE_TEAM, timeline: CONCIERGE_TIMELINE }, () => getConcierge(caseId))
}

export function useTrustReceipts(opts: { caseId?: string; itemId?: string } = {}) {
  const seed = opts.itemId ? TRUST_RECEIPTS.filter(r => r.itemId === opts.itemId) : TRUST_RECEIPTS
  return useAsync(seed, () => getTrustReceipts(opts))
}
