import { requestPayout } from '@/lib/data/actions'
import { canWriteCase } from '@/lib/data/auth'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ caseId?: string; amount?: number; destination?: string; actor?: string }>(req)
  if (!body?.caseId || typeof body.amount !== 'number' || !body.actor) {
    return jsonErr('caseId, amount, and actor are required')
  }

  const ctx = await resolveActor()
  const decision = authorize(ctx, (c) => canWriteCase(c, body.caseId!), {
    reason: 'You cannot request a payout for this case',
  })
  if (!decision.ok) return rejectAuthz(decision)

  const res = await requestPayout(
    {
      caseId: body.caseId,
      amount: body.amount,
      destination: body.destination,
      actor: ctx.authenticated ? ctx.actorLabel : body.actor,
    },
    { actorUserId: ctx.userId },
  )
  return jsonOk(res)
}
