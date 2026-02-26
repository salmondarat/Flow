"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { KanbanColumn as KanbanColumnType, KanbanColumnId } from "./types";
import { TaskCard } from "./task-card";
import { Plus, Sparkles } from "lucide-react";

export interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onAddTask?: (columnId: KanbanColumnId) => void;
  onTaskClick?: (taskId: string, orderId: string) => void;
  className?: string;
}

export function KanbanBoard({ 
  columns, 
  onTaskMove, 
  onAddTask,
  onTaskClick,
  className 
}: KanbanBoardProps) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<KanbanColumnId | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string, fromColumnId: string) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("fromColumnId", fromColumnId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingTaskId(null);
    setDragOverColumnId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: KanbanColumnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumnId(columnId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;
    if (!currentTarget.contains(relatedTarget)) {
      setDragOverColumnId(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toColumnId: KanbanColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const fromColumnId = e.dataTransfer.getData("fromColumnId");
    
    if (taskId && fromColumnId && fromColumnId !== toColumnId && onTaskMove) {
      onTaskMove(taskId, fromColumnId, toColumnId);
    }
    
    setDraggingTaskId(null);
    setDragOverColumnId(null);
  }, [onTaskMove]);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column, columnIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: dragOverColumnId === column.id ? 1.02 : 1,
            }}
            transition={{ 
              delay: columnIndex * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15,
              scale: { type: "spring", stiffness: 300, damping: 20 }
            }}
            data-column-id={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={cn(
              "min-w-72 flex shrink-0 flex-col gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/80 backdrop-blur-sm border-2 transition-all duration-300",
              dragOverColumnId === column.id 
                ? "border-primary/50 shadow-lg shadow-primary/10" 
                : "border-transparent"
            )}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <motion.span 
                  className="flex h-5 items-center justify-center rounded-full bg-gray-200 px-2 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  key={column.tasks.length}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {column.tasks.length}
                </motion.span>
              </div>
              <motion.button 
                onClick={() => onAddTask?.(column.id)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors"
                title="Add new task"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>

            <motion.div 
              className="flex min-h-[100px] flex-col gap-3 rounded-xl transition-colors duration-200"
              animate={{
                backgroundColor: dragOverColumnId === column.id && column.tasks.length === 0 
                  ? "rgba(99, 102, 241, 0.08)" 
                  : "rgba(0, 0, 0, 0)"
              }}
            >
              <AnimatePresence mode="popLayout">
                {column.tasks.length === 0 ? (
                  <motion.div 
                    className="flex min-h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="text-center"
                      animate={dragOverColumnId === column.id ? { 
                        scale: [1, 1.05, 1],
                      } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Sparkles className="h-5 w-5 mx-auto mb-1 text-gray-300 dark:text-gray-600" />
                      <p className="text-xs text-gray-400">
                        {dragOverColumnId === column.id ? "Drop here ✨" : "No tasks"}
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  column.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      layout
                      layoutId={task.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        y: 0,
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ 
                        layout: { type: "spring", stiffness: 300, damping: 25 },
                        opacity: { duration: 0.15 },
                        scale: { type: "spring", stiffness: 300, damping: 25 },
                        y: { type: "spring", stiffness: 300, damping: 25 },
                        delay: taskIndex * 0.03
                      }}
                      style={{
                        opacity: draggingTaskId === task.id ? 0.4 : 1,
                      }}
                    >
                      <TaskCard
                        task={task}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onTaskClick?.(task.id, task.orderId)}
                        isDragging={draggingTaskId === task.id}
                        isDropTarget={dragOverColumnId === column.id && draggingTaskId !== null}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
