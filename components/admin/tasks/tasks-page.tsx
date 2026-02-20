"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
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
      "todo": "draft",
      "in-progress": "in_progress",
      "under-review": "cancelled",
      "completed": "completed",
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
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
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
