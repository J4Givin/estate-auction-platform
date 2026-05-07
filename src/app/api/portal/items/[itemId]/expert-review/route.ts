import { assignExpertReview } from '@/lib/data/actions'
import { jsonErr, jsonOk, readJsonBody } from '../../../_helpers'

export async function POST(req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await ctx.params
  const body = await readJsonBody<{ expertId?: string; notes?: string; actor?: string }>(req)
  if (!body?.actor) return jsonErr('actor is required')
  const res = await assignExpertReview({
    itemId,
    expertId: body.expertId,
    notes: body.notes,
    actor: body.actor,
  })
  return jsonOk(res)
}
