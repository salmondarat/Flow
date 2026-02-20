import { z } from "zod";

// Server-side environment variables (can include secrets)
// This file MUST only be imported in server-side code (API routes, server components, etc.)
const formatUrl = (val: unknown) => {
  if (!val || typeof val !== "string" || val.trim() === "") return undefined;
  let url = val.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
};

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(formatUrl, z.string().url()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.preprocess(
    formatUrl,
    z.string().url().optional().default("http://localhost:3000")
  ),
});

// Lazy validation to avoid build-time errors
let cachedEnv: ReturnType<typeof serverEnvSchema.parse> | null = null;

export const env = new Proxy({} as ReturnType<typeof serverEnvSchema.parse>, {
  get(_target, prop) {
    if (!cachedEnv) {
      cachedEnv = serverEnvSchema.parse(process.env);
    }
    return cachedEnv[prop as keyof typeof cachedEnv];
  },
});
