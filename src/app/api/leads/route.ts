import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schemas ──────────────────────────────────────────────
const CreateLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required").max(30),
  property_address: z.string().min(1, "Property address is required").max(500),
  notes: z.string().max(2000).optional(),
  source: z.string().max(100).optional(),
});

// ── POST /api/leads — Create lead (public, no auth required) ─
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid lead data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();
    const id = uuidv4();

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        id,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        property_address: parsed.data.property_address,
        notes: parsed.data.notes || null,
        source: parsed.data.source || "website",
        status: "new",
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to create lead", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "leads",
      entity_id: lead.id,
      action: "lead_created",
      actor_user_id: null,
      old_values: null,
      new_values: lead,
    });

    return apiSuccess(lead, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── GET /api/leads — List leads (auth required) ──────────────
export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const supabase = createServiceClient();
    const status = request.nextUrl.searchParams.get("status");
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") || "50", 10),
      200
    );
    const offset = parseInt(
      request.nextUrl.searchParams.get("offset") || "0",
      10
    );

    let query = supabase.from("leads").select("*", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: leads, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to fetch leads", 500);
    }

    return apiSuccess({ leads, total: count, limit, offset });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
