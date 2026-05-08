import { createTrustReceipt } from '@/lib/data/trust'
import { canReadItem, canWriteCase, resolveItemCaseId } from '@/lib/data/auth'
import {
  authorize,
  beginIdempotency,
  enforceCsrf,
  enforceRateLimit,
  jsonErr,
  jsonOk,
  readJsonBody,
  rejectAuthz,
  resolveActor,
} from '../_helpers'

export async function POST(req: Request) {
  const csrfBlocked = enforceCsrf(req)
  if (csrfBlocked) return csrfBlocked

  const body = await readJsonBody<{
    kind?: string
    itemId?: string
    caseId?: string
    title?: string
    what?: string
    why?: string
    evidence?: string[]
    approver?: string
    approverRole?: string
  }>(req)
  if (!body?.kind || !body.title || !body.what || !body.why || !body.approver || !body.approverRole) {
    return jsonErr('kind, title, what, why, approver, and approverRole are required')
  }

  const ctx = await resolveActor()
  // The actor must have write access to the case scope (or item-derived case),
  // OR be an expert assigned to the item. Trust receipts are append-only by design.
  const itemCaseId = body.itemId ? await resolveItemCaseId(body.itemId) : null
  const targetCaseId = body.caseId ?? itemCaseId
  const decision = authorize(
    ctx,
    (c) =>
      (targetCaseId ? canWriteCase(c, targetCaseId) : c.isAdmin || c.platformRole === 'ops') ||
      (body.itemId ? canReadItem(c, body.itemId, itemCaseId) && c.platformRole === 'expert' : false),
    { reason: 'You cannot author a trust receipt for this scope' },
  )
  if (!decision.ok) {
    return rejectAuthz(decision, req, { caseId: targetCaseId, itemId: body.itemId })
  }

  const limited = await enforceRateLimit('trust-receipt', req, ctx, {
    caseId: targetCaseId,
    itemId: body.itemId,
  })
  if (limited) return limited

  const idem = await beginIdempotency('trust-receipt:create', req, body, ctx, {
    caseId: targetCaseId,
    itemId: body.itemId,
  })
  if (idem.early) return idem.early

  try {
    const res = await createTrustReceipt(
      {
        kind: body.kind as never,
        itemId: body.itemId,
        caseId: body.caseId,
        title: body.title,
        what: body.what,
        why: body.why,
        evidence: body.evidence,
        approver: ctx.authenticated ? ctx.actorLabel : body.approver,
        approverRole: body.approverRole,
      },
      { actorUserId: ctx.userId },
    )
    return idem.done(jsonOk(res), res)
  } catch (err) {
    if (idem.handle?.active) await idem.handle.fail()
    throw err
  }
}
