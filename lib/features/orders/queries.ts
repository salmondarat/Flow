import { createClient } from "@/lib/supabase/server";
import type { OrderWithItems, OrderStatus } from "@/types";

export interface OrdersFilter {
  status?: OrderStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Get orders with optional filters
 */
export async function getOrders(filter: OrdersFilter = {}) {
  const supabase = await createClient();
  const { status, search, page = 1, pageSize = 20 } = filter;

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*),
      client:profiles!orders_client_id_fkey (id)
    `
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  // For search, we'd need to use a full-text search or like query
  // This is a simplified version
  if (search) {
    query = query.ilike("id", `%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], total: 0 };
  }

  return {
    orders: (data || []) as OrderWithItems[],
    total: count || 0,
  };
}

/**
 * Get order by ID with all related data
 */
export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*),
      client:profiles!orders_client_id_fkey (id),
      change_requests (*),
      progress_logs (*)
    `
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data as OrderWithItems;
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();

  const { error } = await (
    supabase.from("orders") as unknown as {
      update: (data: { status: OrderStatus }) => {
        eq: (field: string, value: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get order by ID for public tracking (read-only, no auth required)
 * Returns public-safe data excluding sensitive admin fields
 */
export async function getOrderByIdForPublic(orderId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      estimated_price_cents,
      estimated_days,
      final_price_cents,
      final_days,
      notes,
      created_at,
      updated_at,
      order_items (
        id,
        kit_name,
        kit_model,
        service_type,
        complexity,
        notes
      ),
      progress_logs (
        id,
        message,
        photo_url,
        created_at
      ),
      change_requests (
        id,
        description,
        price_impact_cents,
        days_impact,
        status,
        created_at
      ),
      client:profiles!orders_client_id_fkey (
        full_name
      )
    `
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order for public:", error);
    return null;
  }

  return data as {
    id: string;
    status: string;
    estimated_price_cents: number;
    estimated_days: number;
    final_price_cents: number | null;
    final_days: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    order_items: Array<{
      id: string;
      kit_name: string;
      kit_model: string | null;
      service_type: string;
      complexity: string;
      notes: string | null;
    }>;
    progress_logs: Array<{
      id: string;
      message: string;
      photo_url: string | null;
      created_at: string;
    }>;
    change_requests: Array<{
      id: string;
      description: string;
      price_impact_cents: number;
      days_impact: number;
      status: string;
      created_at: string;
    }>;
    client: {
      full_name: string | null;
    } | null;
  } | null;
}
