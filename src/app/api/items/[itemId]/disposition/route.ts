import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const SetDispositionSchema = z.object({
  disposition: z.enum(["sell", "keep", "donate", "trash", "auction"], {
    error: "Disposition must be one of: sell, keep, donate, trash, auction",
  }),
  reason: z.string().max(1000).optional(),
});

// ── POST /api/items/[itemId]/disposition — Set disposition (US-004)
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
    const parsed = SetDispositionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid disposition data", 400, {
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

    // State machine: disposition can only be set when status is 'draft' or 'pending_review'
    if (oldItem.status !== "draft" && oldItem.status !== "pending_review") {
      return apiError(
        "STATE_INVALID",
        `Cannot set disposition when item status is "${oldItem.status}". Item must be in "draft" or "pending_review" status.`,
        409
      );
    }

    const { data: item, error } = await supabase
      .from("catalog_items")
      .update({
        disposition: parsed.data.disposition,
        disposition_reason: parsed.data.reason || null,
        disposition_set_by: userId,
        disposition_set_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to set disposition", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "catalog_items",
      entity_id: item.id,
      action: "disposition_set",
      actor_user_id: userId,
      old_values: oldItem,
      new_values: item,
    });

    return apiSuccess(item);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
