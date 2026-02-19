"use client";

import { Plus, Zap, PersonAdd, LayoutDashboard, Gauge } from "lucide-react";
import type { ProjectListItem, ProjectIconType, WidgetState } from "./types";
import { useState, useEffect } from "react";

const iconMap: Record<ProjectIconType, typeof Zap> = {
  code: Zap,
  person_add: PersonAdd,
  dashboard: LayoutDashboard,
  speed: Gauge,
};

const iconStyles: Record<ProjectIconType, string> = {
  code: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  person_add: "text-teal-500 bg-teal-100 dark:bg-teal-900/30",
  dashboard: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30",
  speed: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
};

export function ProjectListWidget() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");

  useEffect(() => {
    // TODO: Connect to Supabase to fetch projects
    // For now, use sample data
    setProjects([
      {
        id: "1",
        name: "Develop API Endpoints",
        dueDate: new Date("2024-11-26"),
        type: "code",
      },
      {
        id: "2",
        name: "Onboarding Flow",
        dueDate: new Date("2024-11-28"),
        type: "person_add",
      },
      {
        id: "3",
        name: "Build Dashboard",
        dueDate: new Date("2024-11-30"),
        type: "dashboard",
      },
      {
        id: "4",
        name: "Optimize Page Load",
        dueDate: new Date("2024-12-05"),
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

  const getIcon = (type: ProjectIconType): typeof Zap => {
    return iconMap[type] || Zap;
  };

  if (widgetState === "loading") {
    return (
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Project</h3>
          <button className="text-xs font-semibold flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Plus className="h-3 w-3 mr-1" />
            New
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white">Project</h3>
        <button className="text-xs font-semibold flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Plus className="h-3 w-3 mr-1" />
          New
        </button>
      </div>

      <ul className="space-y-4">
        {projects.map((project) => {
          const Icon = getIcon(project.type as ProjectIconType);
          const iconClass = iconStyles[project.type as ProjectIconType] || iconStyles.code;

          return (
            <li key={project.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Due date: {formatDate(project.dueDate)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
