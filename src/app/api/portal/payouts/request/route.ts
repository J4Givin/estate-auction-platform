import { requestPayout } from '@/lib/data/actions'
import { canWriteCase } from '@/lib/data/auth'
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
} from '../../_helpers'

export async function POST(req: Request) {
  const csrfBlocked = enforceCsrf(req)
  if (csrfBlocked) return csrfBlocked

  const body = await readJsonBody<{ caseId?: string; amount?: number; destination?: string; actor?: string }>(req)
  if (!body?.caseId || typeof body.amount !== 'number' || !body.actor) {
    return jsonErr('caseId, amount, and actor are required')
  }

  const ctx = await resolveActor()
  const decision = authorize(ctx, (c) => canWriteCase(c, body.caseId!), {
    reason: 'You cannot request a payout for this case',
  })
  if (!decision.ok) return rejectAuthz(decision, req, { caseId: body.caseId })

  const limited = await enforceRateLimit('payout', req, ctx, { caseId: body.caseId })
  if (limited) return limited

  const idem = await beginIdempotency('payout:request', req, body, ctx, { caseId: body.caseId })
  if (idem.early) return idem.early

  try {
    const res = await requestPayout(
      {
        caseId: body.caseId,
        amount: body.amount,
        destination: body.destination,
        actor: ctx.authenticated ? ctx.actorLabel : body.actor,
      },
      { actorUserId: ctx.userId },
    )
    return idem.done(jsonOk(res), res)
  } catch (err) {
    if (idem.handle?.active) await idem.handle.fail()
    throw err
  }
}
