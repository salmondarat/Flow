"use client";

import { Video } from "lucide-react";
import type { Reminder, WidgetState } from "./types";
import { useState, useEffect } from "react";

export function RemindersWidget() {
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Connect to Supabase to fetch reminders
    // For now, use sample data
    setReminder({
      id: "1",
      title: "Meeting with Arc Company",
      startTime: "02.00 pm",
      endTime: "04.00 pm",
    });
    setWidgetState("success");
  }, []);

  if (widgetState === "loading") {
    return (
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Reminders</h3>
        <div className="h-24 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (widgetState === "error" || !reminder) {
    return (
      <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Reminders</h3>
        <div className="h-24 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          {error || "No upcoming reminders"}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Reminders</h3>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2">
          {reminder.title}
        </h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Time : {reminder.startTime} - {reminder.endTime}
        </p>
      </div>

      <div className="mt-8">
        <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center font-semibold transition-all group">
          <Video className="h-5 w-5 mr-2 group-hover:animate-pulse" />
          Start Meeting
        </button>
      </div>
    </div>
  );
}
