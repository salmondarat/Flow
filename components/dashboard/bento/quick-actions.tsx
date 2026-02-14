"use client";

import { cn } from "@/lib/utils";
import { BentoCard } from "./bento-grid";
import type { QuickAction } from "./types";

/**
 * QuickActions - Display quick action buttons
 *
 * Shows primary actions users can take
 */
export interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
  className?: string;
  size?: "sm" | "md";
}

export function QuickActions({
  title,
  actions,
  className,
  size = "sm",
}: QuickActionsProps) {
  return (
    <BentoCard size={size} className={cn("flex flex-col", className)}>
      {/* Header */}
      <h3 className="text-text-high mb-4 text-sm font-semibold uppercase tracking-wide">
        {title}
      </h3>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-2">
        {actions.map((action) => (
          <QuickActionButton key={action.id} action={action} />
        ))}
      </div>
    </BentoCard>
  );
}

/**
 * QuickActionButton - Single action button
 */
function QuickActionButton({ action }: { action: QuickAction }) {
  const variantStyles = {
    primary: cn(
      "bg-brand-500 text-white hover:bg-brand-600",
      "border-transparent"
    ),
    secondary: cn(
      "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
      "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
    ),
    ghost: cn(
      "bg-transparent text-gray-600 border-gray-200 hover:bg-gray-50",
      "dark:bg-transparent dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-800/50"
    ),
  };

  return (
    <button
      onClick={action.onClick}
      disabled={action.disabled}
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-3 py-2.5",
        "text-sm font-medium transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        "active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variantStyles[action.variant || "secondary"]
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-lg",
          "transition-transform duration-200",
          "group-hover:scale-110"
        )}
      >
        {action.icon}
      </span>
      <span className="flex-1 text-left">{action.label}</span>
      <svg
        className="size-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3.33325L10.6667 7.99992L6 12.6666"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/**
 * FloatingQuickActions - Fixed position quick action button (FAB style)
 */
export interface FloatingQuickActionsProps {
  actions: Omit<QuickAction, "id">[];
  position?: "bottom-right" | "bottom-left";
}

export function FloatingQuickActions({
  actions,
  position = "bottom-right",
}: FloatingQuickActionsProps) {
  const positionStyles = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2",
        positionStyles[position]
      )}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            "flex items-center justify-center",
            "size-14 rounded-full shadow-lg",
            "bg-brand-500 text-white hover:bg-brand-600",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          title={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

/**
 * QuickActionLink - Link version of quick action
 */
export interface QuickActionLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function QuickActionLink({
  href,
  label,
  icon,
  variant = "secondary",
}: QuickActionLinkProps) {
  const variantStyles = {
    primary: cn(
      "bg-brand-500 text-white hover:bg-brand-600",
      "border-transparent shadow-sm"
    ),
    secondary: cn(
      "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
      "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
    ),
    ghost: cn(
      "bg-transparent text-gray-600 border-gray-200 hover:bg-gray-50",
      "dark:bg-transparent dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-800/50"
    ),
  };

  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-xl border px-4 py-2.5",
        "text-sm font-medium transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        "active:scale-[0.98]",
        variantStyles[variant]
      )}
    >
      <span
        className={cn(
          "flex size-5 items-center justify-center",
          "transition-transform duration-200",
          "group-hover:scale-110"
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </a>
  );
}
