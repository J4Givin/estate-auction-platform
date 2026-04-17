import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const UpdateDisputeSchema = z.object({
  status: z
    .enum(["open", "under_review", "resolved", "escalated", "closed"])
    .optional(),
  resolution_notes: z.string().max(5000).optional(),
  resolution_type: z
    .enum(["refund", "replacement", "credit", "dismissed", "other"])
    .optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  internal_notes: z.string().max(5000).optional(),
});

// ── GET /api/disputes/[disputeId] — Dispute detail ───────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ disputeId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { disputeId } = await params;
    const supabase = createServiceClient();

    const { data: dispute, error } = await supabase
      .from("disputes")
      .select()
      .eq("id", disputeId)
      .single();

    if (error || !dispute) {
      return apiError("NOT_FOUND", "Dispute not found", 404);
    }

    return apiSuccess(dispute);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── PATCH /api/disputes/[disputeId] — Update/resolve dispute ─
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ disputeId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { disputeId } = await params;
    const body = await request.json();
    const parsed = UpdateDisputeSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid dispute update data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Fetch existing dispute for audit
    const { data: oldDispute, error: fetchError } = await supabase
      .from("disputes")
      .select()
      .eq("id", disputeId)
      .single();

    if (fetchError || !oldDispute) {
      return apiError("NOT_FOUND", "Dispute not found", 404);
    }

    // Cannot update closed disputes
    if (oldDispute.status === "closed") {
      return apiError(
        "STATE_INVALID",
        "Cannot update a closed dispute",
        409
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.status !== undefined) {
      updateData.status = parsed.data.status;
      if (parsed.data.status === "resolved" || parsed.data.status === "closed") {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = userId;
      }
    }
    if (parsed.data.resolution_notes !== undefined)
      updateData.resolution_notes = parsed.data.resolution_notes;
    if (parsed.data.resolution_type !== undefined)
      updateData.resolution_type = parsed.data.resolution_type;
    if (parsed.data.assigned_to !== undefined)
      updateData.assigned_to = parsed.data.assigned_to;
    if (parsed.data.internal_notes !== undefined)
      updateData.internal_notes = parsed.data.internal_notes;

    if (Object.keys(updateData).length === 0) {
      return apiError("VALIDATION_FAILED", "No fields to update", 400);
    }

    const { data: dispute, error } = await supabase
      .from("disputes")
      .update(updateData)
      .eq("id", disputeId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to update dispute", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "disputes",
      entity_id: dispute.id,
      action: parsed.data.status === "resolved" ? "dispute_resolved" : "dispute_updated",
      actor_user_id: userId,
      old_values: oldDispute,
      new_values: dispute,
    });

    return apiSuccess(dispute);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
