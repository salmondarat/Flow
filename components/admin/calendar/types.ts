import type { OrderStatus } from "@/types";

export type CalendarView = "month" | "week" | "day";

export type EventColor = "overdue" | "due-today" | "upcoming" | "completed" | "created";

export interface CalendarEvent {
  id: string;
  orderId: string;
  title: string;
  date: Date;
  color: EventColor;
  status: OrderStatus;
  type: "due-date" | "created-date" | "milestone";
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}
