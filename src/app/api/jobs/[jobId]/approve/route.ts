import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const ApproveJobSchema = z.object({
  signature: z.string().min(1, "Signature is required").max(500),
  approval_notes: z.string().max(2000).optional(),
});

// ── POST /api/jobs/[jobId]/approve — Customer approval (US-006)
export async function POST(
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
    const parsed = ApproveJobSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid approval data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Fetch job
    const { data: oldJob, error: fetchError } = await supabase
      .from("jobs")
      .select()
      .eq("id", jobId)
      .single();

    if (fetchError || !oldJob) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    // Enforce state: only allow approval when status is "review"
    if (oldJob.status !== "review") {
      return apiError(
        "STATE_INVALID",
        `Cannot approve job in "${oldJob.status}" status. Job must be in "review" status.`,
        409
      );
    }

    const { data: job, error } = await supabase
      .from("jobs")
      .update({
        status: "approved",
        approved_by: userId,
        approved_at: new Date().toISOString(),
        approval_signature: parsed.data.signature,
        approval_notes: parsed.data.approval_notes || null,
      })
      .eq("id", jobId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to approve job", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "jobs",
      entity_id: job.id,
      action: "job_approved",
      actor_user_id: userId,
      old_values: oldJob,
      new_values: job,
    });

    return apiSuccess(job);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
