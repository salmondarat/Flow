/**
 * Zod validation schemas for estimation
 */

import { z } from "zod";

/**
 * Service type enum schema
 */
export const serviceTypeSchema = z.enum(["full_build", "repair", "repaint"], {
  errorMap: () => ({ message: "Please select a valid service type" }),
});

/**
 * Complexity enum schema
 */
export const complexitySchema = z.enum(["low", "medium", "high"], {
  errorMap: () => ({ message: "Please select a valid complexity level" }),
});

/**
 * Single estimation input schema
 */
export const estimationInputSchema = z.object({
  serviceType: serviceTypeSchema,
  complexity: complexitySchema,
});

/**
 * Order item input schema (for form validation)
 */
export const orderItemInputSchema = z.object({
  kitName: z
    .string()
    .min(2, "Kit name must be at least 2 characters")
    .max(100, "Kit name must be less than 100 characters"),
  kitGrade: z.string().max(50, "Grade must be less than 50 characters").optional(),
  serviceType: serviceTypeSchema,
  complexity: complexitySchema,
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

/**
 * Infer types from schemas
 */
export type ServiceTypeEnum = z.infer<typeof serviceTypeSchema>;
export type ComplexityEnum = z.infer<typeof complexitySchema>;
export type EstimationInput = z.infer<typeof estimationInputSchema>;
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
