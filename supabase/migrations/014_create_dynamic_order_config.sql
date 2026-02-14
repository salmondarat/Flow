-- Dynamic Order Configuration Migration
-- This migration adds tables for configurable service types, complexity levels, and add-ons

-- ============================================================================
-- SERVICE_TYPES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  base_price_cents INTEGER NOT NULL CHECK (base_price_cents >= 0),
  base_days INTEGER NOT NULL CHECK (base_days >= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_types
-- Admins can do everything
CREATE POLICY "Admins can view all service_types"
  ON public.service_types FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert service_types"
  ON public.service_types FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update service_types"
  ON public.service_types FOR UPDATE
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

CREATE POLICY "Admins can delete service_types"
  ON public.service_types FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public (authenticated) can view active service_types
CREATE POLICY "Authenticated users can view active service_types"
  ON public.service_types FOR SELECT
  USING (is_active = true AND auth.uid() IS NOT NULL);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_service_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_types_updated_at
  BEFORE UPDATE ON public.service_types
  FOR EACH ROW
  EXECUTE FUNCTION update_service_types_updated_at();

-- ============================================================================
-- COMPLEXITY_LEVELS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.complexity_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  multiplier NUMERIC(5, 2) NOT NULL CHECK (multiplier > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.complexity_levels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for complexity_levels
-- Admins can do everything
CREATE POLICY "Admins can view all complexity_levels"
  ON public.complexity_levels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert complexity_levels"
  ON public.complexity_levels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update complexity_levels"
  ON public.complexity_levels FOR UPDATE
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

CREATE POLICY "Admins can delete complexity_levels"
  ON public.complexity_levels FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public (authenticated) can view active complexity_levels
CREATE POLICY "Authenticated users can view active complexity_levels"
  ON public.complexity_levels FOR SELECT
  USING (is_active = true AND auth.uid() IS NOT NULL);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_complexity_levels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER complexity_levels_updated_at
  BEFORE UPDATE ON public.complexity_levels
  FOR EACH ROW
  EXECUTE FUNCTION update_complexity_levels_updated_at();

-- ============================================================================
-- SERVICE_COMPLEXITIES JUNCTION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_complexities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type_id UUID NOT NULL REFERENCES public.service_types(id) ON DELETE CASCADE,
  complexity_level_id UUID NOT NULL REFERENCES public.complexity_levels(id) ON DELETE CASCADE,
  override_multiplier NUMERIC(5, 2) CHECK (override_multiplier > 0),
  UNIQUE (service_type_id, complexity_level_id)
);

-- Enable RLS
ALTER TABLE public.service_complexities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_complexities
-- Admins can do everything
CREATE POLICY "Admins can view all service_complexities"
  ON public.service_complexities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert service_complexities"
  ON public.service_complexities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update service_complexities"
  ON public.service_complexities FOR UPDATE
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

CREATE POLICY "Admins can delete service_complexities"
  ON public.service_complexities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public (authenticated) can view active service_complexities
CREATE POLICY "Authenticated users can view active service_complexities"
  ON public.service_complexities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.service_types st
      JOIN public.complexity_levels cl ON cl.id = service_complexities.complexity_level_id
      WHERE st.id = service_complexities.service_type_id
      AND st.is_active = true
      AND cl.is_active = true
      AND auth.uid() IS NOT NULL
    )
  );

-- ============================================================================
-- SERVICE_ADDONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type_id UUID NOT NULL REFERENCES public.service_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_addons
-- Admins can do everything
CREATE POLICY "Admins can view all service_addons"
  ON public.service_addons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert service_addons"
  ON public.service_addons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update service_addons"
  ON public.service_addons FOR UPDATE
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

CREATE POLICY "Admins can delete service_addons"
  ON public.service_addons FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public (authenticated) can view active service_addons
CREATE POLICY "Authenticated users can view active service_addons"
  ON public.service_addons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.service_types
      WHERE service_types.id = service_addons.service_type_id
      AND service_types.is_active = true
      AND service_addons.is_active = true
      AND auth.uid() IS NOT NULL
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_service_addons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_addons_updated_at
  BEFORE UPDATE ON public.service_addons
  FOR EACH ROW
  EXECUTE FUNCTION update_service_addons_updated_at();

-- ============================================================================
-- ADD COLUMNS TO ORDER_ITEMS FOR BACKWARD COMPATIBILITY
-- ============================================================================

-- Add nullable columns for new system while keeping old enum columns
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS service_type_id UUID REFERENCES public.service_types(id),
  ADD COLUMN IF NOT EXISTS complexity_id UUID REFERENCES public.complexity_levels(id);

-- Create a helper function to calculate price with new system
CREATE OR REPLACE FUNCTION calculate_order_item_price(
  p_service_type_id UUID,
  p_complexity_id UUID,
  p_legacy_service_type TEXT DEFAULT NULL,
  p_legacy_complexity TEXT DEFAULT NULL
) RETURNS NUMERIC AS $$
DECLARE
  v_base_price NUMERIC;
  v_multiplier NUMERIC;
  v_override_multiplier NUMERIC;
BEGIN
  -- Try new system first
  IF p_service_type_id IS NOT NULL AND p_complexity_id IS NOT NULL THEN
    SELECT base_price_cents INTO v_base_price
    FROM public.service_types
    WHERE id = p_service_type_id AND is_active = true;

    -- Check for custom multiplier
    SELECT override_multiplier INTO v_override_multiplier
    FROM public.service_complexities
    WHERE service_type_id = p_service_type_id
    AND complexity_level_id = p_complexity_id;

    IF v_override_multiplier IS NOT NULL THEN
      v_multiplier := v_override_multiplier;
    ELSE
      SELECT multiplier INTO v_multiplier
      FROM public.complexity_levels
      WHERE id = p_complexity_id AND is_active = true;
    END IF;

    RETURN v_base_price * v_multiplier;
  END IF;

  -- Fallback to legacy system
  IF p_legacy_service_type IS NOT NULL AND p_legacy_complexity IS NOT NULL THEN
    v_base_price := CASE p_legacy_service_type
      WHEN 'full_build' THEN 500000
      WHEN 'repair' THEN 150000
      WHEN 'repaint' THEN 200000
      ELSE 0
    END;

    v_multiplier := CASE p_legacy_complexity
      WHEN 'low' THEN 1.0
      WHEN 'medium' THEN 1.5
      WHEN 'high' THEN 2.0
      ELSE 1.0
    END;

    RETURN v_base_price * v_multiplier;
  END IF;

  RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_service_types_is_active ON public.service_types(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_service_types_slug ON public.service_types(slug);
CREATE INDEX IF NOT EXISTS idx_complexity_levels_is_active ON public.complexity_levels(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_complexity_levels_slug ON public.complexity_levels(slug);
CREATE INDEX IF NOT EXISTS idx_service_complexities_service ON public.service_complexities(service_type_id);
CREATE INDEX IF NOT EXISTS idx_service_complexities_complexity ON public.service_complexities(complexity_level_id);
CREATE INDEX IF NOT EXISTS idx_service_addons_service ON public.service_addons(service_type_id, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_order_items_service_type_id ON public.order_items(service_type_id);
CREATE INDEX IF NOT EXISTS idx_order_items_complexity_id ON public.order_items(complexity_id);
