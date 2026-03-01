"use client";

import { cn } from "@/lib/utils";
import { BentoCard } from "./bento-grid";
import type { ActivityItem } from "./types";
import { CubeIcon, ClockIcon, LightningIcon } from "./icons";

/**
 * ActivityList - Display recent activity with timestamp and status (minimal design)
 *
 * Shows a list of recent activities with visual indicators
 */
export interface ActivityListProps {
  title: string;
  items: ActivityItem[];
  className?: string;
  size?: "md" | "lg";
  maxItems?: number;
}

export function ActivityList({
  title,
  items,
  className,
  size = "lg",
  maxItems = 5,
}: ActivityListProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <BentoCard size={size} className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-text-high text-sm font-medium">{title}</h3>
        <span className="text-text-muted text-xs font-medium">
          {items.length} total
        </span>
      </div>

      {/* Activity Items */}
      <div className="flex-1 space-y-3">
        {displayItems.length === 0 ? (
          <EmptyState message="No recent activity" />
        ) : (
          <div className="space-y-3">
            {displayItems.map((item) => (
              <ActivityListItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* View All Link */}
      {items.length > maxItems && (
        <button className="text-text-muted mt-4 text-xs font-medium hover:text-text-high transition-colors">
          View all activity →
        </button>
      )}
    </BentoCard>
  );
}

/**
 * ActivityListItem - Single activity item (minimal)
 */
function ActivityListItem({ item }: { item: ActivityItem }) {
  return (
    <div className="group flex items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
      {/* Minimal icon - no background */}
      <div className="text-neutral-400 shrink-0">
        {getActivityIcon(item.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-text-high text-sm font-medium truncate">
          {item.title}
        </p>
        <p className="text-text-muted mt-0.5 text-xs truncate">
          {item.description}
        </p>
        <p className="text-text-muted mt-1 text-xs">
          {formatRelativeTime(item.timestamp)}
        </p>
      </div>

      {/* Status Badge */}
      <div className="shrink-0">
        <StatusPill status={item.status} />
      </div>
    </div>
  );
}

/**
 * StatusPill - Minimal status indicator pill
 */
function StatusPill({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; bg: string }> = {
    new: { color: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    pending: { color: "bg-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
    in_progress: { color: "bg-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
    completed: { color: "bg-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
    urgent: { color: "bg-red-500", bg: "bg-red-50 dark:bg-red-950/30" },
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <div className={cn("flex items-center gap-1.5 rounded-full px-2 py-1", config.bg)}>
      <span className={cn("size-1.5 rounded-full", config.color)} />
      <span className="text-neutral-700 text-xs font-medium capitalize dark:text-neutral-300">
        {status.replace("_", " ")}
      </span>
    </div>
  );
}

/**
 * Get activity icon based on type
 */
function getActivityIcon(type: ActivityItem["type"]): React.ReactNode {
  const icons = {
    order: <CubeIcon className="size-4" />,
    system: <ClockIcon className="size-4" />,
    alert: <LightningIcon className="size-4" />,
  };

  return icons[type];
}

/**
 * Format relative time
 */
function formatRelativeTime(date: Date | null | undefined): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "Unknown time";
  }

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * EmptyState - Display for empty states (minimal)
 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <svg
        className="text-neutral-300 dark:text-neutral-700 mb-3 size-8"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8V12L15 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  );
}
