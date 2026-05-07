import { createTrustReceipt } from '@/lib/data/trust'
import { jsonErr, jsonOk, readJsonBody } from '../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{
    kind?: string
    itemId?: string
    caseId?: string
    title?: string
    what?: string
    why?: string
    evidence?: string[]
    approver?: string
    approverRole?: string
  }>(req)
  if (!body?.kind || !body.title || !body.what || !body.why || !body.approver || !body.approverRole) {
    return jsonErr('kind, title, what, why, approver, and approverRole are required')
  }
  const res = await createTrustReceipt({
    kind: body.kind as never,
    itemId: body.itemId,
    caseId: body.caseId,
    title: body.title,
    what: body.what,
    why: body.why,
    evidence: body.evidence,
    approver: body.approver,
    approverRole: body.approverRole,
  })
  return jsonOk(res)
}
