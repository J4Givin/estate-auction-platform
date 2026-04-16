import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ lotId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { lotId } = await context.params;
    const supabase = createServiceClient();

    const { data: lot, error } = await supabase
      .from("lots")
      .select()
      .eq("id", lotId)
      .single();

    if (error || !lot) return apiError("VALIDATION_FAILED", "Lot not found", 404);

    // Verify membership
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

    return apiSuccess(lot);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

const PatchLotSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  conditionNotes: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  appraisalValueCents: z.number().int().positive().optional(),
  startPriceCents: z.number().int().positive().optional(),
  reservePriceCents: z.number().int().positive().optional(),
  bidIncrementCents: z.number().int().positive().optional(),
  softCloseEnabled: z.boolean().optional(),
  softCloseWindowSeconds: z.number().int().positive().optional(),
  softCloseExtendSeconds: z.number().int().positive().optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { lotId } = await context.params;
    const body = await request.json();
    const parsed = PatchLotSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    const { data: lot } = await supabase
      .from("lots")
      .select()
      .eq("id", lotId)
      .single();

    if (!lot) return apiError("VALIDATION_FAILED", "Lot not found", 404);
    if (lot.status !== "draft") {
      return apiError("INVALID_STATE_TRANSITION", "Can only edit draft lots", 409);
    }

    // Verify admin/seller in org
    if (lot.org_id) {
      const { data: mem } = await supabase
        .from("org_memberships")
        .select()
        .eq("org_id", lot.org_id)
        .eq("user_id", userId)
        .in("role", ["admin", "seller"])
        .limit(1)
        .single();
      if (!mem) return apiError("AUTH_FORBIDDEN", "Admin or seller role required", 403);
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (parsed.data.title) updates.title = parsed.data.title;
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;
    if (parsed.data.conditionNotes !== undefined) updates.condition_notes = parsed.data.conditionNotes;
    if (parsed.data.mediaUrls) updates.media_urls = parsed.data.mediaUrls;
    if (parsed.data.appraisalValueCents) updates.appraisal_value_cents = parsed.data.appraisalValueCents;
    if (parsed.data.startPriceCents) updates.start_price_cents = parsed.data.startPriceCents;
    if (parsed.data.reservePriceCents) updates.reserve_price_cents = parsed.data.reservePriceCents;
    if (parsed.data.bidIncrementCents) updates.bid_increment_cents = parsed.data.bidIncrementCents;
    if (parsed.data.softCloseEnabled !== undefined) updates.soft_close_enabled = parsed.data.softCloseEnabled;
    if (parsed.data.softCloseWindowSeconds) updates.soft_close_window_seconds = parsed.data.softCloseWindowSeconds;
    if (parsed.data.softCloseExtendSeconds) updates.soft_close_extend_seconds = parsed.data.softCloseExtendSeconds;

    const { data: updated, error } = await supabase
      .from("lots")
      .update(updates)
      .eq("id", lotId)
      .select()
      .single();

    if (error) return apiError("INTERNAL_ERROR", "Failed to update lot", 500);
    return apiSuccess(updated);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
