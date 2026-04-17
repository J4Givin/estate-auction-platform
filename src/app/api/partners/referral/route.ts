import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const SubmitReferralSchema = z.object({
  partner_id: z.string().uuid("Valid partner_id is required"),
  referred_name: z.string().min(1, "Referred name is required").max(255),
  referred_email: z.string().email("Valid email is required"),
  referred_phone: z.string().min(7).max(30),
  property_address: z.string().min(1, "Property address is required").max(500),
  notes: z.string().max(2000).optional(),
  estimated_value: z.string().max(100).optional(),
});

// ── POST /api/partners/referral — Submit referral (US-026) ───
export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const body = await request.json();
    const parsed = SubmitReferralSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid referral data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify partner exists and is active
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select()
      .eq("id", parsed.data.partner_id)
      .single();

    if (partnerError || !partner) {
      return apiError("NOT_FOUND", "Partner not found", 404);
    }

    if (partner.status !== "active") {
      return apiError(
        "STATE_INVALID",
        "Partner is not currently active",
        409
      );
    }

    const id = uuidv4();
    const { data: referral, error } = await supabase
      .from("referrals")
      .insert({
        id,
        partner_id: parsed.data.partner_id,
        referred_name: parsed.data.referred_name,
        referred_email: parsed.data.referred_email,
        referred_phone: parsed.data.referred_phone,
        property_address: parsed.data.property_address,
        notes: parsed.data.notes || null,
        estimated_value: parsed.data.estimated_value || null,
        status: "pending",
        submitted_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to submit referral", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "referrals",
      entity_id: referral.id,
      action: "referral_submitted",
      actor_user_id: userId,
      old_values: null,
      new_values: referral,
    });

    return apiSuccess(referral, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
