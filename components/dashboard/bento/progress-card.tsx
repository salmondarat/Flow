"use client";

import { cn } from "@/lib/utils";
import { BentoCard } from "./bento-grid";
import type { ProgressItem, StatusBadge } from "./types";

/**
 * ProgressCard - Display progress items with visual progress bars
 *
 * Shows active projects with progress indicators
 */
export interface ProgressCardProps {
  title: string;
  items: ProgressItem[];
  className?: string;
  size?: "md" | "lg";
  accent?: "blue" | "purple" | "green" | "orange" | "red" | "gray" | "brand";
}

export function ProgressCard({
  title,
  items,
  className,
  size = "md",
  accent = "brand",
}: ProgressCardProps) {
  return (
    <BentoCard size={size} accent={accent} className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-text-high text-sm font-semibold uppercase tracking-wide">
          {title}
        </h3>
        <span className="text-text-muted text-xs font-medium">
          {items.length} active
        </span>
      </div>

      {/* Progress Items */}
      <div className="flex-1 space-y-4">
        {items.length === 0 ? (
          <EmptyState message="No active projects" />
        ) : (
          items.map((item) => (
            <ProgressItem key={item.id} item={item} />
          ))
        )}
      </div>
    </BentoCard>
  );
}

/**
 * ProgressItem - Single progress item with bar
 */
function ProgressItem({ item }: { item: ProgressItem }) {
  const Card = item.href ? "a" : "div";
  const content = (
    <>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm font-medium truncate dark:text-white">
            {item.title}
          </p>
          {item.subtitle && (
            <p className="text-gray-500 mt-0.5 text-xs dark:text-gray-400">
              {item.subtitle}
            </p>
          )}
        </div>
        <StatusBadgeComponent label={item.status} variant={getStatusVariant(item.status)} />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-gray-700 font-medium dark:text-gray-300">
            {item.progress}%
          </span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>
    </>
  );

  return (
    <Card
      href={item.href}
      className={cn(
        "block rounded-xl border border-gray-100 bg-gray-50/50 p-3",
        "transition-all duration-200",
        "hover:border-brand-200 hover:bg-white hover:shadow-sm",
        "dark:border-gray-800 dark:bg-gray-800/50",
        "dark:hover:border-brand-900 dark:hover:bg-gray-800"
      )}
    >
      {content}
    </Card>
  );
}

/**
 * StatusBadgeComponent - Status indicator badge
 */
interface StatusBadgeComponentProps extends StatusBadge {}

function StatusBadgeComponent({ label, variant, pulse = false }: StatusBadgeComponentProps) {
  const variantConfig = {
    success: {
      classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
      dotColor: "bg-green-500",
    },
    warning: {
      classes: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900",
      dotColor: "bg-orange-500",
    },
    error: {
      classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
      dotColor: "bg-red-500",
    },
    info: {
      classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
      dotColor: "bg-blue-500",
    },
    neutral: {
      classes: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      dotColor: "bg-gray-500",
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-1",
        "text-xs font-semibold",
        config.classes
      )}
    >
      {pulse && (
        <span className={cn("size-1.5 rounded-full animate-pulse", config.dotColor)} />
      )}
      <span>{label}</span>
    </div>
  );
}

/**
 * EmptyState - Display for empty states
 */
interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <svg
        className="text-gray-300 dark:text-gray-700 mb-3 size-8"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-gray-500 text-sm dark:text-gray-400">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-brand-600 mt-3 text-sm font-medium hover:text-brand-700 dark:text-brand-400"
        >
          {actionLabel} →
        </button>
      )}
    </div>
  );
}

/**
 * Helper to get status variant from status string
 */
function getStatusVariant(status: string): StatusBadgeComponentProps["variant"] {
  const statusMap: Record<string, StatusBadgeComponentProps["variant"]> = {
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
