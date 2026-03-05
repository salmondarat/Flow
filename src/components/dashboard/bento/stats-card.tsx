"use client";

import { cn } from "@/lib/utils";
import type { StatsCardProps, Trend, BentoSize } from "./types";
import { BentoCard } from "./bento-grid";

/**
 * StatsCard - Display key metrics with trend indicators (minimal design)
 *
 * Shows a single stat with icon, value, and optional trend
 */
export function StatsCard({
  size = "sm",
  accent = "gray",
  title,
  value,
  icon,
  trend,
  description,
  onClick,
  state = "idle",
}: StatsCardProps) {
  return (
    <BentoCard
      size={size}
      accent={accent}
      onClick={onClick}
      interactive={!!onClick}
      loading={state === "loading"}
      className="flex flex-col justify-between"
    >
      {/* Header with minimal Icon and Title */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "text-neutral-400",
            accent === "brand" && "text-brand-500",
            accent === "blue" && "text-blue-500",
            accent === "green" && "text-green-500",
            accent === "orange" && "text-orange-500",
            accent === "red" && "text-red-500"
          )}
        >
          {icon}
        </div>
        {trend && <TrendIndicator {...trend} />}
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="text-text-muted text-sm font-medium">{title}</p>
        <p className="text-text-high mt-1 text-3xl font-semibold tracking-tight">
          {value}
        </p>
        {description && <p className="text-text-muted mt-1 text-xs">{description}</p>}
      </div>
    </BentoCard>
  );
}

/**
 * TrendIndicator - Visual indicator for trend direction (minimal)
 */
interface TrendIndicatorProps extends Trend {}

function TrendIndicator({ value, direction, isUrgent = false }: TrendIndicatorProps) {
  const baseClasses = "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium";

  const directionConfig = {
    up: {
      icon: (
        <svg className="size-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 9V3M6 3L3 6M6 3L9 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      classes: cn(
        baseClasses,
        isUrgent
          ? "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
          : "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
      ),
    },
    down: {
      icon: (
        <svg className="size-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 3V9M6 9L3 6M6 9L9 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      classes: cn(baseClasses, "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"),
    },
    neutral: {
      icon: (
        <svg className="size-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      classes: cn(baseClasses, "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"),
    },
  };

  const config = directionConfig[direction];

  return (
    <div className={config.classes}>
      {config.icon}
      <span>{value}</span>
    </div>
  );
}

/**
 * StatsGrid - Grid layout for multiple stat cards
 */
export interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}
