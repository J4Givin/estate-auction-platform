import { setFloorPrice } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../../_helpers'

export async function POST(req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await ctx.params
  const body = await readJsonBody<{ floorPrice?: number; actor?: string }>(req)
  if (typeof body?.floorPrice !== 'number' || !body.actor) {
    return jsonErr('floorPrice (number) and actor are required')
  }
  const res = await setFloorPrice({ itemId, floorPrice: body.floorPrice, actor: body.actor })
  return jsonOk(res)
}
