import { requestStatement } from '@/lib/data/actions'
import { canReadCase } from '@/lib/data/auth'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../_helpers'
import { enforceRateLimit } from '../../_rate-limit'

export async function POST(req: Request) {
  const body = await readJsonBody<{ caseId?: string; period?: string; actor?: string }>(req)
  if (!body?.caseId || !body.period || !body.actor) {
    return jsonErr('caseId, period, and actor are required')
  }

  const ctx = await resolveActor()
  // Reading a statement is allowed for any case member; partners cannot request.
  const decision = authorize(
    ctx,
    (c) => canReadCase(c, body.caseId!) && c.platformRole !== 'partner',
    { reason: 'You cannot request a statement for this case' },
  )
  if (!decision.ok) return rejectAuthz(decision)

  const limited = enforceRateLimit('statement', req, ctx)
  if (limited) return limited

  const res = await requestStatement(
    { caseId: body.caseId, period: body.period, actor: ctx.authenticated ? ctx.actorLabel : body.actor },
    { actorUserId: ctx.userId },
  )
  return jsonOk(res)
}
