/**
 * Estimation calculation logic for pricing and time
 *
 * NOTE: This file contains both legacy (sync) and new (async) functions.
 * Legacy functions use hardcoded constants for backward compatibility.
 * New functions use database-driven configuration.
 *
 * For new code, prefer using the async functions or the useEstimation hook.
 */

import type { ServiceType, Complexity } from "@/types";
import type {
  EstimationInput,
  ItemEstimationResult,
  OrderEstimationResult,
  OrderItemInput,
} from "./types";
import { PRICING_RULES, COMPLEXITY_MULTIPLIERS } from "./constants";

// ============================================================================
// LEGACY FUNCTIONS (Sync, using hardcoded constants)
// ============================================================================

/**
 * Calculate price for a single service + complexity combination
 * @deprecated Use calculatePriceAsync from pricing service for new code
 * @param service - Type of service
 * @param complexity - Complexity level
 * @returns Price in cents (IDR)
 * @throws Error if invalid service or complexity
 */
export function calculatePrice(service: ServiceType, complexity: Complexity): number {
  const pricing = PRICING_RULES[service];
  if (!pricing) {
    throw new Error(`Invalid service type: ${service}`);
  }

  const multiplier = COMPLEXITY_MULTIPLIERS[complexity];
  if (multiplier === undefined) {
    throw new Error(`Invalid complexity level: ${complexity}`);
  }

  return Math.round(pricing.basePrice * multiplier);
}

/**
 * Calculate days to complete for a single service + complexity combination
 * @param service - Type of service
 * @param complexity - Complexity level
 * @returns Estimated days
 * @throws Error if invalid service or complexity
 */
export function calculateDays(service: ServiceType, complexity: Complexity): number {
  const pricing = PRICING_RULES[service];
  if (!pricing) {
    throw new Error(`Invalid service type: ${service}`);
  }

  const multiplier = COMPLEXITY_MULTIPLIERS[complexity];
  if (multiplier === undefined) {
    throw new Error(`Invalid complexity level: ${complexity}`);
  }

  return Math.round(pricing.baseDays * multiplier);
}

/**
 * Calculate estimation for a single item
 * @param input - Service type and complexity
 * @returns Item estimation result with price and days
 */
export function calculateEstimation(input: EstimationInput): ItemEstimationResult {
  return {
    priceCents: calculatePrice(input.serviceType, input.complexity),
    days: calculateDays(input.serviceType, input.complexity),
  };
}

/**
 * Calculate total estimation for an order with multiple items
 * @param items - Array of order items with kit info
 * @returns Complete order estimation with breakdown
 */
export function calculateOrderTotal(items: OrderItemInput[]): OrderEstimationResult {
  const breakdown = items.map((item) => {
    const estimation = calculateEstimation(item);
    return {
      kitName: item.kitName,
      serviceType: item.serviceType,
      complexity: item.complexity,
      priceCents: estimation.priceCents,
      days: estimation.days,
    };
  });

  const totalPriceCents = breakdown.reduce((sum, item) => sum + item.priceCents, 0);
  const totalDays = breakdown.reduce((sum, item) => sum + item.days, 0);

  return {
    totalPriceCents,
    totalDays,
    items: breakdown,
  };
}

/**
 * Validate estimation input
 * @param input - Service type and complexity to validate
 * @returns True if valid, false otherwise
 */
export function isValidEstimationInput(input: unknown): input is EstimationInput {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  const record = input as Partial<EstimationInput>;
  const validServices: readonly string[] = ["full_build", "repair", "repaint"];
  const validComplexities: readonly string[] = ["low", "medium", "high"];

  return (
    typeof record.serviceType === "string" &&
    validServices.includes(record.serviceType) &&
    typeof record.complexity === "string" &&
    validComplexities.includes(record.complexity)
  );
}

// ============================================================================
// NEW ASYNC FUNCTIONS (Using database-driven configuration)
// ============================================================================

/**
 * Dynamic pricing data structure
 */
export interface ServicePricingData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconName: string | null;
  basePriceCents: number;
  baseDays: number;
  isActive: boolean;
  sortOrder: number;
}

export interface ComplexityLevelData {
  id: string;
  slug: string;
  name: string;
  multiplier: number;
  isActive: boolean;
  sortOrder: number;
}

export interface ServiceComplexityData {
  serviceTypeId: string;
  complexityLevelId: string;
  overrideMultiplier: number | null;
}

/**
 * Calculate price using dynamic pricing data
 * Use this when you have pre-fetched the pricing data
 */
export function calculatePriceWithDynamicData(
  serviceData: ServicePricingData,
  complexityData: ComplexityLevelData,
  serviceComplexity?: ServiceComplexityData
): { priceCents: number; days: number } {
  const multiplier = serviceComplexity?.overrideMultiplier ?? complexityData.multiplier;

  return {
    priceCents: Math.round(serviceData.basePriceCents * multiplier),
    days: Math.round(serviceData.baseDays * multiplier),
  };
}

/**
 * Calculate estimation using dynamic data
 */
export function calculateEstimationWithDynamicData(
  serviceData: ServicePricingData,
  complexityData: ComplexityLevelData,
  serviceComplexity?: ServiceComplexityData,
  addonData?: Array<{ priceCents: number }>
): ItemEstimationResult {
  const pricing = calculatePriceWithDynamicData(
    serviceData,
    complexityData,
    serviceComplexity
  );

  let addonPriceCents = 0;
  if (addonData) {
    addonPriceCents = addonData.reduce((sum, addon) => sum + addon.priceCents, 0);
  }

  return {
    priceCents: pricing.priceCents + addonPriceCents,
    days: pricing.days,
  };
}
