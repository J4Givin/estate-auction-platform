import { acceptCashOffer } from '@/lib/data/actions'
import { canWriteCase, resolveOfferCaseId } from '@/lib/data/auth'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../_helpers'
import { enforceRateLimit } from '../../_rate-limit'

export async function POST(req: Request) {
  const body = await readJsonBody<{ offerId?: string; caseId?: string; actor?: string }>(req)
  if (!body?.offerId || !body.actor) return jsonErr('offerId and actor are required')

  const ctx = await resolveActor()

  // Authorize against the case that owns the offer. If the caller didn't
  // supply caseId, resolve it server-side from the offer row so we don't
  // have to trust client-provided scope.
  const resolvedCaseId = body.caseId ?? (await resolveOfferCaseId(body.offerId))
  const decision = authorize(
    ctx,
    (c) => (resolvedCaseId ? canWriteCase(c, resolvedCaseId) : c.isAdmin || c.platformRole === 'ops'),
    {
      reason: resolvedCaseId
        ? 'You do not have write access to the case for this offer'
        : 'Sign in required to accept an offer',
    },
  )
  if (!decision.ok) return rejectAuthz(decision)

  const limited = enforceRateLimit('offer', req, ctx)
  if (limited) return limited

  const res = await acceptCashOffer(
    {
      offerId: body.offerId,
      caseId: resolvedCaseId ?? undefined,
      actor: ctx.authenticated ? ctx.actorLabel : body.actor,
    },
    { actorUserId: ctx.userId },
  )
  return jsonOk(res)
}
