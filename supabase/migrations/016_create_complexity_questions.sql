-- Complexity-Based Pricing System Migration
-- This migration adds tables for complexity questions, answer options, and tiers

-- ============================================================================
-- COMPLEXITY_QUESTION_TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.complexity_question_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.complexity_question_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for complexity_question_templates
-- Admins can do everything
CREATE POLICY "Admins can view all complexity_question_templates"
  ON public.complexity_question_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert complexity_question_templates"
  ON public.complexity_question_templates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update complexity_question_templates"
  ON public.complexity_question_templates FOR UPDATE
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

CREATE POLICY "Admins can delete complexity_question_templates"
  ON public.complexity_question_templates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can view templates
CREATE POLICY "Authenticated users can view complexity_question_templates"
  ON public.complexity_question_templates FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_complexity_question_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER complexity_question_templates_updated_at
  BEFORE UPDATE ON public.complexity_question_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_complexity_question_templates_updated_at();

-- ============================================================================
-- COMPLEXITY_QUESTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.complexity_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.complexity_question_templates(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.complexity_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for complexity_questions
-- Admins can do everything
CREATE POLICY "Admins can view all complexity_questions"
  ON public.complexity_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert complexity_questions"
  ON public.complexity_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update complexity_questions"
  ON public.complexity_questions FOR UPDATE
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

CREATE POLICY "Admins can delete complexity_questions"
  ON public.complexity_questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can view questions from templates
CREATE POLICY "Authenticated users can view complexity_questions"
  ON public.complexity_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.complexity_question_templates
      WHERE id = complexity_questions.template_id
      AND auth.uid() IS NOT NULL
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_complexity_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER complexity_questions_updated_at
  BEFORE UPDATE ON public.complexity_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_complexity_questions_updated_at();

-- ============================================================================
-- COMPLEXITY_ANSWER_OPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.complexity_answer_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.complexity_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.complexity_answer_options ENABLE ROW LEVEL SECURITY;

-- RLS Policies for complexity_answer_options
-- Admins can do everything
CREATE POLICY "Admins can view all complexity_answer_options"
  ON public.complexity_answer_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert complexity_answer_options"
  ON public.complexity_answer_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update complexity_answer_options"
  ON public.complexity_answer_options FOR UPDATE
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

CREATE POLICY "Admins can delete complexity_answer_options"
  ON public.complexity_answer_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can view answer options from questions
CREATE POLICY "Authenticated users can view complexity_answer_options"
  ON public.complexity_answer_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.complexity_questions cq
      JOIN public.complexity_question_templates cqt ON cqt.id = cq.template_id
      WHERE cq.id = complexity_answer_options.question_id
      AND auth.uid() IS NOT NULL
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_complexity_answer_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER complexity_answer_options_updated_at
  BEFORE UPDATE ON public.complexity_answer_options
  FOR EACH ROW
  EXECUTE FUNCTION update_complexity_answer_options_updated_at();

-- ============================================================================
-- COMPLEXITY_TIERS TABLE
-- ============================================================================
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

-- Enable RLS
ALTER TABLE public.complexity_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for complexity_tiers
-- Admins can do everything
CREATE POLICY "Admins can view all complexity_tiers"
  ON public.complexity_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert complexity_tiers"
  ON public.complexity_tiers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update complexity_tiers"
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

CREATE POLICY "Admins can delete complexity_tiers"
  ON public.complexity_tiers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can view active tiers
CREATE POLICY "Authenticated users can view active complexity_tiers"
  ON public.complexity_tiers FOR SELECT
  USING (is_active = true AND auth.uid() IS NOT NULL);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_complexity_tiers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER complexity_tiers_updated_at
  BEFORE UPDATE ON public.complexity_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_complexity_tiers_updated_at();

-- ============================================================================
-- ADD COLUMNS TO ORDER_ITEMS FOR NEW COMPLEXITY SYSTEM
-- ============================================================================

-- Add complexity_tier_id for tracking tier assignment
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS complexity_tier_id UUID REFERENCES public.complexity_tiers(id);

-- Add complexity_score for storing the calculated score
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS complexity_score INTEGER;

-- Add complexity_answers JSON for storing individual answer scores
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS complexity_answers JSONB;

-- ============================================================================
-- ADD TIER OVERRIDE TO SERVICE_COMPLEXITIES
-- ============================================================================

-- Add tier_id for supporting tier-based overrides (in addition to level-based)
ALTER TABLE public.service_complexities
  ADD COLUMN IF NOT EXISTS complexity_tier_id UUID REFERENCES public.complexity_tiers(id) ON DELETE SET NULL;

-- Add tier_override_multiplier for tier-specific overrides
ALTER TABLE public.service_complexities
  ADD COLUMN IF NOT EXISTS tier_override_multiplier NUMERIC(5, 2) CHECK (tier_override_multiplier > 0);

-- Make override_multiplier nullable to support tier overrides
ALTER TABLE public.service_complexities
  ALTER COLUMN override_multiplier DROP NOT NULL;

-- Add a partial index for querying by tier
CREATE INDEX IF NOT EXISTS idx_service_complexities_tier
  ON public.service_complexities(complexity_tier_id)
  WHERE complexity_tier_id IS NOT NULL;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_complexity_question_templates_is_default
  ON public.complexity_question_templates(is_default);

CREATE INDEX IF NOT EXISTS idx_complexity_questions_template
  ON public.complexity_questions(template_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_complexity_answer_options_question
  ON public.complexity_answer_options(question_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_complexity_tiers_is_active
  ON public.complexity_tiers(is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_complexity_tiers_score_range
  ON public.complexity_tiers(min_score, max_score);

CREATE INDEX IF NOT EXISTS idx_order_items_complexity_tier_id
  ON public.order_items(complexity_tier_id);
