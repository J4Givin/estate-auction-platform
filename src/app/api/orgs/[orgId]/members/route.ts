import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

const AddMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "seller", "bidder", "viewer"]),
});

type RouteContext = { params: Promise<{ orgId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { orgId } = await context.params;
    const supabase = createServiceClient();

    // Verify caller is a member of this org
    const { data: membership } = await supabase
      .from("org_memberships")
      .select()
      .eq("org_id", orgId)
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (!membership) return apiError("AUTH_FORBIDDEN", "Not a member of this org", 403);

    const { data: members, error } = await supabase
      .from("org_memberships")
      .select("*, users(id, email, display_name)")
      .eq("org_id", orgId);

    if (error) return apiError("INTERNAL_ERROR", "Failed to fetch members", 500);
    return apiSuccess(members);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const callerId = getAuthUserId(request);
    if (!callerId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const { orgId } = await context.params;
    const body = await request.json();
    const parsed = AddMemberSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid member data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const supabase = createServiceClient();

    // Verify caller is admin of this org
    const { data: callerMem } = await supabase
      .from("org_memberships")
      .select()
      .eq("org_id", orgId)
      .eq("user_id", callerId)
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!callerMem) return apiError("AUTH_FORBIDDEN", "Admin role required", 403);

    const { data: member, error } = await supabase
      .from("org_memberships")
      .insert({
        org_id: orgId,
        user_id: parsed.data.userId,
        role: parsed.data.role,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return apiError("VALIDATION_FAILED", "Membership already exists", 409);
      }
      return apiError("INTERNAL_ERROR", "Failed to add member", 500);
    }

    return apiSuccess(member, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
