import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Internal consoles. Anonymous visitors are always redirected to login —
// these surfaces look like real internal tools and must not be browseable
// even in demo mode where no Supabase is configured.
export const INTERNAL_CONSOLE_PATHS = ["/admin", "/ops", "/qa"] as const;

// Authenticated-user surfaces. Gated only when Supabase is configured;
// in demo mode they pass through so the platform is browseable end-to-end
// against sample fixtures.
export const AUTHED_PATHS = [
  "/dashboard",
  "/shows",
  "/lots",
  "/onboarding",
] as const;

export function matchesPath(
  pathname: string,
  paths: readonly string[],
): boolean {
  return paths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const pathname = request.nextUrl.pathname;
  const isInternalConsole = matchesPath(pathname, INTERNAL_CONSOLE_PATHS);

  // Demo mode: no Supabase configured. Skip Supabase entirely, but still
  // gate internal consoles — there is no authenticated session in demo, so
  // these always redirect.
  if (!supabaseUrl || !supabaseAnon) {
    if (isInternalConsole) {
      return redirectToLogin(request);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnon,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = isInternalConsole || matchesPath(pathname, AUTHED_PATHS);

  if (!user && isProtected) {
    return redirectToLogin(request);
  }

  return supabaseResponse;
}
