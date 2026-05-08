import { counterOffer } from '@/lib/data/actions'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ offerId?: string; counterAmount?: number; message?: string; actor?: string; caseId?: string }>(req)
  if (!body?.offerId || typeof body.counterAmount !== 'number' || !body.actor) {
    return jsonErr('offerId, counterAmount, and actor are required')
  }

  const ctx = await resolveActor()
  // In live mode, require an authenticated user for any counter-offer.
  const decision = authorize(ctx, () => true, { reason: 'Sign in required to counter an offer' })
  if (!decision.ok) return rejectAuthz(decision)

  const res = await counterOffer(
    {
      offerId: body.offerId,
      counterAmount: body.counterAmount,
      message: body.message,
      actor: ctx.authenticated ? ctx.actorLabel : body.actor,
    },
    { actorUserId: ctx.userId },
  )
  return jsonOk(res)
}
