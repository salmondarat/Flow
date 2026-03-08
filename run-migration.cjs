const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  console.log('URL:', supabaseUrl ? 'OK' : 'MISSING');
  console.log('Key:', supabaseKey ? 'OK' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL() {
  console.log('Creating complexity_tiers table...');
  
  // Simplified SQL for just the complexity_tiers table
  const sql = \`
    CREATE TABLE IF NOT EXISTS public.complexity_tiers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      min_score INTEGER NOT NULL DEFAULT 0 CHECK (min_score >= 0),
      max_score INTEGER CHECK (max_score >= min_score),
      multiplier NUMERIC(5, 2) NOT NULL CHECK (multiplier > 0),
      base_min_price_cents INTEGER CHECK (base_min_price_cents >= 0),
      base_max_price_cents INTEGER CHECK (base_max_price_cents >= base_min_price_cents),
      is_active BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    ALTER TABLE public.complexity_tiers ENABLE ROW LEVEL SECURITY;

    CREATE POLICY IF NOT EXISTS "Admins can view all complexity_tiers"
      ON public.complexity_tiers FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    CREATE POLICY IF NOT EXISTS "Admins can insert complexity_tiers"
      ON public.complexity_tiers FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    CREATE POLICY IF NOT EXISTS "Admins can update complexity_tiers"
      ON public.complexity_tiers FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    CREATE POLICY IF NOT EXISTS "Admins can delete complexity_tiers"
      ON public.complexity_tiers FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    CREATE POLICY IF NOT EXISTS "Authenticated users can view active complexity_tiers"
      ON public.complexity_tiers FOR SELECT
      USING (is_active = true AND auth.uid() IS NOT NULL);

    CREATE INDEX IF NOT EXISTS idx_complexity_tiers_is_active
      ON public.complexity_tiers(is_active, sort_order);

    CREATE INDEX IF NOT EXISTS idx_complexity_tiers_score_range
      ON public.complexity_tiers(min_score, max_score);
  \`;

  try {
    // Try using SQL editor via the API
    const { data, error } = await supabase.from('complexity_tiers').select('*').limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Table does not exist, creating...');
      // Table doesn't exist - we need to use SQL directly
      console.log('Please run the migration manually from Supabase dashboard or use:');
      console.log('supabase db reset --local');
    } else if (error) {
      console.log('Error checking table:', error);
    } else {
      console.log('Table already exists! Data rows:', data?.length || 0);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

runSQL().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
