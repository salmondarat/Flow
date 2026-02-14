/**
 * Complexity Levels API Functions
 * Handles CRUD operations for complexity levels
 */

import { createClient } from "@/lib/supabase/client";
import type {
  ComplexityLevelRow,
  ComplexityLevelInsert,
  ComplexityLevelUpdate,
} from "@/types";

/**
 * Fetch all active complexity levels ordered by sort_order
 */
export async function getComplexityLevels(
  options: { activeOnly?: boolean } = {}
): Promise<ComplexityLevelRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("complexity_levels")
    .select("*")
    .order("sort_order", { ascending: true });

  if (options.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching complexity levels:", error);
    throw new Error(`Failed to fetch complexity levels: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch a single complexity level by ID
 */
export async function getComplexityLevel(
  id: string
): Promise<ComplexityLevelRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complexity_levels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching complexity level:", error);
    throw new Error(`Failed to fetch complexity level: ${error.message}`);
  }

  return data;
}

/**
 * Fetch a complexity level by slug
 */
export async function getComplexityLevelBySlug(
  slug: string
): Promise<ComplexityLevelRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complexity_levels")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching complexity level by slug:", error);
    throw new Error(`Failed to fetch complexity level: ${error.message}`);
  }

  return data;
}

/**
 * Fetch complexity levels for a specific service
 * Includes custom multipliers if they exist
 */
export async function getComplexityForService(
  serviceTypeId: string
): Promise<
  Array<
    ComplexityLevelRow & {
      override_multiplier: number | null;
    }
  >
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_complexities")
    .select(
      `
      complexity_level_id,
      override_multiplier,
      complexity_levels!inner(*)
    `
    )
    .eq("service_type_id", serviceTypeId)
    .eq("complexity_levels.is_active", true);

  if (error) {
    console.error("Error fetching complexity for service:", error);
    throw new Error(`Failed to fetch complexity for service: ${error.message}`);
  }

  return (
    data?.map((item: unknown) => {
      const typed = item as {
        complexity_levels: ComplexityLevelRow;
        override_multiplier: number | null;
      };
      return {
        ...typed.complexity_levels,
        override_multiplier: typed.override_multiplier,
      };
    }) || []
  );
}

/**
 * Get effective multiplier for a service-complexity combination
 * Returns override multiplier if exists, otherwise default multiplier
 */
export async function getMultiplier(
  serviceTypeId: string,
  complexityLevelId: string
): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_complexities")
    .select("override_multiplier, complexity_levels!inner(multiplier)")
    .eq("service_type_id", serviceTypeId)
    .eq("complexity_level_id", complexityLevelId)
    .single();

  if (error) {
    console.error("Error fetching multiplier:", error);
    throw new Error(`Failed to fetch multiplier: ${error.message}`);
  }

  const typed = data as {
    override_multiplier: number | null;
    complexity_levels: { multiplier: number };
  };

  // Return override if exists, otherwise default
  return typed.override_multiplier ?? typed.complexity_levels.multiplier;
}

/**
 * Create a new complexity level
 */
export async function createComplexityLevel(
  complexity: ComplexityLevelInsert
): Promise<ComplexityLevelRow> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_levels") => {
      insert: (data: ComplexityLevelInsert) => {
        select: () => {
          single: () => Promise<{
            data: ComplexityLevelRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  })
    .from("complexity_levels")
    .insert(complexity)
    .select()
    .single();

  if (error) {
    console.error("Error creating complexity level:", error);
    throw new Error(`Failed to create complexity level: ${error.message}`);
  }

  return data as ComplexityLevelRow;
}

/**
 * Update an existing complexity level
 */
export async function updateComplexityLevel(
  id: string,
  updates: ComplexityLevelUpdate
): Promise<ComplexityLevelRow> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_levels") => {
      update: (data: ComplexityLevelUpdate) => {
        eq: (field: "id", value: string) => {
          select: () => {
            single: () => Promise<{
              data: ComplexityLevelRow | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("complexity_levels")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating complexity level:", error);
    throw new Error(`Failed to update complexity level: ${error.message}`);
  }

  return data as ComplexityLevelRow;
}

/**
 * Soft delete a complexity level (set is_active to false)
 */
export async function deleteComplexityLevel(id: string): Promise<void> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { error } = await (supabase as unknown as {
    from: (table: "complexity_levels") => {
      update: (data: { is_active: boolean; updated_at: string }) => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("complexity_levels")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error deleting complexity level:", error);
    throw new Error(`Failed to delete complexity level: ${error.message}`);
  }
}

/**
 * Set custom multiplier for a service-complexity combination
 */
export async function setServiceComplexityMultiplier(
  serviceTypeId: string,
  complexityLevelId: string,
  multiplier: number | null
): Promise<void> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const { error } = await (supabase as unknown as {
    from: (table: "service_complexities") => {
      upsert: (
        data: {
          service_type_id: string;
          complexity_level_id: string;
          override_multiplier: number | null;
        },
        options?: { onConflict: string }
      ) => Promise<{
        error: { message: string } | null;
      }>;
    };
  })
    .from("service_complexities")
    .upsert(
      {
        service_type_id: serviceTypeId,
        complexity_level_id: complexityLevelId,
        override_multiplier: multiplier,
      },
      { onConflict: "service_type_id,complexity_level_id" }
    );

  if (error) {
    console.error("Error setting service complexity multiplier:", error);
    throw new Error(
      `Failed to set service complexity multiplier: ${error.message}`
    );
  }
}

/**
 * Reorder complexity levels
 */
export async function reorderComplexityLevels(
  orders: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const supabase = createClient();

  // TODO: Remove type assertion after migration is run
  const promises = orders.map(({ id, sort_order }) =>
    (supabase as unknown as {
      from: (table: "complexity_levels") => {
        update: (data: { sort_order: number; updated_at: string }) => {
          eq: (field: "id", value: string) => Promise<{
            error: { message: string } | null;
          }>;
        };
      };
    })
      .from("complexity_levels")
      .update({ sort_order, updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result.error) {
      console.error("Error reordering complexity levels:", result.error);
      throw new Error(
        `Failed to reorder complexity levels: ${result.error.message}`
      );
    }
  }
}
