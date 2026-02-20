"use client";

import { cn } from "@/lib/utils";
import type { BentoSize } from "./types";

/**
 * BentoGrid - A flexible grid container for bento card layouts
 *
 * Uses a 12-column grid system for maximum flexibility across all breakpoints
 */
export interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        // 12-column grid system for all breakpoints
        "grid grid-cols-12",
        "gap-4 md:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
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
 * BentoCard - Base card component with minimal styling
 */
export interface BentoCardProps {
  size?: BentoSize;
  children: React.ReactNode;
  className?: string;
  accent?: "blue" | "purple" | "green" | "orange" | "red" | "gray" | "brand";
  interactive?: boolean;
  onClick?: () => void;
  loading?: boolean;
  dashboard?: boolean; // Use dashboard styling (rounded-3xl, subtle borders)
}

const accentBorders = {
  blue: "group-hover/bento:border-blue-300 dark:group-hover/bento:border-blue-700",
  purple: "group-hover/bento:border-purple-300 dark:group-hover/bento:border-purple-700",
  green: "group-hover/bento:border-green-300 dark:group-hover/bento:border-green-700",
  orange: "group-hover/bento:border-orange-300 dark:group-hover/bento:border-orange-700",
  red: "group-hover/bento:border-red-300 dark:group-hover/bento:border-red-700",
  gray: "group-hover/bento:border-gray-300 dark:group-hover/bento:border-gray-600",
  brand: "group-hover/bento:border-brand-300 dark:group-hover/bento:border-brand-700",
};

export function BentoCard({
  size = "md",
  children,
  className,
  accent = "gray",
  interactive = false,
  onClick,
  loading = false,
  dashboard = false,
}: BentoCardProps) {
  const sizeClasses = getSizeClasses(size);

  if (loading) {
    return (
      <div
        className={cn(
          sizeClasses,
          "rounded-xl bg-neutral-100 dark:bg-neutral-800",
          "border border-neutral-200 dark:border-neutral-700",
          "animate-pulse",
          "min-h-40"
        )}
      >
        <div className="h-full w-full" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/bento",
        sizeClasses,
        dashboard ? "rounded-dashboard-3xl" : "rounded-xl",
        dashboard ? "dashboard-card" : "bg-white dark:bg-neutral-900",
        dashboard ? "border-dashboard-subtle" : "border border-neutral-200 dark:border-neutral-800",
        "p-5 md:p-6",
        "transition-all duration-200",
        dashboard && "dashboard-hover",
        interactive && [
          "cursor-pointer",
          accentBorders[accent],
          onClick && "active:scale-[0.98]",
        ],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
