"use client";

import * as LucideIcons from "lucide-react";
import type { TimeTrackerState } from "./types";
import { useState, useEffect } from "react";

const { Pause, Stop } = LucideIcons;

export function TimerWidget() {
  const [timerState, setTimerState] = useState<TimeTrackerState>({
    isRunning: true,
    elapsedSeconds: 5048, // 01:24:08
  });

  const [displayTime, setDisplayTime] = useState<string>("01:24:08");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timerState.isRunning) {
      interval = setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning]);

  useEffect(() => {
    const hours = Math.floor(timerState.elapsedSeconds / 3600);
    const minutes = Math.floor((timerState.elapsedSeconds % 3600) / 60);
    const seconds = timerState.elapsedSeconds % 60;

    const formatted = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    setDisplayTime(formatted);
  }, [timerState.elapsedSeconds]);

  const handlePause = () => {
    setTimerState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleStop = () => {
    setTimerState({
      isRunning: false,
      elapsedSeconds: 0,
    });
  };

  return (
    <div className="relative flex min-h-62.5 flex-col justify-between overflow-hidden rounded-2xl bg-[#0e2a1e] p-6 text-white lg:col-span-1 dark:bg-black">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 -right-10 h-40 w-40 rounded-full border-20 border-green-800" />
        <div className="absolute top-20 -right-4 h-40 w-40 rounded-full border-20 border-green-700" />
        <div className="absolute top-32 right-6 h-40 w-40 rounded-full border-20 border-green-600" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="mb-8 font-medium text-gray-300">Time Tracker</h3>
        <div className="my-6 text-center">
          <p className="font-mono text-4xl font-bold tracking-widest">{displayTime}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 mt-auto flex justify-center gap-4">
        <button
          type="button"
          onClick={handlePause}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-900 transition-colors hover:bg-gray-200"
          aria-label={timerState.isRunning ? "Pause" : "Resume"}
        >
          <Pause className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleStop}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition-colors hover:bg-red-600"
          aria-label="Stop"
        >
          <Stop className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
