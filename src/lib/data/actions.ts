/**
 * Write actions for the customer portal.
 *
 * Each action:
 *   1. validates input (zod),
 *   2. attempts a Supabase mutation when configured,
 *   3. always emits a trust receipt as a side effect (append-only),
 *   4. returns a deterministic mock response in demo mode shaped like prod.
 */

import { z } from 'zod'

import { isSupabaseConfigured, getDataMode } from './env'
import { createTrustReceipt } from './trust'
import type {
  AcceptOfferInput,
  AssignExpertInput,
  ChangeDispositionInput,
  CounterOfferInput,
  RequestPayoutInput,
  RequestStatementInput,
  SetFloorPriceInput,
  StopSellInput,
  UpdateCaptureChecklistInput,
  UpdateDonationRoutingInput,
  WriteResult,
} from './types'

/** Optional actor identity from auth context. Pass-through; never required. */
export interface ActorIdentity {
  actorUserId?: string | null
}

/* ─── Validation schemas ─── */

const dispositionEnum = z.enum([
  'undecided',
  'sell_managed',
  'sell_to_platform',
  'store',
  'donate',
  'keep',
  'dispose',
])

export const AcceptOfferSchema = z.object({
  offerId: z.string().min(1),
  caseId: z.string().min(1).optional(),
  actor: z.string().min(1),
})

export const CounterOfferSchema = z.object({
  offerId: z.string().min(1),
  counterAmount: z.number().int().positive(),
  message: z.string().max(2000).optional(),
  actor: z.string().min(1),
})

export const SetFloorPriceSchema = z.object({
  itemId: z.string().min(1),
  floorPrice: z.number().int().nonnegative(),
  actor: z.string().min(1),
})

export const ChangeDispositionSchema = z.object({
  itemId: z.string().min(1),
  disposition: dispositionEnum,
  actor: z.string().min(1),
  reason: z.string().max(2000).optional(),
})

export const StopSellSchema = z.object({
  itemId: z.string().min(1),
  reason: z.string().min(1),
  actor: z.string().min(1),
  legalHold: z.boolean().optional(),
})

export const RequestPayoutSchema = z.object({
  caseId: z.string().min(1),
  amount: z.number().int().positive(),
  destination: z.string().max(200).optional(),
  actor: z.string().min(1),
})

export const UpdateDonationRoutingSchema = z.object({
  caseId: z.string().min(1),
  charityId: z.string().min(1),
  actor: z.string().min(1),
})

export const AssignExpertSchema = z.object({
  itemId: z.string().min(1),
  expertId: z.string().optional(),
  notes: z.string().max(2000).optional(),
  actor: z.string().min(1),
})

export const UpdateCaptureChecklistSchema = z.object({
  roomId: z.string().min(1),
  checklistItemId: z.string().min(1),
  done: z.boolean(),
  actor: z.string().min(1),
})

export const RequestStatementSchema = z.object({
  caseId: z.string().min(1),
  period: z.string().min(1),
  actor: z.string().min(1),
})

/* ─── Helpers ─── */

async function trySupabaseInsert(table: string, payload: Record<string, unknown>): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const { getServerSupabase } = await import('./supabase-server')
    const sb = await getServerSupabase()
    if (!sb) return null
    const { error } = await sb.from(table).insert(payload)
    if (error) return error.message
    return null
  } catch (err) {
    return (err as Error).message
  }
}

async function trySupabaseUpsert(
  table: string,
  payload: Record<string, unknown>,
  onConflict: string,
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const { getServerSupabase } = await import('./supabase-server')
    const sb = await getServerSupabase()
    if (!sb) return null
    const { error } = await sb.from(table).upsert(payload, { onConflict })
    if (error) return error.message
    return null
  } catch (err) {
    return (err as Error).message
  }
}

