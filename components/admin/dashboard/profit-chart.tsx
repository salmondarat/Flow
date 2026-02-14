"use client";

import { TailAdminChartCard } from "@/components/shared/dashboard/tailadmin-chart-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data - replace with real data from your API
const data = [
  { day: "Mon", profit: 4500000, lastWeek: 3800000 },
  { day: "Tue", profit: 6200000, lastWeek: 5100000 },
  { day: "Wed", profit: 5800000, lastWeek: 4900000 },
  { day: "Thu", profit: 7100000, lastWeek: 6500000 },
  { day: "Fri", profit: 8500000, lastWeek: 7200000 },
  { day: "Sat", profit: 5200000, lastWeek: 4300000 },
  { day: "Sun", profit: 3900000, lastWeek: 3200000 },
];

export function ProfitChart() {
  return (
    <TailAdminChartCard
      title="Profit This Week"
      description="Daily profit comparison"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="day"
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
          <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </TailAdminChartCard>
  );
}
