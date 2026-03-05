import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const role = searchParams.get("role") ?? "client";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the user to determine their role
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user has a profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        // If no profile exists, create one with the selected role
        if (!profile) {
          const { error: profileError } = await (supabase.from("profiles") as any).insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
            role: role,
          });

          if (profileError) {
            console.error("Failed to create profile:", profileError);
          }
        }

        // Determine redirect based on role
        const userRole = (profile as any)?.role || role;
        const dashboardPath = userRole === "admin" ? "/admin/dashboard" : "/client/dashboard";

        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${dashboardPath}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${dashboardPath}`);
        } else {
          return NextResponse.redirect(`${origin}${dashboardPath}`);
        }
      }

      // Fallback redirect
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}
