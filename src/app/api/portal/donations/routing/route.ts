import { updateDonationRouting } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ caseId?: string; charityId?: string; actor?: string }>(req)
  if (!body?.caseId || !body.charityId || !body.actor) {
    return jsonErr('caseId, charityId, and actor are required')
  }
  const res = await updateDonationRouting({
    caseId: body.caseId,
    charityId: body.charityId,
    actor: body.actor,
  })
  return jsonOk(res)
}
