import { acceptCashOffer } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ offerId?: string; caseId?: string; actor?: string }>(req)
  if (!body?.offerId || !body.actor) return jsonErr('offerId and actor are required')
  const res = await acceptCashOffer({
    offerId: body.offerId,
    caseId: body.caseId,
    actor: body.actor,
  })
  return jsonOk(res)
}