async function trySupabaseUpdate(
  table: string,
  patch: Record<string, unknown>,
  match: Record<string, unknown>,
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const { getServerSupabase } = await import('./supabase-server')
    const sb = await getServerSupabase()
    if (!sb) return null
    let q = sb.from(table).update(patch)
    for (const [k, v] of Object.entries(match)) q = q.eq(k, v as never)
    const { error } = await q
    if (error) return error.message
    return null
  } catch (err) {
    return (err as Error).message
  }
}

/* ─── Actions ─── */

export async function acceptCashOffer(
  input: AcceptOfferInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ offerId: string }>> {
  const parsed = AcceptOfferSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseInsert('offer_decisions', {
    offer_id: parsed.data.offerId,
    case_id: parsed.data.caseId ?? null,
    decision: 'accepted',
    actor: parsed.data.actor,
    actor_user_id: identity.actorUserId ?? null,
    decided_at: new Date().toISOString(),
  })
  // Reflect status on the cash_offers row so UI lists update immediately.
  await trySupabaseUpdate('cash_offers', { status: 'accepted', updated_at: new Date().toISOString() }, { offer_id: parsed.data.offerId })

  const receipt = await createTrustReceipt({
    kind: 'payout',
    title: `Cash offer ${parsed.data.offerId} accepted`,
    what: `Customer accepted cash offer ${parsed.data.offerId}.`,
    why: 'Funded escrow, immediate liquidity preferred over managed sale window.',
    evidence: ['Offer snapshot frozen at accept time'],
    approver: parsed.data.actor,
    approverRole: 'Estate Owner',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { offerId: parsed.data.offerId },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}

export async function counterOffer(
  input: CounterOfferInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ offerId: string; counterAmount: number }>> {
  const parsed = CounterOfferSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseInsert('offer_decisions', {
    offer_id: parsed.data.offerId,
    decision: 'countered',
    counter_amount_cents: parsed.data.counterAmount * 100,
    message: parsed.data.message,
    actor: parsed.data.actor,
    actor_user_id: identity.actorUserId ?? null,
    decided_at: new Date().toISOString(),
  })
  await trySupabaseUpdate('cash_offers', { status: 'countered', updated_at: new Date().toISOString() }, { offer_id: parsed.data.offerId })

  const receipt = await createTrustReceipt({
    kind: 'appraisal',
    title: `Counter on offer ${parsed.data.offerId}`,
    what: `Counter at $${parsed.data.counterAmount} requested.`,
    why: parsed.data.message || 'Customer counter against current offer.',
    evidence: ['Offer snapshot frozen at counter'],
    approver: parsed.data.actor,
    approverRole: 'Estate Owner',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { offerId: parsed.data.offerId, counterAmount: parsed.data.counterAmount },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}

export async function setFloorPrice(
  input: SetFloorPriceInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ itemId: string; floorPrice: number }>> {
  const parsed = SetFloorPriceSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseInsert('item_decisions', {
    item_id: parsed.data.itemId,
    decision_type: 'floor_price',
    payload: { floor_price_cents: parsed.data.floorPrice * 100 },
    actor: parsed.data.actor,
    actor_user_id: identity.actorUserId ?? null,
    decided_at: new Date().toISOString(),
  })
  await trySupabaseUpdate(
    'inventory_items',
    { floor_price_cents: parsed.data.floorPrice * 100, updated_at: new Date().toISOString() },
    { item_id: parsed.data.itemId },
  )

  const receipt = await createTrustReceipt({
    kind: 'price_drop',
    itemId: parsed.data.itemId,
    title: `Floor price set on ${parsed.data.itemId}`,
    what: `Floor price set to $${parsed.data.floorPrice}.`,
    why: 'Customer-set lowest acceptable price before listing or auction.',
    evidence: [`Floor: $${parsed.data.floorPrice}`],
    approver: parsed.data.actor,
    approverRole: 'Estate Owner',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { itemId: parsed.data.itemId, floorPrice: parsed.data.floorPrice },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}

export async function changeDisposition(
  input: ChangeDispositionInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ itemId: string; disposition: string }>> {
  const parsed = ChangeDispositionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseInsert('item_decisions', {
    item_id: parsed.data.itemId,
    decision_type: 'disposition',
    payload: { disposition: parsed.data.disposition, reason: parsed.data.reason },
    actor: parsed.data.actor,
    actor_user_id: identity.actorUserId ?? null,
    decided_at: new Date().toISOString(),
  })
  await trySupabaseUpdate(
    'inventory_items',
    { disposition: parsed.data.disposition, updated_at: new Date().toISOString() },
    { item_id: parsed.data.itemId },
  )

  const receipt = await createTrustReceipt({
    kind: parsed.data.disposition === 'donate' ? 'donation' : 'listing',
    itemId: parsed.data.itemId,
    title: `Disposition changed → ${parsed.data.disposition}`,
    what: `Item ${parsed.data.itemId} disposition set to ${parsed.data.disposition}.`,
    why: parsed.data.reason || 'Customer-driven decision.',
    evidence: [`Previous disposition replaced`, `New: ${parsed.data.disposition}`],
    approver: parsed.data.actor,
    approverRole: 'Estate Owner',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { itemId: parsed.data.itemId, disposition: parsed.data.disposition },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}

export async function stopSell(
  input: StopSellInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ itemId: string }>> {
  const parsed = StopSellSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseInsert('item_decisions', {
    item_id: parsed.data.itemId,
    decision_type: 'stop_sell',
    payload: { reason: parsed.data.reason, legal_hold: parsed.data.legalHold ?? false },
    actor: parsed.data.actor,
    actor_user_id: identity.actorUserId ?? null,
    decided_at: new Date().toISOString(),
  })
  await trySupabaseUpdate(
    'inventory_items',
    { status: 'on_hold', updated_at: new Date().toISOString() },
    { item_id: parsed.data.itemId },
  )

  const receipt = await createTrustReceipt({
    kind: 'stop_sell',
    itemId: parsed.data.itemId,
    title: `Stop-sell on ${parsed.data.itemId}${parsed.data.legalHold ? ' (legal hold)' : ''}`,
    what: 'Item locked from listing/donation/disposal channels.',
    why: parsed.data.reason,
    evidence: ['Customer ack timestamp'],
    approver: parsed.data.actor,
    approverRole: parsed.data.legalHold ? 'Legal Hold' : 'Estate Owner',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { itemId: parsed.data.itemId },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}

export async function requestPayout(
  input: RequestPayoutInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ caseId: string; amount: number }>> {
  const parsed = RequestPayoutSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseInsert('ledger_entries', {
    case_id: parsed.data.caseId,
    type: 'payout_request',
    description: `Payout request to ${parsed.data.destination ?? 'on-file account'}`,
    gross_cents: 0,
    fee_cents: 0,
    net_cents: -parsed.data.amount * 100,
    actor: parsed.data.actor,
    actor_user_id: identity.actorUserId ?? null,
    created_at: new Date().toISOString(),
  })

  const receipt = await createTrustReceipt({
    kind: 'payout',
    title: `Payout requested — $${parsed.data.amount}`,
    what: `Payout of $${parsed.data.amount} requested for case ${parsed.data.caseId}.`,
    why: 'Customer-initiated withdrawal of available proceeds.',
    evidence: [`Destination: ${parsed.data.destination ?? 'bank on file'}`],
    approver: parsed.data.actor,
    approverRole: 'Estate Owner',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { caseId: parsed.data.caseId, amount: parsed.data.amount },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}

export async function updateDonationRouting(
  input: UpdateDonationRoutingInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ caseId: string; charityId: string }>> {
  const parsed = UpdateDonationRoutingSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseUpsert(
    'donation_preferences',
    {
      case_id: parsed.data.caseId,
      charity_id: parsed.data.charityId,
      selected: true,
      actor: parsed.data.actor,
      actor_user_id: identity.actorUserId ?? null,
      selected_at: new Date().toISOString(),
    },
    'case_id,charity_id',
  )

  const receipt = await createTrustReceipt({
    kind: 'donation',
    title: `Donation routing updated`,
    what: `Donations for case ${parsed.data.caseId} routed to charity ${parsed.data.charityId}.`,
    why: 'Customer charity selection change.',
    evidence: [`Charity ID: ${parsed.data.charityId}`],
    approver: parsed.data.actor,
    approverRole: 'Estate Owner',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { caseId: parsed.data.caseId, charityId: parsed.data.charityId },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}

export async function assignExpertReview(
  input: AssignExpertInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ itemId: string; expertId?: string }>> {
  const parsed = AssignExpertSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseInsert('expert_queue_items', {
    item_id: parsed.data.itemId,
    expert_id: parsed.data.expertId ?? null,
    state: parsed.data.expertId ? 'assigned' : 'needed',
    notes: parsed.data.notes,
    actor: parsed.data.actor,
    actor_user_id: identity.actorUserId ?? null,
    queued_at: new Date().toISOString(),
  })

  const receipt = await createTrustReceipt({
    kind: 'authentication',
    itemId: parsed.data.itemId,
    title: `Expert review ${parsed.data.expertId ? 'assigned' : 'requested'}`,
    what: `Item ${parsed.data.itemId} routed to ${parsed.data.expertId ?? 'expert queue'}.`,
    why: parsed.data.notes ?? 'Human validation requested.',
    evidence: ['Queue entry created'],
    approver: parsed.data.actor,
    approverRole: 'Estate Coordinator',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { itemId: parsed.data.itemId, expertId: parsed.data.expertId },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}

export async function updateCaptureChecklist(
  input: UpdateCaptureChecklistInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ roomId: string; checklistItemId: string; done: boolean }>> {
  const parsed = UpdateCaptureChecklistSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const sbErr = await trySupabaseUpsert(
    'capture_checklist_state',
    {
      room_id: parsed.data.roomId,
      checklist_item_id: parsed.data.checklistItemId,
      done: parsed.data.done,
      actor: parsed.data.actor,
      actor_user_id: identity.actorUserId ?? null,
      updated_at: new Date().toISOString(),
    },
    'room_id,checklist_item_id',
  )

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: parsed.data,
    error: sbErr ?? undefined,
  }
}

export async function requestStatement(
  input: RequestStatementInput,
  identity: ActorIdentity = {},
): Promise<WriteResult<{ caseId: string; period: string; statementId: string }>> {
  const parsed = RequestStatementSchema.safeParse(input)
  if (!parsed.success) return { ok: false, mode: getDataMode(), error: parsed.error.message }

  const statementId = `STMT-${parsed.data.period.replace(/\s+/g, '-')}-${Date.now().toString(36).slice(-4).toUpperCase()}`

  const sbErr = await trySupabaseInsert('statements', {
    statement_id: statementId,
    case_id: parsed.data.caseId,
    period: parsed.data.period,
    generated_at: new Date().toISOString(),
    net_cents: 0,
    status: 'generating',
    metadata: identity.actorUserId ? { actor_user_id: identity.actorUserId } : {},
  })

  const receipt = await createTrustReceipt({
    kind: 'payout',
    caseId: parsed.data.caseId,
    title: `Statement requested — ${parsed.data.period}`,
    what: `Statement generation requested for ${parsed.data.period}.`,
    why: 'Customer-initiated statement generation.',
    evidence: [`Period: ${parsed.data.period}`, `Statement: ${statementId}`],
    approver: parsed.data.actor,
    approverRole: 'Estate Owner',
  }, identity)

  return {
    ok: !sbErr,
    mode: getDataMode(),
    data: { caseId: parsed.data.caseId, period: parsed.data.period, statementId },
    error: sbErr ?? undefined,
    trustReceiptId: receipt.trustReceiptId,
  }
}
