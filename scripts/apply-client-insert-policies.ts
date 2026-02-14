/**
 * Script to apply client INSERT policies for orders and order_items tables
 * Run with: npx tsx scripts/apply-client-insert-policies.ts
 */

import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing Supabase environment variables");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyPolicies() {
  console.log("Applying client INSERT policies for orders and order_items...\n");

  // Policy 1: Allow clients to insert orders
  console.log("1. Creating policy: Clients can insert own orders");
  const { error: error1 } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE POLICY IF NOT EXISTS "Clients can insert own orders"
        ON public.orders FOR INSERT
        WITH CHECK (client_id = auth.uid());
    `,
  });

  if (error1) {
    console.error("   Error:", error1.message);
    // Try direct SQL approach
    console.log("   Trying alternative approach...");
  } else {
    console.log("   ✓ Policy created\n");
  }

  // Policy 2: Allow clients to insert order_items
  console.log("2. Creating policy: Clients can insert own order_items");
  const { error: error2 } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE POLICY IF NOT EXISTS "Clients can insert own order_items"
        ON public.order_items FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()
          )
        );
    `,
  });

  if (error2) {
    console.error("   Error:", error2.message);
  } else {
    console.log("   ✓ Policy created\n");
  }

  console.log(
    "\nNote: If policies were not created, you may need to run the SQL manually in Supabase Dashboard:"
  );
  console.log(`
-- Open Supabase Dashboard → SQL Editor and run:

CREATE POLICY IF NOT EXISTS "Clients can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Clients can insert own order_items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()
    )
  );
  `);
}

applyPolicies().catch(console.error);
