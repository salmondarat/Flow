-- Seed Default Complexity Questions and Tiers
-- This migration populates the complexity question system with sensible defaults

-- ============================================================================
-- DEFAULT COMPLEXITY TIERS
-- ============================================================================

-- Insert default complexity tiers (matching existing low/medium/high pattern)
INSERT INTO public.complexity_tiers (name, description, min_score, max_score, multiplier, base_min_price_cents, base_max_price_cents, is_active, sort_order, created_at, updated_at)
VALUES
  ('Low', 'Simple requirements with minimal customization', 0, 10, 1.0, NULL, NULL, true, 1, NOW(), NOW()),
  ('Medium', 'Standard requirements with moderate customization', 11, 20, 1.3, NULL, NULL, true, 2, NOW(), NOW()),
  ('High', 'Complex requirements with extensive customization', 21, NULL, 1.6, NULL, NULL, true, 3, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEFAULT QUESTION TEMPLATE
-- ============================================================================

-- Insert default question template
INSERT INTO public.complexity_question_templates (name, description, is_default, created_at, updated_at)
VALUES (
  'Standard Complexity Assessment',
  'Default template for assessing build complexity based on key factors',
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Get the template ID for creating questions
DO $$
DECLARE
  v_template_id UUID;
BEGIN
  SELECT id INTO v_template_id
  FROM public.complexity_question_templates
  WHERE is_default = true
  LIMIT 1;

  -- ============================================================================
  -- DEFAULT QUESTIONS
  -- ============================================================================

  -- Question 1: Number of paint colors
  INSERT INTO public.complexity_questions (template_id, question_text, sort_order, created_at, updated_at)
  VALUES
    (v_template_id, 'How many paint colors are needed for the build?', 1, NOW(), NOW());

  -- Question 2: Custom parts
  INSERT INTO public.complexity_questions (template_id, question_text, sort_order, created_at, updated_at)
  VALUES
    (v_template_id, 'Are custom or non-standard parts required?', 2, NOW(), NOW());

  -- Question 3: Disassembly required
  INSERT INTO public.complexity_questions (template_id, question_text, sort_order, created_at, updated_at)
  VALUES
    (v_template_id, 'Does the kit require disassembly before painting?', 3, NOW(), NOW());

  -- Question 4: Specialized painting techniques
  INSERT INTO public.complexity_questions (template_id, question_text, sort_order, created_at, updated_at)
  VALUES
    (v_template_id, 'Are specialized painting techniques required (e.g., airbrushing, weathering)?', 4, NOW(), NOW());

  -- Question 5: Reference materials available
  INSERT INTO public.complexity_questions (template_id, question_text, sort_order, created_at, updated_at)
  VALUES
    (v_template_id, 'Are reference materials or color swatches available?', 5, NOW(), NOW());

  -- ============================================================================
  -- ANSWER OPTIONS FOR QUESTION 1 (Paint colors)
  -- ============================================================================

  INSERT INTO public.complexity_answer_options (question_id, answer_text, score, sort_order, created_at, updated_at)
  SELECT id, 'Single color', 1, 1, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 1
  UNION ALL
  SELECT id, '2-3 colors', 3, 2, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 1
  UNION ALL
  SELECT id, '4-6 colors', 5, 3, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 1
  UNION ALL
  SELECT id, '7+ colors', 8, 4, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 1;

  -- ============================================================================
  -- ANSWER OPTIONS FOR QUESTION 2 (Custom parts)
  -- ============================================================================

  INSERT INTO public.complexity_answer_options (question_id, answer_text, score, sort_order, created_at, updated_at)
  SELECT id, 'No, all standard parts', 1, 1, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 2
  UNION ALL
  SELECT id, 'Yes, some custom parts', 5, 2, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 2
  UNION ALL
  SELECT id, 'Yes, mostly custom parts', 10, 3, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 2;

  -- ============================================================================
  -- ANSWER OPTIONS FOR QUESTION 3 (Disassembly required)
  -- ============================================================================

  INSERT INTO public.complexity_answer_options (question_id, answer_text, score, sort_order, created_at, updated_at)
  SELECT id, 'No, ready to paint', 1, 1, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 3
  UNION ALL
  SELECT id, 'Yes, partial disassembly', 4, 2, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 3
  UNION ALL
  SELECT id, 'Yes, full disassembly', 7, 3, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 3;

  -- ============================================================================
  -- ANSWER OPTIONS FOR QUESTION 4 (Specialized techniques)
  -- ============================================================================

  INSERT INTO public.complexity_answer_options (question_id, answer_text, score, sort_order, created_at, updated_at)
  SELECT id, 'No, standard painting', 1, 1, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 4
  UNION ALL
  SELECT id, 'Yes, one specialized technique', 5, 2, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 4
  UNION ALL
  SELECT id, 'Yes, multiple specialized techniques', 10, 3, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 4;

  -- ============================================================================
  -- ANSWER OPTIONS FOR QUESTION 5 (Reference materials)
  -- ============================================================================

  INSERT INTO public.complexity_answer_options (question_id, answer_text, score, sort_order, created_at, updated_at)
  SELECT id, 'Yes, full reference available', 0, 1, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 5
  UNION ALL
  SELECT id, 'Partial reference available (some colors missing)', 3, 2, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 5
  UNION ALL
  SELECT id, 'No, minimal reference', 6, 3, NOW(), NOW()
  FROM public.complexity_questions
  WHERE template_id = v_template_id AND sort_order = 5;
END $$;
