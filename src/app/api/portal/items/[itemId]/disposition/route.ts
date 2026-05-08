import { changeDisposition } from '@/lib/data/actions'
import { canWriteCase, resolveItemCaseId } from '@/lib/data/auth'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../../_helpers'

export async function POST(req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await ctx.params
  const body = await readJsonBody<{ disposition?: string; actor?: string; reason?: string }>(req)
  if (!body?.disposition || !body.actor) return jsonErr('disposition and actor are required')

  const actor = await resolveActor()
  const caseId = await resolveItemCaseId(itemId)
  const decision = authorize(
    actor,
    (c) => (caseId ? canWriteCase(c, caseId) : c.isAdmin || c.platformRole !== 'partner'),
    { reason: 'You cannot change disposition on this item' },
  )
  if (!decision.ok) return rejectAuthz(decision)

  const res = await changeDisposition(
    {
      itemId,
      // narrow at validation layer
      disposition: body.disposition as never,
      actor: actor.authenticated ? actor.actorLabel : body.actor,
      reason: body.reason,
    },
    { actorUserId: actor.userId },
  )
  return jsonOk(res)
}
