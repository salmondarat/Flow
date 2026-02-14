import {
  BentoGrid,
  StatsCard,
  ActivityList,
  ProgressCard,
  AdminDashboardHeader,
} from "@/components/dashboard/bento";
import { DashboardContent } from "./dashboard-content";
import {
  getDashboardStats,
  getRecentActivity,
  getAttentionNeeded,
  getWorkloadOverview,
} from "@/lib/features/dashboard/queries";
import type { ActivityItem, ProgressItem } from "@/components/dashboard/bento/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, activities, attentionItems, workload] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getAttentionNeeded(),
    getWorkloadOverview(),
  ]);

  // Transform RecentActivity to ActivityItem
  const activityItems: ActivityItem[] = activities.map((activity) => ({
    id: activity.id,
    title: activity.type === "order_created"
      ? "New Order"
      : activity.type === "progress_added"
      ? "Progress Update"
      : activity.type === "change_request"
      ? "Change Request"
      : "Order Updated",
    description: activity.description,
    timestamp: activity.createdAt ? new Date(activity.createdAt) : new Date(),
    status: "new",
    type: activity.type === "order_created"
      ? "order"
      : activity.type === "progress_added"
      ? "system"
      : "alert",
  }));

  // Transform WorkloadItem to ProgressItem
  const progressItems: ProgressItem[] = workload.map((item) => ({
    id: item.orderId,
    title: item.kitName,
    subtitle: `${item.clientName} • ${item.serviceType.replace("_", " ")}`,
    progress: item.progress,
    status: item.status,
    href: `/admin/orders/${item.orderId}`,
  }));

  // Transform AttentionNeeded to ProgressItem
  const attentionProgressItems: ProgressItem[] = attentionItems.map((item) => ({
    id: item.orderId,
    title: item.description,
    subtitle: item.clientName,
    progress: 0,
    status: "draft",
    href: `/admin/orders/${item.orderId}`,
  }));

  return (
    <DashboardContent
      stats={stats}
      activityItems={activityItems}
      progressItems={progressItems}
      attentionProgressItems={attentionProgressItems}
    />
  );
}
