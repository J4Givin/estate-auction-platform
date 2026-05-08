import { requestStatement } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ caseId?: string; period?: string; actor?: string }>(req)
  if (!body?.caseId || !body.period || !body.actor) {
    return jsonErr('caseId, period, and actor are required')
  }
  const res = await requestStatement({ caseId: body.caseId, period: body.period, actor: body.actor })
  return jsonOk(res)
}
