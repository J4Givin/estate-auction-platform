import { setFloorPrice } from '@/lib/data/actions'
import { canWriteCase, resolveItemCaseId } from '@/lib/data/auth'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../../_helpers'
import { enforceRateLimit } from '../../../_rate-limit'

export async function POST(req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await ctx.params
  const body = await readJsonBody<{ floorPrice?: number; actor?: string }>(req)
  if (typeof body?.floorPrice !== 'number' || !body.actor) {
    return jsonErr('floorPrice (number) and actor are required')
  }

  const actor = await resolveActor()
  const caseId = await resolveItemCaseId(itemId)
  const decision = authorize(
    actor,
    (c) => (caseId ? canWriteCase(c, caseId) : c.isAdmin || c.platformRole !== 'partner'),
    { reason: 'You cannot set a floor price on this item' },
  )
  if (!decision.ok) return rejectAuthz(decision)

  const limited = enforceRateLimit('item-write', req, actor)
  if (limited) return limited

  const res = await setFloorPrice(
    {
      itemId,
      floorPrice: body.floorPrice,
      actor: actor.authenticated ? actor.actorLabel : body.actor,
    },
    { actorUserId: actor.userId },
  )
  return jsonOk(res)
}
