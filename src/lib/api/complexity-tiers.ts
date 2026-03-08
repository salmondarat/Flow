/**
 * Complexity Tiers API Functions
 * Handles CRUD operations for complexity tiers and calculations
 */

import { createAdminClient } from "@/lib/supabase/admin";

const createClient = createAdminClient;
import type {
  ComplexityTierRow,
  ComplexityTierInsert,
  ComplexityTierUpdate,
  ComplexityTierWithPricing,
  ServiceComplexityWithTiers,
} from "@/types";

// ============================================================================
// COMPLEXITY TIERS
// ============================================================================

/**
 * Fetch all active complexity tiers ordered by sort_order
 */
export async function getComplexityTiers(
  options: { activeOnly?: boolean } = {}
): Promise<ComplexityTierRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("complexity_tiers")
    .select("*")
    .order("sort_order", { ascending: true });

  if (options.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching complexity tiers:", error);
    throw new Error(`Failed to fetch complexity tiers: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch a single complexity tier by ID
 */
export async function getComplexityTierById(
  id: string
): Promise<ComplexityTierRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complexity_tiers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching complexity tier:", error);
    throw new Error(`Failed to fetch complexity tier: ${error.message}`);
  }

  return data;
}

/**
 * Fetch the complexity tier that matches a given score
 * Returns the tier with the highest max_score that is less than or equal to the given score
 */
export async function getTierByScore(score: number): Promise<ComplexityTierRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complexity_tiers")
    .select("*")
    .eq("is_active", true)
    .lte("min_score", score)
    .order("max_score", { ascending: true, nullsFirst: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching tier by score:", error);
    throw new Error(`Failed to fetch tier by score: ${error.message}`);
  }

  return data;
}

/**
 * Create a new complexity tier
 */
export async function createComplexityTier(
  tier: ComplexityTierInsert
): Promise<ComplexityTierRow> {
  const supabase = createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_tiers") => {
      insert: (data: ComplexityTierInsert) => {
        select: () => {
          single: () => Promise<{
            data: ComplexityTierRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  })
    .from("complexity_tiers")
    .insert(tier)
    .select()
    .single();

  if (error) {
    console.error("Error creating complexity tier:", error);
    throw new Error(`Failed to create complexity tier: ${error.message}`);
  }

  return data as ComplexityTierRow;
}

/**
 * Update an existing complexity tier
 */
export async function updateComplexityTier(
  id: string,
  updates: ComplexityTierUpdate
): Promise<ComplexityTierRow> {
  const supabase = createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_tiers") => {
      update: (data: ComplexityTierUpdate) => {
        eq: (field: "id", value: string) => {
          select: () => {
            single: () => Promise<{
              data: ComplexityTierRow | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("complexity_tiers")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating complexity tier:", error);
    throw new Error(`Failed to update complexity tier: ${error.message}`);
  }

  return data as ComplexityTierRow;
}

/**
 * Soft delete a complexity tier (set is_active to false)
 */
export async function deleteComplexityTier(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await (supabase as unknown as {
    from: (table: "complexity_tiers") => {
      update: (data: { is_active: boolean; updated_at: string }) => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("complexity_tiers")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error deleting complexity tier:", error);
    throw new Error(`Failed to delete complexity tier: ${error.message}`);
  }
}

/**
 * Reorder complexity tiers
 */
export async function reorderTiers(
  orders: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const supabase = createClient();

  const promises = orders.map(({ id, sort_order }) =>
    (supabase as unknown as {
      from: (table: "complexity_tiers") => {
        update: (data: { sort_order: number; updated_at: string }) => {
          eq: (field: "id", value: string) => Promise<{
            error: { message: string } | null;
          }>;
        };
      };
    })
      .from("complexity_tiers")
      .update({ sort_order, updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result.error) {
      console.error("Error reordering complexity tiers:", result.error);
      throw new Error(`Failed to reorder complexity tiers: ${result.error.message}`);
    }
  }
}

/**
 * Fetch tier with service-specific overrides
 */
export async function getTierForService(
  serviceTypeId: string,
  tierId: string
): Promise<ServiceComplexityWithTiers> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("service_complexities")
    .select("*")
    .eq("service_type_id", serviceTypeId)
    .eq("complexity_tier_id", tierId)
    .single();

  if (error) {
    console.error("Error fetching tier for service:", error);
    throw new Error(`Failed to fetch tier for service: ${error.message}`);
  }

  if (!data) {
    return {
      service_type_id: serviceTypeId,
      complexity_level_id: null,
      complexity_tier_id: tierId,
      override_multiplier: null,
      tier_override_multiplier: null,
    };
  }

  return {
    service_type_id: (data as any).service_type_id,
    complexity_level_id: (data as any).complexity_level_id,
    complexity_tier_id: (data as any).complexity_tier_id,
    override_multiplier: (data as any).override_multiplier,
    tier_override_multiplier: (data as any).tier_override_multiplier,
  };
}

/**
 * Set tier override multiplier for a service-tier combination
 */
export async function setServiceTierMultiplier(
  serviceTypeId: string,
  tierId: string,
  multiplier: number | null
): Promise<void> {
  const supabase = createClient();

  const { error } = await (supabase as unknown as {
    from: (table: "service_complexities") => {
      upsert: (
        data: {
          service_type_id: string;
          complexity_tier_id: string;
          tier_override_multiplier: number | null;
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
        complexity_tier_id: tierId,
        tier_override_multiplier: multiplier,
      },
      { onConflict: "service_type_id,complexity_tier_id" }
    );

  if (error) {
    console.error("Error setting service tier multiplier:", error);
    throw new Error(
      `Failed to set service tier multiplier: ${error.message}`
    );
  }
}
