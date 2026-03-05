/**
 * Bento Grid Type Definitions
 *
 * Type-safe Bento Grid system without any 'any' types
 */

/** Size variants for Bento cards */
export type BentoSize = "sm" | "md" | "lg" | "wd" | "xl" | "widget" | "widget-lg";

/** Color accent variants */
export type BentoAccent =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red"
  | "gray"
  | "brand";

/** Card interaction states */
export type CardState = "idle" | "loading" | "error" | "empty";

/** Trend direction for stats */
export type TrendDirection = "up" | "down" | "neutral";

/** Trend data for statistics cards */
export interface Trend {
  value: string;
  direction: TrendDirection;
  isUrgent?: boolean;
}

/** Base props for all Bento cards */
export interface BentoCardProps {
  size: BentoSize;
  accent?: BentoAccent;
  state?: CardState;
  className?: string;
  children: React.ReactNode;
}

/** Stats card specific props */
export interface StatsCardProps {
  size?: BentoSize;
  accent?: BentoAccent;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: Trend;
  description?: string;
  onClick?: () => void;
  state?: CardState;
}

/** Activity item for activity lists */
export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date | null;
  status: string;
  type: "order" | "system" | "alert";
}

/** Chart data point */
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date | null;
}

/** Progress item for progress cards */
export interface ProgressItem {
  id: string;
  title: string;
  subtitle?: string;
  progress: number; // 0-100
  status: string;
  href?: string;
}

/** Quick action button config */
export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

/** Status badge config */
export interface StatusBadge {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral";
  pulse?: boolean;
}

/**
 * Get the column span classes for each bento size across all breakpoints
 */
export function getSizeClasses(size: BentoSize): string {
  const sizeMap: Record<BentoSize, string> = {
    sm: "col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3",
    md: "col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6",
    lg: "col-span-12 md:col-span-6 lg:col-span-12 xl:col-span-9",
    wd: "col-span-12",
    xl: "col-span-12 row-span-2",
    // Dashboard widget sizes
    widget: "col-span-12 lg:col-span-4",
    "widget-lg": "col-span-12 lg:col-span-8",
  };

  return sizeMap[size];
}

/**
 * Helper to get status variant from status string
 */
export function getStatusVariant(
  status: string
): "success" | "warning" | "error" | "info" | "neutral" {
  const statusMap: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
    completed: "success",
    approved: "success",
    in_progress: "info",
    estimated: "warning",
    pending: "warning",
    draft: "neutral",
    rejected: "error",
    cancelled: "error",
  };

  return statusMap[status] || "neutral";
}

/**
 * Progress value formatter
 */
export function formatProgress(value: number): string {
  return `${Math.round(value)}%`;
}
