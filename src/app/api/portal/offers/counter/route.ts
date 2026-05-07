import { counterOffer } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ offerId?: string; counterAmount?: number; message?: string; actor?: string }>(req)
  if (!body?.offerId || typeof body.counterAmount !== 'number' || !body.actor) {
    return jsonErr('offerId, counterAmount, and actor are required')
  }
  const res = await counterOffer({
    offerId: body.offerId,
    counterAmount: body.counterAmount,
    message: body.message,
    actor: body.actor,
  })
  return jsonOk(res)
}
