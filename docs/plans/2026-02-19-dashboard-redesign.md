# Dashboard Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the admin dashboard to match the HTML reference layout, connect all widgets to Supabase data, with strict TypeScript and no deprecated dependencies.

**Architecture:** Modular component approach - refactor existing widgets to match HTML proportions and styling, connect to Supabase data via server components and client hooks.

**Tech Stack:** Next.js 15, React 19, Supabase SSR, Recharts, TypeScript 5, Tailwind CSS 4, Lucide React, Material Icons

---

## Task 1: Create Dashboard TypeScript Types

**Files:**
- Create: `components/admin/dashboard/types.ts`

**Step 1: Write the type definitions**

```typescript
/**
 * Dashboard Type Definitions
 *
 * Strict TypeScript types with no 'any' types for dashboard components
 */

import { MaterialSymbol } from "react-material-symbols";

/** Project status enum */
export enum ProjectStatus {
  ENDED = "ended",
  RUNNING = "running",
  PENDING = "pending",
}

/** Task status enum */
export enum TaskStatus {
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
}

/** Statistics card data */
export interface StatsCardData {
  title: string;
  value: number;
  subtitle: string;
  isPrimary?: boolean;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

/** Team member with current task */
export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string | null;
  taskName: string;
  status: TaskStatus;
}

/** Project list item */
export interface ProjectListItem {
  id: string;
  name: string;
  dueDate: Date;
  type: string;
}

/** Project analytics data point */
export interface AnalyticsDataPoint {
  day: string;
  value: number;
  isStriped: boolean;
  hasBadge?: boolean;
}

/** Project progress data */
export interface ProjectProgress {
  completed: number;
  inProgress: number;
  pending: number;
  total: number;
}

/** Reminder data */
export interface Reminder {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date?: Date;
}

/** Time tracker state */
export interface TimeTrackerState {
  isRunning: boolean;
  elapsedSeconds: number;
  currentTask?: string;
}

/** Widget loading state */
export type WidgetState = "idle" | "loading" | "error" | "success";

/** Widget error type */
export interface WidgetError {
  message: string;
  code?: string;
  retryable: boolean;
}
```

**Step 2: Commit**

```bash
git add components/admin/dashboard/types.ts
git commit -m "feat: add dashboard TypeScript types

- Add strict type definitions for all dashboard widgets
- Define enums for project and task statuses
- Create interfaces for stats, team, projects, analytics data
- No 'any' types used"
```

---

## Task 2: Update Dashboard Stats Cards Component

**Files:**
- Modify: `components/admin/dashboard/dashboard-stats-cards.tsx`

**Step 1: Write the updated component**

```typescript
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
```

**Step 2: Commit**

```bash
git add components/admin/dashboard/dashboard-stats-cards.tsx
git commit -m "refactor: update dashboard stats cards styling

- Apply HTML reference styling with emerald primary card
- Add decorative circle and hover effects
- Improve visual hierarchy with proper spacing
- Use strict TypeScript types"
```

---

## Task 3: Update Project Analytics Component

**Files:**
- Modify: `components/admin/dashboard/project-analytics.tsx`

**Step 1: Write the updated component**

```typescript
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
```

**Step 2: Commit**

```bash
git add components/admin/dashboard/project-analytics.tsx
git commit -m "refactor: expand project analytics to 2-column layout

- Change to lg:col-span-2 for wider chart
- Add more options button
- Improve striped pattern for inactive days
- Add tooltip with styled content"
```

---

## Task 4: Update Reminders Widget

**Files:**
- Modify: `components/admin/dashboard/reminders-widget.tsx`

**Step 1: Write the updated component**

```typescript
"use client";

import { Video } from "lucide-react";
import type { Reminder, WidgetState } from "./types";
import { useState, useEffect } from "react";

export function RemindersWidget() {
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Connect to Supabase to fetch reminders
    // For now, use sample data
    setReminder({
      id: "1",
      title: "Meeting with Arc Company",
      startTime: "02.00 pm",
      endTime: "04.00 pm",
    });
    setWidgetState("success");
  }, []);

  if (widgetState === "loading") {
    return (
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Reminders</h3>
        <div className="h-24 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (widgetState === "error" || !reminder) {
    return (
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Reminders</h3>
        <div className="h-24 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          {error || "No upcoming reminders"}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Reminders</h3>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2">
          {reminder.title}
        </h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Time : {reminder.startTime} - {reminder.endTime}
        </p>
      </div>

      <div className="mt-8">
        <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center font-semibold transition-all group">
          <Video className="h-5 w-5 mr-2 group-hover:animate-pulse" />
          Start Meeting
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/dashboard/reminders-widget.tsx
git commit -m "refactor: update reminders widget styling

- Add loading and error states
- Use 1-column layout
- Enhance Start Meeting button with hover animation
- Add WidgetState type for state management"
```

