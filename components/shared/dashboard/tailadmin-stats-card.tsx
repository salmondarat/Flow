"use client";

import { cn } from "@/lib/utils";

export interface TailAdminStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isUp: boolean;
    isUrgent?: boolean;
  };
  className?: string;
}

export function TailAdminStatsCard({
  title,
  value,
  icon,
  trend,
  className,
}: TailAdminStatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6",
        className
      )}
    >
      <div className="flex items-center justify-center size-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
              trend.isUrgent
                ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400"
                : trend.isUp
                ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
            )}
          >
            {trend.isUrgent ? null : trend.isUp ? (
              <svg className="size-3" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.00006 9.00002C5.61344 9.00002 5.26825 8.83263 4.98779 8.58171L1.67242 5.14539C1.45931 4.87499 1.47109 4.49407 1.70133 4.23752C1.93156 3.98096 2.31197 3.96918 2.56852 4.20153L5.81947 7.80325C5.90384 7.89854 6.0004 7.94887 6.09876 7.94943C6.19713 7.95 6.29374 7.90102 6.3782 7.80664L9.74355 4.20153C9.97621 3.95088 10.3571 3.95459 10.5882 4.20963C10.8193 4.46466 10.823 4.84486 10.5723 5.07753L7.11123 8.59397C6.83924 8.84286 6.47467 9.00002 6.00006 9.00002Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg className="size-3" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.99994 2.99998C6.38656 2.99998 6.73175 3.16737 7.01221 3.41829L10.3276 6.85461C10.5407 7.12501 10.5289 7.50593 10.2987 7.76248C10.0684 8.01904 9.68803 8.03082 9.43148 7.79847L6.18053 4.19675C6.09616 4.10146 5.9996 4.05113 5.90124 4.05057C5.80287 4.05 5.70626 4.09898 5.6218 4.19336L2.25645 7.79847C2.02379 8.04912 1.6429 8.04541 1.41181 7.79037C1.18072 7.53534 1.17698 7.15514 1.42768 6.92247L4.88877 3.40603C5.16076 3.15714 5.52533 2.99998 5.99994 2.99998Z"
                  fill="currentColor"
                />
              </svg>
            )}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
