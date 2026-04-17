import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const AuthRequestSchema = z.object({
  reason: z.string().min(1, "Reason is required").max(2000),
  extra_photos: z.array(z.string().url("Each photo must be a valid URL")).min(1, "At least one photo is required").max(20),
  authentication_type: z
    .enum(["certificate_of_authenticity", "expert_review", "provenance_check", "lab_test"])
    .optional(),
  priority: z.enum(["normal", "rush"]).default("normal"),
});

// ── POST /api/items/[itemId]/auth-request — Request authentication (US-020)
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
    const parsed = AuthRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid authentication request data", 400, {
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

    // State machine: auth_request only when auth_status is 'not_required' or 'inconclusive'
    const currentAuthStatus = oldItem.auth_status || "not_required";
    if (currentAuthStatus !== "not_required" && currentAuthStatus !== "inconclusive") {
      return apiError(
        "STATE_INVALID",
        `Cannot request authentication when auth_status is "${currentAuthStatus}". Must be "not_required" or "inconclusive".`,
        409
      );
    }

    const { data: item, error } = await supabase
      .from("catalog_items")
      .update({
        auth_status: "pending",
        auth_request_reason: parsed.data.reason,
        auth_extra_photos: parsed.data.extra_photos,
        auth_type: parsed.data.authentication_type || null,
        auth_priority: parsed.data.priority,
        auth_requested_by: userId,
        auth_requested_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to create authentication request", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "catalog_items",
      entity_id: item.id,
      action: "auth_request_created",
      actor_user_id: userId,
      old_values: oldItem,
      new_values: item,
    });

    return apiSuccess(item);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
