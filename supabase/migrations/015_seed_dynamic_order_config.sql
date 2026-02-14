-- Seed data for Dynamic Order Configuration
-- This migration seeds the new tables with existing service types and complexity levels

-- ============================================================================
-- SEED SERVICE_TYPES
-- ============================================================================

-- Full Build
INSERT INTO public.service_types (slug, name, description, icon_name, base_price_cents, base_days, is_active, sort_order)
VALUES (
  'full_build',
  'Full Build',
  'Complete assembly, panel lining, and detailing',
  'hammer',
  500000,
  14,
  true,
  1
) ON CONFLICT (slug) DO NOTHING;

-- Repair
INSERT INTO public.service_types (slug, name, description, icon_name, base_price_cents, base_days, is_active, sort_order)
VALUES (
  'repair',
  'Repair',
  'Fix broken parts and restore functionality',
  'wrench',
  150000,
  5,
  true,
  2
) ON CONFLICT (slug) DO NOTHING;

-- Repaint
INSERT INTO public.service_types (slug, name, description, icon_name, base_price_cents, base_days, is_active, sort_order)
VALUES (
  'repaint',
  'Repaint',
  'Disassemble, paint, and reassemble with custom colors',
  'palette',
  200000,
  7,
  true,
  3
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED COMPLEXITY_LEVELS
-- ============================================================================

-- Low
INSERT INTO public.complexity_levels (slug, name, multiplier, is_active, sort_order)
VALUES ('low', 'Low', 1.0, true, 1)
ON CONFLICT (slug) DO NOTHING;

-- Medium
INSERT INTO public.complexity_levels (slug, name, multiplier, is_active, sort_order)
VALUES ('medium', 'Medium', 1.5, true, 2)
ON CONFLICT (slug) DO NOTHING;

-- High
INSERT INTO public.complexity_levels (slug, name, multiplier, is_active, sort_order)
VALUES ('high', 'High', 2.0, true, 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED SERVICE_COMPLEXITIES (All combinations with default multipliers)
-- ============================================================================

-- Note: override_multiplier is NULL, meaning use the default from complexity_levels

-- Full Build combinations
INSERT INTO public.service_complexities (service_type_id, complexity_level_id, override_multiplier)
SELECT st.id, cl.id, NULL
FROM public.service_types st
CROSS JOIN public.complexity_levels cl
WHERE st.slug = 'full_build'
ON CONFLICT (service_type_id, complexity_level_id) DO NOTHING;

-- Repair combinations
INSERT INTO public.service_complexities (service_type_id, complexity_level_id, override_multiplier)
SELECT st.id, cl.id, NULL
FROM public.service_types st
CROSS JOIN public.complexity_levels cl
WHERE st.slug = 'repair'
ON CONFLICT (service_type_id, complexity_level_id) DO NOTHING;

-- Repaint combinations
INSERT INTO public.service_complexities (service_type_id, complexity_level_id, override_multiplier)
SELECT st.id, cl.id, NULL
FROM public.service_types st
CROSS JOIN public.complexity_levels cl
WHERE st.slug = 'repaint'
ON CONFLICT (service_type_id, complexity_level_id) DO NOTHING;

-- ============================================================================
-- SAMPLE ADDONS (Optional - uncomment if you want sample add-ons)
-- ============================================================================

-- Example: LED Lighting for Full Build
-- INSERT INTO public.service_addons (service_type_id, name, description, price_cents, is_required, is_active, sort_order)
-- SELECT
--   st.id,
--   'LED Lighting Kit',
--   'Add LED lights to illuminate your model',
--   50000,
--   false,
--   true,
--   1
-- FROM public.service_types st
-- WHERE st.slug = 'full_build'
-- ON CONFLICT DO NOTHING;

-- Example: Protective Coating for Repaint
-- INSERT INTO public.service_addons (service_type_id, name, description, price_cents, is_required, is_active, sort_order)
-- SELECT
--   st.id,
--   'Protective Coating',
--   'Apply a clear protective top coat for durability',
--   30000,
--   false,
--   true,
--   1
-- FROM public.service_types st
-- WHERE st.slug = 'repaint'
-- ON CONFLICT DO NOTHING;

-- Example: Extra Parts for Repair
-- INSERT INTO public.service_addons (service_type_id, name, description, price_cents, is_required, is_active, sort_order)
-- SELECT
--   st.id,
--   'Replacement Parts',
--   'Cost of replacement parts (charged separately)',
--   0,
--   false,
--   true,
--   1
-- FROM public.service_types st
-- WHERE st.slug = 'repair'
-- ON CONFLICT DO NOTHING;
