#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const userId = "84a8b77c-77f1-4e1b-9da5-0473b0101d6b";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  console.log("Checking profile for user:", userId);
  console.log("");

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

  if (error) {
    console.error("❌ Error:", error.message);
  } else {
    console.log("✅ Profile found:");
    console.log(JSON.stringify(data, null, 2));
    console.log("");
    console.log(`Role: ${data.role === "admin" ? "✅ ADMIN" : "❌ CLIENT"}`);
  }
})();
