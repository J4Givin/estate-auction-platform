/**
 * Row → domain mappers for the estate liquidity data layer.
 *
 * Supabase returns snake_case rows; the UI/domain types use camelCase. This
 * module is the single boundary where translation happens. Each mapper
 * tolerates partial / missing rows by falling back to sensible defaults so
 * the UI never crashes on a malformed response.
 */

import type {
  AppraisalAgent,
  AppraisalRun,
  CashOffer,
  Charity,
  ComplianceCheck,
  Expert,
  ExpertQueueRow,
  InventoryItem,
  LearningMetric,
  LedgerEntry,
  OfferStackEntry,
  OpsEvent,
  RoomCapture,
  Statement,
  TrustReceiptData,
  ChannelMatrixForItem,
  ChannelOption,
} from '@/lib/sample-data'

import type { EstateCase } from './types'

const cents = (v: number | null | undefined) => Math.round(((v ?? 0) as number) / 100)

/* ─── EstateCase ─── */

export function rowToEstateCase(
  row: Record<string, unknown> | null | undefined,
  itemAggregates: {
    total: number
    cataloged: number
    approved: number
    listed: number
    sold: number
    stored: number
    donated: number
    held: number
  } = {
    total: 0, cataloged: 0, approved: 0, listed: 0, sold: 0, stored: 0, donated: 0, held: 0,
  },
): EstateCase | null {
  if (!row) return null
  const r = row as Record<string, string | number | null>
  return {
    jobId: String(r.case_id ?? ''),
    estateName: String(r.estate_name ?? ''),
    itemsTotal: itemAggregates.total,
    itemsCataloged: itemAggregates.cataloged,
    itemsApproved: itemAggregates.approved,
    itemsListed: itemAggregates.listed,
    itemsSold: itemAggregates.sold,
    itemsStored: itemAggregates.stored,
    itemsDonated: itemAggregates.donated,
    itemsHeld: itemAggregates.held,
    estimatedNetLow: cents(r.estimated_net_low_cents as number),
    estimatedNetHigh: cents(r.estimated_net_high_cents as number),
    cashOfferAvailable: cents(r.cash_offer_available_cents as number),
    cashOfferExpires: String(r.cash_offer_expires ?? ''),
    proceedsToDate: cents(r.proceeds_to_date_cents as number),
    reservedForFees: cents(r.reserved_for_fees_cents as number),
    availableForPayout: cents(r.available_for_payout_cents as number),
    donationsToDate: cents(r.donations_to_date_cents as number),
    charityName: String((r as Record<string, unknown>).charity_name ?? ''),
    storageItems: 0,
    storageMonthlyCost: cents(r.storage_monthly_cost_cents as number),
    riskFlags: 0,
    pendingApprovals: 0,
  }
}

/* ─── InventoryItem ─── */

export function rowToInventoryItem(row: Record<string, unknown>): InventoryItem {
  const r = row as Record<string, unknown>
  return {
    id: String(r.item_id ?? ''),
    name: String(r.name ?? ''),
    room: String(r.room ?? ''),
    category: String(r.category ?? ''),
    estimateLow: cents(r.estimate_low_cents as number),
    estimateHigh: cents(r.estimate_high_cents as number),
    cashOffer: cents(r.cash_offer_cents as number),
    floorPrice: cents(r.floor_price_cents as number),
    status: ((r.status as InventoryItem['status']) ?? 'captured'),
    disposition: ((r.disposition as InventoryItem['disposition']) ?? 'undecided'),
    confidence: ((r.confidence as InventoryItem['confidence']) ?? 'medium'),
    aiRationale: String(r.ai_rationale ?? ''),
    humanReviewed: Boolean(r.human_reviewed),
    reviewer: (r.reviewer as InventoryItem['reviewer']) ?? undefined,
    comps: Array.isArray(r.comps) ? (r.comps as InventoryItem['comps']) : [],
    flags: Array.isArray(r.flags) ? (r.flags as string[]) : [],
    channels: Array.isArray(r.channels) ? (r.channels as string[]) : undefined,
    donationSuggested: r.donation_suggested === true,
    storageLocation: (r.storage_location as string) ?? undefined,
    evidenceSnapshot: (r.evidence_snapshot as string) ?? undefined,
  }
}

