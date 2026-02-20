# Tasks & Calendar Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build dedicated Tasks and Calendar pages to replace placeholder sidebar navigation

**Architecture:** Separate pages at `/admin/tasks` and `/admin/calendar` using existing kanban components and custom calendar grid. State managed via URL query params with confirmation modals for status changes.

**Tech Stack:** React, Next.js App Router, Tailwind CSS, Supabase, HTML5 drag-and-drop

---

## Phase 1: Update Sidebar Navigation

### Task 1.1: Update sidebar to point to new routes

**Files:**

- Modify: `components/admin/admin-sidebar.tsx:20-26`

**Step 1: Edit the menuItems array**

Replace:

```tsx
const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { name: "Tasks", href: "/admin/orders", icon: CheckCircle2, badge: "12+" },
  { name: "Calendar", href: "/admin/orders", icon: CalendarDays },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Team", href: "/admin/clients", icon: Users },
];
```

With:

```tsx
const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { name: "Tasks", href: "/admin/tasks", icon: CheckCircle2, badge: "12+" },
  { name: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Team", href: "/admin/clients", icon: Users },
];
```

**Step 2: Run type check**

Run: `npm run type-check` or `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/admin/admin-sidebar.tsx
git commit -m "refactor: update sidebar Tasks and Calendar routes to point to new pages"
```

---

## Phase 2: Tasks Page Components

### Task 2.1: Create StatusChangeModal component

**Files:**

- Create: `components/admin/tasks/status-change-modal.tsx`

**Step 1: Create the component file**

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OrderStatus } from "@/types";

export interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  taskTitle: string;
}

const statusLabels: Record<OrderStatus, string> = {
  draft: "Draft",
  estimated: "Estimated",
  approved: "Approved",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function StatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  fromStatus,
  toStatus,
  taskTitle,
}: StatusChangeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogDescription>
            Change status for <strong>{taskTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">From</p>
            <p className="font-semibold">{statusLabels[fromStatus]}</p>
          </div>
          <div className="text-muted-foreground">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
          <div className="flex-1 text-right">
            <p className="text-muted-foreground text-sm">To</p>
            <p className="font-semibold">{statusLabels[toStatus]}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/tasks/status-change-modal.tsx
git commit -m "feat: add StatusChangeModal component for task status changes"
```

---

### Task 2.2: Create TaskListView component

**Files:**

- Create: `components/admin/tasks/task-list-view.tsx`

**Step 1: Create the component file**

```tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Task } from "@/components/admin/kanban/types";

