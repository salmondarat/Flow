import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";
import { clientEnv } from "@/lib/env/client";

export function createClient() {
  return createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
          // Use cookies for session persistence
          getItem: (key: string) => {
            const cookies = document.cookie.split(";");
            for (const cookie of cookies) {
              const [name, value] = cookie.trim().split("=");
              if (name === key) {
                return decodeURIComponent(value);
              }
            }
            return null;
          },
          setItem: (key: string, value: string) => {
            document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
          },
          removeItem: (key: string) => {
            document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
          },
        },
      },
    }
  );
}
