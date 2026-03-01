"use client";

import { cn } from "@/lib/utils";
import type { KanbanColumn as KanbanColumnType, Task } from "./types";
import { TaskCard } from "./task-card";

/**
 * Kanban Column - Individual column for the kanban board
 *
 * Shows column header with count badge and task cards
 */
export interface KanbanColumnProps {
  column: KanbanColumnType;
  onTaskMove?: (taskId: string, toColumnId: string) => void;
  isActive?: boolean;
  onColumnClick?: (columnId: string) => void;
  className?: string;
}

export function KanbanColumn({
  column,
  onTaskMove,
  isActive = false,
  onColumnClick,
  className,
}: KanbanColumnProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Column Header */}
      <button
        onClick={() => onColumnClick?.(column.id)}
        className={cn(
          "flex items-center gap-1 border-b-2 px-1 pb-2 text-sm font-semibold transition-colors",
          isActive
            ? "border-black text-black dark:border-white dark:text-white"
            : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        )}
      >
        <span>{column.title}</span>
        <span
          className={cn(
            "flex h-5 items-center justify-center rounded-full px-1.5 text-xs font-bold",
            isActive
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          )}
        >
          {column.tasks.length}
        </span>
        <span className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          +
        </span>
      </button>

      {/* Task Cards */}
      <div className="flex flex-col gap-4">
        {column.tasks.length === 0 ? (
          <div className="rounded-dashboard-2xl border-dashboard-subtle flex min-h-25 items-center justify-center border border-dashed p-8">
            <p className="text-sm text-gray-400">No tasks yet</p>
          </div>
        ) : (
          column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
