import { acceptCashOffer } from '@/lib/data/actions'
import { canWriteCase } from '@/lib/data/auth'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ offerId?: string; caseId?: string; actor?: string }>(req)
  if (!body?.offerId || !body.actor) return jsonErr('offerId and actor are required')

  const ctx = await resolveActor()
  // Customer-driven action; if a caseId is supplied, require write access to that case.
  if (body.caseId) {
    const decision = authorize(ctx, (c) => canWriteCase(c, body.caseId!), {
      reason: 'You do not have write access to this case',
    })
    if (!decision.ok) return rejectAuthz(decision)
  }

  const res = await acceptCashOffer(
    {
      offerId: body.offerId,
      caseId: body.caseId,
      actor: ctx.authenticated ? ctx.actorLabel : body.actor,
    },
    { actorUserId: ctx.userId },
  )
  return jsonOk(res)
}
