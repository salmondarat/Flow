import { createClient } from "@/lib/supabase/server";
import type { OrderRow, OrderStatus } from "@/types";
import type { CalendarDay, CalendarEvent, EventColor } from "./types";

type OrderWithDates = OrderRow & {
  order_items?: Array<{
    kit_name: string;
  }>;
};

/**
 * Get calendar data for a specific month
 */
export async function getCalendarData(
  year: number,
  month: number
): Promise<{
  days: CalendarDay[];
  currentDate: Date;
}> {
  const supabase = await createClient();

  // Get orders for the month and surrounding months
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, estimated_days, status, order_items(kit_name)")
    .in("status", [
      "draft",
      "estimated",
      "approved",
      "in_progress",
      "completed",
      "cancelled",
    ])
    .order("created_at", { ascending: false });

  // Build calendar days
  const days: CalendarDay[] = [];
  const today = new Date();

  // Get first day of month and total days
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // Get events for this month
  const events: CalendarEvent[] = [];

  (orders as OrderWithDates[]).forEach((order) => {
    const kitName = order.order_items?.[0]?.kit_name || "Untitled";
    const createdAt = new Date(order.created_at);
    const dueDate = order.estimated_days
      ? new Date(order.created_at)
      : null;
    if (dueDate) dueDate.setDate(dueDate.getDate() + order.estimated_days);

    // Add due date event
    if (dueDate && isSameMonth(dueDate, year, month)) {
      events.push({
        id: `due-${order.id}`,
        orderId: order.id,
        title: kitName,
        date: dueDate,
        color: getEventColor(dueDate, order.status),
        status: order.status,
        type: "due-date",
      });
    }

    // Add created date event
    if (isSameMonth(createdAt, year, month)) {
      events.push({
        id: `created-${order.id}`,
        orderId: order.id,
        title: kitName,
        date: createdAt,
        color: "created",
        status: order.status,
        type: "created-date",
      });
    }
  });

  // Build calendar grid (include days from previous/next month for full grid)
  const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayDate = new Date(year, month - 1, i - startDayOfWeek + 1);
    const isCurrentMonth = dayDate.getMonth() === month - 1;

    days.push({
      date: dayDate,
      isCurrentMonth,
      isToday:
        dayDate.getDate() === today.getDate() &&
        dayDate.getMonth() === today.getMonth() &&
        dayDate.getFullYear() === today.getFullYear(),
      events: isCurrentMonth
        ? events.filter((e) => isSameDay(e.date, dayDate))
        : [],
    });
  }

  return {
    days,
    currentDate: firstDay,
  };
}

function isSameMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month - 1;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function getEventColor(dueDate: Date, status: OrderStatus): EventColor {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateCopy = new Date(dueDate);
  dueDateCopy.setHours(0, 0, 0, 0);

  if (status === "completed") return "completed";

  const diffDays = Math.floor(
    (dueDateCopy.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "due-today";
  return "upcoming";
}
