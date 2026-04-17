import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const UpdatePriceSchema = z.object({
  price_cents: z.number().int().positive("Price must be a positive integer in cents"),
  override_rationale: z.string().min(1, "Override rationale is required for manual price changes").max(2000),
  price_source: z
    .enum(["manual", "algorithmic", "comp_based", "appraiser"])
    .default("manual"),
});

// ── GET /api/items/[itemId]/price — Pricing info ─────────────
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

    // Fetch item
    const { data: item, error: itemError } = await supabase
      .from("catalog_items")
      .select("id, title, estimated_value_cents, appraised_value_cents")
      .eq("id", itemId)
      .single();

    if (itemError || !item) {
      return apiError("NOT_FOUND", "Item not found", 404);
    }

    // Fetch pricing events
    const { data: events, error: eventsError } = await supabase
      .from("pricing_events")
      .select()
      .eq("item_id", itemId)
      .order("created_at", { ascending: false });

    if (eventsError) {
      return apiError("INTERNAL_ERROR", "Failed to fetch pricing events", 500);
    }

    const currentPrice = events && events.length > 0 ? events[0] : null;

    return apiSuccess({
      item_id: item.id,
      title: item.title,
      estimated_value_cents: item.estimated_value_cents,
      appraised_value_cents: item.appraised_value_cents,
      current_price: currentPrice,
      price_history: events || [],
    });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── PATCH /api/items/[itemId]/price — Update price ───────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { itemId } = await params;
    const body = await request.json();
    const parsed = UpdatePriceSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid pricing data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify item exists
    const { data: item, error: itemError } = await supabase
      .from("catalog_items")
      .select()
      .eq("id", itemId)
      .single();

    if (itemError || !item) {
      return apiError("NOT_FOUND", "Item not found", 404);
    }

    // Get previous price event for old_values
    const { data: prevEvents } = await supabase
      .from("pricing_events")
      .select()
      .eq("item_id", itemId)
      .order("created_at", { ascending: false })
      .limit(1);

    const previousPrice = prevEvents && prevEvents.length > 0 ? prevEvents[0] : null;

    // Create new pricing event
    const eventId = uuidv4();
    const { data: priceEvent, error } = await supabase
      .from("pricing_events")
      .insert({
        id: eventId,
        item_id: itemId,
        price_cents: parsed.data.price_cents,
        price_source: parsed.data.price_source,
        override_rationale: parsed.data.override_rationale,
        previous_price_cents: previousPrice?.price_cents || null,
        set_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to update price", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "pricing_events",
      entity_id: priceEvent.id,
      action: "price_updated",
      actor_user_id: userId,
      old_values: previousPrice,
      new_values: priceEvent,
    });

    return apiSuccess(priceEvent);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
