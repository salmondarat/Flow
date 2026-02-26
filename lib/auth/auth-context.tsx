"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import type { ProfileRow } from "@/types";

interface AuthUser {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (supabaseUser: User | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();

      // Get user profile with role
      type ProfileRole = Pick<ProfileRow, "role" | "full_name">;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", supabaseUser.id)
        .maybeSingle<ProfileRole>();

      const metadata = supabaseUser.user_metadata as Record<string, unknown> | null;

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        full_name: profile?.full_name || (metadata?.full_name as string | undefined),
        role: profile?.role ?? "client",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Still set basic user info from auth
      const metadata = supabaseUser.user_metadata as Record<string, unknown> | null;
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        full_name: (metadata?.full_name as string | undefined) || supabaseUser.email?.split("@")[0],
      });
    }
  };

  const refreshUser = async () => {
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      await fetchUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const supabase = (await import("@/lib/supabase/client")).createClient();

        // Get initial session
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          await fetchUser(initialSession?.user ?? null);
          setIsLoading(false);
        }

        // Listen for auth state changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          if (mounted) {
            setSession(newSession);
            await fetchUser(newSession?.user ?? null);
            setIsLoading(false);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext value={{ user, session, isLoading, refreshUser }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
