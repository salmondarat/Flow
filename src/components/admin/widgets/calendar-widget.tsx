"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * Calendar Widget - Mini calendar with event highlights
 *
 * Shows current month with event indicators
 */
export interface CalendarWidgetProps {
  className?: string;
}

export function CalendarWidget({ className }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Event days (highlighted dates)
  const eventDays = [1, 3, 12, 16, 25, 26, 27];
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();

  const days = [];

  // Empty cells for days before first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-6" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isCurrentDay = day === currentDay && month === currentMonth;
    const hasEvent = eventDays.includes(day);
    const is25thOr26thOr27th = [25, 26, 27].includes(day);

    const dayClass = "h-6 w-6 flex items-center justify-center mx-auto text-[10px] font-bold";
    let bgClass = "";

    if (isCurrentDay) {
      bgClass = "bg-pink-100 text-pink-500 dark:bg-pink-950/30 dark:text-pink-400";
    } else if (hasEvent && !is25thOr26thOr27th) {
      bgClass = "bg-purple-100 text-purple-500 dark:bg-purple-950/30 dark:text-purple-400";
    } else if (is25thOr26thOr27th) {
      bgClass =
        day === 25
          ? "bg-orange-400 text-white"
          : day === 26
            ? "bg-orange-200 text-orange-700"
            : "bg-orange-400 text-white";
    }

    days.push(
      <div key={day} className={cn(dayClass, bgClass, "rounded-full")}>
        {day}
      </div>
    );
  }

  // Empty cells for remaining days
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const remainingCells = totalCells - days.length;
  for (let i = 0; i < remainingCells; i++) {
    days.push(<div key={`empty-end-${i}`} className="h-6" />);
  }

  return (
    <div
      className={cn(
        "dashboard-card dashboard-hover rounded-dashboard-3xl border-dashboard-subtle flex flex-col gap-4 p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗓️</span>
          <h3 className="text-dashboard-primary font-bold dark:text-white">Calendar</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
            {monthNames[month]}{" "}
            <svg className="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <button className="font-bold text-gray-400">••</button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-bold text-gray-400">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-y-3">{days}</div>
    </div>
  );
}
