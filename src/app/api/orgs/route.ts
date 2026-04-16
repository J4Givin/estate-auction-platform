import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

const CreateOrgSchema = z.object({
  name: z.string().min(1).max(255),
});

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const supabase = createServiceClient();

    // Get orgs the user is a member of
    const { data: memberships, error: memError } = await supabase
      .from("org_memberships")
      .select("org_id")
      .eq("user_id", userId);

    if (memError) return apiError("INTERNAL_ERROR", "Failed to fetch memberships", 500);

    const orgIds = memberships.map((m) => m.org_id);
    if (orgIds.length === 0) return apiSuccess([]);

    const { data: orgs, error } = await supabase
      .from("orgs")
      .select()
      .in("id", orgIds)
      .order("created_at", { ascending: false });

    if (error) return apiError("INTERNAL_ERROR", "Failed to fetch orgs", 500);
    return apiSuccess(orgs);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const body = await request.json();
    const parsed = CreateOrgSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid org data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Create org
    const { data: org, error: orgError } = await supabase
      .from("orgs")
      .insert({ name: parsed.data.name })
      .select()
      .single();

    if (orgError) return apiError("INTERNAL_ERROR", "Failed to create org", 500);

    // Add creator as admin
    const { error: memError } = await supabase.from("org_memberships").insert({
      org_id: org.id,
      user_id: userId,
      role: "admin",
    });

    if (memError) return apiError("INTERNAL_ERROR", "Failed to add membership", 500);

    return apiSuccess(org, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
