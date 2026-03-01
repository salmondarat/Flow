/**
 * Hook for fetching and managing service configuration
 * Provides caching and real-time updates for service types, complexity levels, and add-ons
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  ServicePricingData,
  ComplexityLevelData,
  ServiceComplexityData,
} from "@/lib/estimation/calculate";
import type { ServiceAddonRow } from "@/types";
import {
  getServiceTypes,
  getServiceTypeBySlug,
} from "@/lib/api/services";
import {
  getComplexityLevels,
  getComplexityForService,
} from "@/lib/api/complexities";
import { getAddonsForService } from "@/lib/api/addons";

/**
 * Service configuration hook return type
 */
export interface ServiceConfiguration {
  services: ServicePricingData[];
  complexities: ComplexityLevelData[];
  complexitiesByService: Map<string, Array<ComplexityLevelData & { overrideMultiplier?: number }>>;
  addonsByService: Map<string, ServiceAddonRow[]>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Cache for service configuration
 */
let cache: ServiceConfiguration | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for fetching service configuration
 * @param options - Configuration options
 * @returns Service configuration data
 */
export function useServiceConfiguration(options: {
  enableCache?: boolean;
  refetchInterval?: number;
} = {}): ServiceConfiguration {
  const { enableCache = true, refetchInterval } = options;

  const [services, setServices] = useState<ServicePricingData[]>([]);
  const [complexities, setComplexities] = useState<ComplexityLevelData[]>([]);
  const [complexitiesByService, setComplexitiesByService] = useState<
    Map<string, Array<ComplexityLevelData & { overrideMultiplier?: number }>>
  >(new Map());
  const [addonsByService, setAddonsByService] = useState<Map<string, ServiceAddonRow[]>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfiguration = useCallback(async () => {
    // Check cache first
    if (
      enableCache &&
      cache &&
      Date.now() - cacheTimestamp < CACHE_DURATION
    ) {
      setServices(cache.services);
      setComplexities(cache.complexities);
      setComplexitiesByService(cache.complexitiesByService);
      setAddonsByService(cache.addonsByService);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all active services
      const servicesData = await getServiceTypes({ activeOnly: true });

      // Fetch all active complexities
      const complexitiesData = await getComplexityLevels({ activeOnly: true });

      // Fetch complexities and addons for each service
      const complexitiesMap = new Map<
        string,
        Array<ComplexityLevelData & { overrideMultiplier?: number }>
      >();
      const addonsMap = new Map<string, ServiceAddonRow[]>();

      for (const service of servicesData) {
        // Fetch complexities with custom multipliers
        const serviceComplexities = await getComplexityForService(service.id);
        complexitiesMap.set(
          service.id,
          serviceComplexities.map((sc) => ({
            id: sc.id,
            slug: sc.slug,
            name: sc.name,
            multiplier: sc.multiplier,
            isActive: sc.is_active,
            sortOrder: sc.sort_order,
            overrideMultiplier: sc.override_multiplier ?? undefined,
          }))
        );

        // Fetch add-ons
        const addons = await getAddonsForService(service.id, { activeOnly: true });
        addonsMap.set(service.id, addons);
      }

      // Update state
      setServices(
        servicesData.map((s) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          description: s.description,
          iconName: s.icon_name,
          basePriceCents: s.base_price_cents,
          baseDays: s.base_days,
          isActive: s.is_active,
          sortOrder: s.sort_order,
        }))
      );
      setComplexities(
        complexitiesData.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          multiplier: c.multiplier,
          isActive: c.is_active,
          sortOrder: c.sort_order,
        }))
      );
      setComplexitiesByService(complexitiesMap);
      setAddonsByService(addonsMap);

      // Update cache
      cache = {
        services,
        complexities,
        complexitiesByService: complexitiesMap,
        addonsByService: addonsMap,
        isLoading: false,
        error: null,
        refresh: fetchConfiguration,
      };
      cacheTimestamp = Date.now();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch service configuration";
      setError(message);
      console.error("Error fetching service configuration:", err);
    } finally {
      setIsLoading(false);
    }
  }, [enableCache]);

  useEffect(() => {
    fetchConfiguration();
  }, [fetchConfiguration]);

  // Set up refetch interval
  useEffect(() => {
    if (refetchInterval) {
      const interval = setInterval(fetchConfiguration, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchConfiguration, refetchInterval]);

  return {
    services,
    complexities,
    complexitiesByService,
    addonsByService,
    isLoading,
    error,
    refresh: fetchConfiguration,
  };
}

/**
 * Invalidate cache
 * Call this after making changes to service configuration
 */
export function invalidateServiceConfigurationCache(): void {
  cache = null;
  cacheTimestamp = 0;
}

/**
 * Helper to get service by slug
 */
export function useServiceBySlug(slug: string) {
  const { services, isLoading } = useServiceConfiguration();

  return {
    service: services.find((s) => s.slug === slug),
    isLoading,
  };
}

/**
 * Helper to get complexities for a specific service
 */
export function useComplexitiesForService(serviceId: string) {
  const { complexitiesByService, isLoading } = useServiceConfiguration();

  return {
    complexities: complexitiesByService.get(serviceId) || [],
    isLoading,
  };
}

/**
 * Helper to get add-ons for a specific service
 */
export function useAddonsForService(serviceId: string) {
  const { addonsByService, isLoading } = useServiceConfiguration();

  return {
    addons: addonsByService.get(serviceId) || [],
    isLoading,
  };
}
