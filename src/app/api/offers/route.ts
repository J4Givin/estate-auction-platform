import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const CreateOfferSchema = z.object({
  item_id: z.string().uuid("Valid item_id is required"),
  buyer_name: z.string().min(1, "Buyer name is required").max(255),
  buyer_email: z.string().email().optional(),
  buyer_phone: z.string().max(30).optional(),
  offer_amount_cents: z.number().int().positive("Offer amount must be a positive integer in cents"),
  message: z.string().max(2000).optional(),
  expires_at: z.string().datetime().optional(),
});

// ── POST /api/offers — Create offer ──────────────────────────
export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const body = await request.json();
    const parsed = CreateOfferSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid offer data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify item exists
    const { data: item, error: itemError } = await supabase
      .from("catalog_items")
      .select("id, title, status")
      .eq("id", parsed.data.item_id)
      .single();

    if (itemError || !item) {
      return apiError("NOT_FOUND", "Item not found", 404);
    }

    const id = uuidv4();
    const { data: offer, error } = await supabase
      .from("offers")
      .insert({
        id,
        item_id: parsed.data.item_id,
        buyer_name: parsed.data.buyer_name,
        buyer_email: parsed.data.buyer_email || null,
        buyer_phone: parsed.data.buyer_phone || null,
        offer_amount_cents: parsed.data.offer_amount_cents,
        message: parsed.data.message || null,
        expires_at: parsed.data.expires_at || null,
        status: "pending",
        offered_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to create offer", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "offers",
      entity_id: offer.id,
      action: "offer_created",
      actor_user_id: userId,
      old_values: null,
      new_values: offer,
    });

    return apiSuccess(offer, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── GET /api/offers — List offers ────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const supabase = createServiceClient();
    const itemId = request.nextUrl.searchParams.get("item_id");
    const status = request.nextUrl.searchParams.get("status");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "50", 10),
      200
    );
    const offset = parseInt(
      request.nextUrl.searchParams.get("offset") || "0",
      10
    );

    let query = supabase.from("offers").select("*", { count: "exact" });

    if (itemId) query = query.eq("item_id", itemId);
    if (status) query = query.eq("status", status);

    const { data: offers, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch offers", 500);
    }

    return apiSuccess({ offers, total: count, limit, offset });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
