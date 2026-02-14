import { createClient } from "@/lib/supabase/server";
import type {
  DashboardStats,
  RecentActivity,
  AttentionNeeded,
  WorkloadItem,
  OrderRow,
  OrderStatus,
} from "@/types";

type OrderBasicInfo = Pick<
  OrderRow,
  "id" | "created_at" | "client_id" | "estimated_price_cents" | "estimated_days"
>;
type OrderWithStatus = OrderBasicInfo & { status: OrderStatus };
type OrderWithBasicItems = OrderWithStatus & {
  order_items?: Array<{
    kit_name: string;
    service_type: string;
  }>;
};
type ProgressLogBasicInfo = {
  id: string;
  order_id: string;
  created_at: string;
};

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get total orders count
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Get in-progress orders count
  const { count: inProgressOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress");

  // Get completed orders count
  const { count: completedOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  // Get total estimated revenue
  const { data: orders } = await supabase
    .from("orders")
    .select("estimated_price_cents")
    .in("status", ["approved", "in_progress", "completed"])
    .returns<Array<{ estimated_price_cents: number }>>();

  const estimatedRevenue =
    orders?.reduce((sum, order) => sum + order.estimated_price_cents, 0) || 0;

  return {
    totalOrders: totalOrders || 0,
    inProgressOrders: inProgressOrders || 0,
    completedOrders: completedOrders || 0,
    estimatedRevenue,
  };
}

/**
 * Get recent activity (last 10 items)
 */
export async function getRecentActivity(): Promise<RecentActivity[]> {
  const supabase = await createClient();

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<OrderBasicInfo[]>();

  // Get recent progress logs
  const { data: recentLogs } = await supabase
    .from("progress_logs")
    .select("id, order_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<ProgressLogBasicInfo[]>();

  const activities: RecentActivity[] = [];

  // Add order activities
  recentOrders?.forEach((order) => {
    activities.push({
      id: `order-${order.id}`,
      type: "order_created",
      description: "New order created",
      relatedId: order.id,
      createdAt: order.created_at,
    });
  });

  // Add progress log activities
  recentLogs?.forEach((log) => {
    activities.push({
      id: `log-${log.id}`,
      type: "progress_added",
      description: "Progress update added",
      relatedId: log.order_id,
      createdAt: log.created_at,
    });
  });

  // Sort by date and return top 10
  return activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
}

/**
 * Get items needing attention
 */
export async function getAttentionNeeded(): Promise<AttentionNeeded[]> {
  const supabase = await createClient();

  const items: AttentionNeeded[] = [];

  // Get new orders (draft status) with client info
  const { data: newOrders } = await supabase
    .from("orders")
    .select("id, created_at, client_id")
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<OrderBasicInfo[]>();

  // Get client info for each order (this could be optimized with a JOIN)
  for (const order of newOrders || []) {
    items.push({
      id: `new-${order.id}`,
      type: "new_order",
      description: "New order awaiting estimation",
      orderId: order.id,
      clientName: `Client ${order.client_id.slice(0, 8)}`,
      createdAt: order.created_at,
    });
  }

  return items.slice(0, 5);
}

/**
 * Get workload overview (active orders)
 */
export async function getWorkloadOverview(): Promise<WorkloadItem[]> {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      estimated_days,
      created_at,
      client_id,
      order_items (
        kit_name,
        service_type
      )
    `
    )
    .in("status", ["approved", "in_progress"])
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<OrderWithBasicItems[]>();

  const workload: WorkloadItem[] = [];

  orders?.forEach((order) => {
    const firstItem = order.order_items?.[0];
    if (firstItem) {
      const createdDate = new Date(order.created_at);
      const estimatedCompletion = new Date(createdDate);
      estimatedCompletion.setDate(estimatedCompletion.getDate() + order.estimated_days);

      workload.push({
        orderId: order.id,
        clientName: `Client ${order.client_id.slice(0, 8)}`,
        kitName: firstItem.kit_name,
        serviceType: firstItem.service_type as "full_build" | "repair" | "repaint",
        status: order.status,
        estimatedCompletion: estimatedCompletion.toISOString(),
        progress: order.status === "in_progress" ? 50 : 0,
      });
    }
  });

  return workload;
}
