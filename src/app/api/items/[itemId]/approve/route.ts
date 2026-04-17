import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const ApproveItemSchema = z.object({
  approved: z.boolean(),
  appraiser_notes: z.string().max(2000).optional(),
  appraised_value_cents: z.number().int().positive().optional(),
});

// ── POST /api/items/[itemId]/approve — Appraiser approval (US-018)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { itemId } = await params;
    const body = await request.json();
    const parsed = ApproveItemSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid approval data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Fetch existing item
    const { data: oldItem, error: fetchError } = await supabase
      .from("catalog_items")
      .select()
      .eq("id", itemId)
      .single();

    if (fetchError || !oldItem) {
      return apiError("NOT_FOUND", "Item not found", 404);
    }

    // State machine: approve can only happen when status is 'pending_review' or 'qa_required'
    if (oldItem.status !== "pending_review" && oldItem.status !== "qa_required") {
      return apiError(
        "STATE_INVALID",
        `Cannot approve item in "${oldItem.status}" status. Item must be in "pending_review" or "qa_required" status.`,
        409
      );
    }

    const newStatus = parsed.data.approved ? "approved" : "rejected";

    const updateData: Record<string, unknown> = {
      status: newStatus,
      appraiser_user_id: userId,
      appraised_at: new Date().toISOString(),
      appraiser_notes: parsed.data.appraiser_notes || null,
    };

    if (parsed.data.appraised_value_cents !== undefined) {
      updateData.appraised_value_cents = parsed.data.appraised_value_cents;
    }

    const { data: item, error } = await supabase
      .from("catalog_items")
      .update(updateData)
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to process approval", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "catalog_items",
      entity_id: item.id,
      action: parsed.data.approved ? "item_approved" : "item_rejected",
      actor_user_id: userId,
      old_values: oldItem,
      new_values: item,
    });

    return apiSuccess(item);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
