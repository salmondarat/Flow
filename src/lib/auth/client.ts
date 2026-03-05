import { createClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/types";
import type { User, Session } from "@supabase/supabase-js";

export type AuthResultData = {
  user: User | null;
  session: Session | null;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: AuthResultData;
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Signup with email and password
 */
export async function signup(credentials: SignupCredentials): Promise<AuthResult> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Signup failed",
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
    // Don't throw - logout should always succeed from UX perspective
  }
}

/**
 * Get current user from client
 */
export async function getCurrentUserClient() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Get user profile with role
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
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if current user is admin (client-side)
 */
export async function isAdminClient(): Promise<boolean> {
  try {
    const user = await getCurrentUserClient();
    return user?.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Sign in with OAuth provider (Google, etc.)
 */
export async function signInWithOAuth(
  provider: "google",
  role: "client" | "admin" = "client"
): Promise<AuthResult> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          role: role,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || "OAuth sign-in failed",
      };
    }

    return { success: true, data: { user: null, session: null } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
