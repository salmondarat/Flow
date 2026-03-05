import { createClient } from "@/lib/supabase/server";
import type {
  OrderRow,
  OrderStatus,
  ServiceType,
  Complexity,
} from "@/types";
import type {
  KanbanColumn,
  KanbanColumnId,
  Task,
  TaskTag,
} from "@/components/admin/kanban/types";
import {
  complexityToPriority,
  orderStatusToColumn,
  calculateDueDate,
  formatDateForDisplay,
} from "@/components/admin/kanban/types";

type OrderWithItems = OrderRow & {
  order_items?: Array<{
    kit_name: string;
    kit_model: string | null;
    service_type: ServiceType;
    complexity: Complexity;
  }>;
  progress_logs?: Array<{ id: string }>;
  change_requests?: Array<{ id: string }>;
};

/**
 * Get kanban tasks grouped by column
 */
export async function getKanbanTasks(): Promise<KanbanColumn[]> {
  const supabase = await createClient();

  // Get orders with their items, progress logs, and change requests
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      client_id,
      estimated_days,
      notes,
      status,
      order_items (
        kit_name,
        kit_model,
        service_type,
        complexity
      ),
      progress_logs (id),
      change_requests (id)
    `
    )
    .in("status", ["draft", "estimated", "approved", "in_progress", "completed", "cancelled"])
    .order("created_at", { ascending: false })
    .limit(20)
    .returns<OrderWithItems[]>();

  // Initialize columns
  const columns: Record<KanbanColumnId, Task[]> = {
    todo: [],
    "in-progress": [],
    "under-review": [],
    completed: [],
  };

  // Transform orders to tasks
  orders?.forEach((order) => {
    const firstItem = order.order_items?.[0];
    if (!firstItem) return;

    const columnId = orderStatusToColumn(order.status);
    const priority = complexityToPriority(firstItem.complexity);
    const dueDate = order.estimated_days
      ? calculateDueDate(order.created_at, order.estimated_days)
      : null;

    const task: Task = {
      id: `task-${order.id}`,
      orderId: order.id,
      title: firstItem.kit_name || "Untitled Task",
      description: order.notes || undefined,
      tags: buildTaskTags(firstItem, dueDate, priority),
      dueDate,
      assignees: [], // Will be populated from profiles in production
      progress: calculateProgress(order.status),
      priority,
      status: order.status,
      commentCount: order.progress_logs?.length || 0,
      linkCount: order.change_requests?.length || 0,
    };

    columns[columnId].push(task);
  });

  // Return columns with their tasks
  return [
    {
      id: "todo",
      title: "To Do",
      tasks: columns.todo,
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: columns["in-progress"],
    },
    {
      id: "under-review",
      title: "Under Review",
      tasks: columns["under-review"],
    },
    {
      id: "completed",
      title: "Completed",
      tasks: columns.completed,
    },
  ];
}

/**
 * Build task tags based on order item data
 */
function buildTaskTags(
  item: {
    kit_name: string;
    service_type: ServiceType;
    complexity: Complexity;
  },
  dueDate: Date | null,
  priority: Task["priority"]
): TaskTag[] {
  const tags: TaskTag[] = [];

  // Add priority tag
  if (priority === "high") {
    tags.push({
      label: "🔥 Urgent",
      variant: "urgent",
    });
  } else if (priority === "low") {
    tags.push({
      label: "🟡 Low Priority",
      variant: "low-priority",
    });
  }

  // Add due date tag
  if (dueDate) {
    const dueString = formatDateForDisplay(dueDate);
    if (dueString) {
      tags.push({
        label: `📅 ${dueString}`,
        variant: "due",
      });
    }
  }

  return tags;
}

/**
 * Calculate progress percentage based on order status
 */
function calculateProgress(status: OrderStatus): number {
  const progressMap: Record<OrderStatus, number> = {
    draft: 0,
    estimated: 0,
    approved: 10,
    in_progress: 50,
    completed: 100,
    cancelled: 0,
  };
  return progressMap[status] || 0;
}
