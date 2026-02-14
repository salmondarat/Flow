/**
 * Service Add-ons API Functions
 * Handles CRUD operations for service add-ons
 */

import { createClient } from "@/lib/supabase/client";
import type { ServiceAddonRow, ServiceAddonInsert, ServiceAddonUpdate } from "@/types";

/**
 * Fetch all active add-ons for a specific service
 */
export async function getAddonsForService(
  serviceTypeId: string,
  options: { activeOnly?: boolean } = {}
): Promise<ServiceAddonRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("service_addons")
    .select("*")
    .eq("service_type_id", serviceTypeId)
    .order("sort_order", { ascending: true });

  if (options.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching add-ons for service:", error);
    throw new Error(`Failed to fetch add-ons: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch all add-ons (admin only)
 */
export async function getAllAddons(
  options: { activeOnly?: boolean; serviceTypeId?: string } = {}
): Promise<Array<ServiceAddonRow & { service_name: string }>> {
  const supabase = createClient();

  let query = supabase
    .from("service_addons")
    .select(`
      *,
      service_types!inner(name)
    `)
    .order("sort_order", { ascending: true });

  if (options.activeOnly) {
    query = query.eq("is_active", true);
  }

  if (options.serviceTypeId) {
    query = query.eq("service_type_id", options.serviceTypeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching all add-ons:", error);
    throw new Error(`Failed to fetch add-ons: ${error.message}`);
  }

  return (
    data?.map((item: unknown) => {
      const typed = item as ServiceAddonRow & {
        service_types: { name: string };
      };
      return {
        ...typed,
        service_name: typed.service_types.name,
      };
    }) || []
  );
}

/**
 * Fetch a single add-on by ID
 */
export async function getAddon(id: string): Promise<ServiceAddonRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_addons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching add-on:", error);
    throw new Error(`Failed to fetch add-on: ${error.message}`);
  }

  return data;
}

/**
 * Create a new add-on
 */
export async function createAddon(
  addon: ServiceAddonInsert
): Promise<ServiceAddonRow> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
    from: (table: "service_addons") => {
      insert: (data: ServiceAddonInsert) => {
        select: () => {
          single: () => Promise<{
            data: ServiceAddonRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  })
    .from("service_addons")
    .insert(addon)
    .select()
    .single();

  if (error) {
    console.error("Error creating add-on:", error);
    throw new Error(`Failed to create add-on: ${error.message}`);
  }

  return data as ServiceAddonRow;
}

/**
 * Update an existing add-on
 */
export async function updateAddon(
  id: string,
  updates: ServiceAddonUpdate
): Promise<ServiceAddonRow> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
    from: (table: "service_addons") => {
      update: (data: ServiceAddonUpdate) => {
        eq: (field: "id", value: string) => {
          select: () => {
            single: () => Promise<{
              data: ServiceAddonRow | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("service_addons")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating add-on:", error);
    throw new Error(`Failed to update add-on: ${error.message}`);
  }

  return data as ServiceAddonRow;
}

/**
 * Soft delete an add-on (set is_active to false)
 */
export async function deleteAddon(id: string): Promise<void> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { error } = await (supabase as unknown as {
    from: (table: "service_addons") => {
      update: (data: { is_active: boolean; updated_at: string }) => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("service_addons")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error deleting add-on:", error);
    throw new Error(`Failed to delete add-on: ${error.message}`);
  }
}

/**
 * Reorder add-ons for a service
 */
export async function reorderAddons(
  orders: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const promises = orders.map(({ id, sort_order }) =>
    (supabase as unknown as {
      from: (table: "service_addons") => {
        update: (data: { sort_order: number; updated_at: string }) => {
          eq: (field: "id", value: string) => Promise<{
            error: { message: string } | null;
          }>;
        };
      };
    })
      .from("service_addons")
      .update({ sort_order, updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result.error) {
      console.error("Error reordering add-ons:", result.error);
      throw new Error(`Failed to reorder add-ons: ${result.error.message}`);
    }
  }
}

/**
 * Calculate total add-on price for an array of addon IDs
 */
export async function calculateAddonsTotal(
  addonIds: string[]
): Promise<number> {
  if (addonIds.length === 0) return 0;

  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
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
    .in("id", addonIds)
    .eq("is_active", true);

  if (error) {
    console.error("Error calculating addons total:", error);
    throw new Error(`Failed to calculate addons total: ${error.message}`);
  }

  return data?.reduce((sum, addon) => sum + addon.price_cents, 0) || 0;
}
