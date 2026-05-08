/**
 * AI integration hooks for the appraisal pipeline.
 *
 * These are typed stubs intended as clean integration points for future
 * AI orchestration (multi-agent runs, evidence pinning, listing generation,
 * channel scoring). Each function:
 *   - persists a row to Supabase when configured,
 *   - returns a deterministic mock when not configured,
 *   - never throws — orchestration callers should not need defensive code.
 *
 * The shapes mirror what the appraisal-pipeline UI already consumes from
 * sample-data so the wiring stays trivial when models come online.
 */

import { v4 as uuid } from 'uuid'

import { isSupabaseConfigured, getDataMode } from './env'
import { createTrustReceipt } from './trust'
import type {
  AgentStageInput,
  AppraisalRunInput,
  ChannelFitScoreInput,
  EvidenceSnapshotInput,
  ListingDraftInput,
  WriteResult,
} from './types'

async function lazyServiceClient() {
  if (!isSupabaseConfigured()) return null
  const { getServerSupabase } = await import('./supabase-server')
  return await getServerSupabase()
}

export async function createAppraisalRun(input: AppraisalRunInput): Promise<WriteResult<{ runId: string }>> {
  const runId = `run_${uuid().slice(0, 8)}`
  const sb = await lazyServiceClient()
  if (sb) {
    const { error } = await sb.from('appraisal_runs').insert({
      run_id: runId,
      item_id: input.itemId,
      item_name: input.itemName ?? null,
      category: input.category ?? null,
      started_by: input.startedBy,
      started_at: new Date().toISOString(),
      status: 'queued',
    })
    if (error) return { ok: false, mode: 'supabase', error: error.message }
  }

  const receipt = await createTrustReceipt({
    kind: 'appraisal',
    itemId: input.itemId,
    title: `AI appraisal queued — ${input.itemId}`,
    what: 'Multi-agent appraisal run created and queued for processing.',
    why: 'Initiated by orchestration / customer action.',
    evidence: [`Run ID: ${runId}`],
    approver: input.startedBy,
    approverRole: 'AI Orchestrator',
  })

  return { ok: true, mode: getDataMode(), data: { runId }, trustReceiptId: receipt.trustReceiptId }
}

export async function enqueueAgentStage(input: AgentStageInput): Promise<WriteResult<{ stageId: string }>> {
  const stageId = `stage_${uuid().slice(0, 8)}`
  const sb = await lazyServiceClient()
  if (sb) {
    const { error } = await sb.from('appraisal_stages').insert({
      stage_id: stageId,
      run_id: input.runId,
      stage: input.stage,
      payload: input.payload ?? {},
      state: 'queued',
      queued_at: new Date().toISOString(),
    })
    if (error) return { ok: false, mode: 'supabase', error: error.message }
  }
  return { ok: true, mode: getDataMode(), data: { stageId } }
}

export async function persistEvidenceSnapshot(input: EvidenceSnapshotInput): Promise<WriteResult<{ snapshotId: string }>> {
  const snapshotId = `snap_${uuid().slice(0, 10)}`
  const sb = await lazyServiceClient()
  if (sb) {
    const { error } = await sb.from('appraisal_evidence').insert({
      snapshot_id: snapshotId,
      subject_type: input.subjectType,
      subject_id: input.subjectId,
      payload: input.payload,
      created_at: new Date().toISOString(),
    })
    if (error) return { ok: false, mode: 'supabase', error: error.message }
  }
  return { ok: true, mode: getDataMode(), data: { snapshotId } }
}

export async function requireHumanValidation(input: {
  itemId: string
  reason: string
  triggeredBy: string
}): Promise<WriteResult<{ ok: true }>> {
  const sb = await lazyServiceClient()
  if (sb) {
    const { error } = await sb.from('expert_queue_items').insert({
      item_id: input.itemId,
      state: 'needed',
      notes: input.reason,
      actor: input.triggeredBy,
      queued_at: new Date().toISOString(),
    })
    if (error) return { ok: false, mode: 'supabase', error: error.message }
  }

  const receipt = await createTrustReceipt({
    kind: 'authentication',
    itemId: input.itemId,
    title: `Human validation required — ${input.itemId}`,
    what: 'AI escalated to expert review.',
    why: input.reason,
    evidence: ['AI confidence/threshold trigger'],
    approver: input.triggeredBy,
    approverRole: 'AI Orchestrator',
  })

  return { ok: true, mode: getDataMode(), data: { ok: true }, trustReceiptId: receipt.trustReceiptId }
}

export async function generateListingDraft(input: ListingDraftInput): Promise<WriteResult<{ draftId: string; channel: string }>> {
  const draftId = `draft_${uuid().slice(0, 8)}`
  const sb = await lazyServiceClient()
  if (sb) {
    const { error } = await sb.from('listing_drafts').insert({
      draft_id: draftId,
      item_id: input.itemId,
      channel: input.channel,
      created_at: new Date().toISOString(),
    })
    if (error) return { ok: false, mode: 'supabase', error: error.message }
  }
  return { ok: true, mode: getDataMode(), data: { draftId, channel: input.channel } }
}

export async function scoreChannelFit(input: ChannelFitScoreInput): Promise<WriteResult<{ recommendations: { channel: string; fitScore: number }[] }>> {
  // Placeholder scoring: deterministic ramp by index until model wired.
  const recommendations = input.channels.map((ch, i) => ({
    channel: ch,
    fitScore: Math.max(0.3, 0.95 - i * 0.12),
  }))
  const sb = await lazyServiceClient()
  if (sb) {
    const rows = recommendations.map(r => ({
      item_id: input.itemId,
      channel: r.channel,
      fit_score: r.fitScore,
      created_at: new Date().toISOString(),
    }))
    const { error } = await sb.from('channel_recommendations').insert(rows)
    if (error) return { ok: false, mode: 'supabase', error: error.message, data: { recommendations } }
  }
  return { ok: true, mode: getDataMode(), data: { recommendations } }
}

export { createTrustReceipt }
