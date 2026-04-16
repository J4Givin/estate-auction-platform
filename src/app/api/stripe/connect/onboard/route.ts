import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";
import { getStripe } from "@/lib/stripe";

const OnboardSchema = z.object({
  orgId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const body = await request.json();
    const parsed = OnboardSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid request", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { orgId } = parsed.data;
    const supabase = createServiceClient();

    // Verify admin in org
    const { data: mem } = await supabase
      .from("org_memberships")
      .select()
      .eq("org_id", orgId)
      .eq("user_id", userId)
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!mem) return apiError("AUTH_FORBIDDEN", "Admin role required", 403);

    // Get org
    const { data: org } = await supabase
      .from("orgs")
      .select()
      .eq("id", orgId)
      .single();

    if (!org) return apiError("VALIDATION_FAILED", "Org not found", 404);

    let accountId = org.stripe_account_id;

    // Create Stripe Connect Express account if not exists
    if (!accountId) {
      const account = await getStripe().accounts.create({
        type: "express",
        metadata: { org_id: orgId },
      });
      accountId = account.id;

      await supabase
        .from("orgs")
        .update({ stripe_account_id: accountId })
        .eq("id", orgId);
    }

    // Create account link for onboarding
    const origin = request.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const accountLink = await getStripe().accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/onboarding/seller?orgId=${orgId}&refresh=true`,
      return_url: `${origin}/onboarding/seller?orgId=${orgId}&success=true`,
      type: "account_onboarding",
    });

    return apiSuccess({ url: accountLink.url, accountId });
  } catch {
    return apiError("INTERNAL_ERROR", "Failed to create onboarding link", 500);
  }
}
