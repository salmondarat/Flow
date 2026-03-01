import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types";
import type { ProfileRow } from "@/types";
import { env } from "@/lib/env/server";
import { corsHeaders, isApiRoute, isPreflight, handlePreflight } from "@/lib/api/middleware-cors";

/**
 * CORS headers for API routes
 */
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const pathname = requestUrl.pathname;

  // Handle CORS for API routes
  if (isApiRoute(pathname)) {
    if (isPreflight(request)) {
      return handlePreflight();
    }

    // Add CORS headers to all API route responses
    const response = NextResponse.next();
    return addCorsHeaders(response);
  }

  // Check if the path is an admin route
  const isAdminRoute = pathname.startsWith("/admin");
  // Exclude unified auth page from protection
  const isAuthPage = pathname === "/auth";
  // Exclude unified register page from protection
  const isRegisterPage = pathname === "/register";

  // Check if the path is a client route
  const isClientRoute = pathname.startsWith("/client");
  // Exclude client register page from protection (login is now handled by /auth)
  const isClientRegisterPage = pathname === "/client/register";

  // If not a protected route, continue
  if (isAuthPage || isRegisterPage || (!isAdminRoute && (!isClientRoute || isClientRegisterPage))) {
    return NextResponse.next();
  }

  // Create a Supabase client configured for Middleware
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to unified auth page
  if (!user) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check if user has admin role
  type ProfileRole = Pick<ProfileRow, "role">;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<ProfileRole>();

  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware] User ID:", user.id);
    console.log("[Middleware] Profile data:", JSON.stringify(profile));
    if (profileError) {
      console.log("[Middleware] Profile error:", profileError.message);
    } else {
      console.log("[Middleware] Profile query: Success (no error)");
    }
    console.log("[Middleware] Is admin:", profile?.role === "admin");
  }

  // Admin route: require admin role
  if (isAdminRoute) {
    if (!profile || profile.role !== "admin") {
      // User is authenticated but not admin - redirect to auth page with error
      const redirectUrl = new URL("/auth", request.url);
      redirectUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Client route: require client role, prevent admin access
  if (isClientRoute) {
    if (!profile || profile.role !== "client") {
      // User is admin trying to access client routes - redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
