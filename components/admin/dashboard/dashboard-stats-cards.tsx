"use client";

import { TrendingUp, ArrowUpRight, Package, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { StatsCardData } from "./types";

interface StatCardProps {
  data: StatsCardData;
}

function StatCard({ data }: StatCardProps) {
  const { title, value, subtitle, isPrimary = false, trend, icon: Icon } = data;

  if (isPrimary) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-emerald-600 p-6 text-white transition-all hover:shadow-lg hover:shadow-emerald-600/20">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/5 transition-transform group-hover:scale-110" />

        <div className="relative mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-emerald-100" />}
            <h3 className="text-sm font-medium text-emerald-100">{title}</h3>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <ArrowUpRight className="h-4 w-4 -rotate-45 text-white" />
          </div>
        </div>

        <div className="relative">
          <p className="text-4xl font-bold">{value}</p>
        </div>

        <div className="relative mt-4 flex items-center text-xs text-emerald-100">
          {trend && (
            <>
              <span className="mr-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] text-white">
                {trend.direction === "up" ? `${trend.value} ▲` : `${trend.value} ▼`}
              </span>
            </>
          )}
          <span>{subtitle}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-600/50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 group-hover:bg-gray-50 dark:border-gray-600 dark:group-hover:bg-gray-700">
          <ArrowUpRight className="h-4 w-4 -rotate-45 text-gray-600 dark:text-gray-400" />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>

      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
        {trend ? (
          <div className="mr-2 flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <TrendingUp className="mr-0.5 h-3 w-3" />
            <span className="text-[10px]">{trend.value} ▲</span>
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">-</span>
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

export function DashboardStatsCards() {
  // Sample data reflecting Gunpla Custom Build Service
  const statsData: StatsCardData[] = [
    {
      title: "Total Orders",
      value: 24,
      subtitle: "All client orders",
      isPrimary: true,
      trend: { value: 5, direction: "up" },
      icon: Package,
    },
    {
      title: "Completed Builds",
      value: 10,
      subtitle: "Ready for delivery",
      trend: { value: 6, direction: "up" },
      icon: CheckCircle,
    },
    {
      title: "In Progress",
      value: 12,
      subtitle: "Active builds",
      trend: { value: 2, direction: "up" },
      icon: Clock,
    },
    {
      title: "Pending Review",
      value: 2,
      subtitle: "Awaiting approval",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard key={`stat-${index}`} data={stat} />
      ))}
    </div>
  );
}
