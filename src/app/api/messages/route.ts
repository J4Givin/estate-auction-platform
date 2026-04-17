import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── GET /api/messages — Unified inbox with optional filters ──
export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const supabase = createServiceClient();
    const jobId = request.nextUrl.searchParams.get("job_id");
    const itemId = request.nextUrl.searchParams.get("item_id");
    const channel = request.nextUrl.searchParams.get("channel");
    const isRead = request.nextUrl.searchParams.get("is_read");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "50", 10),
      200
    );
    const offset = parseInt(
      request.nextUrl.searchParams.get("offset") || "0",
      10
    );

    let query = supabase
      .from("messages")
      .select("*", { count: "exact" })
      .or(`sender_user_id.eq.${userId},recipient_user_id.eq.${userId}`);

    if (jobId) query = query.eq("job_id", jobId);
    if (itemId) query = query.eq("item_id", itemId);
    if (channel) query = query.eq("channel", channel);
    if (isRead === "true") query = query.eq("is_read", true);
    if (isRead === "false") query = query.eq("is_read", false);

    const { data: messages, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch messages", 500);
    }

    // Count unread
    const { count: unreadCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_user_id", userId)
      .eq("is_read", false);

    return apiSuccess({
      messages,
      total: count,
      unread_count: unreadCount || 0,
      limit,
      offset,
    });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
