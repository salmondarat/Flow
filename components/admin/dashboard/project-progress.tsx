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
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="w-full font-bold text-gray-900 dark:text-white mb-4 text-left">
          Project Progress
        </h3>
        <div className="flex flex-col items-center justify-center h-48">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col items-center">
      <h3 className="w-full font-bold text-gray-900 dark:text-white mb-4 text-left">
        Project Progress
      </h3>

      <div className="relative w-48 h-24 mt-4 mb-2 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
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
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 text-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {progress?.completed}%
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">Project Ended</p>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full mt-6 flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
          Completed
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-700 mr-1" />
          In Progress
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-gray-300 mr-1" />
          Pending
        </div>
      </div>
    </div>
  );
}
