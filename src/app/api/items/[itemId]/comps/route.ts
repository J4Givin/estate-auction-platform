import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── GET /api/items/[itemId]/comps — Comparable sales ─────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { itemId } = await params;
    const supabase = createServiceClient();

    // Verify item exists
    const { data: item, error: itemError } = await supabase
      .from("catalog_items")
      .select("id, title, category")
      .eq("id", itemId)
      .single();

    if (itemError || !item) {
      return apiError("NOT_FOUND", "Item not found", 404);
    }

    const source = request.nextUrl.searchParams.get("source");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "20", 10),
      100
    );

    let query = supabase
      .from("comps")
      .select()
      .eq("item_id", itemId);

    if (source) query = query.eq("source", source);

    const { data: comps, error } = await query
      .order("sold_at", { ascending: false })
      .limit(limit);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch comparable sales", 500);
    }

    // Calculate average and median
    const prices = (comps || [])
      .map((c) => c.sold_price_cents)
      .filter((p): p is number => p != null)
      .sort((a, b) => a - b);

    const avgPriceCents =
      prices.length > 0
        ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length)
        : null;

    const medianPriceCents =
      prices.length > 0
        ? prices.length % 2 === 0
          ? Math.round((prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2)
          : prices[Math.floor(prices.length / 2)]
        : null;

    return apiSuccess({
      item_id: item.id,
      title: item.title,
      category: item.category,
      comps: comps || [],
      summary: {
        count: prices.length,
        avg_price_cents: avgPriceCents,
        median_price_cents: medianPriceCents,
        min_price_cents: prices.length > 0 ? prices[0] : null,
        max_price_cents: prices.length > 0 ? prices[prices.length - 1] : null,
      },
    });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
