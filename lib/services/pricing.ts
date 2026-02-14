/**
 * Dynamic Pricing Service
 * Handles all pricing calculations using database-driven configuration
 * Falls back to legacy constants for backward compatibility
 */

import { createClient } from "@/lib/supabase/client";
import type { ServiceType, Complexity } from "@/types";

// Legacy pricing constants for fallback
const LEGACY_PRICING_RULES: Record<ServiceType, { basePrice: number; baseDays: number }> = {
  full_build: { basePrice: 500000, baseDays: 14 },
  repair: { basePrice: 150000, baseDays: 5 },
  repaint: { basePrice: 200000, baseDays: 7 },
} as const;

const LEGACY_COMPLEXITY_MULTIPLIERS: Record<Complexity, number> = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
} as const;

/**
 * Pricing result interface
 */
export interface PricingResult {
  priceCents: number;
  days: number;
}

/**
 * Service pricing information
 */
export interface ServicePricing {
  serviceTypeId: string;
  serviceSlug: string;
  serviceName: string;
  basePriceCents: number;
  baseDays: number;
}

/**
 * Complexity with effective multiplier
 */
export interface ComplexityWithMultiplier {
  complexityId: string;
  complexitySlug: string;
  complexityName: string;
  multiplier: number;
}

/**
 * Calculate price for a service-complexity combination
 * @param serviceTypeId - UUID of the service type
 * @param complexityLevelId - UUID of the complexity level
 * @returns Price in cents and estimated days
 */
