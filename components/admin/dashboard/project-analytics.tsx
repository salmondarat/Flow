"use client";

import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import type { AnalyticsDataPoint } from "./types";

const analyticsData: AnalyticsDataPoint[] = [
  { day: "S", value: 45, isStriped: true },
  { day: "M", value: 75, isStriped: false },
  { day: "T", value: 60, isStriped: false, hasBadge: true },
  { day: "W", value: 90, isStriped: false },
  { day: "T", value: 40, isStriped: true },
  { day: "F", value: 55, isStriped: true },
  { day: "S", value: 35, isStriped: true },
];

export function ProjectAnalyticsChart() {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Project Analytics</h3>
        <button className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData} barSize={40} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
              {analyticsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isStriped ? "url(#striped)" : "#10B981"} />
              ))}
            </Bar>
            <defs>
              <pattern
                id="striped"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(45)"
              >
                <rect width="8" height="8" fill="transparent" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#D1D5DB" strokeWidth="2" />
              </pattern>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
