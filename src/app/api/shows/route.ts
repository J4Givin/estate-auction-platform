import { NextRequest } from "next/server";
import { ZCreateShowRequest } from "@/types";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const supabase = createServiceClient();
    const orgId = request.nextUrl.searchParams.get("orgId");

    let query = supabase.from("shows").select();

    if (orgId) {
      // Verify membership
      const { data: mem } = await supabase
        .from("org_memberships")
        .select()
        .eq("org_id", orgId)
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (!mem) return apiError("AUTH_FORBIDDEN", "Not a member of this org", 403);
      query = query.eq("org_id", orgId);
    } else {
      // Get shows for all user orgs
      const { data: memberships } = await supabase
        .from("org_memberships")
        .select("org_id")
        .eq("user_id", userId);

      const orgIds = memberships?.map((m) => m.org_id) || [];
      if (orgIds.length === 0) return apiSuccess([]);
      query = query.in("org_id", orgIds);
    }

    const { data: shows, error } = await query.order("created_at", { ascending: false });
    if (error) return apiError("INTERNAL_ERROR", "Failed to fetch shows", 500);
    return apiSuccess(shows);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const body = await request.json();
    const parsed = ZCreateShowRequest.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid show data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify user is admin/seller in org
    const { data: mem } = await supabase
      .from("org_memberships")
      .select()
      .eq("org_id", parsed.data.orgId)
      .eq("user_id", userId)
      .in("role", ["admin", "seller"])
      .limit(1)
      .single();

    if (!mem) return apiError("AUTH_FORBIDDEN", "Admin or seller role required", 403);

    const { data: show, error } = await supabase
      .from("shows")
      .insert({
        org_id: parsed.data.orgId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        scheduled_at: parsed.data.scheduledAt || null,
        stream_url: parsed.data.streamUrl || null,
      })
      .select()
      .single();

    if (error) return apiError("INTERNAL_ERROR", "Failed to create show", 500);
    return apiSuccess(show, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
