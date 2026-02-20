"use client";

import { Plus, Download } from "lucide-react";
import { DashboardStatsCards } from "@/components/admin/dashboard/dashboard-stats-cards";
import { ProjectAnalyticsChart } from "@/components/admin/dashboard/project-analytics";
import { RemindersWidget } from "@/components/admin/dashboard/reminders-widget";
import { ProjectListWidget } from "@/components/admin/dashboard/project-list-widget";
import { TeamCollaborationWidget } from "@/components/admin/dashboard/team-collaboration";
import { ProjectProgressChart } from "@/components/admin/dashboard/project-progress";

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700">
            <Plus className="mr-2 h-5 w-5" />
            Add Project
          </button>
          <button className="flex items-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <Download className="mr-2 h-5 w-5" />
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

      {/* Bottom Section: Team + Progress + Projects */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TeamCollaborationWidget />
        <ProjectProgressChart />
        <ProjectListWidget />
      </div>
    </div>
  );
}
