import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const CreateItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  category: z.string().min(1, "Category is required").max(100),
  condition: z.enum(["A", "B", "C", "D"], {
    error: "Condition must be A, B, C, or D",
  }),
  description: z.string().max(5000).optional(),
  media_urls: z.array(z.string().url()).max(50).optional(),
  location_in_home: z.string().max(255).optional(),
  dimensions: z.string().max(255).optional(),
  weight_lbs: z.number().positive().optional(),
  estimated_value_cents: z.number().int().positive().optional(),
  notes: z.string().max(2000).optional(),
});

// ── GET /api/jobs/[jobId]/items — List items for a job ───────
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

    // Verify job exists
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    const status = request.nextUrl.searchParams.get("status");
    const category = request.nextUrl.searchParams.get("category");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "100", 10),
      500
    );
    const offset = parseInt(
      request.nextUrl.searchParams.get("offset") || "0",
      10
    );

    let query = supabase
      .from("catalog_items")
      .select("*", { count: "exact" })
      .eq("job_id", jobId);

    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);

    const { data: items, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch items", 500);
    }

    return apiSuccess({ items, total: count, limit, offset });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── POST /api/jobs/[jobId]/items — Create catalog item ───────
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
    const parsed = CreateItemSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid item data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify job exists
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select()
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    const id = uuidv4();
    const { data: item, error } = await supabase
      .from("catalog_items")
      .insert({
        id,
        job_id: jobId,
        title: parsed.data.title,
        category: parsed.data.category,
        condition: parsed.data.condition,
        description: parsed.data.description || null,
        media_urls: parsed.data.media_urls || [],
        location_in_home: parsed.data.location_in_home || null,
        dimensions: parsed.data.dimensions || null,
        weight_lbs: parsed.data.weight_lbs || null,
        estimated_value_cents: parsed.data.estimated_value_cents || null,
        notes: parsed.data.notes || null,
        status: "draft",
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to create item", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "catalog_items",
      entity_id: item.id,
      action: "item_created",
      actor_user_id: userId,
      old_values: null,
      new_values: item,
    });

    return apiSuccess(item, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
