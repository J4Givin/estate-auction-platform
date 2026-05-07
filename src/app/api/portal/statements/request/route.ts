import { createTrustReceipt } from '@/lib/data/trust'
import { jsonErr, jsonOk, readJsonBody } from '../../_helpers'

export async function POST(req: Request) {
  const body = await readJsonBody<{ caseId?: string; period?: string; actor?: string }>(req)
  if (!body?.caseId || !body.period || !body.actor) {
    return jsonErr('caseId, period, and actor are required')
  }
  const receipt = await createTrustReceipt({
    kind: 'payout',
    caseId: body.caseId,
    title: `Statement requested — ${body.period}`,
    what: `Statement generation requested for ${body.period} on case ${body.caseId}.`,
    why: 'Customer-initiated statement generation.',
    evidence: [`Period: ${body.period}`],
    approver: body.actor,
    approverRole: 'Estate Owner',
  })
  return jsonOk({ ok: true, mode: receipt.mode, statementRequestId: receipt.trustReceiptId })
}
