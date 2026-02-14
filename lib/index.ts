/**
 * Central exports for @/lib
 */

// Utilities
export { cn } from "./utils";

// Environment - use appropriate env module based on context:
// - Client-side: import { clientEnv } from "@/lib/env/client"
// - Server-side: import { env } from "@/lib/env/server"

// Constants
export * from "./constants";

// Auth
export * from "./auth/client";
export * from "./auth/server";

// Supabase
export { createClient } from "./supabase/client";
export { createClient as createServerClient } from "./supabase/server";
export { createAdminClient } from "./supabase/admin";

// Dashboard features
export * from "./features/dashboard/queries";

// Orders features
export * from "./features/orders/queries";
export * from "./features/orders/mutations";
