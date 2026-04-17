import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const CreateBookingSchema = z.object({
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format"),
  time_slot: z.string().min(1, "Time slot is required").max(50),
  address_line1: z.string().min(1, "Address line 1 is required").max(255),
  address_line2: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(2, "State is required").max(50),
  zip_code: z.string().min(5, "ZIP code is required").max(20),
  contact_phone: z.string().max(30).optional(),
  special_instructions: z.string().max(1000).optional(),
});

// ── POST /api/jobs/[jobId]/bookings — Create booking (US-001) ─
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) {
      return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);
    }

    const { jobId } = await params;
    const body = await request.json();
    const parsed = CreateBookingSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid booking data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify job exists
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select()
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    const id = uuidv4();
    const { data: booking, error } = await supabase
      .from("job_bookings")
      .insert({
        id,
        job_id: jobId,
        scheduled_date: parsed.data.scheduled_date,
        time_slot: parsed.data.time_slot,
        address_line1: parsed.data.address_line1,
        address_line2: parsed.data.address_line2 || null,
        city: parsed.data.city,
        state: parsed.data.state,
        zip_code: parsed.data.zip_code,
        contact_phone: parsed.data.contact_phone || null,
        special_instructions: parsed.data.special_instructions || null,
        status: "scheduled",
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to create booking", 500);
    }

    // Update job status to scheduled
    await supabase
      .from("jobs")
      .update({ status: "scheduled" })
      .eq("id", jobId);

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "job_bookings",
      entity_id: booking.id,
      action: "booking_created",
      actor_user_id: userId,
      old_values: null,
      new_values: booking,
    });

    return apiSuccess(booking, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
