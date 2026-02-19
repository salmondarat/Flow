"use client";

import { Plus, Download } from "lucide-react";
import { DashboardStatsCards } from "@/components/admin/dashboard/dashboard-stats-cards";
import { ProjectAnalyticsChart } from "@/components/admin/dashboard/project-analytics";
import { RemindersWidget } from "@/components/admin/dashboard/reminders-widget";
import { ProjectListWidget } from "@/components/admin/dashboard/project-list-widget";
import { TeamCollaborationWidget } from "@/components/admin/dashboard/team-collaboration";
import { ProjectProgressChart } from "@/components/admin/dashboard/project-progress";
import { TimerWidget } from "@/components/admin/dashboard/timer-widget";

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/30 flex items-center font-medium transition-all">
            <Plus className="h-5 w-5 mr-2" />
            Add Project
          </button>
          <button className="px-5 py-2.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
            <Download className="h-5 w-5 mr-2" />
            Import Data
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <DashboardStatsCards />

      {/* Middle Section: Analytics + Reminders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ProjectAnalyticsChart />
        <RemindersWidget />
      </div>

      {/* Bottom Section: Team + Progress + Projects + Time Tracker */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <TeamCollaborationWidget />
        <ProjectProgressChart />
        <ProjectListWidget />
        <TimerWidget />
      </div>
    </div>
  );
}
