#!/usr/bin/env node

/**
 * Database Setup and Diagnostic Script for Flow Admin Dashboard
 *
 * This script checks your Supabase configuration and guides you through setup
 */

const { createClient } = require("@supabase/supabase-js");

// Read from .env.local
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  console.log("\nPlease add these to .env.local:");
  console.log("NEXT_PUBLIC_SUPABASE_URL=your-url");
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key");
  console.log("SUPABASE_SERVICE_ROLE_KEY=your-service-role-key");
  process.exit(1);
}

console.log("✅ Environment variables found");
console.log("🔗 Supabase URL:", supabaseUrl);

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseAndSetup() {
  console.log("\n🔍 Diagnosing Supabase configuration...\n");

  // Check 1: Test database connection
  try {
    const { data, error } = await supabase.from("profiles").select("count").limit(1);

    if (error) {
      console.error("❌ Database connection failed:", error.message);
      console.log("\n💡 Make sure you have run the migration script!");
      console.log("   Copy the content of supabase/migrations_combined.sql");
      console.log("   and run it in Supabase Dashboard → SQL Editor");
      return;
    }

    console.log("✅ Database connection successful");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }

  // Check 2: Verify tables exist
  const tables = ["profiles", "orders", "order_items", "change_requests", "progress_logs"];
  console.log("\n📋 Checking tables...");

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select("*").limit(1);

      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`);
      } else {
        console.log(`  ✅ ${table}: exists`);
      }
    } catch (err) {
      console.log(`  ❌ ${table}: ${err.message}`);
    }
  }

  // Check 3: Verify triggers exist
  console.log("\n🔧 Checking triggers...");

  const { data: triggers } = await supabase
    .rpc("search_barcode", {
      search_query: "handle_new_user",
      search_type: "triggers",
    })
    .catch(() => ({ data: null }));

  if (triggers && triggers.length > 0) {
    console.log("  ✅ handle_new_user trigger exists");
  } else {
    console.log("  ❌ handle_new_user trigger NOT found");
    console.log("     ⚠️  This will cause signup to fail!");
    console.log("     💡 Make sure you ran migrations_combined.sql in SQL Editor");
  }

  // Check 4: Test email auth by checking if user can be created
  console.log("\n🔐 Checking authentication configuration...");

  try {
    // Try to list existing users
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("❌ Cannot access users:", error.message);
      console.log('   ⚠️  Make sure "Enable Email Auth" is on in Supabase Dashboard');
      console.log("   Go to: Authentication → Providers → Email");
    } else {
      console.log(`✅ Email auth is configured (${users.length} users found)`);
    }
  } catch (err) {
    console.error("❌ Authentication check failed:", err.message);
  }

  // Check 5: Verify RLS policies
  console.log("\n🔒 Checking RLS policies...");

  const tablesToCheck = ["profiles", "orders", "order_items"];
  for (const table of tablesToCheck) {
    try {
      const { data: policies, error } = await supabase
        .from("pg_policies")
        .select("policyname, tablename")
        .eq("tablename", table);

      if (error) {
        console.log(`  ❌ ${table}: cannot check policies`);
      } else if (policies && policies.length > 0) {
        console.log(`  ✅ ${table}: ${policies.length} policy(ies) found`);
      } else {
        console.log(`  ⚠️  ${table}: no policies found`);
      }
    } catch (err) {
      console.log(`  ❌ ${table}: ${err.message}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📋 SETUP SUMMARY");
  console.log("=".repeat(60));

  // Provide next steps
  console.log("\n✨ Quick Setup Checklist:");
  console.log("\n1. Run Database Migrations:");
  console.log("   - Go to Supabase Dashboard → SQL Editor");
  console.log("   - Copy all content from supabase/migrations_combined.sql");
  console.log('   - Click "Run"');

  console.log("\n2. Enable Email Auth (if not already enabled):");
  console.log("   - Go to Authentication → Providers → Email");
  console.log('   - Click "Enable"');

  console.log("\n3. Create Your Admin User:");
  console.log("   - Go to /admin/login in your app");
  console.log('   - Click "Don\'t have an account? Sign up"');
  console.log('   - Fill in email and password, then click "Sign up"');
  console.log("   - Get your user ID from: Authentication → Users");
  console.log("   - Run in SQL Editor: SELECT public.promote_to_admin('your-user-id-here');");

  console.log("\n4. Test Login:");
  console.log("   - Go to /admin/login");
  console.log("   - Enter your credentials");
  console.log("   - You should be redirected to /admin/dashboard");
}

// Run diagnostics
diagnoseAndSetup().catch(console.error);
