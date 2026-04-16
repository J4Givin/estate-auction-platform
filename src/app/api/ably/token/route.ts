import { NextRequest } from "next/server";
import Ably from "ably";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, getAuthUserId } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUserId(request);
    if (!userId) return apiError("AUTH_UNAUTHENTICATED", "Not authenticated", 401);

    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return apiError("DEPENDENCY_UNAVAILABLE", "Ably not configured", 503);
    }

    const body = await request.json().catch(() => ({}));
    const lotId = body.lotId as string | undefined;

    const supabase = createServiceClient();

    // Determine user roles for capability scoping
    const { data: memberships } = await supabase
      .from("org_memberships")
      .select("org_id, role")
      .eq("user_id", userId);

    const roles = memberships?.map((m) => m.role) || [];
    const isHost = roles.includes("admin") || roles.includes("seller");

    // Build capability based on user role
    const capability: Record<string, string[]> = {};

    if (lotId) {
      // Scoped to specific lot channels
      capability[`lot:${lotId}:events`] = ["subscribe"];
      capability[`lot:${lotId}:state`] = ["subscribe"];

      if (isHost) {
        // Hosts can also subscribe to moderation channels
        capability[`lot:${lotId}:events`] = ["subscribe", "publish"];
      }
    } else {
      // General subscription capability
      capability["lot:*:events"] = ["subscribe"];
      capability["lot:*:state"] = ["subscribe"];
      capability["show:*:moderation"] = ["subscribe"];

      if (isHost) {
        capability["show:*:host-actions"] = ["subscribe", "publish"];
      }
    }

    const ably = new Ably.Rest({ key: apiKey });
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: userId,
      capability: JSON.stringify(capability),
    });

    return apiSuccess(tokenRequest);
  } catch {
    return apiError("INTERNAL_ERROR", "Failed to generate token", 500);
  }
}
