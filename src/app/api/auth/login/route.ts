import { NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/api-utils";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_FAILED", "Invalid login data", 400, {
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parsed.data;
    const supabase = createServiceClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return apiError("AUTH_UNAUTHENTICATED", "Invalid credentials", 401);
    }

    return apiSuccess({
      session: data.session,
      user: data.user,
    });
  } catch {
    return apiError("INTERNAL_ERROR", "Unexpected error", 500);
  }
}
