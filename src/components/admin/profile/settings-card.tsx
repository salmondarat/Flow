"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  action?: ReactNode;
  variant?: "default" | "danger";
}

export function SettingsCard({
  title,
  description,
  icon,
  children,
  defaultExpanded = true,
  action,
  variant = "default",
}: SettingsCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 shadow-sm transition-colors",
        variant === "danger"
          ? "border-red-200 bg-white dark:border-red-900 dark:bg-gray-900"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                variant === "danger"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-primary/10 text-primary"
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <h3
              className={cn(
                "text-lg font-bold",
                variant === "danger"
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-white"
              )}
            >
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {isExpanded && <div className="mt-6 space-y-4">{children}</div>}
    </div>
  );
}
