import { requestPayout } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ caseId?: string; amount?: number; destination?: string; actor?: string }>(req)
  if (!body?.caseId || typeof body.amount !== 'number' || !body.actor) {
    return jsonErr('caseId, amount, and actor are required')
  }
  const res = await requestPayout({
    caseId: body.caseId,
    amount: body.amount,
    destination: body.destination,
    actor: body.actor,
  })
  return jsonOk(res)
}
