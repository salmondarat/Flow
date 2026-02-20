"use client";

import { cn } from "@/lib/utils";

/**
 * Status Pill - Reusable status indicator with colors matching dashboard design
 */

export interface StatusPillProps {
  label: string;
  variant: "urgent" | "due" | "low-priority" | "pink" | "purple" | "blue" | "gray";
  className?: string;
  emoji?: string;
}

const variantStyles = {
  urgent: "bg-badge-orange",
  due: "bg-badge-red",
  "low-priority": "bg-badge-yellow",
  pink: "bg-badge-pink",
  purple: "bg-badge-purple",
  blue: "bg-badge-blue",
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function StatusPill({ label, variant, className, emoji }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
        variantStyles[variant],
        className
      )}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </span>
  );
}

/**
 * Status Count Badge - Small badge for navigation items showing counts
 */
export interface StatusCountBadgeProps {
  count: number | string;
  variant?: "pink" | "purple" | "black";
  className?: string;
}

const badgeStyles = {
  pink: "bg-badge-purple text-purple-600 dark:text-purple-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
  black: "bg-black text-white",
};

export function StatusCountBadge({
  count,
  variant = "pink",
  className,
}: StatusCountBadgeProps) {
  return (
    <span
      className={cn(
        "flex h-5 items-center justify-center rounded-full px-1.5 text-xs font-bold",
        badgeStyles[variant],
        className
      )}
    >
      {count}
    </span>
  );
}
