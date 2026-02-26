"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Task, TaskTag } from "./types";
import { formatDateForDisplay } from "./types";

export interface TaskCardProps {
  task: Task;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onClick?: () => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
  className?: string;
}

export function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  draggable = false, 
  onDragStart, 
  onDragEnd,
  onClick,
  isDragging = false,
  isDropTarget = false,
  className 
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(e, task.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
    <div
      draggable={draggable}
      onDragStart={draggable && onDragStart ? handleDragStart : undefined}
      onDragEnd={draggable && onDragEnd ? onDragEnd : undefined}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-task-id={task.id}
      className={cn(
        "relative cursor-pointer",
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.01 : 1,
          y: isHovered ? -2 : 0,
        }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
        className={cn(
          "dashboard-card rounded-2xl flex flex-col gap-3 border p-4",
          "transition-all duration-200",
          isDragging && "shadow-2xl shadow-primary/30 ring-2 ring-primary/40 border-primary/30",
          isDropTarget && !isDragging && "ring-2 ring-emerald-400/50 border-emerald-400/30",
          !isDragging && !isDropTarget && isHovered && "shadow-lg shadow-black/10 dark:shadow-black/40",
          !isDragging && !isDropTarget && !isHovered && "border-transparent"
        )}
      >
        <div className="flex items-center justify-between">
          <motion.div 
          className="flex gap-1.5 flex-wrap"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {task.tags.map((tag, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.1 }}
            >
              <TaskTagPill tag={tag} />
            </motion.div>
          ))}
        </motion.div>
        <motion.button 
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={1.5} />
            <circle cx={12} cy={5} r={1.5} />
            <circle cx={12} cy={19} r={1.5} />
          </svg>
        </motion.button>
      </div>

      <motion.h3 
        className="text-base font-bold text-dashboard-primary dark:text-white leading-tight"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {task.title}
      </motion.h3>

      {task.description && (
        <motion.p 
          className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {task.description}
        </motion.p>
      )}

      <motion.div 
        className="flex items-center gap-2 py-1"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        {task.assignees.length > 0 ? (
          <div className="flex -space-x-2">
            {task.assignees.slice(0, 3).map((assignee, index) => (
              <motion.img
                key={index}
                src={assignee}
                alt="Assignee"
                className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                initial={{ opacity: 0, x: -10, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.3, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.2, zIndex: 10, x: 0 }}
              />
            ))}
            {task.assignees.length > 3 && (
              <motion.div 
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-primary to-purple-500 text-[10px] font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
              >
                +{task.assignees.length - 3}
              </motion.div>
            )}
          </div>
        ) : (
          <motion.span 
            className="text-[10px] text-gray-400 font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Unassigned
          </motion.span>
        )}
      </motion.div>

      <motion.div 
        className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-medium gap-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex gap-3">
          {task.commentCount !== undefined && (
            <motion.span 
              className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <span>💬</span>
              <span>{task.commentCount}</span>
            </motion.span>
          )}
          {task.linkCount !== undefined && (
            <motion.span 
              className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <span>🔗</span>
              <span>{task.linkCount}</span>
            </motion.span>
          )}
        </div>
        {task.progress > 0 && (
          <motion.div 
            className="flex items-center gap-1.5"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-green-600 dark:text-green-400">{task.progress}%</span>
          </motion.div>
        )}
      </motion.div>
      </motion.div>
    </div>
  );
}

function TaskTagPill({ tag }: { tag: TaskTag }) {
  const variantStyles: Record<TaskTag["variant"], string> = {
    urgent: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 dark:from-orange-900/30 dark:to-red-900/30 dark:text-orange-300",
    due: "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300",
    "low-priority": "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-300",
    pink: "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 dark:from-pink-900/30 dark:to-rose-900/30 dark:text-pink-300",
    purple: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 dark:from-purple-900/30 dark:to-violet-900/30 dark:text-purple-300",
    blue: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300",
    gray: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300",
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
        variantStyles[tag.variant]
      )}
      whileHover={{ scale: 1.08, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {tag.emoji && <span>{tag.emoji}</span>}
      <span>{tag.label}</span>
    </motion.span>
  );
}
