import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const QAFlagSchema = z.object({
  reason: z.string().min(1, "Reason is required").max(2000),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  flagged_fields: z.array(z.string().max(100)).max(20).optional(),
});

// ── POST /api/items/[itemId]/qa-flag — Flag for QA (US-019) ─
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
    const parsed = QAFlagSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid QA flag data", 400, {
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

    const { data: item, error } = await supabase
      .from("catalog_items")
      .update({
        status: "qa_required",
        qa_flag_reason: parsed.data.reason,
        qa_flag_severity: parsed.data.severity,
        qa_flagged_fields: parsed.data.flagged_fields || [],
        qa_flagged_by: userId,
        qa_flagged_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to flag item for QA", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "catalog_items",
      entity_id: item.id,
      action: "item_qa_flagged",
      actor_user_id: userId,
      old_values: oldItem,
      new_values: item,
    });

    return apiSuccess(item);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
