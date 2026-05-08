import { updateCaptureChecklist } from '@/lib/data/actions'
import { authorize, jsonErr, jsonOk, readJsonBody, rejectAuthz, resolveActor } from '../../_helpers'
import { enforceRateLimit } from '../../_rate-limit'

export async function POST(req: Request) {
  const body = await readJsonBody<{ roomId?: string; checklistItemId?: string; done?: boolean; actor?: string }>(req)
  if (!body?.roomId || !body.checklistItemId || typeof body.done !== 'boolean' || !body.actor) {
    return jsonErr('roomId, checklistItemId, done, and actor are required')
  }

  // Capture is typically performed by ops or the customer themselves on their case;
  // RLS enforces case scope at the DB layer. We require an authenticated user in live mode.
  const ctx = await resolveActor()
  const decision = authorize(ctx, () => true, { reason: 'Sign in required' })
  if (!decision.ok) return rejectAuthz(decision)

  const limited = enforceRateLimit('capture', req, ctx)
  if (limited) return limited

  const res = await updateCaptureChecklist(
    {
      roomId: body.roomId,
      checklistItemId: body.checklistItemId,
      done: body.done,
      actor: ctx.authenticated ? ctx.actorLabel : body.actor,
    },
    { actorUserId: ctx.userId },
  )
  return jsonOk(res)
}
