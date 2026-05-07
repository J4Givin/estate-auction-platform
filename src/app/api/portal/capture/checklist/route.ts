import { updateCaptureChecklist } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ roomId?: string; checklistItemId?: string; done?: boolean; actor?: string }>(req)
  if (!body?.roomId || !body.checklistItemId || typeof body.done !== 'boolean' || !body.actor) {
    return jsonErr('roomId, checklistItemId, done, and actor are required')
  }
  const res = await updateCaptureChecklist({
    roomId: body.roomId,
    checklistItemId: body.checklistItemId,
    done: body.done,
    actor: body.actor,
  })
  return jsonOk(res)
}
