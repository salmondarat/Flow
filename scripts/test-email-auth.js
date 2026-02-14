#!/usr/bin/env node

/**
 * Test Email Auth Configuration
 */

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEmailAuth() {
  console.log("🔍 Testing Email Authentication Configuration...\n");

  // Test 1: Try to check email provider status
  console.log("Test 1: Checking auth configuration...");

  try {
    // Try to list providers (this will fail if email auth is not enabled)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error && error.message.includes("Auth session missing")) {
      console.log("  ⚠️  No active session (expected if not logged in)");
    }
  } catch (err) {
    console.log("  ⚠️  Could not check auth status:", err.message);
  }

  // Test 2: Try to list users (requires service role)
  console.log("\nTest 2: Checking existing users...");

  const { createClient: createAdminClient } = require("@supabase/supabase-js");
  const supabaseServiceRole = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const {
      data: { users },
      error,
    } = await supabaseServiceRole.auth.admin.listUsers();

    if (error) {
      console.log("  ❌ Cannot list users:", error.message);
      if (error.message.includes("Email auth is not enabled")) {
        console.log("\n  💡 SOLUTION: Enable Email Auth in Supabase Dashboard");
        console.log("     Go to: Authentication → Providers → Email → Enable");
      }
    } else {
      console.log(`  ✅ Found ${users.length} user(s)`);
    }
  } catch (err) {
    console.log("  ❌ Error listing users:", err.message);
  }

  // Test 3: Test signup with a common email
  console.log("\nTest 3: Testing signup with test email...");

  const testEmail = `test-${Date.now()}@gmail.com`;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: "test123456",
    });

    if (error) {
      console.log("  ❌ Signup failed:", error.message);
      console.log("\n  💡 Common issues:");
      console.log("     1. Email provider not enabled");
      console.log("     2. Custom email domain (use @gmail.com, @yahoo.com, etc)");
      console.log("     3. Email confirmation required (check Authentication → Providers)");
    } else {
      console.log("  ✅ Signup successful!");
      console.log(`     User ID: ${data.user.id}`);
      console.log(`     Email: ${data.user.email}`);
      console.log(`     Confirmed at: ${data.user.email_confirmed_at || "Pending"}`);

      // Clean up test user
      console.log("\n  🧹 Cleaning up test user...");
      await supabaseServiceRole.auth.admin.deleteUser(data.user.id);
      console.log("  ✅ Test user deleted");
    }
  } catch (err) {
    console.log("  ❌ Unexpected error:", err.message);
  }

  // Test 4: Check profiles table
  console.log("\nTest 4: Checking profiles table...");

  try {
    const { data: profiles } = await supabaseServiceRole.from("profiles").select("*");

    if (profiles.error) {
      console.log("  ❌ Cannot access profiles:", profiles.error.message);
    } else {
      console.log(`  ✅ Profiles table has ${profiles.data?.length || 0} profile(s)`);
    }
  } catch (err) {
    console.log("  ❌ Error accessing profiles:", err.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🔧 Most Common Fixes:");
  console.log("=".repeat(60));
  console.log("\n1. Enable Email Provider:");
  console.log("   Supabase Dashboard → Authentication → Providers → Email → Enable");
  console.log("\n2. Disable Email Confirmation (for development):");
  console.log("   Go to Email provider → Configuration → Confirm email → Disable");
  console.log("\n3. Use a Common Email Domain:");
  console.log("   Use @gmail.com, @yahoo.com, @outlook.com instead of custom domains");
  console.log("\n4. Check Email Settings:");
  console.log('   - Ensure "Allow listing" is DISABLED (allows any email)');
  console.log('   - Or add your domain to "Allowed email domains"');
}

testEmailAuth().catch(console.error);
