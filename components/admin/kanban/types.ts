/**
 * Kanban Board Type Definitions
 *
 * Type-safe Kanban system for the dashboard
 */

import type { OrderStatus, ServiceType, Complexity } from "@/types";

/** Kanban column identifiers */
export type KanbanColumnId = "todo" | "in-progress" | "under-review" | "completed";

/** Task tag for displaying task information */
export interface TaskTag {
  label: string;
  variant: "urgent" | "due" | "low-priority" | "pink" | "purple" | "blue" | "gray";
  emoji?: string;
}

/** Task interface for kanban cards */
export interface Task {
  id: string;
  orderId: string;
  title: string;
  description?: string;
  tags: TaskTag[];
  dueDate: Date | null;
  assignees: string[];
  progress: number; // 0-100
  priority: "low" | "medium" | "high";
  status: OrderStatus;
  commentCount?: number;
  linkCount?: number;
}

/** Kanban column interface */
export interface KanbanColumn {
  id: KanbanColumnId;
  title: string;
  tasks: Task[];
}

/** Complexity to priority mapping */
export function complexityToPriority(complexity: Complexity): Task["priority"] {
  const priorityMap: Record<Complexity, Task["priority"]> = {
    low: "low",
    medium: "medium",
    high: "high",
  };
  return priorityMap[complexity] || "medium";
}

/** Order status to kanban column mapping */
export function orderStatusToColumn(status: OrderStatus): KanbanColumnId {
  const statusMap: Record<OrderStatus, KanbanColumnId> = {
    draft: "todo",
    estimated: "todo",
    approved: "in-progress",
    in_progress: "in-progress",
    completed: "completed",
    cancelled: "under-review",
  };
  return statusMap[status] || "todo";
}

/** Calculate due date from created date and estimated days */
export function calculateDueDate(createdAt: string, estimatedDays: number): Date {
  const created = new Date(createdAt);
  const dueDate = new Date(created);
  dueDate.setDate(dueDate.getDate() + estimatedDays);
  return dueDate;
}

/** Format date for display */
export function formatDateForDisplay(date: Date | null): string {
  if (!date) return "";
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";

  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `Due ${month} ${day}`;
}
