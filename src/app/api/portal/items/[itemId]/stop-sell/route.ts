import { stopSell } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../../_helpers'

export async function POST(req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await ctx.params
  const body = await readJsonBody<{ reason?: string; actor?: string; legalHold?: boolean }>(req)
  if (!body?.reason || !body.actor) return jsonErr('reason and actor are required')
  const res = await stopSell({
    itemId,
    reason: body.reason,
    actor: body.actor,
    legalHold: body.legalHold,
  })
  return jsonOk(res)
}
