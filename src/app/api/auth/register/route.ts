import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-utils";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid registration data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password, displayName } = parsed.data;
    const supabase = createServiceClient();

    // Create auth user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes("already")) {
        return apiError("VALIDATION_FAILED", "Email already registered", 409);
      }
      return apiError("INTERNAL_ERROR", authError.message, 500);
    }

    // Insert into users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        display_name: displayName || null,
      })
      .select()
      .single();

    if (userError) {
      return apiError("INTERNAL_ERROR", "Failed to create user record", 500);
    }

    return apiSuccess(user, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
