-- Migration: Configurable Client Orders - Phase 1
-- This migration adds support for client authentication and form configuration

-- ============================================
-- 1. Extend profiles table with client-specific fields
-- ============================================

-- Add client-specific fields to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================
-- 2. Create status_transitions table for workflow validation
-- ============================================

CREATE TABLE IF NOT EXISTS public.status_transitions (
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  allowed_role TEXT NOT NULL CHECK (allowed_role IN ('admin', 'client', 'both')),
  PRIMARY KEY (from_status, to_status, allowed_role)
);

-- Seed valid status transitions
INSERT INTO public.status_transitions (from_status, to_status, allowed_role) VALUES
  ('draft', 'estimated', 'admin'),
  ('draft', 'cancelled', 'both'),
  ('estimated', 'approved', 'client'),
  ('estimated', 'cancelled', 'both'),
  ('approved', 'in_progress', 'admin'),
  ('in_progress', 'completed', 'admin'),
  ('in_progress', 'cancelled', 'both')
ON CONFLICT (from_status, to_status, allowed_role) DO NOTHING;

-- ============================================
-- 3. Add additional client-related indexes
-- ============================================

-- Composite index for client order queries with status filter
CREATE INDEX IF NOT EXISTS idx_orders_client_status ON public.orders(client_id, status);

-- ============================================
-- 4. Update RLS policies for client role access
-- ============================================

-- Drop existing policies to recreate them with proper client support
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (email, name, phone, address)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
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

-- ============================================
-- 5. Create function to validate status transitions
-- ============================================

CREATE OR REPLACE FUNCTION public.can_transition_status(
  current_status TEXT,
  new_status TEXT,
  user_role TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  allowed BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.status_transitions
    WHERE from_status = current_status
    AND to_status = new_status
    AND (allowed_role = user_role OR allowed_role = 'both')
  ) INTO allowed;

  RETURN allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. Update handle_new_user function to include email
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, email)
  VALUES (NEW.id, 'client', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
