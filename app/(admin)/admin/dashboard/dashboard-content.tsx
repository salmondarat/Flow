"use client";

import { useRouter } from "next/navigation";
import {
  BentoGrid,
  StatsCard,
  ActivityList,
  ProgressCard,
  AdminDashboardHeader,
  QuickActions,
  type QuickAction,
  // Unified icons
  LightningIcon,
  ClockIcon,
  ChartIcon,
  CheckIcon,
  ListIcon,
  PlusIcon,
} from "@/components/dashboard/bento";
import type { DashboardStats } from "@/types";
import type { ActivityItem, ProgressItem } from "@/components/dashboard/bento/types";

interface DashboardContentProps {
  stats: DashboardStats;
  activityItems: ActivityItem[];
  progressItems: ProgressItem[];
  attentionProgressItems: ProgressItem[];
}

export function DashboardContent({
  stats,
  activityItems,
  progressItems,
  attentionProgressItems,
}: DashboardContentProps) {
  const router = useRouter();

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(cents);
  };

  const quickActions: QuickAction[] = [
    {
      id: "view-all",
      label: "View All Pending",
      onClick: () => router.push("/admin/orders?status=pending"),
      variant: "secondary",
      icon: <ListIcon />,
    },
    {
      id: "create-order",
      label: "Create Order",
      onClick: () => router.push("/admin/orders/new"),
      variant: "primary",
      icon: <PlusIcon />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminDashboardHeader
        systemStatus={{
          status: "online",
          version: "2.4.0",
        }}
      />

      {/* Stats Grid - 12-column Bento Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatsCard
            title="Active Operations"
            value={stats.inProgressOrders}
            icon={<LightningIcon />}
            trend={{ value: "+20%", direction: "up" }}
            accent="blue"
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatsCard
            title="Pending Estimations"
            value={stats.totalOrders}
            icon={<ClockIcon />}
            trend={{ value: "Urgent", direction: "up", isUrgent: true }}
            accent="orange"
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatsCard
            title="Revenue (YTD)"
            value={formatCurrency(stats.estimatedRevenue)}
            icon={<ChartIcon />}
            trend={{ value: "+15%", direction: "up" }}
            accent="green"
          />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <StatsCard
            title="Completed"
            value={stats.completedOrders}
            icon={<CheckIcon />}
            trend={{ value: "+8%", direction: "up" }}
            accent="brand"
          />
        </div>
      </div>

      {/* Bento Grid Layout - Reordered for perfect fit */}
      <BentoGrid>
        {/* Recent Activity - Large (9 cols) */}
        <ActivityList
          title="Recent Activity"
          items={activityItems}
          size="lg"
          maxItems={6}
        />

        {/* Quick Actions - Small (3 cols) - pairs with lg to fill 12 */}
        <QuickActions title="Quick Actions" actions={quickActions} size="sm" />

        {/* Attention Needed - Medium (6 cols) */}
        <ProgressCard
          title="Needs Attention"
          items={attentionProgressItems}
          size="md"
          accent="orange"
        />

        {/* Workload Progress - Medium (6 cols) - pairs with md to fill 12 */}
        <ProgressCard
          title="Workload Progress"
          items={progressItems}
          size="md"
          accent="blue"
        />
      </BentoGrid>
    </div>
  );
}
