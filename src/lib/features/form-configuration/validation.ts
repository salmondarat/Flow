import { z } from "zod";
import type { FieldType } from "@/types/form-config";

/**
 * Zod schema for field validation rules
 */
export const fieldValidationSchema = z.object({
  pattern: z.string().optional(),
  minLength: z.number().int().positive().optional(),
  maxLength: z.number().int().positive().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  customMessage: z.string().optional(),
});

/**
 * Zod schema for a form field
 */
export const formFieldSchema = z.object({
  id: z.string().min(1, "Field ID is required"),
  key: z.string().min(1, "Field key is required"),
  type: z.enum(["text", "textarea", "select", "checkbox", "number", "file"] as const),
  label: z.string().min(1, "Field label is required"),
  placeholder: z.string().optional(),
  required: z.boolean(),
  validation: fieldValidationSchema.optional(),
  options: z.array(z.string()).optional(),
  defaultValue: z.any().optional(),
});

/**
 * Zod schema for a form step
 */
export const formStepSchema = z.object({
  id: z.string().min(1, "Step ID is required"),
  order: z.number().int().nonnegative(),
  title: z.string().min(1, "Step title is required"),
  description: z.string().optional(),
  fields: z.array(formFieldSchema).min(1, "Step must have at least one field"),
});

/**
 * Zod schema for service config item
 */
export const serviceConfigItemSchema = z.object({
  id: z.string().min(1, "Service ID is required"),
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
});

/**
 * Zod schema for service config
 */
export const serviceConfigSchema = z.object({
  services: z.array(serviceConfigItemSchema).min(1, "At least one service is required"),
});

/**
 * Zod schema for complexity multiplier
 */
export const complexityMultiplierSchema = z.object({
  low: z.number().nonnegative(),
  medium: z.number().nonnegative(),
  high: z.number().nonnegative(),
});

/**
 * Zod schema for service pricing
 */
export const servicePricingSchema = z.object({
  full_build: z.number().nonnegative().optional(),
  repair: z.number().nonnegative().optional(),
  repaint: z.number().nonnegative().optional(),
});

/**
 * Zod schema for pricing config
 */
export const pricingConfigSchema = z.object({
  basePrice: z.number().int().nonnegative(),
  complexityMultiplier: complexityMultiplierSchema,
  servicePricing: servicePricingSchema,
});

/**
 * Zod schema for form template config
 */
export const formTemplateConfigSchema = z.object({
  steps: z.array(formStepSchema).min(1, "At least one step is required"),
  serviceConfig: serviceConfigSchema,
  pricingConfig: pricingConfigSchema,
});

/**
 * Zod schema for complete form template (with metadata)
 */
export const formTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  isDefault: z.boolean().default(false),
  version: z.number().int().positive().default(1),
  config: formTemplateConfigSchema,
});

/**
 * Zod schema for creating a form template
 */
export const createFormTemplateSchema = formTemplateSchema;

/**
 * Zod schema for updating a form template
 */
export const updateFormTemplateSchema = formTemplateSchema.partial().extend({
  config: formTemplateConfigSchema.optional(),
});

/**
 * Validate a field value based on its configuration
 */
export function validateFieldValue(
  field: z.infer<typeof formFieldSchema>,
  value: unknown
): { valid: boolean; error?: string } {
  // Check required fields
  if (field.required && (value === null || value === undefined || value === "")) {
    return { valid: false, error: `${field.label} is required` };
  }

  // Skip validation if field is not required and empty
  if (!field.required && (value === null || value === undefined || value === "")) {
    return { valid: true };
  }

  // Type-specific validation
  switch (field.type) {
    case "text":
    case "textarea":
      if (typeof value !== "string") {
        return { valid: false, error: `${field.label} must be text` };
      }
      break;

    case "number":
      if (typeof value !== "number") {
        return { valid: false, error: `${field.label} must be a number` };
      }
      break;

    case "select":
      if (field.options && !field.options.includes(value as string)) {
        return { valid: false, error: `${field.label} must be one of the allowed options` };
      }
      break;

    case "checkbox":
      if (typeof value !== "boolean") {
        return { valid: false, error: `${field.label} must be true or false` };
      }
      break;
  }

  // Apply custom validation rules
  if (field.validation) {
    const strValue = String(value);

    if (field.validation.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(strValue)) {
        return {
          valid: false,
          error: field.validation.customMessage || `${field.label} format is invalid`,
        };
      }
    }

    if (field.validation.minLength && strValue.length < field.validation.minLength) {
      return {
        valid: false,
        error:
          field.validation.customMessage ||
          `${field.label} must be at least ${field.validation.minLength} characters`,
      };
    }

    if (field.validation.maxLength && strValue.length > field.validation.maxLength) {
      return {
        valid: false,
        error:
          field.validation.customMessage ||
          `${field.label} must be at most ${field.validation.maxLength} characters`,
      };
    }

    if (field.validation.min !== undefined && Number(value) < field.validation.min) {
      return {
        valid: false,
        error:
          field.validation.customMessage ||
          `${field.label} must be at least ${field.validation.min}`,
      };
    }

    if (field.validation.max !== undefined && Number(value) > field.validation.max) {
      return {
        valid: false,
        error:
          field.validation.customMessage ||
          `${field.label} must be at most ${field.validation.max}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate form data against a template
 */
export function validateFormData(
  template: z.infer<typeof formTemplateConfigSchema>,
  formData: Record<string, unknown>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const step of template.steps) {
    for (const field of step.fields) {
      const result = validateFieldValue(field, formData[field.key]);
      if (!result.valid && result.error) {
        errors[field.key] = result.error;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
