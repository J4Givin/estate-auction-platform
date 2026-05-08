import { counterOffer } from '@/lib/data/actions'
import { canWriteCase, resolveOfferCaseId } from '@/lib/data/auth'
import {
  authorize,
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

  // Resolve the offer's parent case before authorizing. In live mode we
  // require write access to that case; relying on RLS as a backstop is
  // insufficient because we want clear 401/403 semantics without leaking
  // RLS error strings.
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
