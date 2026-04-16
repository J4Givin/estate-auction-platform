import { NextRequest } from "next/server";
import { ZCreateLotRequest } from "@/types";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const supabase = createServiceClient();
    const orgId = request.nextUrl.searchParams.get("orgId");
    const showId = request.nextUrl.searchParams.get("showId");
    const status = request.nextUrl.searchParams.get("status");

    let query = supabase.from("lots").select();

    if (orgId) {
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
      const { data: memberships } = await supabase
        .from("org_memberships")
        .select("org_id")
        .eq("user_id", userId);
      const orgIds = memberships?.map((m) => m.org_id) || [];
      if (orgIds.length === 0) return apiSuccess([]);
      query = query.in("org_id", orgIds);
    }

    if (showId) query = query.eq("show_id", showId);
    if (status) query = query.eq("status", status);

    const { data: lots, error } = await query.order("created_at", { ascending: false });
    if (error) return apiError("INTERNAL_ERROR", "Failed to fetch lots", 500);
    return apiSuccess(lots);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const body = await request.json();
    const parsed = ZCreateLotRequest.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid lot data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify admin/seller in org
    const { data: mem } = await supabase
      .from("org_memberships")
      .select()
      .eq("org_id", parsed.data.orgId)
      .eq("user_id", userId)
      .in("role", ["admin", "seller"])
      .limit(1)
      .single();

    if (!mem) return apiError("AUTH_FORBIDDEN", "Admin or seller role required", 403);

    const { data: lot, error } = await supabase
      .from("lots")
      .insert({
        org_id: parsed.data.orgId,
        show_id: parsed.data.showId || null,
        title: parsed.data.title,
        description: parsed.data.description || null,
        condition_notes: parsed.data.conditionNotes || null,
        media_urls: parsed.data.mediaUrls || [],
        appraisal_value_cents: parsed.data.appraisalValueCents || null,
        start_price_cents: parsed.data.startPriceCents,
        reserve_price_cents: parsed.data.reservePriceCents || null,
        bid_increment_cents: parsed.data.bidIncrementCents,
        soft_close_enabled: parsed.data.softCloseEnabled,
        soft_close_window_seconds: parsed.data.softCloseWindowSeconds,
        soft_close_extend_seconds: parsed.data.softCloseExtendSeconds,
      })
      .select()
      .single();

    if (error) return apiError("INTERNAL_ERROR", "Failed to create lot", 500);
    return apiSuccess(lot, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
