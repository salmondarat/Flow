import { z } from "zod";

// Server-side environment variables (can include secrets)
// This file MUST only be imported in server-side code (API routes, server components, etc.)
const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export const env = serverEnvSchema.parse(process.env);
