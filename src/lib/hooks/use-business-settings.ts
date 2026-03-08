/**
 * Hook for fetching and managing business settings
 * Provides caching and updates for business configuration
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import type { BusinessSettingsRow, BusinessSettingsUpdate } from "@/types";

/**
 * Business settings hook return type
 */
export interface BusinessSettingsHook {
  settings: BusinessSettingsRow | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateSettings: (updates: BusinessSettingsUpdate) => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
}

/**
 * Cache for business settings
 */
let cache: BusinessSettingsRow | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for fetching and managing business settings
 * @returns Business settings data and functions
 */
export function useBusinessSettings(): BusinessSettingsHook {
  const [settings, setSettings] = useState<BusinessSettingsRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    // Check cache first
    if (cache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setSettings(cache);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/business-settings");

      if (!response.ok) {
        throw new Error("Failed to fetch business settings");
      }

      const data = await response.json();
      setSettings(data);
      cache = data;
      cacheTimestamp = Date.now();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch business settings";
      setError(message);
      console.error("Error fetching business settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (updates: BusinessSettingsUpdate) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/business-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update business settings");
      }

      const data = await response.json();
      setSettings(data);
      cache = data;
      cacheTimestamp = Date.now();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update business settings";
      setError(message);
      console.error("Error updating business settings:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const uploadLogo = useCallback(
    async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("logo", file);

      try {
        const response = await fetch("/api/admin/business-settings/logo", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to upload logo");
        }

        const data = await response.json();

        // Update local settings with new logo URL
        if (settings) {
          const updatedSettings = { ...settings, logo_url: data.logoUrl };
          setSettings(updatedSettings);
          cache = updatedSettings;
          cacheTimestamp = Date.now();
        }

        return data.logoUrl;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to upload logo";
        setError(message);
        console.error("Error uploading logo:", err);
        throw err;
      }
    },
    [settings]
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    refresh: fetchSettings,
    updateSettings,
    uploadLogo,
  };
}

/**
 * Invalidate cache
 * Call this after making changes to business settings
 */
export function invalidateBusinessSettingsCache(): void {
  cache = null;
  cacheTimestamp = 0;
}
