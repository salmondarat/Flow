"use client";

import { cn } from "@/lib/utils";

export interface TailAdminChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function TailAdminChartCard({
  title,
  description,
  children,
  className,
  contentClassName,
}: TailAdminChartCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
        {description && (
          <p className="text-gray-500 text-sm dark:text-gray-400">{description}</p>
        )}
      </div>
      <div className={cn(contentClassName)}>{children}</div>
    </div>
  );
}
