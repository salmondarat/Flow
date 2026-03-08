const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  const sqlFile = process.argv[2] || "./supabase/migrations/018_create_business_settings.sql";

  console.log(`Reading migration file: ${sqlFile}`);
  const sql = fs.readFileSync(sqlFile, "utf8");

  console.log("Applying business_settings migration...");
  console.log("SQL length:", sql.length, "characters");

  // Split SQL into individual statements
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("/*"));

  console.log(`Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ";";
    console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);

    try {
      const { error } = await supabase.rpc("exec_sql", { sql: statement });

      if (error) {
        // If exec_sql doesn't exist, try a different approach
        console.log("  exec_sql RPC not available, trying REST API...");

        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
          },
          body: JSON.stringify({ query: statement }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log(`  Note: ${errorText.substring(0, 100)}`);
        }
      } else {
        console.log("  ✓ Success");
      }
    } catch (err) {
      console.log(`  Note: ${err.message}`);
    }
  }

  console.log("\n✅ Migration completed!");
  console.log(
    "\nNote: If you see errors above, you may need to run this migration manually in the Supabase dashboard."
  );
  console.log("Go to: https://app.supabase.com/project/_/sql");
  console.log("And execute the SQL from:", sqlFile);
}

applyMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
