import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const UpdateJobSchema = z.object({
  status: z
    .enum([
      "pending",
      "scheduled",
      "in_progress",
      "cataloging",
      "review",
      "approved",
      "listed",
      "completed",
      "canceled",
    ])
    .optional(),
  strategy: z
    .enum(["full_service", "partial", "consignment", "buyout"])
    .optional(),
  notes: z.string().max(2000).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});

// ── GET /api/jobs/[jobId] — Job detail ───────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { jobId } = await params;
    const supabase = createServiceClient();

    const { data: job, error } = await supabase
      .from("jobs")
      .select()
      .eq("id", jobId)
      .single();

    if (error || !job) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    return apiSuccess(job);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── PATCH /api/jobs/[jobId] — Update job ─────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { jobId } = await params;
    const body = await request.json();
    const parsed = UpdateJobSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid job update data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Fetch existing job for audit
    const { data: oldJob, error: fetchError } = await supabase
      .from("jobs")
      .select()
      .eq("id", jobId)
      .single();

    if (fetchError || !oldJob) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
    if (parsed.data.strategy !== undefined) updateData.strategy = parsed.data.strategy;
    if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;
    if (parsed.data.assigned_to !== undefined)
      updateData.assigned_to = parsed.data.assigned_to;

    if (Object.keys(updateData).length === 0) {
      return apiError("VALIDATION_FAILED", "No fields to update", 400);
    }

    const { data: job, error } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", jobId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to update job", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "jobs",
      entity_id: job.id,
      action: "job_updated",
      actor_user_id: userId,
      old_values: oldJob,
      new_values: job,
    });

    return apiSuccess(job);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
