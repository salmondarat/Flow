/**
 * Bento Grid Dashboard Components
 *
 * A flexible, type-safe bento grid system for dashboard layouts
 */

// Types
export type {
  BentoSize,
  BentoAccent,
  CardState,
  TrendDirection,
  Trend,
  BentoCardProps,
  StatsCardProps,
  ActivityItem,
  ChartDataPoint,
  ProgressItem,
  QuickAction,
  StatusBadge,
} from "./types";

// Utilities
export { getSizeClasses, getStatusVariant, formatProgress } from "./types";

// Core Components
export { BentoGrid, BentoCard } from "./bento-grid";

// Card Components
export { StatsCard, StatsGrid } from "./stats-card";
export { ProgressCard } from "./progress-card";
export { ActivityList } from "./activity-list";
export { QuickActions, FloatingQuickActions, QuickActionLink } from "./quick-actions";

// Header Components
export { DashboardHeader, AdminDashboardHeader, ClientDashboardHeader } from "./dashboard-header";

// Icons - Unified icon system
export {
  LightningIcon,
  ClockIcon,
  ChartIcon,
  CheckIcon,
  ListIcon,
  PlusIcon,
  CubeIcon,
  ActivityIcon,
  SupportIcon,
  SettingsIcon,
  ArrowRightIcon,
} from "./icons";
