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
