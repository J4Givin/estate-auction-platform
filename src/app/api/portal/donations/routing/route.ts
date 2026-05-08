import { updateDonationRouting } from '@/lib/data/actions'
import { canWriteCase } from '@/lib/data/auth'
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

  const body = await readJsonBody<{ caseId?: string; charityId?: string; actor?: string }>(req)
  if (!body?.caseId || !body.charityId || !body.actor) {
    return jsonErr('caseId, charityId, and actor are required')
  }

  const ctx = await resolveActor()
  const decision = authorize(ctx, (c) => canWriteCase(c, body.caseId!), {
    reason: 'You cannot change donation routing for this case',
  })
  if (!decision.ok) return rejectAuthz(decision, req, { caseId: body.caseId })

  const limited = enforceRateLimit('donation', req, ctx, { caseId: body.caseId })
  if (limited) return limited

  const res = await updateDonationRouting(
    {
      caseId: body.caseId,
      charityId: body.charityId,
      actor: ctx.authenticated ? ctx.actorLabel : body.actor,
    },
    { actorUserId: ctx.userId },
  )
  return jsonOk(res)
}
