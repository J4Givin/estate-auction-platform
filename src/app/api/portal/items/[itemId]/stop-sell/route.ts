import { stopSell } from '@/lib/data/actions'
import { canWriteCase, resolveItemCaseId } from '@/lib/data/auth'
import {
  authorize,
  enforceCsrf,
  enforceRateLimit,
  jsonErr,
  jsonOk,
  readJsonBody,
  rejectAuthz,
  resolveActor,
} from '../../../_helpers'

export async function POST(req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const csrfBlocked = enforceCsrf(req)
  if (csrfBlocked) return csrfBlocked

  const { itemId } = await ctx.params
  const body = await readJsonBody<{ reason?: string; actor?: string; legalHold?: boolean }>(req)
  if (!body?.reason || !body.actor) return jsonErr('reason and actor are required')

  const actor = await resolveActor()
  const caseId = await resolveItemCaseId(itemId)
  const decision = authorize(
    actor,
    (c) => (caseId ? canWriteCase(c, caseId) : c.isAdmin || c.platformRole !== 'partner'),
    { reason: 'You cannot stop-sell this item' },
  )
  if (!decision.ok) return rejectAuthz(decision, req, { caseId, itemId })

  const limited = await enforceRateLimit('item-write', req, actor, { caseId, itemId })
  if (limited) return limited

  const res = await stopSell(
    {
      itemId,
      reason: body.reason,
      actor: actor.authenticated ? actor.actorLabel : body.actor,
      legalHold: body.legalHold,
    },
    { actorUserId: actor.userId },
  )
  return jsonOk(res)
}