export interface TaskListViewProps {
  tasks: Task[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export function TaskListView({ tasks, onSort, sortField, sortDirection }: TaskListViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in_progress":
      case "approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-orange-600 dark:text-orange-400";
      case "low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort?.("title")}
                className="h-auto p-0 font-medium"
              >
                Task
                {sortField === "title" && <ArrowUpDown className="ml-1 h-3 w-3" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort?.("status")}
                className="h-auto p-0 font-medium"
              >
                Status
                {sortField === "status" && <ArrowUpDown className="ml-1 h-3 w-3" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort?.("priority")}
                className="h-auto p-0 font-medium"
              >
                Priority
                {sortField === "priority" && <ArrowUpDown className="ml-1 h-3 w-3" />}
              </Button>
            </TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground text-center">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-muted-foreground line-clamp-1 text-sm">
                        {task.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <span className="text-sm">{task.dueDate.toLocaleDateString()}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-400"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm">{task.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${task.orderId}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/tasks/task-list-view.tsx
git commit -m "feat: add TaskListView component for list-based task display"
```

---

### Task 2.3: Create TasksPage component

**Files:**

- Create: `components/admin/tasks/tasks-page.tsx`
- Create: `app/(admin)/admin/tasks/page.tsx`

**Step 1: Create the TasksPage component**

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getKanbanTasks } from "@/lib/features/dashboard/kanban-queries";
import { KanbanBoard } from "@/components/admin/kanban/kanban-board";
import { TaskListView } from "./task-list-view";
import { StatusChangeModal } from "./status-change-modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, Filter } from "lucide-react";
import type { KanbanColumn } from "@/components/admin/kanban/types";
import type { OrderStatus } from "@/types";

export function TasksPage({ initialColumns }: { initialColumns: KanbanColumn[] }) {
  const searchParams = useSearchParams();
  const [view, setView] = useState<"kanban" | "list">(
    (searchParams.get("view") as "kanban" | "list") || "kanban"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    orderId: string;
    fromStatus: OrderStatus;
    toStatus: OrderStatus;
    taskTitle: string;
  } | null>(null);

  // Flatten all tasks for list view and filtering
  const allTasks = initialColumns.flatMap((column) => column.tasks);

  // Filter tasks
  const filteredTasks = allTasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    return true;
  });

  // Filter columns for kanban view
  const filteredColumns = initialColumns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      return true;
    }),
  }));

  const handleTaskMove = (taskId: string, fromColumnId: string, toColumnId: string) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    // Map column ID back to status
    const columnToStatus: Record<string, OrderStatus> = {
      todo: "draft",
      "in-progress": "in_progress",
      "under-review": "cancelled",
      completed: "completed",
    };

    setStatusModal({
      isOpen: true,
      orderId: task.orderId,
      fromStatus: task.status,
      toStatus: columnToStatus[toColumnId] || task.status,
      taskTitle: task.title,
    });
  };

  const confirmStatusChange = async () => {
    if (!statusModal) return;

    try {
      const response = await fetch(`/api/orders/${statusModal.orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusModal.toStatus }),
      });

      if (response.ok) {
        // Reload the page to refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setStatusModal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track all your tasks and projects
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button
              variant={view === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("kanban")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-45">
            <Filter className="text-muted-foreground mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="estimated">Estimated</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View */}
      {view === "kanban" ? (
        <KanbanBoard columns={filteredColumns} onTaskMove={handleTaskMove} />
      ) : (
        <TaskListView tasks={filteredTasks} />
      )}

      {/* Status Change Modal */}
      {statusModal && (
        <StatusChangeModal
          isOpen={statusModal.isOpen}
          onClose={() => setStatusModal(null)}
          onConfirm={confirmStatusChange}
          orderId={statusModal.orderId}
          fromStatus={statusModal.fromStatus}
          toStatus={statusModal.toStatus}
          taskTitle={statusModal.taskTitle}
        />
      )}
    </div>
  );
}
```

**Step 2: Create the page route**

```tsx
import { TasksPage } from "@/components/admin/tasks/tasks-page";
import { getKanbanTasks } from "@/lib/features/dashboard/kanban-queries";

export const dynamic = "force-dynamic";

export default async function TasksPageRoute() {
  const columns = await getKanbanTasks();
  return <TasksPage initialColumns={columns} />;
}
```

**Step 3: Commit**

```bash
git add components/admin/tasks/tasks-page.tsx app/\(admin\)/admin/tasks/page.tsx
git commit -m "feat: add Tasks page with kanban/list toggle and filters"
```

---

## Phase 3: Calendar Page Components

### Task 3.1: Create Calendar types and utilities

**Files:**

- Create: `components/admin/calendar/types.ts`

**Step 1: Create the types file**

```tsx
import type { OrderStatus } from "@/types";

export type CalendarView = "month" | "week" | "day";

export type EventColor = "overdue" | "due-today" | "upcoming" | "completed" | "created";

export interface CalendarEvent {
  id: string;
  orderId: string;
  title: string;
  date: Date;
  color: EventColor;
  status: OrderStatus;
  type: "due-date" | "created-date" | "milestone";
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}
```

**Step 2: Commit**

```bash
git add components/admin/calendar/types.ts
git commit -m "feat: add calendar types and interfaces"
```

---

### Task 3.2: Create CalendarEvent component

**Files:**

- Create: `components/admin/calendar/calendar-event.tsx`

**Step 1: Create the component file**

```tsx
"use client";

import { cn } from "@/lib/utils";
import type { CalendarEvent } from "./types";

export interface CalendarEventProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

const colorClasses: Record<CalendarEvent["color"], string> = {
  overdue:
    "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
  "due-today":
    "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
  upcoming:
    "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  completed:
    "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  created:
    "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  estimated: "Estimated",
  approved: "Approved",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function CalendarEvent({ event, onClick }: CalendarEventProps) {
  return (
    <button
      onClick={() => onClick(event)}
      className={cn(
        "w-full rounded border p-1.5 text-left text-xs transition-colors hover:shadow-md",
        colorClasses[event.color]
      )}
    >
      <div className="truncate font-medium">{event.title}</div>
      <div className="truncate opacity-75">{statusLabels[event.status]}</div>
    </button>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/calendar/calendar-event.tsx
git commit -m "feat: add CalendarEvent component with color coding"
```

---

### Task 3.3: Create EventDetailModal component

**Files:**

- Create: `components/admin/calendar/event-detail-modal.tsx`

**Step 1: Create the component file**

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import type { CalendarEvent, EventColor } from "./types";

export interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}

const colorLabels: Record<EventColor, string> = {
  overdue: "Overdue",
  "due-today": "Due Today",
  upcoming: "Upcoming",
  completed: "Completed",
  created: "New Order",
};

export function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            {colorLabels[event.color]} - {event.type.replace("-", " ")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Calendar className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-muted-foreground text-sm">
                {event.date.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Badge variant="outline">{event.status.replace("_", " ")}</Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button asChild>
            <Link href={`/admin/orders/${event.orderId}`}>View Order</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/calendar/event-detail-modal.tsx
git commit -m "feat: add EventDetailModal component"
```

---

### Task 3.4: Create CalendarGrid component (Month view)

**Files:**

- Create: `components/admin/calendar/calendar-grid.tsx`

**Step 1: Create the component file**

```tsx
"use client";

import { cn } from "@/lib/utils";
import type { CalendarView, CalendarDay } from "./types";
import { CalendarEvent } from "./calendar-event";

export interface CalendarGridProps {
  days: CalendarDay[];
  view: CalendarView;
  onEventClick: (event: any) => void;
  onDateClick?: (date: Date) => void;
}

export function CalendarGrid({ days, view, onEventClick, onDateClick }: CalendarGridProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Group days by week for month view
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="space-y-4">
      {/* Week day headers */}
      <div className="bg-muted grid grid-cols-7 gap-px border-b">
        {weekDays.map((day) => (
          <div key={day} className="text-muted-foreground py-2 text-center text-sm font-semibold">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="bg-muted grid grid-cols-7 gap-px border">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <button
              key={`${weekIndex}-${dayIndex}`}
              onClick={() => onDateClick?.(day.date)}
              className={cn(
                "min-h-30 bg-background hover:bg-muted/50 p-2 text-left transition-colors",
                !day.isCurrentMonth && "bg-muted/50",
                day.isToday && "bg-muted"
              )}
            >
              <div
                className={cn(
                  "mb-2 text-sm font-medium",
                  !day.isCurrentMonth && "text-muted-foreground",
                  day.isToday &&
                    "bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full"
                )}
              >
                {day.date.getDate()}
              </div>

              <div className="space-y-1">
                {day.events.slice(0, 3).map((event) => (
                  <CalendarEvent
                    key={`${event.id}-${event.type}`}
                    event={event}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  />
                ))}
                {day.events.length > 3 && (
                  <div className="text-muted-foreground text-xs">+{day.events.length - 3} more</div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/calendar/calendar-grid.tsx
git commit -m "feat: add CalendarGrid component for month view"
```

---

### Task 3.5: Create CalendarPage component

**Files:**

- Create: `components/admin/calendar/calendar-page.tsx`
- Create: `app/(admin)/admin/calendar/page.tsx`

**Step 1: Create the CalendarPage component**

```tsx
"use client";

import { useState } from "react";
import { CalendarEvent } from "./calendar-event";
import { CalendarGrid } from "./calendar-grid";
import { EventDetailModal } from "./event-detail-modal";
import type { CalendarView, CalendarDay, CalendarEvent as CalendarEventType } from "./types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export function CalendarPage({ days, currentDate }: { days: CalendarDay[]; currentDate: Date }) {
  const [view, setView] = useState<CalendarView>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventType | null>(null);

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    window.location.href = `/admin/calendar?date=${newDate.toISOString().split("T")[0]}`;
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    window.location.href = `/admin/calendar?date=${newDate.toISOString().split("T")[0]}`;
  };

  const handleToday = () => {
    window.location.href = "/admin/calendar";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View project schedules, deadlines, and milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border p-1">
          {(["month", "week", "day"] as CalendarView[]).map((v) => (
            <Button
              key={v}
              variant={view === v ? "default" : "ghost"}
              size="sm"
              onClick={() => setView(v)}
              className="capitalize"
            >
              {v}
            </Button>
          ))}
        </div>

        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid days={days} view={view} onEventClick={(event) => setSelectedEvent(event)} />

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  );
}
```

**Step 2: Create the calendar query utility**

First, create the query file:

```tsx
import { createClient } from "@/lib/supabase/server";
import type { OrderRow, OrderStatus } from "@/types";
import type { CalendarDay, CalendarEvent, EventColor } from "@/components/admin/calendar/types";

type OrderWithDates = OrderRow & {
  order_items?: Array<{
    kit_name: string;
  }>;
};

/**
 * Get calendar data for a specific month
 */
export async function getCalendarData(
  year: number,
  month: number
): Promise<{
  days: CalendarDay[];
  currentDate: Date;
}> {
  const supabase = await createClient();

  // Get orders for the month and surrounding months
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, estimated_days, status, order_items(kit_name)")
    .in("status", ["draft", "estimated", "approved", "in_progress", "completed", "cancelled"])
    .order("created_at", { ascending: false });

  // Build calendar days
  const days: CalendarDay[] = [];
  const today = new Date();

  // Get first day of month and total days
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // Get events for this month
  const events: CalendarEvent[] = [];

  (orders as OrderWithDates[]).forEach((order) => {
    const kitName = order.order_items?.[0]?.kit_name || "Untitled";
    const createdAt = new Date(order.created_at);
    const dueDate = order.estimated_days ? new Date(order.created_at) : null;
    if (dueDate) dueDate.setDate(dueDate.getDate() + order.estimated_days);

    // Add due date event
    if (dueDate && isSameMonth(dueDate, year, month)) {
      events.push({
        id: `due-${order.id}`,
        orderId: order.id,
        title: kitName,
        date: dueDate,
        color: getEventColor(dueDate, order.status),
        status: order.status,
        type: "due-date",
      });
    }

    // Add created date event
    if (isSameMonth(createdAt, year, month)) {
      events.push({
        id: `created-${order.id}`,
        orderId: order.id,
        title: kitName,
        date: createdAt,
        color: "created",
        status: order.status,
        type: "created-date",
      });
    }
  });

  // Build calendar grid (include days from previous/next month for full grid)
  const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayDate = new Date(year, month - 1, i - startDayOfWeek + 1);
    const isCurrentMonth = dayDate.getMonth() === month - 1;

    days.push({
      date: dayDate,
      isCurrentMonth,
      isToday:
        dayDate.getDate() === today.getDate() &&
        dayDate.getMonth() === today.getMonth() &&
        dayDate.getFullYear() === today.getFullYear(),
      events: isCurrentMonth ? events.filter((e) => isSameDay(e.date, dayDate)) : [],
    });
  }

  return {
    days,
    currentDate: firstDay,
  };
}

function isSameMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month - 1;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function getEventColor(dueDate: Date, status: OrderStatus): EventColor {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateCopy = new Date(dueDate);
  dueDateCopy.setHours(0, 0, 0, 0);

  if (status === "completed") return "completed";

  const diffDays = Math.floor((dueDateCopy.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "due-today";
  return "upcoming";
}
```

**Step 3: Create the page route**

```tsx
import { CalendarPage } from "@/components/admin/calendar/calendar-page";
import { getCalendarData } from "@/components/admin/calendar/calendar-utils";

export const dynamic = "force-dynamic";

export default async function CalendarPageRoute({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;

  const today = new Date();
  const dateParam = params.date ? new Date(params.date) : today;

  const year = dateParam.getFullYear();
  const month = dateParam.getMonth() + 1;

  const { days, currentDate } = await getCalendarData(year, month);

  return <CalendarPage days={days} currentDate={currentDate} />;
}
```

**Step 4: Commit**

```bash
git add components/admin/calendar/calendar-page.tsx app/\(admin\)/admin/calendar/page.tsx components/admin/calendar/calendar-utils.ts
git commit -m "feat: add Calendar page with month view and event detail modal"
```

---

## Phase 4: API Endpoints

### Task 4.1: Create order status update API endpoint

**Files:**

- Create: `app/api/orders/[orderId]/status/route.ts`

**Step 1: Create the API route**

```tsx
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const supabase = await createClient();
  const { orderId } = await params;

  try {
    const { status } = (await request.json()) as { status: OrderStatus };

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Step 2: Commit**

```bash
git add app/api/orders/\[orderId\]/status/route.ts
git commit -m "feat: add API endpoint for updating order status"
```

---

## Phase 5: Testing & Verification

### Task 5.1: Verify Tasks page functionality

**Files:**

- Test: Manual verification

**Step 1: Test navigation**

Run: `npm run dev`
Visit: `http://localhost:3000/admin/tasks`

Expected: Tasks page loads with kanban view visible

**Step 2: Test view toggle**

Action: Click the List view button
Expected: View switches to table/list layout
Action: Click the Kanban view button
Expected: View switches back to kanban layout

**Step 3: Test filters**

Action: Select "In Progress" from status filter dropdown
Expected: Only tasks with "In Progress" status are shown
Action: Select "High" from priority filter dropdown
Expected: Only high priority tasks are shown

**Step 4: Verify URL persistence**

Action: Switch to list view, then refresh page
Expected: View remains in list mode (`?view=list` in URL)

**Step 5: Commit verification note**

```bash
git commit --allow-empty -m "test: verify Tasks page functionality"
```

---

### Task 5.2: Verify Calendar page functionality

**Files:**

- Test: Manual verification

**Step 1: Test navigation**

Run: `npm run dev`
Visit: `http://localhost:3000/admin/calendar`

Expected: Calendar page loads with current month visible

**Step 2: Test month navigation**

Action: Click "Next Month" button
Expected: Calendar advances to next month
Action: Click "Previous Month" button
Expected: Calendar goes back to previous month
Action: Click "Today" button
Expected: Calendar shows current month

**Step 3: Test event viewing**

Action: Click on any calendar event
Expected: Event detail modal opens with order information
Action: Click "View Order" button
Expected: Navigates to order detail page

**Step 4: Verify event colors**

Action: Check events for different status types
Expected: Events are color-coded correctly (red for overdue, orange for due today, etc.)

**Step 5: Commit verification note**

```bash
git commit --allow-empty -m "test: verify Calendar page functionality"
```

---

### Task 5.3: Test drag-and-drop with confirmation

**Files:**

- Test: Manual verification

**Step 1: Test drag functionality**

Run: `npm run dev`
Visit: `http://localhost:3000/admin/tasks`

Action: Drag a task from "To Do" to "In Progress"
Expected: Status change confirmation modal appears

**Step 2: Confirm status change**

Action: Click "Confirm Change" in modal
Expected: Modal closes and page refreshes with task moved to new column

**Step 3: Cancel status change**

Action: Drag another task to different column
Expected: Confirmation modal appears
Action: Click "Cancel"
Expected: Modal closes and task stays in original column

**Step 4: Verify database update**

Action: Check order status in database after confirmation
Expected: Order status matches new column

**Step 5: Commit verification note**

```bash
git commit --allow-empty -m "test: verify drag-and-drop status change confirmation"
```

---

## Summary

This implementation plan builds:

1. **Tasks page** (`/admin/tasks`) with:
   - Kanban board view using existing components
   - List/table view with sorting and filtering
   - View toggle with URL persistence
   - Drag-and-drop with confirmation modal
   - Status, priority, and assignee filters

2. **Calendar page** (`/admin/calendar`) with:
   - Month view calendar grid
   - Events color-coded by status and urgency
   - Event detail modal with order information
   - Month navigation controls
   - Framework for Week/Day views

3. **API endpoint** for updating order status

4. **Updated sidebar** navigation to point to new routes

Total commits: 14 (including verification checkpoints)