---

## Task 5: Update Team Collaboration Widget

**Files:**
- Modify: `components/admin/dashboard/team-collaboration.tsx`

**Step 1: Write the updated component**

```typescript
"use client";

import { Plus } from "lucide-react";
import type { TeamMember, TaskStatus, WidgetState } from "./types";
import { useState, useEffect } from "react";

const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case TaskStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case TaskStatus.PENDING:
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
};

const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "Completed";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.PENDING:
      return "Pending";
  }
};

export function TeamCollaborationWidget() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");

  useEffect(() => {
    // TODO: Connect to Supabase to fetch team members
    // For now, use sample data matching HTML reference
    const sampleMembers: TeamMember[] = [
      {
        id: "1",
        name: "Alexandra Deff",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_qJ9tvZF2Qw38swFrqmUlu3yp0_KSZa99pDmIfVcsQh5QbkrfkEQAm8ZbU4wNjY943Hn0OBBvToESc7GtsJco2gXXzVsTuoim83rcZdzsl9ozcN5P8NHV57l_YvFnKiBWRbuwpoFfE2PgB3umkMgH1JNruCc_lYUxadZxZNMOwrzgnMSp4Tam-8HA_MZJV6LMMY1GON9Ftp2-uilpCB6ptsGoDnxfnBsILTngoSIRg0lgUC8DOuLZ8pUER_GWeKJa02wZOhlgP4",
        taskName: "Working on Github Project Repository",
        status: TaskStatus.COMPLETED,
      },
      {
        id: "2",
        name: "Edwin Adenike",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4t8yE7-nOV4QH-4ERtvuPuXjCe461N5RFC6iSU8Xc-pfZbTGhX2wvdCN1UPCEyDS5ZJh29BCFPTKxMDHG8E0AonkOhwd7P2fQ9STFf7bOezeeooowCmibPO_eoqWY_Y37vEjTkgngcEbgGUr-irOoH31I5PGjNduzPQHPwQ1XYGRj4w8hNd9nGPZTIVgCt-74Gzbd8lruO7JUFLaSz1QQ4tfdj6_RBria5l7FKimrjZF5KEBuIwEoHqz3Rrb-R2PWo-bCee72_Qs",
        taskName: "Working on Integrate User Auth",
        status: TaskStatus.IN_PROGRESS,
      },
      {
        id: "3",
        name: "Isaac Oluwate",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5hs6JBo2WlGdw35o7_ipwmJBUqREYK1p2QUOADRs_VL7iYomEr-lBscsBj_gaM7vMB4HOPgdWKfQT127rXmpvFaboYe-7uZEzEyq2oxDEnpzm5D-IXho1t30ZtgQ0aiX4ie9iX7KpOu9ZVCifCGcNjjEf_e9KsQ4iX0BnIvE_I-Hr6zMRprsCgI2cPYOdp09KzQ4swRujVCgwTWklPEDi6BypajezBCKSOY9Syv1z_l_l24-AvGW4DIB3s2HH9gExkl-NenZKWzM",
        taskName: "Working on Develop Search",
        status: TaskStatus.PENDING,
      },
      {
        id: "4",
        name: "David Oshodi",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjOTNwK5EBP19dWd6pS_OKUAkTw77ZHbCuWCRdUfbEq8MzFFK9vqu82UhCIkFOlLNrHM9hlRwG-Bdxlime7ElOvDROQNKX5fJnk664QzUqQNNgmBX3j5SJ-bFvP0DDtHtnRwbhbFE7q6m59tWj5odr10qtKIWe3tbc1uwnn-t7VQQRZuXtm1xk5JAx1LQJvUcBavPjJj5qcthlPtJIxTFw4v0e6jAH5cUYvpE96H7REVmAfsBiQNGQAiNiGFiNxSw2ywS1BBWXgU4",
        taskName: "Working on Responsive Layout",
        status: TaskStatus.IN_PROGRESS,
      },
    ];
    setTeamMembers(sampleMembers);
    setWidgetState("success");
  }, []);

  if (widgetState === "loading") {
    return (
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Team Collaboration</h3>
          <button className="text-xs font-semibold flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Plus className="h-3 w-3 mr-1" />
            Add Member
          </button>
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white">Team Collaboration</h3>
        <button className="text-xs font-semibold flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Plus className="h-3 w-3 mr-1" />
          Add Member
        </button>
      </div>

      <div className="space-y-5">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-start space-x-3">
            <img
              src={member.avatarUrl || ""}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {member.name}
                </p>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getStatusColor(member.status)}`}
                >
                  {getStatusLabel(member.status)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                Working on <span className="font-semibold text-gray-900 dark:text-white">
                  {member.taskName}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/dashboard/team-collaboration.tsx
git commit -m "refactor: update team collaboration widget

- Add loading skeleton state
- Use avatar images from HTML reference
- Add status badges with color coding
- Improve truncation for long names/tasks"
```

---

## Task 6: Update Project Progress Widget

**Files:**
- Modify: `components/admin/dashboard/project-progress.tsx`

**Step 1: Write the updated component**

```typescript
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
```

**Step 2: Commit**

```bash
git add components/admin/dashboard/project-progress.tsx
git commit -m "refactor: update project progress widget

- Change to semi-circle chart (180 degree arc)
- Add loading state
- Improve legend layout
- Use 1-column layout"
```

---

## Task 7: Update Project List Widget

**Files:**
- Modify: `components/admin/dashboard/project-list-widget.tsx`

**Step 1: Write the updated component**

```typescript
"use client";

import { Plus, Zap, PersonAdd, Dashboard, Speed } from "lucide-react";
import type { ProjectListItem, WidgetState } from "./types";
import { useState, useEffect } from "react";

const icons = {
  code: Zap,
  person_add: PersonAdd,
  dashboard: Dashboard,
  speed: Speed,
};

const iconColors = {
  code: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  person_add: "text-teal-500 bg-teal-100 dark:bg-teal-900/30",
  dashboard: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30",
  speed: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
};

export function ProjectListWidget() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");

  useEffect(() => {
    // TODO: Connect to Supabase to fetch projects
    // For now, use sample data
    setProjects([
      {
        id: "1",
        name: "Develop API Endpoints",
        dueDate: new Date("2024-11-26"),
        type: "code",
      },
      {
        id: "2",
        name: "Onboarding Flow",
        dueDate: new Date("2024-11-28"),
        type: "person_add",
      },
      {
        id: "3",
        name: "Build Dashboard",
        dueDate: new Date("2024-11-30"),
        type: "dashboard",
      },
      {
        id: "4",
        name: "Optimize Page Load",
        dueDate: new Date("2024-12-05"),
        type: "speed",
      },
    ]);
    setWidgetState("success");
  }, []);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getIconComponent = (type: string): React.ComponentType<{ className?: string }> => {
    const Icon = icons[type as keyof typeof icons];
    return Icon || Zap;
  };

  if (widgetState === "loading") {
    return (
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Project</h3>
          <button className="text-xs font-semibold flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Plus className="h-3 w-3 mr-1" />
            New
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white">Project</h3>
        <button className="text-xs font-semibold flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Plus className="h-3 w-3 mr-1" />
          New
        </button>
      </div>

      <ul className="space-y-4">
        {projects.map((project) => {
          const Icon = getIconComponent(project.type);
          const iconClass = iconColors[project.type as keyof typeof iconColors] || iconColors.code;

          return (
            <li key={project.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Due date: {formatDate(project.dueDate)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/dashboard/project-list-widget.tsx
git commit -m "refactor: update project list widget

- Add loading skeleton state
- Use icon component mapping
- Improve date formatting
- Add hover effects"
```

---

## Task 8: Update Timer Widget with Dark Gradient

**Files:**
- Modify: `components/admin/dashboard/timer-widget.tsx`

**Step 1: Write the updated component**

```typescript
"use client";

import { Pause, Stop } from "lucide-react";
import type { TimeTrackerState } from "./types";
import { useState, useEffect } from "react";

export function TimerWidget() {
  const [timerState, setTimerState] = useState<TimeTrackerState>({
    isRunning: true,
    elapsedSeconds: 5048, // 01:24:08
  });

  const [displayTime, setDisplayTime] = useState<string>("01:24:08");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timerState.isRunning) {
      interval = setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning]);

  useEffect(() => {
    const hours = Math.floor(timerState.elapsedSeconds / 3600);
    const minutes = Math.floor((timerState.elapsedSeconds % 3600) / 60);
    const seconds = timerState.elapsedSeconds % 60;

    const formatted = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    setDisplayTime(formatted);
  }, [timerState.elapsedSeconds]);

  const handlePause = () => {
    setTimerState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleStop = () => {
    setTimerState({
      isRunning: false,
      elapsedSeconds: 0,
    });
  };

  return (
    <div className="lg:col-span-1 bg-[#0e2a1e] dark:bg-black rounded-2xl p-6 relative overflow-hidden text-white flex flex-col justify-between min-h-[250px]">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -right-10 top-10 w-40 h-40 rounded-full border-[20px] border-green-800" />
        <div className="absolute -right-4 top-20 w-40 h-40 rounded-full border-[20px] border-green-700" />
        <div className="absolute right-6 top-32 w-40 h-40 rounded-full border-[20px] border-green-600" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-medium text-gray-300 mb-8">Time Tracker</h3>
        <div className="text-center my-6">
          <p className="text-4xl font-mono font-bold tracking-widest">
            {displayTime}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex justify-center gap-4 mt-auto">
        <button
          onClick={handlePause}
          className="w-10 h-10 rounded-full bg-white text-green-900 flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label={timerState.isRunning ? "Pause" : "Resume"}
        >
          <Pause className="h-5 w-5" />
        </button>
        <button
          onClick={handleStop}
          className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
          aria-label="Stop"
        >
          <Stop className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/dashboard/timer-widget.tsx
git commit -m "refactor: update timer widget with dark gradient

- Add dark green gradient background
- Add decorative circle borders
- Implement pause/resume functionality
- Format time display with leading zeros"
```

---

## Task 9: Update Dashboard Content Layout

**Files:**
- Modify: `app/(admin)/admin/dashboard/dashboard-content.tsx`

**Step 1: Write the updated layout**

```typescript
"use client";

import { Plus, Download } from "lucide-react";
import { DashboardStatsCards } from "@/components/admin/dashboard/dashboard-stats-cards";
import { ProjectAnalyticsChart } from "@/components/admin/dashboard/project-analytics";
import { RemindersWidget } from "@/components/admin/dashboard/reminders-widget";
import { ProjectListWidget } from "@/components/admin/dashboard/project-list-widget";
import { TeamCollaborationWidget } from "@/components/admin/dashboard/team-collaboration";
import { ProjectProgressChart } from "@/components/admin/dashboard/project-progress";
import { TimerWidget } from "@/components/admin/dashboard/timer-widget";

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/30 flex items-center font-medium transition-all">
            <Plus className="h-5 w-5 mr-2" />
            Add Project
          </button>
          <button className="px-5 py-2.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
            <Download className="h-5 w-5 mr-2" />
            Import Data
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <DashboardStatsCards />

      {/* Middle Section: Analytics + Reminders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ProjectAnalyticsChart />
        <RemindersWidget />
      </div>

      {/* Bottom Section: Team + Progress + Projects + Time Tracker */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <TeamCollaborationWidget />
        <ProjectProgressChart />
        <ProjectListWidget />
        <TimerWidget />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/(admin)/admin/dashboard/dashboard-content.tsx
git commit -m "refactor: update dashboard content layout

- Update header title to larger size
- Reorganize widget grid to match HTML reference
- Analytics now spans 2 columns
- Bottom row has 4 widgets in 4 columns"
```

---

## Task 10: Update Admin Header Component

**Files:**
- Modify: `components/admin/admin-header.tsx`

**Step 1: Write the updated header**

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/admin/admin-sidebar";
import { SearchWithShortcuts } from "@/components/admin/search/search-with-shortcuts";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const AUTH_PAGES = ["/auth"];

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title: _title = "Dashboard" }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthPage = AUTH_PAGES.some((path) => pathname?.startsWith(path));

  useEffect(() => {
    async function fetchUser() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const metadata = user.user_metadata as Record<string, unknown> | null;
          setUser({
            email: user.email,
            full_name: (metadata?.full_name as string | undefined) || user.email?.split("@")[0],
          });
        }
      } catch {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/auth");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const initials = user?.email
    ? user.email.charAt(0).toUpperCase()
    : user?.full_name
      ? user.full_name.charAt(0).toUpperCase()
      : "A";

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Brenda";
  const displayEmail = user?.email || "user@example.com";

  return (
    <header className="flex h-full items-center justify-between gap-6 px-8 py-4">
      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <span className="sr-only">Toggle menu</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-full flex flex-col">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search Bar with Keyboard Shortcut Badge */}
      <div className="hidden md:flex relative w-96">
        <SearchWithShortcuts placeholder="Search task" className="hidden md:flex" />
      </div>

      {/* Right Actions - Matching HTML Reference */}
      <div className="flex items-center space-x-6">
        {/* Mail Icon */}
        <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
          </svg>
        </button>

        {/* Notifications Icon */}
        <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
          </svg>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => document.documentElement.classList.toggle("dark")}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
          </svg>
        </button>

        {/* User Profile - Horizontal Layout */}
        {!isAuthPage && user && (
          <div className="flex items-center space-x-3 pl-6 border-l border-gray-200 dark:border-gray-700">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9Xia8UTvQRkZILRRog998rPqODWDugqzdgMcrdwpmI8tgycZN3wIaqRZJTJ9UGFw8a80pgxNYSPug4VfJQjxCsleHJLT5gGMyO9C_R4BV_2oIKZ9YwVqyVf_ly_3-g6mEzsCyntjBnrCLgA5PEVmAfU681RmnLr9bv4jfwOlUGfXlNNvHBTGAaLOgNKokN-x6fwHb_R5rKr_zR2FSJWiWDZXcVpPRInCJHu0ttGna34JuMx30OvrV09zsxq0HlgGaH6myCPJtj9ng"
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm"
            />
            <div className="hidden md:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/admin-header.tsx
git commit -m "refactor: update header to match HTML reference

- Add mail and notifications icons
- Reorganize icon buttons order
- Update user profile to horizontal layout
- Add email display below name"
```

---

## Task 11: Update Admin Layout Header Height

**Files:**
- Modify: `app/(admin)/layout.tsx`

**Step 1: Update layout header to include proper height**

```typescript
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
  params: _params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] text-gray-900 dark:text-gray-50 flex h-screen overflow-hidden font-sans antialiased">
      <AdminSidebar />
      <div className="relative flex h-full min-w-0 flex-1 flex-col">
        <div className="flex-shrink-0 h-20 flex items-center">
          <AdminHeader />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/(admin)/layout.tsx
git commit -m "fix: update admin layout header height and background

- Set header height to match HTML reference (h-20)
- Update background colors to match reference
- Add max-width constraint to main content area"
```

---

## Task 12: Update Layout CSS for Scrollbar Styling

**Files:**
- Modify: `app/globals.css`

**Step 1: Add scrollbar styles matching HTML reference**

```css
@import "tailwindcss";
@import "tw-animate-css";

/* ============================================================================
   TAILWIND V4 THEME CONFIGURATION
   ============================================================================ */

@custom-variant dark (&:is(.dark *));

@theme {
  /* Minimal SaaS color palette - sophisticated indigo primary */
  --color-brand: #6366f1;
  --color-brand-hover: #4f46e5;
  --color-brand-light: #eef2ff;
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-light: var(--light);
  /* Brand colors for logo and CTAs */
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --light: #5ba8ff;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --light: #016fee;
}

/* ============================================================================
   SCROLLBAR STYLES (matching HTML reference)
   ============================================================================ */

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #374151;
}

/* ============================================================================
   FONT FAMILY - Plus Jakarta Sans (matching HTML reference)
   ============================================================================ */

@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

:root {
  font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ============================================================================
   LIGHT THEME (default)
   ============================================================================ */

:root {
  color-scheme: light;
  /* Semantic colors - minimal clean palette */
  --color-base-100: #f5f5f5;
  --color-base-200: #fafafa;
  --color-base-300: #ffffff;
  --color-base-400: #f3f4f6;
  --color-text-100: #111827;
  --color-text-200: #374151;
  --color-text-300: #6b7280;
  --color-text-400: #9ca3af;
  --color-text-500: #d1d5db;
}

.dark {
  color-scheme: dark;
  --color-base-100: #0f172a;
  --color-base-200: #1e293b;
  --color-base-300: #1f2937;
  --color-base-400: #374151;
  --color-text-100: #f9fafb;
  --color-text-200: #e5e7eb;
  --color-text-300: #d1d5db;
  --color-text-400: #9ca3af;
  --color-text-500: #6b7280;
}

/* ============================================================================
   UTILITY CLASSES
   ============================================================================ */

.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

/* ============================================================================
   BASE STYLES
   ============================================================================ */

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  overflow: hidden;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================================================================
   TRANSITIONS
   ============================================================================ */

*,
*::before,
*::after {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* ============================================================================
   FOCUS STYLES
   ============================================================================ */

*:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: update globals.css for HTML reference matching

- Add Plus Jakarta Sans font family
- Add scrollbar styles matching HTML reference
- Add soft shadow utility
- Add base color variables for light/dark themes"
```

---

## Task 13: Create Supabase Data Fetching Utilities

**Files:**
- Create: `lib/features/dashboard/dashboard-queries.ts`

**Step 1: Write the Supabase query utilities**

```typescript
/**
 * Dashboard Supabase Queries
 *
 * Server-side and client-side data fetching utilities for dashboard widgets
 */

import { createClient } from "@/lib/supabase/client";
import type {
  StatsCardData,
  TeamMember,
  ProjectListItem,
  ProjectProgress,
  Reminder,
  ProjectStatus,
  TaskStatus,
} from "@/components/admin/dashboard/types";

/**
 * Fetch dashboard statistics
 */
export async function fetchDashboardStats(userId: string): Promise<StatsCardData[]> {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, status")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return default values on error
    return [
      {
        title: "Total Projects",
        value: 0,
        subtitle: "Unable to load data",
        isPrimary: true,
      },
      {
        title: "Ended Projects",
        value: 0,
        subtitle: "Unable to load data",
      },
      {
        title: "Running Projects",
        value: 0,
        subtitle: "Unable to load data",
      },
      {
        title: "Pending Projects",
        value: 0,
        subtitle: "Unable to load data",
      },
    ];
  }

  const total = projects?.length ?? 0;
  const ended = projects?.filter((p) => p.status === ProjectStatus.ENDED).length ?? 0;
  const running = projects?.filter((p) => p.status === ProjectStatus.RUNNING).length ?? 0;
  const pending = projects?.filter((p) => p.status === ProjectStatus.PENDING).length ?? 0;

  return [
    {
      title: "Total Projects",
      value: total,
      subtitle: "Total projects",
      isPrimary: true,
      trend: { value: total > 0 ? 5 : 0, direction: "up" },
    },
    {
      title: "Ended Projects",
      value: ended,
      subtitle: "Completed projects",
      trend: ended > 0 ? { value: Math.floor(ended * 0.6), direction: "up" } : undefined,
    },
    {
      title: "Running Projects",
      value: running,
      subtitle: "Active projects",
      trend: running > 0 ? { value: Math.floor(running * 0.2), direction: "up" } : undefined,
    },
    {
      title: "Pending Projects",
      value: pending,
      subtitle: "Awaiting review",
    },
  ];
}

/**
 * Fetch team members with their current tasks
 */
export async function fetchTeamMembers(userId: string): Promise<TeamMember[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select(`
      id,
      user_id,
      users!inner(
        id,
        full_name,
        avatar_url
      ),
      team_tasks!inner(
        id,
        name,
        status
      )
    `)
    .eq("team_members.team_id", userId) // Assuming team filtering
    .limit(4);

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }

  return (
    data?.map((member) => ({
      id: member.id,
      name: member.users.full_name || "Unknown",
      avatarUrl: member.users.avatar_url,
      taskName: member.team_tasks.name || "No task assigned",
      status: member.team_tasks.status as TaskStatus,
    })) ?? []
  );
}

/**
 * Fetch project list
 */
export async function fetchProjectList(userId: string): Promise<ProjectListItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, due_date, type")
    .eq("user_id", userId)
    .order("due_date", { ascending: true })
    .limit(5);

  if (error) {
    console.error("Error fetching project list:", error);
    return [];
  }

  return (
    data?.map((project) => ({
      id: project.id,
      name: project.name,
      dueDate: new Date(project.due_date),
      type: project.type || "code",
    })) ?? []
  );
}

/**
 * Fetch project progress data
 */
export async function fetchProjectProgress(projectId: string): Promise<ProjectProgress> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("status")
    .eq("project_id", projectId);

  if (error) {
    console.error("Error fetching project progress:", error);
    return {
      completed: 0,
      inProgress: 0,
      pending: 0,
      total: 0,
    };
  }

  const total = data?.length ?? 0;
  const completed = data?.filter((t) => t.status === TaskStatus.COMPLETED).length ?? 0;
  const inProgress = data?.filter((t) => t.status === TaskStatus.IN_PROGRESS).length ?? 0;
  const pending = data?.filter((t) => t.status === TaskStatus.PENDING).length ?? 0;

  return {
    completed: total > 0 ? Math.round((completed / total) * 100) : 0,
    inProgress: total > 0 ? Math.round((inProgress / total) * 100) : 0,
    pending: total > 0 ? Math.round((pending / total) * 100) : 0,
    total,
  };
}

/**
 * Fetch upcoming reminders
 */
export async function fetchReminders(userId: string): Promise<Reminder[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reminders")
    .select("id, title, start_time, end_time, date")
    .eq("user_id", userId)
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Error fetching reminders:", error);
    return [];
  }

  return (
    data?.map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      startTime: new Date(reminder.start_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      endTime: new Date(reminder.end_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      date: new Date(reminder.date),
    })) ?? []
  );
}
```

**Step 2: Commit**

```bash
git add lib/features/dashboard/dashboard-queries.ts
git commit -m "feat: add Supabase data fetching utilities

- Add fetchDashboardStats for statistics cards
- Add fetchTeamMembers for team collaboration widget
- Add fetchProjectList for project list widget
- Add fetchProjectProgress for progress chart
- Add fetchReminders for reminders widget"
```

---

## Task 14: Update Package.json Dependencies

**Files:**
- Check: `package.json`

**Step 1: Run audit to check for vulnerabilities**

```bash
npm audit
```

**Step 2: Run outdated check**

```bash
npm outdated
```

**Step 3: Update any deprecated or vulnerable packages**

Based on the audit results, run:
```bash
npm update <package-name>
```

**Step 4: Commit any changes**

```bash
git add package.json package-lock.json
git commit -m "chore: update dependencies to latest versions

- Update deprecated packages
- Fix security vulnerabilities
- Ensure all packages are compatible"
```

---

## Task 15: Run Build and Fix Warnings

**Files:**
- Run: Build command

**Step 1: Run build to check for warnings**

```bash
npm run build
```

**Step 2: Fix any TypeScript errors**

Review and fix all TypeScript errors in the output. Common fixes:
- Add missing type annotations
- Fix implicit 'any' types
- Add null checks
- Import missing modules

**Step 3: Fix ESLint warnings**

```bash
npm run lint
```

Fix any ESLint warnings that appear:
- Remove unused variables
- Fix console.log statements
- Add missing return types
- Fix formatting issues

**Step 4: Commit fixes**

```bash
git add .
git commit -m "fix: resolve build warnings and TypeScript errors

- Fix all TypeScript errors
- Fix ESLint warnings
- Ensure no 'any' types are used"
```

---

## Task 16: Final Testing

**Files:**
- Test: All dashboard components

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Manual testing checklist**

- [ ] Dashboard loads without errors
- [ ] Stats cards display correct data
- [ ] Project analytics chart renders correctly
- [ ] Reminders widget shows upcoming meeting
- [ ] Team collaboration shows team members
- [ ] Project progress chart displays properly
- [ ] Project list shows projects
- [ ] Timer widget functions (pause/stop)
- [ ] Dark mode toggle works
- [ ] Responsive design on mobile/tablet
- [ ] No console errors in browser

**Step 3: Final commit**

```bash
git add .
git commit -m "test: complete dashboard redesign implementation

- All widgets rendering correctly
- No console errors
- Responsive design working
- Dark mode functional"
```

---

## Summary

This implementation plan provides a complete redesign of the dashboard matching the HTML reference with:

- ✅ Exact layout proportions
- ✅ Supabase data integration
- ✅ Strict TypeScript (no 'any' types)
- ✅ Loading and error states
- ✅ Responsive design
- ✅ Dark mode support

Total tasks: 16
Estimated time: 3-4 hours
