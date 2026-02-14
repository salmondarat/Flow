"use client";

import { cn } from "@/lib/utils";
import { QuickActionLink } from "./quick-actions";
import type { QuickActionLinkProps } from "./quick-actions";

/**
 * DashboardHeader - Header component for dashboards
 *
 * Displays title, subtitle, and optional quick actions
 */
export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "success" | "warning" | "error" | "info" | "neutral";
  };
  actions?: QuickActionLinkProps[];
  className?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  badge,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4",
        "md:flex-row md:items-end",
        "pb-2",
        className
      )}
    >
      {/* Left: Title and Badge */}
      <div className="space-y-2">
        {badge && <StatusBadge text={badge.text} variant={badge.variant || "neutral"} />}
        <h1 className="text-text-high text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-muted max-w-xl text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: Quick Actions */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <QuickActionLink key={index} {...action} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * StatusBadge - Small status badge for header (minimal)
 */
interface StatusBadgeProps {
  text: string;
  variant: "success" | "warning" | "error" | "info" | "neutral";
  pulse?: boolean;
}

function StatusBadge({ text, variant, pulse = false }: StatusBadgeProps) {
  const variantStyles = {
    success: cn(
      "bg-green-50 text-green-700 border-green-200",
      "dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
    ),
    warning: cn(
      "bg-orange-50 text-orange-700 border-orange-200",
      "dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900"
    ),
    error: cn(
      "bg-red-50 text-red-700 border-red-200",
      "dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
    ),
    info: cn(
      "bg-blue-50 text-blue-700 border-blue-200",
      "dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900"
    ),
    neutral: cn(
      "bg-neutral-100 text-neutral-700 border-neutral-200",
      "dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
    ),
  };

  const dotColors = {
    success: "bg-green-500",
    warning: "bg-orange-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    neutral: "bg-neutral-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1",
        "text-xs font-medium uppercase",
        variantStyles[variant]
      )}
    >
      {pulse && (
        <span className={cn("size-2 rounded-full", dotColors[variant])} />
      )}
      <span>{text}</span>
    </div>
  );
}

/**
 * AdminDashboardHeader - Specialized header for admin dashboard (minimal)
 */
export interface AdminDashboardHeaderProps {
  systemStatus?: {
    status: "online" | "offline" | "maintenance";
    version?: string;
  };
}

export function AdminDashboardHeader({ systemStatus }: AdminDashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="text-text-high text-2xl font-semibold tracking-tight md:text-3xl">
          Dashboard
        </h2>
        <p className="text-text-muted mt-1 text-sm">
          Overview of your orders and projects
        </p>
      </div>

      {systemStatus && (
        <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 dark:bg-neutral-900">
          <span className="bg-green-500 size-2 rounded-full" />
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Online
          </span>
          {systemStatus.version && (
            <span className="text-sm text-neutral-500">v{systemStatus.version}</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ClientDashboardHeader - Specialized header for client dashboard (minimal)
 */
export interface ClientDashboardHeaderProps {
  userName?: string;
  actions?: QuickActionLinkProps[];
}

export function ClientDashboardHeader({ userName = "there", actions }: ClientDashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 md:flex-row md:items-end">
      <div className="space-y-1">
        <div className="text-sm font-medium text-brand-500">
          Dashboard
        </div>
        <h1 className="text-text-high text-2xl font-semibold tracking-tight md:text-3xl">
          Welcome back, {userName}
        </h1>
        <p className="text-text-muted text-sm">
          Track your orders and build progress
        </p>
      </div>

      {actions && actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <QuickActionLink key={index} {...action} />
          ))}
        </div>
      )}
    </div>
  );
}
