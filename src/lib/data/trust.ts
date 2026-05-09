/**
 * Trust receipt persistence — append-only by design.
 *
 * In demo mode we keep an in-memory ring of receipts created during the
 * session; in Supabase mode the same shape is INSERTed against
 * `trust_receipts`. The writer never updates or deletes — every action is
 * a new immutable row, consistent with the FRD.
 */

import { TRUST_RECEIPTS, type TrustReceiptData, type ReceiptKind } from '@/lib/sample-data'
import { isSupabaseConfigured, getDataMode } from './env'
import type { CreateTrustReceiptInput, WriteResult } from './types'

interface TrustReceiptIdentity {
  actorUserId?: string | null
}

const SESSION_RECEIPTS: TrustReceiptData[] = []

function nextReceiptId(kind: ReceiptKind, subject?: string): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6)
  const subj = subject ? subject.replace(/[^A-Z0-9]/gi, '').slice(-4).toUpperCase() : 'NEW'
  return `TR-${subj}-${kind.slice(0, 3).toUpperCase()}-${stamp}`
}

function nextSnapshotId(): string {
  return `snap_${Math.random().toString(36).slice(2, 10)}`
}

export function listSessionReceipts(): TrustReceiptData[] {
  return [...SESSION_RECEIPTS, ...TRUST_RECEIPTS]
}

export async function createTrustReceipt(
  input: CreateTrustReceiptInput,
  identity: TrustReceiptIdentity = {},
): Promise<WriteResult<TrustReceiptData>> {
  const receipt: TrustReceiptData = {
    id: nextReceiptId(input.kind, input.itemId ?? input.caseId),
    kind: input.kind,
    itemId: input.itemId,
    title: input.title,
    what: input.what,
    why: input.why,
    evidence: input.evidence ?? [],
    approver: input.approver,
    approverRole: input.approverRole,
    timestamp: new Date().toISOString(),
    immutableSnapshotId: input.immutableSnapshotId ?? nextSnapshotId(),
    disputeUrl: input.disputeUrl,
  }

  if (!isSupabaseConfigured()) {
    SESSION_RECEIPTS.unshift(receipt)
    return { ok: true, mode: 'demo', data: receipt, trustReceiptId: receipt.id }
  }

  try {
    // Lazy-import so the Supabase server client doesn't get pulled into
    // client bundles. Trust receipts are always written server-side.
    const { getServerSupabase } = await import('./supabase-server')
    const sb = await getServerSupabase()
    if (!sb) return { ok: false, mode: 'demo', error: 'supabase not configured' }
    const { error } = await sb.from('trust_receipts').insert({
      receipt_id: receipt.id,
      kind: receipt.kind,
      item_id: receipt.itemId ?? null,
      case_id: input.caseId ?? null,
      title: receipt.title,
      what: receipt.what,
      why: receipt.why,
      evidence: receipt.evidence,
      approver: receipt.approver,
      approver_role: receipt.approverRole,
      immutable_snapshot_id: receipt.immutableSnapshotId,
      dispute_url: receipt.disputeUrl,
      actor_user_id: identity.actorUserId ?? null,
      created_at: receipt.timestamp,
    })
    if (error) {
      return { ok: false, mode: 'supabase', error: error.message }
    }
    return { ok: true, mode: 'supabase', data: receipt, trustReceiptId: receipt.id }
  } catch (err) {
    return { ok: false, mode: getDataMode(), error: (err as Error).message }
  }
}
