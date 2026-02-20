"use client";

import { Plus, Wrench, Paintbrush, Sparkles, Shield } from "lucide-react";
import type { ProjectListItem, ProjectIconType, WidgetState } from "./types";
import { useState, useEffect } from "react";

const iconMap: Record<ProjectIconType, typeof Wrench> = {
  code: Wrench,
  person_add: Paintbrush,
  dashboard: Sparkles,
  speed: Shield,
};

const iconStyles: Record<ProjectIconType, string> = {
  code: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  person_add: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  dashboard: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
  speed: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
};

// Gunpla service type labels
const serviceLabels: Record<string, string> = {
  code: "Assembly",
  person_add: "Paint Job",
  dashboard: "Weathering",
  speed: "Protective Coat",
};

export function ProjectListWidget() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");

  useEffect(() => {
    // Sample Gunpla orders data
    setProjects([
      {
        id: "1",
        name: "RX-78-2 Gundam - Full Custom",
        dueDate: new Date("2026-02-28"),
        type: "code",
      },
      {
        id: "2",
        name: "Wing Zero Custom - Paint + Panel",
        dueDate: new Date("2026-03-05"),
        type: "person_add",
      },
      {
        id: "3",
        name: "Barbatos Lupus Rex - Weathering",
        dueDate: new Date("2026-03-12"),
        type: "dashboard",
      },
      {
        id: "4",
        name: "Unicorn Gundam - LED Install",
        dueDate: new Date("2026-03-18"),
        type: "speed",
      },
    ]);
    setWidgetState("success");
  }, []);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getIcon = (type: ProjectIconType): typeof Wrench => {
    return iconMap[type] || Wrench;
  };

  if (widgetState === "loading") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Orders</h3>
          <button className="flex items-center rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
            <Plus className="mr-1 h-3 w-3" />
            New
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">Recent Orders</h3>
        <button className="flex items-center rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
          <Plus className="mr-1 h-3 w-3" />
          New
        </button>
      </div>

      <ul className="space-y-4">
        {projects.map((project) => {
          const Icon = getIcon(project.type as ProjectIconType);
          const iconClass = iconStyles[project.type as ProjectIconType] || iconStyles.code;
          const serviceLabel = serviceLabels[project.type] || "Custom Work";

          return (
            <li key={project.id} className="flex items-start space-x-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {serviceLabel} • Due: {formatDate(project.dueDate)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
