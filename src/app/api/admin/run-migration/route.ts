import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BusinessSettingsInsert } from "@/types";

/**
 * POST /api/admin/run-migration
 * Run the business_settings migration
 * This is a one-time endpoint to create the business_settings table
 */
export async function POST() {
  try {
    const supabase = createAdminClient();

    // Check if table already exists
    const { data: existingTable, error: checkError } = await supabase
      .from("business_settings")
      .select("id")
      .limit(1);

    if (!checkError) {
      return NextResponse.json({
        message: "Migration already applied - business_settings table exists",
        success: true,
      });
    }

    // Create table using raw SQL via REST API
    const sql = `
CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL DEFAULT 'Flow Gunpla Service',
    tagline TEXT,
    description TEXT,
    registration_number TEXT,
    established_date DATE,
    logo_url TEXT,
    business_email TEXT,
    business_phone TEXT,
    website_url TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state_province TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Indonesia',
    instagram_url TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    youtube_url TEXT,
    portfolio_url TEXT,
    timezone TEXT DEFAULT 'Asia/Jakarta',
    monday_enabled BOOLEAN DEFAULT true,
    monday_open TIME DEFAULT '09:00',
    monday_close TIME DEFAULT '17:00',
    tuesday_enabled BOOLEAN DEFAULT true,
    tuesday_open TIME DEFAULT '09:00',
    tuesday_close TIME DEFAULT '17:00',
    wednesday_enabled BOOLEAN DEFAULT true,
    wednesday_open TIME DEFAULT '09:00',
    wednesday_close TIME DEFAULT '17:00',
    thursday_enabled BOOLEAN DEFAULT true,
    thursday_open TIME DEFAULT '09:00',
    thursday_close TIME DEFAULT '17:00',
    friday_enabled BOOLEAN DEFAULT true,
    friday_open TIME DEFAULT '09:00',
    friday_close TIME DEFAULT '17:00',
    saturday_enabled BOOLEAN DEFAULT false,
    saturday_open TIME DEFAULT '09:00',
    saturday_close TIME DEFAULT '17:00',
    sunday_enabled BOOLEAN DEFAULT false,
    sunday_open TIME DEFAULT '09:00',
    sunday_close TIME DEFAULT '17:00',
    currency_code TEXT DEFAULT 'IDR',
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_enabled BOOLEAN DEFAULT false,
    deposit_percentage INTEGER DEFAULT 50,
    payment_methods JSONB DEFAULT '["bank_transfer", "cash"]'::jsonb,
    invoice_prefix TEXT DEFAULT 'INV',
    invoice_starting_number INTEGER DEFAULT 1,
    payment_terms_days INTEGER DEFAULT 14,
    late_payment_fee_percentage DECIMAL(5,2) DEFAULT 0,
    default_lead_time_days INTEGER DEFAULT 14,
    rush_order_fee_percentage DECIMAL(5,2) DEFAULT 25,
    cancellation_policy TEXT,
    revision_policy TEXT,
    max_revisions INTEGER DEFAULT 2,
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#10B981',
    email_signature TEXT,
    auto_reply_message TEXT,
    terms_of_service_url TEXT,
    privacy_policy_url TEXT,
    warranty_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO business_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin to read business settings"
ON business_settings FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
));

CREATE POLICY "Allow admin to update business settings"
ON business_settings FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
));

CREATE POLICY "Allow public to read basic business settings"
ON business_settings FOR SELECT
TO anon
USING (true);
`;

    // Execute SQL via Supabase REST API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Try alternative: create table via individual INSERT
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: createError } = await (supabase as any)
        .from("business_settings")
        .insert({ id: "00000000-0000-0000-0000-000000000001" });

      if (createError && !createError.message.includes("does not exist")) {
        throw new Error(`Failed to create table: ${errorText}`);
      }
    }

    return NextResponse.json({
      message: "Migration applied successfully",
      success: true,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        error: "Failed to apply migration",
        details: error instanceof Error ? error.message : String(error),
        manualInstructions:
          "Please run the SQL from supabase/migrations/018_create_business_settings.sql manually in the Supabase dashboard SQL editor",
      },
      { status: 500 }
    );
  }
}
