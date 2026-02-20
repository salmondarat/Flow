"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Task, TaskTag } from "./types";
import { formatDateForDisplay } from "./types";

/**
 * Task Card - Rich card displaying task information
 *
 * Shows task title, tags, due date, description, assignees, progress, comments, and links
 */
export interface TaskCardProps {
  task: Task;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  draggable?: boolean;
  onDragStart?: (taskId: string) => void;
  className?: string;
}

export function TaskCard({ task, onEdit, onDelete, draggable = false, onDragStart, className }: TaskCardProps) {
  const dueDateString = task.dueDate ? formatDateForDisplay(task.dueDate) : "";

  return (
    <Link
      href={`/admin/orders/${task.orderId}`}
      draggable={draggable}
      onDragStart={draggable && onDragStart ? (e) => {
        e.preventDefault();
        onDragStart(task.id);
      } : undefined}
      className={cn(
        "dashboard-card dashboard-hover rounded-dashboard-3xl flex cursor-pointer flex-col gap-4 border-dashboard-subtle p-5 transition-colors",
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      {/* Header with tags and menu */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {task.tags.map((tag, index) => (
            <TaskTagPill key={index} tag={tag} />
          ))}
        </div>
        <button className="text-gray-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={1} />
            <circle cx={12} cy={5} r={1} />
            <circle cx={12} cy={19} r={1} />
          </svg>
        </button>
      </div>

      {/* Task title */}
      <h3 className="text-lg font-bold text-dashboard-primary dark:text-white">
        {task.title}
      </h3>

      {/* Task description */}
      {task.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {task.description}
        </p>
      )}

      {/* Assignees */}
      <div className="flex items-center gap-2 py-2">
        {task.assignees.length > 0 ? (
          <div className="flex -space-x-1.5">
            {task.assignees.slice(0, 3).map((assignee, index) => (
              <img
                key={index}
                src={assignee}
                alt="Assignee"
                className="h-6 w-6 rounded-full border-2 border-white object-cover"
              />
            ))}
            {task.assignees.length > 3 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold text-gray-500">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-gray-400 font-bold">
            No assignees
          </span>
        )}
      </div>

      {/* Footer with stats */}
      <div className="flex items-center justify-between pt-4 border-dashboard-subtle border-t text-[10px] text-gray-400 font-bold">
        <div className="flex gap-4">
          {task.commentCount !== undefined && (
            <span className="flex items-center gap-1">
              💬 {task.commentCount}
            </span>
          )}
          {task.linkCount !== undefined && (
            <span className="flex items-center gap-1">
              🔗 {task.linkCount}
            </span>
          )}
        </div>
        {task.progress > 0 && (
          <span className="flex items-center gap-1">
            ✅ {task.progress}% complete
          </span>
        )}
      </div>
    </Link>
  );
}

/**
 * Task Tag Pill - Small badge for task tags
 */
function TaskTagPill({ tag }: { tag: TaskTag }) {
  const variantStyles: Record<TaskTag["variant"], string> = {
    urgent: "bg-badge-orange",
    due: "bg-badge-red",
    "low-priority": "bg-badge-yellow",
    pink: "bg-badge-pink",
    purple: "bg-badge-purple",
    blue: "bg-badge-blue",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
        variantStyles[tag.variant]
      )}
    >
      {tag.emoji && <span>{tag.emoji}</span>}
      {tag.label}
    </span>
  );
}
