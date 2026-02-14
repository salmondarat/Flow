/**
 * React hook for order estimation calculations
 */

"use client";

import { useMemo } from "react";
import type { OrderEstimationResult, FormattedEstimation } from "@/lib/estimation/types";
import type { OrderItemInput } from "@/lib/estimation/validation";
import { calculateOrderTotal } from "@/lib/estimation/calculate";
import { formatOrderEstimation } from "@/lib/estimation/utils";

export interface UseEstimationResult {
  /** Raw calculation result */
  estimation: OrderEstimationResult | null;
  /** Formatted for display */
  formatted: FormattedEstimation | null;
  /** Whether any items have invalid data */
  hasInvalidItems: boolean;
  /** Total price formatted */
  totalPrice: string;
  /** Total days formatted */
  totalDays: string;
}

/**
 * Hook for calculating order estimation from form items
 * @param items - Array of order items from the form
 * @returns Estimation result with formatted values
 */
export function useEstimation(items: Partial<OrderItemInput>[]): UseEstimationResult {
  const result = useMemo(() => {
    // Filter out incomplete items
    const validItems = items.filter(
      (item): item is OrderItemInput =>
        !!(
          item &&
          item.kitName &&
          item.serviceType &&
          item.complexity &&
          item.kitName.trim().length >= 2
        )
    );

    if (validItems.length === 0) {
      return {
        estimation: null,
        formatted: null,
        hasInvalidItems: items.length > 0,
        totalPrice: "Rp 0",
        totalDays: "0 days",
      };
    }

    try {
      const estimation = calculateOrderTotal(validItems);
      const formatted = formatOrderEstimation(estimation);
      const hasInvalidItems = validItems.length < items.length;

      return {
        estimation,
        formatted,
        hasInvalidItems,
        totalPrice: formatted.price,
        totalDays: formatted.days,
      };
    } catch (error) {
      console.error("Estimation calculation error:", error);
      return {
        estimation: null,
        formatted: null,
        hasInvalidItems: true,
        totalPrice: "Rp 0",
        totalDays: "0 days",
      };
    }
  }, [items]);

  return result;
}
