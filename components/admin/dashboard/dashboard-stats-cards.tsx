"use client";

import { TrendingUp, ArrowUpRight } from "lucide-react";
import type { StatsCardData } from "./types";

interface StatCardProps {
  data: StatsCardData;
}

function StatCard({ data }: StatCardProps) {
  const { title, value, subtitle, isPrimary = false, trend } = data;

  if (isPrimary) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-emerald-600 p-6 text-white group hover:shadow-lg hover:shadow-emerald-600/20 transition-all">
        {/* Decorative circle */}
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/5 -mr-10 -mt-10 transition-transform group-hover:scale-110" />

        <div className="relative flex justify-between items-start mb-4">
          <h3 className="font-medium text-emerald-100 text-sm">{title}</h3>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <ArrowUpRight className="h-4 w-4 text-white -rotate-45" />
          </div>
        </div>

        <div className="relative">
          <p className="text-4xl font-bold">{value}</p>
        </div>

        <div className="relative flex items-center text-xs text-emerald-100 mt-4">
          {trend && (
            <>
              <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-emerald-100 mr-2 text-[10px]">
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 group hover:border-emerald-600/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-gray-600 dark:text-gray-400 text-sm">{title}</h3>
        <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-gray-700">
          <ArrowUpRight className="h-4 w-4 text-gray-600 dark:text-gray-400 -rotate-45" />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>

      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
        {trend ? (
          <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded mr-2">
            <TrendingUp className="h-3 w-3 mr-0.5" />
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
  const statsData: StatsCardData[] = [
    {
      title: "Total Projects",
      value: 24,
      subtitle: "Increased from last month",
      isPrimary: true,
      trend: { value: 5, direction: "up" },
    },
    {
      title: "Ended Projects",
      value: 10,
      subtitle: "Increased from last month",
      trend: { value: 6, direction: "up" },
    },
    {
      title: "Running Projects",
      value: 12,
      subtitle: "Increased from last month",
      trend: { value: 2, direction: "up" },
    },
    {
      title: "Pending Projects",
      value: 2,
      subtitle: "On Discuss",
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
