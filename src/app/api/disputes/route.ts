import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const CreateDisputeSchema = z.object({
  dispute_type: z.enum([
    "pricing",
    "condition",
    "authenticity",
    "missing_item",
    "damage",
    "billing",
    "other",
  ], {
    error: "dispute_type must be one of: pricing, condition, authenticity, missing_item, damage, billing, other",
  }),
  description: z.string().min(1, "Description is required").max(5000),
  job_id: z.string().uuid().optional(),
  item_id: z.string().uuid().optional(),
  order_id: z.string().uuid().optional(),
  evidence_urls: z.array(z.string().url()).max(10).optional(),
  desired_resolution: z.string().max(2000).optional(),
});

// ── POST /api/disputes — Create dispute (US-008) ─────────────
export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const body = await request.json();
    const parsed = CreateDisputeSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid dispute data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();
    const id = uuidv4();

    const { data: dispute, error } = await supabase
      .from("disputes")
      .insert({
        id,
        dispute_type: parsed.data.dispute_type,
        description: parsed.data.description,
        job_id: parsed.data.job_id || null,
        item_id: parsed.data.item_id || null,
        order_id: parsed.data.order_id || null,
        evidence_urls: parsed.data.evidence_urls || [],
        desired_resolution: parsed.data.desired_resolution || null,
        status: "open",
        filed_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to create dispute", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "disputes",
      entity_id: dispute.id,
      action: "dispute_created",
      actor_user_id: userId,
      old_values: null,
      new_values: dispute,
    });

    return apiSuccess(dispute, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── GET /api/disputes — List disputes ────────────────────────
export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const supabase = createServiceClient();
    const status = request.nextUrl.searchParams.get("status");
    const disputeType = request.nextUrl.searchParams.get("dispute_type");
    const jobId = request.nextUrl.searchParams.get("job_id");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "50", 10),
      200
    );
    const offset = parseInt(
      request.nextUrl.searchParams.get("offset") || "0",
      10
    );

    let query = supabase.from("disputes").select("*", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (disputeType) query = query.eq("dispute_type", disputeType);
    if (jobId) query = query.eq("job_id", jobId);

    const { data: disputes, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch disputes", 500);
    }

    return apiSuccess({ disputes, total: count, limit, offset });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
