/**
 * Form validation schema for order submission
 */

import { z } from "zod";

/**
 * Client information schema
 */
export const clientInfoSchema = z.object({
  clientName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z.string().regex(/^\+62\d{8,12}$/, "Phone must start with +62 followed by 8-12 digits"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  address: z.string().max(500, "Address must be less than 500 characters").optional(),
});

/**
 * Order item schema for form validation
 */
export const orderItemFormSchema = z.object({
  kitName: z
    .string()
    .min(2, "Kit name must be at least 2 characters")
    .max(100, "Kit name must be less than 100 characters"),
  kitGrade: z.string().max(50, "Grade must be less than 50 characters").optional(),
  serviceType: z.enum(["full_build", "repair", "repaint"], {
    required_error: "Please select a service type",
  }),
  complexity: z.enum(["low", "medium", "high"], {
    required_error: "Please select a complexity level",
  }),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

/**
 * Complete order form schema
 */
export const orderFormSchema = z.object({
  clientName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z.string().regex(/^\+62\d{8,12}$/, "Phone must start with +62 followed by 8-12 digits"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().max(500).optional(),
  items: z
    .array(orderItemFormSchema)
    .min(1, "Please add at least one kit")
    .max(10, "Cannot add more than 10 kits per order"),
});

/**
 * API request body schema
 */
export const createOrderRequestSchema = orderFormSchema;

/**
 * Infer types from schemas
 */
export type ClientInfo = z.infer<typeof clientInfoSchema>;
export type OrderItemForm = z.infer<typeof orderItemFormSchema>;
export type OrderForm = z.infer<typeof orderFormSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
