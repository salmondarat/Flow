import type { Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
