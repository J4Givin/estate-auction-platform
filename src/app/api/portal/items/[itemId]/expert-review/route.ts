import { assignExpertReview } from '@/lib/data/actions'
import { canExpertWriteItem, canWriteCase, resolveItemCaseId } from '@/lib/data/auth'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../../_helpers'
import { enforceRateLimit } from '../../../_rate-limit'

export async function POST(req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await ctx.params
  const body = await readJsonBody<{ expertId?: string; notes?: string; actor?: string }>(req)
  if (!body?.actor) return jsonErr('actor is required')

  const actor = await resolveActor()
  const caseId = await resolveItemCaseId(itemId)
  // Customer/ops on the case OR the assigned expert can request/update review.
  const decision = authorize(
    actor,
    (c) =>
      (caseId ? canWriteCase(c, caseId) : c.isAdmin || c.platformRole !== 'partner') ||
      canExpertWriteItem(c, itemId),
    { reason: 'You cannot route this item to expert review' },
  )
  if (!decision.ok) return rejectAuthz(decision)

  const limited = enforceRateLimit('expert-review', req, actor)
  if (limited) return limited

  const res = await assignExpertReview(
    {
      itemId,
      expertId: body.expertId,
      notes: body.notes,
      actor: actor.authenticated ? actor.actorLabel : body.actor,
    },
    { actorUserId: actor.userId },
  )
  return jsonOk(res)
}