export async function calculatePrice(
  serviceTypeId: string,
  complexityLevelId: string
): Promise<PricingResult> {
  const supabase = createClient();

  // TODO: Remove type assertions after migration is run
  // Fetch service type
  const { data: service, error: serviceError } = await (supabase as unknown as {
    from: (table: "service_types") => {
      select: (columns: "base_price_cents, base_days") => {
        eq: (field: "id", value: string) => {
          eq: (field: "is_active", value: true) => {
            single: () => Promise<{
              data: { base_price_cents: number; base_days: number } | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("service_types")
    .select("base_price_cents, base_days")
    .eq("id", serviceTypeId)
    .eq("is_active", true)
    .single();

  if (serviceError || !service) {
    console.error("Error fetching service type:", serviceError);
    throw new Error("Invalid service type");
  }

  // Check for custom multiplier in service_complexities
  const { data: customMultiplier } = await (supabase as unknown as {
    from: (table: "service_complexities") => {
      select: (columns: "override_multiplier") => {
        eq: (field: "service_type_id", value: string) => {
          eq: (field: "complexity_level_id", value: string) => {
            single: () => Promise<{
              data: { override_multiplier: number | null } | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("service_complexities")
    .select("override_multiplier")
    .eq("service_type_id", serviceTypeId)
    .eq("complexity_level_id", complexityLevelId)
    .single();

  // Fetch complexity level for default multiplier
  const { data: complexity, error: complexityError } = await (supabase as unknown as {
    from: (table: "complexity_levels") => {
      select: (columns: "multiplier") => {
        eq: (field: "id", value: string) => {
          eq: (field: "is_active", value: true) => {
            single: () => Promise<{
              data: { multiplier: number } | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("complexity_levels")
    .select("multiplier")
    .eq("id", complexityLevelId)
    .eq("is_active", true)
    .single();

  if (complexityError || !complexity) {
    console.error("Error fetching complexity level:", complexityError);
    throw new Error("Invalid complexity level");
  }

  // Use custom multiplier if exists, otherwise use default
  const multiplier =
    customMultiplier?.override_multiplier ?? complexity.multiplier;

  const priceCents = Math.round(service.base_price_cents * multiplier);
  const days = Math.round(service.base_days * multiplier);

  return { priceCents, days };
}

/**
 * Calculate price using legacy enum values
 * Falls back to hardcoded constants
 * @param serviceType - Legacy service type enum
 * @param complexity - Legacy complexity enum
 * @returns Price in cents and estimated days
 */
export function calculateLegacyPrice(
  serviceType: ServiceType,
  complexity: Complexity
): PricingResult {
  const pricing = LEGACY_PRICING_RULES[serviceType];
  const multiplier = LEGACY_COMPLEXITY_MULTIPLIERS[complexity];

  return {
    priceCents: Math.round(pricing.basePrice * multiplier),
    days: Math.round(pricing.baseDays * multiplier),
  };
}

/**
 * Calculate price using either new IDs or legacy enums
 * @param serviceTypeId - UUID or null
 * @param complexityLevelId - UUID or null
 * @param legacyServiceType - Legacy enum for fallback
 * @param legacyComplexity - Legacy enum for fallback
 * @returns Price in cents and estimated days
 */
export async function calculatePriceWithFallback(
  serviceTypeId: string | null,
  complexityLevelId: string | null,
  legacyServiceType?: ServiceType,
  legacyComplexity?: Complexity
): Promise<PricingResult> {
  // Try new system first
  if (serviceTypeId && complexityLevelId) {
    try {
      return await calculatePrice(serviceTypeId, complexityLevelId);
    } catch (error) {
      console.warn("Failed to calculate with new system, falling back", error);
    }
  }

  // Fallback to legacy system
  if (legacyServiceType && legacyComplexity) {
    return calculateLegacyPrice(legacyServiceType, legacyComplexity);
  }

  throw new Error("Invalid pricing parameters");
}

/**
 * Get all active service types with pricing
 */
export async function getActiveServices(): Promise<ServicePricing[]> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
    from: (table: "service_types") => {
      select: (columns: "id, slug, name, base_price_cents, base_days") => {
        eq: (field: "is_active", value: true) => {
          order: (field: "sort_order", options: { ascending: true }) => Promise<{
            data: Array<{
              id: string;
              slug: string;
              name: string;
              base_price_cents: number;
              base_days: number;
            }> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  })
    .from("service_types")
    .select("id, slug, name, base_price_cents, base_days")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching active services:", error);
    throw new Error("Failed to fetch services");
  }

  return (
    data?.map((service) => ({
      serviceTypeId: service.id,
      serviceSlug: service.slug,
      serviceName: service.name,
      basePriceCents: service.base_price_cents,
      baseDays: service.base_days,
    })) || []
  );
}

/**
 * Get complexities for a specific service with effective multipliers
 */
export async function getComplexitiesForService(
  serviceTypeId: string
): Promise<ComplexityWithMultiplier[]> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
    from: (table: "service_complexities") => {
      select: (columns: string) => {
        eq: (field: "service_type_id", value: string) => Promise<{
          data: Array<{
            complexity_level_id: string;
            override_multiplier: number | null;
            complexity_levels: {
              id: string;
              slug: string;
              name: string;
              multiplier: number;
            };
          }> | null;
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("service_complexities")
    .select(`
      complexity_level_id,
      override_multiplier,
      complexity_levels!inner(id, slug, name, multiplier)
    `)
    .eq("service_type_id", serviceTypeId);

  if (error) {
    console.error("Error fetching complexities:", error);
    throw new Error("Failed to fetch complexities");
  }

  return (
    data?.map((item: unknown) => {
      const typed = item as {
        complexity_level_id: string;
        override_multiplier: number | null;
        complexity_levels: {
          id: string;
          slug: string;
          name: string;
          multiplier: number;
        };
      };
      return {
        complexityId: typed.complexity_levels.id,
        complexitySlug: typed.complexity_levels.slug,
        complexityName: typed.complexity_levels.name,
        multiplier:
          typed.override_multiplier ?? typed.complexity_levels.multiplier,
      };
    }) || []
  );
}

/**
 * Calculate total for order items with add-ons
 */
export async function calculateOrderTotal(
  items: Array<{
    serviceTypeId: string | null;
    complexityLevelId: string | null;
    legacyServiceType?: ServiceType;
    legacyComplexity?: Complexity;
    addonIds?: string[];
  }>
): Promise<{ totalPriceCents: number; totalDays: number }> {
  const supabase = createClient();
  let totalPriceCents = 0;
  let totalDays = 0;

  for (const item of items) {
    const { priceCents, days } = await calculatePriceWithFallback(
      item.serviceTypeId,
      item.complexityLevelId,
      item.legacyServiceType,
      item.legacyComplexity
    );

    totalPriceCents += priceCents;
    totalDays += days;

    // Add add-on prices if any
    if (item.addonIds && item.addonIds.length > 0) {
      // TODO: Remove type assertion after migration is run
      const { data: addons } = await (supabase as unknown as {
        from: (table: "service_addons") => {
          select: (columns: "price_cents") => {
            in: (field: "id", values: string[]) => {
              eq: (field: "is_active", value: boolean) => Promise<{
                data: Array<{ price_cents: number }> | null;
                error: { message: string } | null;
              }>;
            };
          };
        };
      })
        .from("service_addons")
        .select("price_cents")
        .in("id", item.addonIds)
        .eq("is_active", true);

      if (addons) {
        totalPriceCents += addons.reduce(
          (sum, addon) => sum + addon.price_cents,
          0
        );
      }
    }
  }

  return { totalPriceCents, totalDays };
}
