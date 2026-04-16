import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { ApiError, ApiSuccess } from "@/types";

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data, requestId: uuidv4() }, { status });
}

export function apiError(
  code: string,
  message: string,
  status: number,
  details?: Record<string, unknown>
): NextResponse<ApiError> {
  return NextResponse.json(
    { requestId: uuidv4(), code, message, details },
    { status }
  );
}

export function getAuthUserId(request: Request): string | null {
  // In production, extract from Supabase JWT via middleware.
  // For Sprint-1, we support an X-User-Id header for development.
  return request.headers.get("x-user-id");
}
