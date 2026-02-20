"use client";

import { useState } from "react";
import { CalendarGrid } from "./calendar-grid";
import { EventDetailModal } from "./event-detail-modal";
import type { CalendarView, CalendarDay, CalendarEvent } from "./types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function CalendarPage({
  days,
  currentDate,
}: {
  days: CalendarDay[];
  currentDate: Date;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<CalendarView>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", newDate.toISOString().split("T")[0]);
    router.push(`/admin/calendar?${params.toString()}`);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", newDate.toISOString().split("T")[0]);
    router.push(`/admin/calendar?${params.toString()}`);
  };

  const handleToday = () => {
    router.push("/admin/calendar");
  };

  const handleDateClick = (date: Date) => {
    // Future: Open event creation modal for this date
    console.log("Date clicked:", date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            View project schedules, deadlines, and milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border p-1">
          {(["month", "week", "day"] as CalendarView[]).map((v) => (
            <Button
              key={v}
              variant={view === v ? "default" : "ghost"}
              size="sm"
              onClick={() => setView(v)}
              className="capitalize"
            >
              {v}
            </Button>
          ))}
        </div>

        <Button size="sm" onClick={() => handleDateClick(new Date())}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        days={days}
        view={view}
        onEventClick={(calendarEvent) => setSelectedEvent(calendarEvent)}
        onDateClick={handleDateClick}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  );
}
