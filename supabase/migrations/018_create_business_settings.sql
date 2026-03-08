-- Migration: Create business_settings table
-- This table stores all business configuration settings

CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Business Info
    business_name TEXT NOT NULL DEFAULT 'Flow Gunpla Service',
    tagline TEXT,
    description TEXT,
    registration_number TEXT,
    established_date DATE,
    logo_url TEXT,
    
    -- Contact Information
    business_email TEXT,
    business_phone TEXT,
    website_url TEXT,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state_province TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Indonesia',
    
    -- Social Media Links
    instagram_url TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    youtube_url TEXT,
    portfolio_url TEXT,
    
    -- Operating Hours
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
    
    -- Financial Settings
    currency_code TEXT DEFAULT 'IDR',
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_enabled BOOLEAN DEFAULT false,
    deposit_percentage INTEGER DEFAULT 50,
    payment_methods JSONB DEFAULT '["bank_transfer", "cash"]'::jsonb,
    invoice_prefix TEXT DEFAULT 'INV',
    invoice_starting_number INTEGER DEFAULT 1,
    payment_terms_days INTEGER DEFAULT 14,
    late_payment_fee_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Service Defaults
    default_lead_time_days INTEGER DEFAULT 14,
    rush_order_fee_percentage DECIMAL(5,2) DEFAULT 25,
    cancellation_policy TEXT,
    revision_policy TEXT,
    max_revisions INTEGER DEFAULT 2,
    
    -- Branding
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#10B981',
    email_signature TEXT,
    auto_reply_message TEXT,
    
    -- Legal
    terms_of_service_url TEXT,
    privacy_policy_url TEXT,
    warranty_terms TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: Only one settings row allowed
    CONSTRAINT single_settings CHECK (id = '00000000-0000-0000-0000-000000000001')
);

-- Insert default settings row
INSERT INTO business_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Allow public read access to basic business info
CREATE POLICY "Allow public to read basic business settings"
ON business_settings FOR SELECT
TO anon
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_settings_updated_at
    BEFORE UPDATE ON business_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
