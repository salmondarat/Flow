"use client";

import { cn } from "@/lib/utils";
import type { CalendarView, CalendarDay, CalendarEvent } from "./types";
import { CalendarEvent as CalendarEventComponent } from "./calendar-event";

export interface CalendarGridProps {
  days: CalendarDay[];
  view: CalendarView;
  onEventClick: (calendarEvent: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export function CalendarGrid({
  days,
  view,
  onEventClick,
  onDateClick,
}: CalendarGridProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Group days by week for month view
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="space-y-4">
      {/* Week day headers */}
      <div className="bg-muted grid grid-cols-7 gap-px border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-muted-foreground py-2 text-center text-sm font-semibold"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="bg-muted grid grid-cols-7 gap-px border">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <button
              key={`${weekIndex}-${dayIndex}`}
              onClick={() => onDateClick?.(day.date)}
              className={cn(
                "min-h-30 bg-background hover:bg-muted/50 p-2 text-left transition-colors",
                !day.isCurrentMonth && "bg-muted/50",
                day.isToday && "bg-muted"
              )}
            >
              <div
                className={cn(
                  "mb-2 text-sm font-medium",
                  !day.isCurrentMonth && "text-muted-foreground",
                  day.isToday &&
                    "bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full"
                )}
              >
                {day.date.getDate()}
              </div>

              <div className="space-y-1">
                {day.events.slice(0, 3).map((event) => (
                  <CalendarEventComponent
                    key={`${event.id}-${event.type}`}
                    event={event}
                    onClick={() => onEventClick(event)}
                  />
                ))}
                {day.events.length > 3 && (
                  <div className="text-muted-foreground text-xs">
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
