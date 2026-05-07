import { changeDisposition } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../../_helpers'

export async function POST(req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await ctx.params
  const body = await readJsonBody<{ disposition?: string; actor?: string; reason?: string }>(req)
  if (!body?.disposition || !body.actor) return jsonErr('disposition and actor are required')
  const res = await changeDisposition({
    itemId,
    // narrow at validation layer
    disposition: body.disposition as never,
    actor: body.actor,
    reason: body.reason,
  })
  return jsonOk(res)
}
