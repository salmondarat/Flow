"use client";

import { unstable_noStore } from "next/cache";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  BentoGrid,
  StatsCard,
  ActivityList,
  ProgressCard,
  ClientDashboardHeader,
  QuickActions,
  QuickActionLink,
  type QuickAction,
  // Unified icons
  CubeIcon,
  LightningIcon,
  ClockIcon,
  CheckIcon,
  ListIcon,
  PlusIcon,
  SupportIcon,
} from "@/components/dashboard/bento";
import type { ProgressItem, ActivityItem } from "@/components/dashboard/bento/types";
import type { OrderRow } from "@/types";

// Force dynamic rendering to prevent static generation issues with client-side handlers
export const dynamic = "force-dynamic";

interface DashboardStats {
  total: number;
  active: number;
  pending: number;
  completed: number;
}

interface RecentOrder {
  id: string;
  kit_name: string;
  kit_model: string | null;
  status: string;
  created_at: string;
  service_type: string;
  progress: number;
}

export default function ClientDashboardPage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/client/orders");

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth");
          return;
        }
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();

      const orders = result.orders || [];
      const total = orders.length;
      const active = orders.filter((o: OrderRow) =>
        ["estimated", "approved", "in_progress"].includes(o.status)
      ).length;
      const pending = orders.filter((o: OrderRow) =>
        ["draft", "estimated"].includes(o.status)
      ).length;
      const completed = orders.filter((o: OrderRow) => o.status === "completed").length;

      setStats({ total, active, pending, completed });

      const recent = orders.slice(0, 5).map((order: any) => ({
        id: order.id,
        kit_name: order.order_items?.[0]?.kit_name || "Unknown Kit",
        kit_model: order.order_items?.[0]?.kit_model || null,
        status: order.status,
        created_at: order.created_at,
        service_type: order.service_type || "full_build",
        progress: order.progress || 0,
      }));
      setRecentOrders(recent);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceLabel = (service: string): string => {
    const serviceMap: Record<string, string> = {
      full_build: "Full Build",
      repair: "Repair",
      repaint: "Repaint",
    };
    return serviceMap[service] || service;
  };

  // Transform orders to activity items
  const activityItems: ActivityItem[] = recentOrders.map((order) => ({
    id: order.id,
    title: order.kit_name,
    description: getServiceLabel(order.service_type),
    timestamp: new Date(order.created_at),
    status: order.status,
    type: "order" as const,
  }));

  // Transform orders to progress items (only in_progress)
  const progressItems: ProgressItem[] = recentOrders
    .filter((o) => o.status === "in_progress")
    .map((order) => ({
      id: order.id,
      title: order.kit_name,
      subtitle: getServiceLabel(order.service_type),
      progress: order.progress,
      status: order.status,
      href: `/client/orders/${order.id}`,
    }));

  // Quick actions
  const quickActions: QuickAction[] = [
    {
      id: "new-order",
      label: "Create New Order",
      onClick: () => router.push("/client/orders/new"),
      variant: "primary",
      icon: <PlusIcon />,
    },
    {
      id: "view-orders",
      label: "View All Orders",
      onClick: () => router.push("/client/orders"),
      variant: "secondary",
      icon: <ListIcon />,
    },
  ];

  const headerActions = [
    {
      href: "/client/orders",
      label: "View All Orders",
      variant: "secondary" as const,
      icon: <ListIcon />,
    },
    {
      href: "/client/orders/new",
      label: "New Order",
      variant: "primary" as const,
      icon: <PlusIcon />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-brand-500 size-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ClientDashboardHeader actions={headerActions} />

      {/* Stats Grid - 12-column Bento Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatsCard title="Total Orders" value={stats.total} icon={<CubeIcon />} accent="blue" />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatsCard
            title="Active Builds"
            value={stats.active}
            icon={<LightningIcon />}
            trend={{ value: "+5%", direction: "up" }}
            accent="brand"
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatsCard
            title="Pending Action"
            value={stats.pending}
            icon={<ClockIcon />}
            trend={{ value: "Action Needed", direction: "neutral" }}
            accent="orange"
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={<CheckIcon />}
            trend={{ value: "+3", direction: "up" }}
            accent="green"
          />
        </div>
      </div>

      {/* Bento Grid Layout - Reordered for perfect fit */}
      <BentoGrid>
        {/* Recent Orders - Large (9 cols) */}
        <ActivityList title="Recent Orders" items={activityItems} size="lg" maxItems={6} />

        {/* Quick Actions - Small (3 cols) - pairs with lg to fill 12 */}
        <QuickActions title="Quick Actions" actions={quickActions} size="sm" />

        {/* Active Projects - Medium (6 cols) */}
        {progressItems.length > 0 && (
          <ProgressCard title="Active Projects" items={progressItems} size="md" accent="brand" />
        )}

        {/* Support Card - Medium (6 cols) - pairs with md to fill 12 */}
        <div className="col-span-12 rounded-2xl border border-gray-100 bg-white p-5 md:col-span-6 md:p-6 lg:col-span-6 xl:col-span-6 dark:border-gray-800 dark:bg-gray-900/80">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-900 uppercase dark:text-white">
            Need Help?
          </h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Contact our support team for assistance with your orders.
          </p>
          <Link
            href="/client/messages"
            className="hover:border-brand-200 dark:hover:border-brand-900 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <SupportIcon />
            Contact Support
          </Link>
        </div>
      </BentoGrid>
    </div>
  );
}
