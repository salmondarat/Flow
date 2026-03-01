import type { ServiceType, Complexity } from "./database";

/**
 * Form field types supported by the dynamic form system
 */
export type FieldType = "text" | "textarea" | "select" | "checkbox" | "number" | "file";

/**
 * Validation rules for a form field
 */
export interface FieldValidation {
  pattern?: string; // regex pattern
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  customMessage?: string;
}

/**
 * Configuration for a single form field
 */
export interface FormField {
  id: string;
  key: string; // e.g., "client_name", "kit_grade"
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: string[]; // for select fields
  defaultValue?: unknown;
}

/**
 * Configuration for a single step in a multi-step form
 */
export interface FormStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  fields: FormField[];
}

/**
 * Service configuration for pricing calculations
 */
export interface ServiceConfigItem {
  id: string;
  name: string;
  description: string;
}

export interface ServiceConfig {
  services: ServiceConfigItem[];
}

/**
 * Complexity multiplier for pricing
 */
export interface ComplexityMultiplier {
  low: number;
  medium: number;
  high: number;
}

/**
 * Service-specific pricing multipliers
 */
export interface ServicePricing {
  full_build?: number;
  repair?: number;
  repaint?: number;
}

/**
 * Pricing configuration
 */
export interface PricingConfig {
  basePrice: number; // in cents
  complexityMultiplier: ComplexityMultiplier;
  servicePricing: ServicePricing;
}

/**
 * Complete form template configuration
 */
export interface FormTemplateConfig {
  steps: FormStep[];
  serviceConfig: ServiceConfig;
  pricingConfig: PricingConfig;
}

/**
 * Complete form template with metadata
 */
export interface FormTemplate extends FormTemplateConfig {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Form field value during form filling
 */
export interface FormFieldValue {
  fieldKey: string;
  value: unknown;
}

/**
 * Form state during multi-step form
 */
export interface FormState {
  currentStep: number;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

/**
 * Validation error for a field
 */
export interface FieldError {
  fieldKey: string;
  message: string;
}

/**
 * Kit item in an order form
 */
export interface KitFormItem {
  kit_name: string;
  kit_model?: string;
  service_type: ServiceType;
  complexity: Complexity;
  notes?: string;
  reference_images?: string[];
}
