/**
 * Estimation type definitions for order pricing and time calculations
 */

import type { ServiceType, Complexity } from "@/types";

/**
 * Input for calculating estimation for a single kit/service combination
 */
export interface EstimationInput {
  /** Type of service requested */
  serviceType: ServiceType;
  /** Complexity level affecting price and time */
  complexity: Complexity;
}

/**
 * Single item breakdown in an order
 */
export interface OrderItemInput extends EstimationInput {
  /** Kit name/model */
  kitName: string;
  /** Kit grade (optional) */
  kitGrade?: string;
  /** Additional notes (optional) */
  notes?: string;
}

/**
 * Result of estimation calculation for a single item
 */
export interface ItemEstimationResult {
  /** Price in cents (IDR) */
  priceCents: number;
  /** Estimated days to complete */
  days: number;
}

/**
 * Complete estimation result for an order
 */
export interface OrderEstimationResult {
  /** Total price in cents (IDR) */
  totalPriceCents: number;
  /** Total estimated days */
  totalDays: number;
  /** Breakdown by item */
  items: Array<{
    kitName: string;
    serviceType: ServiceType;
    complexity: Complexity;
    priceCents: number;
    days: number;
  }>;
}

/**
 * Formatted estimation for display
 */
export interface FormattedEstimation {
  /** Total price formatted as "Rp 500.000" */
  price: string;
  /** Total days formatted as "14 days" or "2 weeks" */
  days: string;
  /** Price breakdown per item */
  breakdown: Array<{
    kitName: string;
    service: string;
    complexity: string;
    price: string;
    days: string;
  }>;
}
