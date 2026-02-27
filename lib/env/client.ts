import { z } from "zod";

// Client-side environment variables (only NEXT_PUBLIC_ prefixed vars)
// This file is safe to import in client components
const formatUrl = (val: unknown) => {
  if (!val || typeof val !== "string" || val.trim() === "") return undefined;
  let url = val.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
};

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(formatUrl, z.string().url()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.preprocess(
    formatUrl,
    z.string().url().optional().default("http://localhost:3000")
  ),
});

function parseClientEnv() {
  // Next.js injects NEXT_PUBLIC_ vars at build time into process.env
  // These are available in the browser bundle
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };

  // Validate and return
  return clientEnvSchema.parse(envVars);
}

// Export the validated environment
export const clientEnv = parseClientEnv();
