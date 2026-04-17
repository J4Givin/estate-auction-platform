import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const UpdateOfferSchema = z.object({
  action: z.enum(["accept", "counter", "decline"], {
    error: "Action must be one of: accept, counter, decline",
  }),
  counter_amount_cents: z.number().int().positive().optional(),
  counter_message: z.string().max(2000).optional(),
  decline_reason: z.string().max(2000).optional(),
}).refine(
  (data) => {
    if (data.action === "counter" && !data.counter_amount_cents) {
      return false;
    }
    return true;
  },
  {
    message: "counter_amount_cents is required when action is 'counter'",
    path: ["counter_amount_cents"],
  }
);

// ── PATCH /api/offers/[offerId] — Accept/counter/decline offer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { offerId } = await params;
    const body = await request.json();
    const parsed = UpdateOfferSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid offer action data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Fetch existing offer
    const { data: oldOffer, error: fetchError } = await supabase
      .from("offers")
      .select()
      .eq("id", offerId)
      .single();

    if (fetchError || !oldOffer) {
      return apiError("NOT_FOUND", "Offer not found", 404);
    }

    // Only pending or countered offers can be acted on
    if (oldOffer.status !== "pending" && oldOffer.status !== "countered") {
      return apiError(
        "STATE_INVALID",
        `Cannot ${parsed.data.action} an offer with status "${oldOffer.status}". Offer must be "pending" or "countered".`,
        409
      );
    }

    const updateData: Record<string, unknown> = {
      responded_by: userId,
      responded_at: new Date().toISOString(),
    };

    switch (parsed.data.action) {
      case "accept":
        updateData.status = "accepted";
        break;
      case "counter":
        updateData.status = "countered";
        updateData.counter_amount_cents = parsed.data.counter_amount_cents;
        updateData.counter_message = parsed.data.counter_message || null;
        break;
      case "decline":
        updateData.status = "declined";
        updateData.decline_reason = parsed.data.decline_reason || null;
        break;
    }

    const { data: offer, error } = await supabase
      .from("offers")
      .update(updateData)
      .eq("id", offerId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to update offer", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "offers",
      entity_id: offer.id,
      action: `offer_${parsed.data.action}${parsed.data.action === "counter" ? "ed" : parsed.data.action === "decline" ? "d" : "ed"}`,
      actor_user_id: userId,
      old_values: oldOffer,
      new_values: offer,
    });

    return apiSuccess(offer);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
