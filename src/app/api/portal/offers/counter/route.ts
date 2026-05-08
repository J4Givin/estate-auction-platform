import { counterOffer } from '@/lib/data/actions'
import { canWriteCase, resolveOfferCaseId } from '@/lib/data/auth'
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

  const body = await readJsonBody<{ offerId?: string; counterAmount?: number; message?: string; actor?: string; caseId?: string }>(req)
  if (!body?.offerId || typeof body.counterAmount !== 'number' || !body.actor) {
    return jsonErr('offerId, counterAmount, and actor are required')
  }

  const ctx = await resolveActor()

  const offerCaseId = body.caseId ?? (await resolveOfferCaseId(body.offerId))
  const decision = authorize(
    ctx,
    (c) => (offerCaseId ? canWriteCase(c, offerCaseId) : c.isAdmin || c.platformRole === 'ops'),
    {
      reason: offerCaseId
        ? 'You do not have write access to the case for this offer'
        : 'Sign in required to counter an offer',
    },
  )
  if (!decision.ok) {
    return rejectAuthz(decision, req, { caseId: offerCaseId, offerId: body.offerId })
  }

  const limited = await enforceRateLimit('offer', req, ctx, { caseId: offerCaseId, offerId: body.offerId })
  if (limited) return limited

  const idem = await beginIdempotency('offer:counter', req, body, ctx, {
    caseId: offerCaseId,
    offerId: body.offerId,
  })
  if (idem.early) return idem.early

  try {
    const res = await counterOffer(
      {
        offerId: body.offerId,
        counterAmount: body.counterAmount,
        message: body.message,
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
