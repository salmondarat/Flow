"use client";

import { cn } from "@/lib/utils";
import type { KanbanColumn as KanbanColumnType } from "./types";
import { TaskCard } from "./task-card";

/**
 * Kanban Board - Traditional horizontal kanban layout
 *
 * Displays all columns side-by-side with task cards
 */
export interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  className?: string;
}

export function KanbanBoard({ columns, onTaskMove, className }: KanbanBoardProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Horizontal Column Layout */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="min-w-72 flex shrink-0 flex-col gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="flex h-5 items-center justify-center rounded-full bg-gray-200 px-2 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {column.tasks.length}
                </span>
              </div>
              <button className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-3">
              {column.tasks.length === 0 ? (
                <div className="flex min-h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-xs text-gray-400">No tasks</p>
                </div>
              ) : (
                column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    draggable
                    onDragStart={() => handleDragStart(task.id, column.id)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function handleDragStart(taskId: string, fromColumnId: string) {
    // Store drag data for drop handling
    if (onTaskMove) {
      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const toColumnId = (e.target as HTMLElement)
          .closest('[data-column-id]')
          ?.getAttribute('data-column-id');
        if (toColumnId && toColumnId !== fromColumnId) {
          onTaskMove(taskId, fromColumnId, toColumnId);
        }
        document.removeEventListener('dragover', handleDrop as any);
        document.removeEventListener('drop', handleDrop as any);
      };

      document.addEventListener('dragover', handleDrop as any);
      document.addEventListener('drop', handleDrop as any);
    }
  }
}
