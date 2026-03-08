import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  const sql = readFileSync('./supabase/migrations/016_create_complexity_questions.sql', 'utf8');

  console.log('Applying migration...');

  const { error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    console.error('Error applying migration:', error);
    process.exit(1);
  }

  console.log('Migration applied successfully!');
}

applyMigration().catch(console.error);
