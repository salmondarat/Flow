"use client";

import { Pause, Stop } from "lucide-react";
import type { TimeTrackerState } from "../dashboard/types";
import { useState, useEffect } from "react";

export function TimerWidget() {
  const [timerState, setTimerState] = useState<TimeTrackerState>({
    isRunning: true,
    elapsedSeconds: 5048, // 01:24:08
  });

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
    <div className="lg:col-span-1 bg-[#0e2a1e] dark:bg-black rounded-2xl p-6 relative overflow-hidden text-white flex flex-col justify-between min-h-62.5">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -right-10 top-10 w-40 h-40 rounded-full border-20 border-green-800" />
        <div className="absolute -right-4 top-20 w-40 h-40 rounded-full border-20 border-green-700" />
        <div className="absolute right-6 top-32 w-40 h-40 rounded-full border-20 border-green-600" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-medium text-gray-300 mb-8">Time Tracker</h3>
        <div className="text-center my-6">
          <p className="text-4xl font-mono font-bold tracking-widest">
            {(() => {
              const hours = Math.floor(timerState.elapsedSeconds / 3600);
              const minutes = Math.floor((timerState.elapsedSeconds % 3600) / 60);
              const seconds = timerState.elapsedSeconds % 60;
              return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            })()}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex justify-center gap-4 mt-auto">
        <button
          onClick={handlePause}
          className="w-10 h-10 rounded-full bg-white text-green-900 flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label={timerState.isRunning ? "Pause" : "Resume"}
        >
          <Pause className="h-5 w-5" />
        </button>
        <button
          onClick={handleStop}
          className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
          aria-label="Stop"
        >
          <Stop className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
