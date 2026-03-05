/**
 * Pricing and time estimation constants
 */

import type { ServiceType, Complexity } from "@/types";

/**
 * Base pricing rules for each service type
 * Prices are in Indonesian Rupiah cents (1 IDR = 100 cents)
 */
export const PRICING_RULES: Record<ServiceType, { basePrice: number; baseDays: number }> = {
  full_build: { basePrice: 500000, baseDays: 14 },
  repair: { basePrice: 150000, baseDays: 5 },
  repaint: { basePrice: 200000, baseDays: 7 },
} as const;

/**
 * Complexity multipliers affecting both price and time
 */
export const COMPLEXITY_MULTIPLIERS: Record<Complexity, number> = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
} as const;

/**
 * Display names for service types
 */
export const SERVICE_NAMES: Readonly<Record<ServiceType, string>> = {
  full_build: "Full Build",
  repair: "Repair",
  repaint: "Repaint",
};

/**
 * Display names for complexity levels
 */
export const COMPLEXITY_NAMES: Readonly<Record<Complexity, string>> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

/**
 * Service descriptions for UI display
 */
export const SERVICE_DESCRIPTIONS: Readonly<Record<ServiceType, string>> = {
  full_build: "Complete assembly, panel lining, and detailing",
  repair: "Fix broken parts and restore functionality",
  repaint: "Disassemble, paint, and reassemble with custom colors",
};
