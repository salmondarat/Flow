/**
 * Dashboard Type Definitions
 *
 * Strict TypeScript types with no 'any' types for dashboard components
 */

import { MaterialSymbol } from "react-material-symbols";

/** Project status enum */
export enum ProjectStatus {
  ENDED = "ended",
  RUNNING = "running",
  PENDING = "pending",
}

/** Task status enum */
export enum TaskStatus {
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
}

/** Statistics card data */
export interface StatsCardData {
  title: string;
  value: number;
  subtitle: string;
  isPrimary?: boolean;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

/** Team member with current task */
export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string | null;
  taskName: string;
  status: TaskStatus;
}

/** Project list item */
export interface ProjectListItem {
  id: string;
  name: string;
  dueDate: Date;
  type: string;
}

/** Project analytics data point */
export interface AnalyticsDataPoint {
  day: string;
  value: number;
  isStriped: boolean;
  hasBadge?: boolean;
}

/** Project progress data */
export interface ProjectProgress {
  completed: number;
  inProgress: number;
  pending: number;
  total: number;
}

/** Reminder data */
export interface Reminder {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date?: Date;
}

/** Time tracker state */
export interface TimeTrackerState {
  isRunning: boolean;
  elapsedSeconds: number;
  currentTask?: string;
}

/** Widget loading state */
export type WidgetState = "idle" | "loading" | "error" | "success";

/** Widget error type */
export interface WidgetError {
  message: string;
  code?: string;
  retryable: boolean;
}
