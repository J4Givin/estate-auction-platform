import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const RegisterPartnerSchema = z.object({
  company_name: z.string().min(1, "Company name is required").max(255),
  contact_name: z.string().min(1, "Contact name is required").max(255),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7).max(30),
  partner_type: z
    .enum(["realtor", "estate_attorney", "financial_advisor", "moving_company", "appraiser", "other"])
    .default("other"),
  website: z.string().url().optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  commission_rate_bps: z.number().int().min(0).max(5000).optional(),
});

// ── POST /api/partners — Register partner ────────────────────
export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const body = await request.json();
    const parsed = RegisterPartnerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid partner data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();
    const id = uuidv4();

    const { data: partner, error } = await supabase
      .from("partners")
      .insert({
        id,
        company_name: parsed.data.company_name,
        contact_name: parsed.data.contact_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        partner_type: parsed.data.partner_type,
        website: parsed.data.website || null,
        address: parsed.data.address || null,
        notes: parsed.data.notes || null,
        commission_rate_bps: parsed.data.commission_rate_bps || null,
        status: "active",
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to register partner", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "partners",
      entity_id: partner.id,
      action: "partner_registered",
      actor_user_id: userId,
      old_values: null,
      new_values: partner,
    });

    return apiSuccess(partner, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── GET /api/partners — List partners ────────────────────────
export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const supabase = createServiceClient();
    const partnerType = request.nextUrl.searchParams.get("partner_type");
    const status = request.nextUrl.searchParams.get("status");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "50", 10),
      200
    );
    const offset = parseInt(
      request.nextUrl.searchParams.get("offset") || "0",
      10
    );

    let query = supabase.from("partners").select("*", { count: "exact" });

    if (partnerType) query = query.eq("partner_type", partnerType);
    if (status) query = query.eq("status", status);

    const { data: partners, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch partners", 500);
    }

    return apiSuccess({ partners, total: count, limit, offset });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
