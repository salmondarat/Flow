"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * Workspace Navigation - Hierarchical project navigation
 *
 * Shows workspace section with expandable projects and badge counts
 */
export interface Project {
  id: string;
  name: string;
  taskCount?: number;
  isActive?: boolean;
}

export interface WorkspaceNavProps {
  projects: Project[];
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string;
  className?: string;
}

export function WorkspaceNav({
  projects,
  onProjectSelect,
  selectedProjectId,
  className,
}: WorkspaceNavProps) {
  const pathname = usePathname();
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="mb-2 flex items-center justify-between px-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Workspace
        </p>
        <span className="text-gray-400 font-bold">+</span>
      </div>

      {/* Ongoing Projects */}
      <div>
        <Link
          href="/admin/orders"
          className="dashboard-nav-active flex items-center justify-between rounded-dashboard-xl px-4 py-2 text-sm font-medium"
        >
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Ongoing Projects
          </div>
          <span className="bg-white text-black flex h-5 items-center justify-center rounded-full px-1.5 text-xs font-bold dark:bg-gray-900 dark:text-white">
            {projects.length}
          </span>
        </Link>

        {/* Project list */}
        <div className="ml-10 mt-2 flex flex-col gap-1">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => {
                setExpandedProjectId(
                  expandedProjectId === project.id ? null : project.id
                );
                onProjectSelect?.(project.id);
              }}
              className={cn(
                "rounded-lg px-3 py-2 text-left text-xs transition-colors",
                selectedProjectId === project.id
                  ? "bg-purple-50 text-purple-600 font-semibold border border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900"
                  : "text-gray-400 py-1 hover:text-dashboard-primary"
              )}
            >
              {project.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access Items */}
      <div className="mt-2">
        <button className="text-dashboard-primary hover:bg-white flex items-center justify-between rounded-dashboard-xl px-4 py-3 text-sm font-medium transition-colors dark:hover:bg-gray-800">
          <div className="flex items-center gap-3">
            <span>📙 Daily Tasks</span>
          </div>
          <span className="text-xs font-bold">6</span>
        </button>

        <button className="text-gray-600 hover:bg-white hover:text-dashboard-primary flex items-center justify-between rounded-dashboard-xl px-4 py-3 text-sm font-medium transition-colors dark:text-gray-400 dark:hover:bg-gray-800">
          <div className="flex items-center gap-3">
            <span>🏀 Other Tasks</span>
          </div>
          <span className="text-xs font-bold">3</span>
        </button>
      </div>
    </div>
  );
}
