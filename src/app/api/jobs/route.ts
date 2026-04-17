import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schemas ──────────────────────────────────────────────
const CreateJobSchema = z.object({
  lead_id: z.string().uuid("Valid lead_id is required"),
  strategy: z
    .enum(["full_service", "partial", "consignment", "buyout"])
    .default("full_service"),
  notes: z.string().max(2000).optional(),
  assigned_to: z.string().uuid().optional(),
});

// ── POST /api/jobs — Create job from lead ────────────────────
export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const body = await request.json();
    const parsed = CreateJobSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid job data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify lead exists
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select()
      .eq("id", parsed.data.lead_id)
      .single();

    if (leadError || !lead) {
      return apiError("NOT_FOUND", "Lead not found", 404);
    }

    const id = uuidv4();
    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        id,
        lead_id: parsed.data.lead_id,
        strategy: parsed.data.strategy,
        status: "pending",
        notes: parsed.data.notes || null,
        assigned_to: parsed.data.assigned_to || null,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to create job", 500);
    }

    // Update lead status
    await supabase
      .from("leads")
      .update({ status: "converted" })
      .eq("id", parsed.data.lead_id);

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "jobs",
      entity_id: job.id,
      action: "job_created",
      actor_user_id: userId,
      old_values: null,
      new_values: job,
    });

    return apiSuccess(job, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── GET /api/jobs — List jobs ────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const supabase = createServiceClient();
    const status = request.nextUrl.searchParams.get("status");
    const assignedTo = request.nextUrl.searchParams.get("assigned_to");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "50", 10),
      200
    );
    const offset = parseInt(
      request.nextUrl.searchParams.get("offset") || "0",
      10
    );

    let query = supabase.from("jobs").select("*", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (assignedTo) query = query.eq("assigned_to", assignedTo);

    const { data: jobs, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch jobs", 500);
    }

    return apiSuccess({ jobs, total: count, limit, offset });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
