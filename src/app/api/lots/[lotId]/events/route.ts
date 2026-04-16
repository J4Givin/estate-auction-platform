import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ lotId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { lotId } = await context.params;
    const afterEventNo = parseInt(
      request.nextUrl.searchParams.get("afterEventNo") || "0",
      10
    );

    const supabase = createServiceClient();

    // Get lot to verify access
    const { data: lot } = await supabase
      .from("lots")
      .select("org_id")
      .eq("id", lotId)
      .single();

    if (!lot) return apiError("VALIDATION_FAILED", "Lot not found", 404);

    // Verify org membership
    if (lot.org_id) {
      const { data: mem } = await supabase
        .from("org_memberships")
        .select()
        .eq("org_id", lot.org_id)
        .eq("user_id", userId)
        .limit(1)
        .single();
      if (!mem) return apiError("AUTH_FORBIDDEN", "Not a member of this org", 403);
    }

    // Fetch events after the given event_no for gap resync
    const { data: events, error } = await supabase
      .from("auction_events")
      .select()
      .eq("lot_id", lotId)
      .gt("event_no", afterEventNo)
      .order("event_no", { ascending: true })
      .limit(100);

    if (error) return apiError("INTERNAL_ERROR", "Failed to fetch events", 500);
    return apiSuccess(events || []);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
