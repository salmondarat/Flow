"use client";

import { Video, MessageSquare } from "lucide-react";
import type { Reminder, WidgetState } from "./types";
import { useState, useEffect } from "react";

export function RemindersWidget() {
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [widgetState, setWidgetState] = useState<WidgetState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gunpla business context - client consultation
    setReminder({
      id: "1",
      title: "Client Consultation - RX-93 Nu Gundam Custom",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
    });
    setWidgetState("success");
  }, []);

  if (widgetState === "loading") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Up Next</h3>
        <div className="flex h-24 items-center justify-center">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  if (widgetState === "error" || !reminder) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Up Next</h3>
        <div className="flex h-24 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          {error || "No upcoming appointments"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Up Next</h3>
        <h4 className="mb-2 text-xl leading-snug font-bold text-gray-900 dark:text-white">
          {reminder.title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Time: {reminder.startTime} - {reminder.endTime}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <MessageSquare className="mr-1 h-3 w-3" />
            Requirements Review
          </span>
        </div>
      </div>

      <div className="mt-8">
        <button className="group flex w-full items-center justify-center rounded-xl bg-emerald-600 py-4 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700">
          <Video className="mr-2 h-5 w-5 group-hover:animate-pulse" />
          Join Call
        </button>
      </div>
    </div>
  );
}
