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

export function TaskListView({
  tasks,
  onSort,
  sortField,
  sortDirection,
}: TaskListViewProps) {
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
                {sortField === "title" && (
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                )}
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
                {sortField === "status" && (
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                )}
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
                {sortField === "priority" && (
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                )}
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
              <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                      <div className="line-clamp-1 text-sm text-muted-foreground">
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
                    <span className="text-sm">
                      {task.dueDate.toLocaleDateString()}
                    </span>
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
                    <span className="text-sm text-muted-foreground">
                      {task.progress}%
                    </span>
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
