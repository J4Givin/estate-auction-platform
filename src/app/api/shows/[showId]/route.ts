import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ showId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { showId } = await context.params;
    const supabase = createServiceClient();

    const { data: show, error } = await supabase
      .from("shows")
      .select()
      .eq("id", showId)
      .single();

    if (error || !show) return apiError("VALIDATION_FAILED", "Show not found", 404);

    // Verify membership
    if (show.org_id) {
      const { data: mem } = await supabase
        .from("org_memberships")
        .select()
        .eq("org_id", show.org_id)
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (!mem) return apiError("AUTH_FORBIDDEN", "Not a member of this org", 403);
    }

    return apiSuccess(show);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

const PatchShowSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  streamUrl: z.string().url().optional(),
  status: z.string().optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { showId } = await context.params;
    const body = await request.json();
    const parsed = PatchShowSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Get show first
    const { data: show } = await supabase
      .from("shows")
      .select()
      .eq("id", showId)
      .single();

    if (!show) return apiError("VALIDATION_FAILED", "Show not found", 404);

    // Verify admin/seller in org
    if (show.org_id) {
      const { data: mem } = await supabase
        .from("org_memberships")
        .select()
        .eq("org_id", show.org_id)
        .eq("user_id", userId)
        .in("role", ["admin", "seller"])
        .limit(1)
        .single();

      if (!mem) return apiError("AUTH_FORBIDDEN", "Admin or seller role required", 403);
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (parsed.data.title) updates.title = parsed.data.title;
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;
    if (parsed.data.scheduledAt) updates.scheduled_at = parsed.data.scheduledAt;
    if (parsed.data.streamUrl) updates.stream_url = parsed.data.streamUrl;
    if (parsed.data.status) updates.status = parsed.data.status;

    const { data: updated, error } = await supabase
      .from("shows")
      .update(updates)
      .eq("id", showId)
      .select()
      .single();

    if (error) return apiError("INTERNAL_ERROR", "Failed to update show", 500);
    return apiSuccess(updated);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
