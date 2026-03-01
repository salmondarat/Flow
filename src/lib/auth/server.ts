import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import type { UserRole, ProfileRow } from "@/types";

export interface AuthUser {
  id: string;
  email?: string;
  role: UserRole;
}

/**
 * Get the current authenticated user from the server
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user role from profiles table
  type ProfileRole = Pick<ProfileRow, "role">;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<ProfileRole>();

  return {
    id: user.id,
    email: user.email,
    role: profile?.role ?? "client",
  };
}

/**
 * Check if the current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Require admin role, throw error if not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return user;
}

/**
 * Get user session
 */
export async function getSession() {
  const supabase = await createSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}
