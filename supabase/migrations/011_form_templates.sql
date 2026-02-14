-- Migration: Form Templates Configuration
-- This migration adds support for admin-configurable form templates

-- ============================================
-- 1. Create form_templates table
-- ============================================

CREATE TABLE IF NOT EXISTS public.form_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  config JSONB NOT NULL, -- Contains steps, fields, services, pricing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id),
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- ============================================
-- 2. Add form template columns to orders table
-- ============================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS form_template_id UUID REFERENCES public.form_templates(id),
  ADD COLUMN IF NOT EXISTS form_template_version INTEGER;

-- ============================================
-- 3. Enable RLS and create policies
-- ============================================

ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can view all form templates"
  ON public.form_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert form templates"
  ON public.form_templates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update form templates"
  ON public.form_templates FOR UPDATE
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

CREATE POLICY "Admins can delete form templates"
  ON public.form_templates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 4. Create indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_form_templates_is_default ON public.form_templates(is_default) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_form_templates_created_by ON public.form_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_orders_form_template_id ON public.orders(form_template_id);

-- ============================================
-- 5. Create trigger for updated_at
-- ============================================

CREATE TRIGGER update_form_templates_updated_at
  BEFORE UPDATE ON public.form_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. Function to get default form template
-- ============================================

CREATE OR REPLACE FUNCTION public.get_default_form_template()
RETURNS public.form_templates AS $$
DECLARE
  result public.form_templates;
BEGIN
  SELECT * INTO result
  FROM public.form_templates
  WHERE is_default = TRUE
    AND deleted_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. Insert default form template
-- ============================================

INSERT INTO public.form_templates (
  name,
  description,
  is_default,
  version,
  config,
  created_by
) VALUES (
  'Default Order Form',
  'Standard order form with basic kit information',
  true,
  1,
  '{
    "steps": [
      {
        "id": "kit-info",
        "order": 1,
        "title": "Kit Information",
        "description": "Tell us about your model kit",
        "fields": [
          {
            "id": "kit-name",
            "key": "kit_name",
            "type": "text",
            "label": "Kit Name",
            "placeholder": "e.g., MG RX-78-2 Gundam",
            "required": true
          },
          {
            "id": "kit-model",
            "key": "kit_model",
            "type": "text",
            "label": "Kit Model/Grade",
            "placeholder": "e.g., MG 1/100",
            "required": false
          }
        ]
      },
      {
        "id": "service-selection",
        "order": 2,
        "title": "Service Selection",
        "description": "Choose the type of service you need",
        "fields": [
          {
            "id": "service-type",
            "key": "service_type",
            "type": "select",
            "label": "Service Type",
            "required": true,
            "options": ["full_build", "repair", "repaint"]
          },
          {
            "id": "complexity",
            "key": "complexity",
            "type": "select",
            "label": "Complexity Level",
            "required": true,
            "options": ["low", "medium", "high"],
            "defaultValue": "medium"
          }
        ]
      },
      {
        "id": "additional-info",
        "order": 3,
        "title": "Additional Information",
        "description": "Any special requests or notes?",
        "fields": [
          {
            "id": "notes",
            "key": "notes",
            "type": "textarea",
            "label": "Notes",
            "placeholder": "Describe any customizations, color preferences, etc.",
            "required": false
          }
        ]
      }
    ],
    "serviceConfig": {
      "services": [
        {
          "id": "full_build",
          "name": "Full Build",
          "description": "Complete assembly of the kit"
        },
        {
          "id": "repair",
          "name": "Repair",
          "description": "Fix broken or damaged parts"
        },
        {
          "id": "repaint",
          "name": "Repaint",
          "description": "Custom paint job"
        }
      ]
    },
    "pricingConfig": {
      "basePrice": 5000,
      "complexityMultiplier": {
        "low": 1.0,
        "medium": 1.5,
        "high": 2.0
      },
      "servicePricing": {
        "full_build": 1.0,
        "repair": 0.8,
        "repaint": 1.2
      }
    }
  }'::jsonb,
  (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
) ON CONFLICT DO NOTHING;