/* ─── Cash offers ─── */

export function rowToCashOffer(row: Record<string, unknown>): CashOffer {
  const r = row as Record<string, unknown>
  const raw = String(r.status ?? 'live')
  // Map DB enum (live | expiring | accepted | declined | countered) onto the
  // narrower UI enum used by the demo dataset.
  const status: CashOffer['status'] = raw === 'countered'
    ? 'live'
    : (raw as CashOffer['status'])
  return {
    id: String(r.offer_id ?? ''),
    scope: String(r.scope_label ?? r.scope ?? ''),
    amount: cents(r.amount_cents as number),
    expires: String(r.expires ?? ''),
    itemCount: Number(r.item_count ?? 0),
    description: String(r.description ?? ''),
    status,
  }
}

export function rowsToOfferStack(
  offers: Record<string, unknown>[],
  components: Record<string, unknown>[],
): OfferStackEntry[] {
  return offers.map(o => {
    const offerId = String(o.offer_id ?? '')
    const matchingComponents = components
      .filter(c => String(c.offer_id) === offerId)
      .sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0))
      .map(c => ({
        label: String(c.label ?? ''),
        value: cents(c.value_cents as number),
        pct: Number(c.pct ?? 0),
        detail: String(c.detail ?? ''),
        color: String(c.color ?? '#826DEE'),
      }))
    return {
      scope: ((o.scope as OfferStackEntry['scope']) ?? 'estate'),
      scopeLabel: String(o.scope_label ?? ''),
      offerAmount: cents(o.amount_cents as number),
      managedNetLow: cents(o.managed_net_low_cents as number),
      managedNetHigh: cents(o.managed_net_high_cents as number),
      itemCount: Number(o.item_count ?? 0),
      expires: String(o.expires ?? ''),
      payoutEta: String(o.payout_eta ?? ''),
      reserves: cents(o.reserves_cents as number),
      components: matchingComponents,
    }
  })
}

/* ─── Ledger / statements ─── */

export function rowToLedgerEntry(row: Record<string, unknown>): LedgerEntry {
  const r = row as Record<string, unknown>
  return {
    id: String(r.entry_id ?? r.id ?? ''),
    date: String(r.created_at ?? '').slice(0, 10),
    description: String(r.description ?? ''),
    type: ((r.type as LedgerEntry['type']) ?? 'sale'),
    gross: cents(r.gross_cents as number),
    fee: cents(r.fee_cents as number),
    net: cents(r.net_cents as number),
    channel: (r.channel as string) ?? undefined,
  }
}

export function rowToStatement(row: Record<string, unknown>): Statement {
  const r = row as Record<string, unknown>
  return {
    id: String(r.statement_id ?? r.id ?? ''),
    period: String(r.period ?? ''),
    generated: String(r.generated_at ?? '').slice(0, 10),
    net: cents(r.net_cents as number),
    status: ((r.status as Statement['status']) ?? 'ready'),
    downloadUrl: (r.download_url as string) ?? '#',
  }
}

/* ─── Charities ─── */

export function rowToCharity(row: Record<string, unknown>): Charity {
  const r = row as Record<string, unknown>
  return {
    id: String(r.charity_id ?? ''),
    name: String(r.charity_name ?? r.name ?? ''),
    mission: String(r.mission ?? ''),
    ein: String(r.ein ?? ''),
    selected: r.selected !== false,
    taxReceipts: Number(r.tax_receipts ?? 0),
    totalRouted: cents(r.total_routed_cents as number),
  }
}

/* ─── Appraisal runs ─── */

