import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

const StartLotSchema = z.object({
  durationSeconds: z.number().int().positive().default(300), // 5 min default
});

type RouteContext = { params: Promise<{ lotId: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { lotId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const parsed = StartLotSchema.safeParse(body);
    const durationSeconds = parsed.success ? parsed.data.durationSeconds : 300;

    const supabase = createServiceClient();

    const { data: lot } = await supabase
      .from("lots")
      .select()
      .eq("id", lotId)
      .single();

    if (!lot) return apiError("VALIDATION_FAILED", "Lot not found", 404);

    // Verify admin/seller in org
    if (lot.org_id) {
      const { data: mem } = await supabase
        .from("org_memberships")
        .select()
        .eq("org_id", lot.org_id)
        .eq("user_id", userId)
        .in("role", ["admin", "seller"])
        .limit(1)
        .single();
      if (!mem) return apiError("AUTH_FORBIDDEN", "Admin or seller role required", 403);
    }

    if (lot.status !== "draft" && lot.status !== "queued") {
      return apiError(
        "INVALID_STATE_TRANSITION",
        `Cannot start lot in ${lot.status} state`,
        409
      );
    }

    const now = new Date();
    const opensAt = now.toISOString();
    const closesAt = new Date(now.getTime() + durationSeconds * 1000).toISOString();
    const newEventNo = lot.last_event_no + 1;

    // Transition to live_bidding
    const { data: updated, error: updateError } = await supabase
      .from("lots")
      .update({
        status: "live_bidding",
        opens_at: opensAt,
        closes_at: closesAt,
        last_event_no: newEventNo,
        updated_at: now.toISOString(),
      })
      .eq("id", lotId)
      .select()
      .single();

    if (updateError) return apiError("INTERNAL_ERROR", "Failed to start lot", 500);

    // Insert auction event
    await supabase.from("auction_events").insert({
      lot_id: lotId,
      org_id: lot.org_id,
      event_no: newEventNo,
      event_type: "lot_opened",
      actor_user_id: userId,
      payload: { opensAt, closesAt, startPriceCents: lot.start_price_cents },
    });

    // Take opened snapshot
    await supabase.from("lot_snapshots").insert({
      lot_id: lotId,
      snapshot_type: "opened",
      payload: updated,
    });

    // Write outbox event
    await supabase.from("outbox_events").insert({
      lot_id: lotId,
      channel: `lot:${lotId}:events`,
      event_type: "lot_opened",
      payload: { lotId, eventNo: newEventNo, opensAt, closesAt },
    });

    return apiSuccess(updated);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
