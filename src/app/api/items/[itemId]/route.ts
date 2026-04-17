import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

// ── Zod Schema ───────────────────────────────────────────────
const UpdateItemSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  category: z.string().min(1).max(100).optional(),
  condition: z.enum(["A", "B", "C", "D"]).optional(),
  description: z.string().max(5000).optional(),
  media_urls: z.array(z.string().url()).max(50).optional(),
  location_in_home: z.string().max(255).optional(),
  dimensions: z.string().max(255).optional(),
  weight_lbs: z.number().positive().optional(),
  estimated_value_cents: z.number().int().positive().optional(),
  notes: z.string().max(2000).optional(),
});

// ── GET /api/items/[itemId] — Item detail ────────────────────
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

    const { data: item, error } = await supabase
      .from("catalog_items")
      .select()
      .eq("id", itemId)
      .single();

    if (error || !item) {
      return apiError("NOT_FOUND", "Item not found", 404);
    }

    return apiSuccess(item);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

// ── PATCH /api/items/[itemId] — Update item ──────────────────
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
    const parsed = UpdateItemSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid item update data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Fetch existing item for audit
    const { data: oldItem, error: fetchError } = await supabase
      .from("catalog_items")
      .select()
      .eq("id", itemId)
      .single();

    if (fetchError || !oldItem) {
      return apiError("NOT_FOUND", "Item not found", 404);
    }

    const updateData: Record<string, unknown> = {};
    const fields = [
      "title",
      "category",
      "condition",
      "description",
      "media_urls",
      "location_in_home",
      "dimensions",
      "weight_lbs",
      "estimated_value_cents",
      "notes",
    ] as const;

    for (const field of fields) {
      if (parsed.data[field] !== undefined) {
        updateData[field] = parsed.data[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return apiError("VALIDATION_FAILED", "No fields to update", 400);
    }

    const { data: item, error } = await supabase
      .from("catalog_items")
      .update(updateData)
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", "Failed to update item", 500);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      entity_type: "catalog_items",
      entity_id: item.id,
      action: "item_updated",
      actor_user_id: userId,
      old_values: oldItem,
      new_values: item,
    });

    return apiSuccess(item);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
