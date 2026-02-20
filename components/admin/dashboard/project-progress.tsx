"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { ProjectProgress, WidgetState } from "./types";
import { useState, useEffect } from "react";

export function ProjectProgressChart() {
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");

  useEffect(() => {
    // TODO: Connect to Supabase to fetch project progress
    // For now, use sample data
    setProgress({
      completed: 41,
      inProgress: 35,
      pending: 24,
      total: 100,
    });
    setWidgetState("success");
  }, []);

  const data = progress
    ? [
        { name: "Completed", value: progress.completed, color: "#10B981" },
        { name: "In Progress", value: progress.inProgress, color: "#059669" },
        { name: "Pending", value: progress.pending, color: "#D1D5DB" },
      ]
    : [];

  if (widgetState === "loading") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 w-full text-left font-bold text-gray-900 dark:text-white">
          Build Progress
        </h3>
        <div className="flex h-48 flex-col items-center justify-center">
          <div className="h-32 w-32 animate-pulse rounded-full border-8 border-gray-200 dark:border-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 w-full text-left font-bold text-gray-900 dark:text-white">
        Build Progress
      </h3>

      <div className="relative mt-4 mb-2 h-24 w-48 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={50}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 transform text-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {progress?.completed}%
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">Project Ended</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex w-full justify-between text-[10px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="mr-1 h-2 w-2 rounded-full bg-emerald-500" />
          Completed
        </div>
        <div className="flex items-center">
          <span className="mr-1 h-2 w-2 rounded-full bg-emerald-700" />
          In Progress
        </div>
        <div className="flex items-center">
          <span className="mr-1 h-2 w-2 rounded-full bg-gray-300" />
          Pending
        </div>
      </div>
    </div>
  );
}
