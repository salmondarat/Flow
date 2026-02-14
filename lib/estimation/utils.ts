/**
 * Estimation formatting utilities for display
 */

import type { OrderEstimationResult } from "./types";
import { SERVICE_NAMES, COMPLEXITY_NAMES } from "./constants";

/**
 * Format price from cents to Indonesian Rupiah string
 * @param cents - Price in cents (IDR * 100)
 * @returns Formatted price string (e.g., "Rp 500.000")
 */
export function formatPrice(cents: number): string {
  const rupiah = Math.floor(cents / 100);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupiah);
}

/**
 * Format days to human-readable string
 * @param days - Number of days
 * @returns Formatted string (e.g., "14 days", "2 weeks")
 */
export function formatDays(days: number): string {
  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  }

  const weeks = Math.round(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  }

  const months = Math.round(days / 30);
  return `${months} month${months !== 1 ? "s" : ""}`;
}

/**
 * Format service type to display name
 * @param service - Service type
 * @returns Display name
 */
export function formatService(service: string): string {
  return SERVICE_NAMES[service as keyof typeof SERVICE_NAMES] || service;
}

/**
 * Format complexity to display name
 * @param complexity - Complexity level
 * @returns Display name
 */
export function formatComplexity(complexity: string): string {
  return COMPLEXITY_NAMES[complexity as keyof typeof COMPLEXITY_NAMES] || complexity;
}

/**
 * Format complete estimation result for display
 * @param estimation - Order estimation result
 * @returns Formatted estimation with breakdown
 */
export function formatOrderEstimation(estimation: OrderEstimationResult): {
  price: string;
  days: string;
  breakdown: Array<{
    kitName: string;
    service: string;
    complexity: string;
    price: string;
    days: string;
  }>;
} {
  return {
    price: formatPrice(estimation.totalPriceCents),
    days: formatDays(estimation.totalDays),
    breakdown: estimation.items.map((item) => ({
      kitName: item.kitName,
      service: formatService(item.serviceType),
      complexity: formatComplexity(item.complexity),
      price: formatPrice(item.priceCents),
      days: formatDays(item.days),
    })),
  };
}
