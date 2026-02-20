"use client";

import { cn } from "@/lib/utils";
import type { CalendarEvent } from "./types";

export interface CalendarEventProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

const colorClasses: Record<CalendarEvent["color"], string> = {
  "overdue": "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
  "due-today": "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
  "upcoming": "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  "completed": "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  "created": "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
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
