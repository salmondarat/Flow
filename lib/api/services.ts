/**
 * Service Types API Functions
 * Handles CRUD operations for service types
 */

import { createAdminClient } from "@/lib/supabase/admin";

const createClient = createAdminClient;
import type {
  ServiceTypeRow,
  ServiceTypeInsert,
  ServiceTypeUpdate,
} from "@/types";

/**
 * Fetch all active service types ordered by sort_order
 */
export async function getServiceTypes(
  options: { activeOnly?: boolean; includeInactive?: boolean } = {}
): Promise<ServiceTypeRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("service_types")
    .select("*")
    .order("sort_order", { ascending: true });

  if (options.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching service types:", error);
    throw new Error(`Failed to fetch service types: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch a single service type by ID
 */
export async function getServiceType(
  id: string
): Promise<ServiceTypeRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_types")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching service type:", error);
    throw new Error(`Failed to fetch service type: ${error.message}`);
  }

  return data;
}

/**
 * Fetch a service type by slug
 */
export async function getServiceTypeBySlug(
  slug: string
): Promise<ServiceTypeRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_types")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching service type by slug:", error);
    throw new Error(`Failed to fetch service type: ${error.message}`);
  }

  return data;
}

/**
 * Create a new service type
 */
export async function createServiceType(
  service: ServiceTypeInsert
): Promise<ServiceTypeRow> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
    from: (table: "service_types") => {
      insert: (data: ServiceTypeInsert) => {
        select: () => {
          single: () => Promise<{
            data: ServiceTypeRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  })
    .from("service_types")
    .insert(service)
    .select()
    .single();

  if (error) {
    console.error("Error creating service type:", error);
    throw new Error(`Failed to create service type: ${error.message}`);
  }

  return data as ServiceTypeRow;
}

/**
 * Update an existing service type
 */
export async function updateServiceType(
  id: string,
  updates: ServiceTypeUpdate
): Promise<ServiceTypeRow> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
    from: (table: "service_types") => {
      update: (data: ServiceTypeUpdate) => {
        eq: (field: "id", value: string) => {
          select: () => {
            single: () => Promise<{
              data: ServiceTypeRow | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("service_types")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating service type:", error);
    throw new Error(`Failed to update service type: ${error.message}`);
  }

  return data as ServiceTypeRow;
}

/**
 * Soft delete a service type (set is_active to false)
 */
export async function deleteServiceType(id: string): Promise<void> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { error } = await (supabase as unknown as {
    from: (table: "service_types") => {
      update: (data: { is_active: boolean; updated_at: string }) => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("service_types")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error deleting service type:", error);
    throw new Error(`Failed to delete service type: ${error.message}`);
  }
}

/**
 * Permanently delete a service type (hard delete)
 * Use with caution - only for services with no existing orders
 */
export async function hardDeleteServiceType(id: string): Promise<void> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { error } = await (supabase as unknown as {
    from: (table: "service_types") => {
      delete: () => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("service_types")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error hard deleting service type:", error);
    throw new Error(`Failed to delete service type: ${error.message}`);
  }
}

/**
 * Reorder service types
 */
export async function reorderServiceTypes(
  orders: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const promises = orders.map(({ id, sort_order }) =>
    (supabase as unknown as {
      from: (table: "service_types") => {
        update: (data: { sort_order: number; updated_at: string }) => {
          eq: (field: "id", value: string) => Promise<{
            error: { message: string } | null;
          }>;
        };
      };
    })
      .from("service_types")
      .update({ sort_order, updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result.error) {
      console.error("Error reordering service types:", result.error);
      throw new Error(`Failed to reorder service types: ${result.error.message}`);
    }
  }
}