export function rowsToAppraisalRun(
  run: Record<string, unknown>,
  stages: Record<string, unknown>[],
): AppraisalRun {
  const r = run
  const agents: AppraisalAgent[] = stages
    .filter(s => String(s.run_id) === String(r.run_id))
    .map(s => ({
      stage: (s.stage as AppraisalAgent['stage']) ?? 'classify',
      title: String(s.title ?? humanizeStage(String(s.stage ?? ''))),
      oneLine: String(s.one_line ?? ''),
      state: (s.state as AppraisalAgent['state']) ?? 'queued',
      confidence: Number(s.confidence ?? 0),
      evidence: Array.isArray(s.evidence)
        ? (s.evidence as Array<Record<string, unknown> | string>).map(e =>
            typeof e === 'string' ? e : String((e as Record<string, unknown>).text ?? JSON.stringify(e)),
          )
        : [],
      output: String(s.output ?? ''),
      humanTrigger: (s.human_trigger as string) ?? undefined,
      nextAction: (s.next_action as string) ?? undefined,
      ranAt: (s.ran_at as string) ?? undefined,
      durationMs: s.duration_ms ? Number(s.duration_ms) : undefined,
    }))
  return {
    itemId: String(r.item_id ?? ''),
    itemName: String(r.item_name ?? ''),
    category: String(r.category ?? ''),
    startedAt: String(r.started_at ?? ''),
    finalConfidence: Number(r.final_confidence ?? 0),
    finalEstimate: {
      low: cents(r.final_estimate_low_cents as number),
      high: cents(r.final_estimate_high_cents as number),
    },
    agents,
  }
}

function humanizeStage(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Agent'
}

/* ─── Experts / queue ─── */

export function rowToExpert(row: Record<string, unknown>): Expert {
  const r = row
  return {
    id: String(r.expert_id ?? ''),
    name: String(r.name ?? ''),
    specialty: String(r.specialty ?? ''),
    credential: String(r.credential ?? ''),
    rating: Number(r.rating ?? 0),
    reviewsCount: Number(r.reviews_count ?? 0),
    accuracy: Number(r.accuracy ?? 0),
    responseTime: String(r.response_time ?? ''),
    status: (r.status as Expert['status']) ?? 'available',
    bio: String(r.bio ?? ''),
    region: String(r.region ?? ''),
    hourlyRate: r.hourly_rate_cents ? cents(r.hourly_rate_cents as number) : undefined,
  }
}

export function rowToExpertQueue(row: Record<string, unknown>): ExpertQueueRow {
  const r = row
  const queuedAt = String(r.queued_at ?? new Date().toISOString())
  const hoursOpen =
    r.resolved_at != null
      ? 0
      : Math.max(0, Math.round((Date.now() - new Date(queuedAt).getTime()) / 36e5))
  return {
    id: String(r.queue_id ?? r.id ?? ''),
    itemId: String(r.item_id ?? ''),
    itemName: String(r.item_name ?? ''),
    category: String(r.category ?? ''),
    estimateLow: cents(r.estimate_low_cents as number),
    estimateHigh: cents(r.estimate_high_cents as number),
    state: (r.state as ExpertQueueRow['state']) ?? 'needed',
    expertId: (r.expert_id as string) ?? undefined,
    assignedAt: (r.assigned_at as string) ?? undefined,
    slaHours: Number(r.sla_hours ?? 48),
    hoursOpen,
    notes: (r.notes as string) ?? undefined,
  }
}

/* ─── Capture ─── */

export function rowToRoomCapture(row: Record<string, unknown>): RoomCapture {
  const r = row
  return {
    id: String(r.room_id ?? ''),
    name: String(r.name ?? ''),
    itemsExpected: Number(r.items_expected ?? 0),
    itemsCaptured: Number(r.items_captured ?? 0),
    coverageScore: Number(r.coverage_score ?? 0),
    missingAngles: Array.isArray(r.missing_angles) ? (r.missing_angles as string[]) : [],
    qualityIssues: Array.isArray(r.quality_issues) ? (r.quality_issues as string[]) : [],
    piiRedacted: Number(r.pii_redacted ?? 0),
    status: (r.status as RoomCapture['status']) ?? 'incomplete',
    lastCapturedAt: (r.last_captured_at as string) ?? undefined,
  }
}

/* ─── Trust receipts ─── */

