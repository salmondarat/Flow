"use client";

import { TailAdminChartCard } from "@/components/shared/dashboard/tailadmin-chart-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data - replace with real data from your API
const data = [
  { month: "Jan", revenue: 45000, sales: 38000 },
  { month: "Feb", revenue: 52000, sales: 42000 },
  { month: "Mar", revenue: 48000, sales: 45000 },
  { month: "Apr", revenue: 61000, sales: 52000 },
  { month: "May", revenue: 58000, sales: 48000 },
  { month: "Jun", revenue: 72000, sales: 61000 },
  { month: "Jul", revenue: 68000, sales: 58000 },
  { month: "Aug", revenue: 79000, sales: 67000 },
  { month: "Sep", revenue: 85000, sales: 72000 },
  { month: "Oct", revenue: 78000, sales: 65000 },
  { month: "Nov", revenue: 92000, sales: 78000 },
  { month: "Dec", revenue: 98000, sales: 85000 },
];

export function RevenueChart() {
  return (
    <TailAdminChartCard
      title="Revenue Overview"
      description="Monthly revenue and sales trends"
    >
      <ResponsiveContainer width="100%" height={355}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              new Intl.NumberFormat("id-ID", {
                notation: "compact",
                compactDisplay: "short",
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "10px",
              fontSize: "12px",
            }}
            formatter={(value: number | undefined) =>
              value !== undefined
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(value)
                : ""
            }
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="hsl(var(--chart-2))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </TailAdminChartCard>
  );
}