export function rowToTrustReceipt(row: Record<string, unknown>): TrustReceiptData {
  const r = row
  return {
    id: String(r.receipt_id ?? r.id ?? ''),
    kind: (r.kind as TrustReceiptData['kind']) ?? 'appraisal',
    itemId: (r.item_id as string) ?? undefined,
    title: String(r.title ?? ''),
    what: String(r.what ?? ''),
    why: String(r.why ?? ''),
    evidence: Array.isArray(r.evidence) ? (r.evidence as string[]) : [],
    approver: String(r.approver ?? ''),
    approverRole: String(r.approver_role ?? ''),
    timestamp: String(r.created_at ?? ''),
    immutableSnapshotId: String(r.immutable_snapshot_id ?? ''),
    disputeUrl: (r.dispute_url as string) ?? undefined,
  }
}

/* ─── Channel matrix ─── */

export function rowsToChannelMatrix(
  channels: Record<string, unknown>[],
  items: Record<string, unknown>[],
): ChannelMatrixForItem[] {
  const byItem = new Map<string, ChannelOption[]>()
  for (const c of channels) {
    const itemId = String(c.item_id ?? '')
    if (!byItem.has(itemId)) byItem.set(itemId, [])
    byItem.get(itemId)!.push({
      id: String(c.channel ?? '').toLowerCase().replace(/\s+/g, '_'),
      name: String(c.channel ?? ''),
      fitScore: Number(c.fit_score ?? 0),
      expectedDays: Number(c.expected_days ?? 0),
      expectedNet: cents(c.expected_net_cents as number),
      feePct: Number(c.fee_pct ?? 0),
      policyRisk: ((c.policy_risk as ChannelOption['policyRisk']) ?? 'low'),
      fulfillmentBurden: ((c.fulfillment_burden as ChannelOption['fulfillmentBurden']) ?? 'medium'),
      bestFor: String(c.best_for ?? ''),
      notes: String(c.notes ?? ''),
    })
  }
  const result: ChannelMatrixForItem[] = []
  for (const item of items) {
    const itemId = String(item.item_id ?? '')
    const opts = byItem.get(itemId)
    if (!opts || opts.length === 0) continue
    const recommended = channels.find(c => String(c.item_id) === itemId && c.recommended === true)
    result.push({
      itemId,
      itemName: String(item.name ?? ''),
      category: String(item.category ?? ''),
      options: opts,
      recommendedId: recommended
        ? String(recommended.channel ?? '').toLowerCase().replace(/\s+/g, '_')
        : opts[0]?.id ?? '',
    })
  }
  return result
}

/* ─── Compliance ─── */

export function rowToComplianceCheck(row: Record<string, unknown>): ComplianceCheck {
  const r = row
  return {
    id: String(r.check_id ?? r.id ?? ''),
    area: String(r.area ?? ''),
    state: (r.state as ComplianceCheck['state']) ?? 'green',
    label: String(r.label ?? ''),
    detail: String(r.detail ?? ''),
    evidence: Array.isArray(r.evidence) ? (r.evidence as string[]) : [],
  }
}

/* ─── Ops events ─── */

export function rowToOpsEvent(row: Record<string, unknown>): OpsEvent {
  const r = row
  return {
    id: String(r.event_id ?? r.id ?? ''),
    kind: (r.kind as OpsEvent['kind']) ?? 'pickup_scheduled',
    itemId: (r.item_id as string) ?? undefined,
    jobId: String(r.case_id ?? ''),
    title: String(r.title ?? ''),
    detail: String(r.detail ?? ''),
    ts: String(r.ts ?? ''),
    status: (r.status as OpsEvent['status']) ?? 'ok',
    evidence: Array.isArray(r.evidence) ? (r.evidence as string[]) : undefined,
    owner: (r.owner as string) ?? undefined,
  }
}

/* ─── Learning metrics ─── */

export function rowToLearningMetric(row: Record<string, unknown>): LearningMetric {
  const r = row
  return {
    id: String(r.metric_id ?? r.id ?? ''),
    label: String(r.label ?? ''),
    value: String(r.value ?? ''),
    trend: { up: Boolean(r.trend_up), pct: Number(r.trend_pct ?? 0) },
    description: String(r.description ?? ''),
    color: String(r.color ?? '#826DEE'),
  }
}
