"use client";

import { cn } from "@/lib/utils";

/**
 * Meet Widget - Video meeting widget with preview
 *
 * Shows meeting preview, time, and join button
 */
export interface MeetWidgetProps {
  title?: string;
  time?: string;
  date?: string;
  onJoin?: () => void;
  className?: string;
}

export function MeetWidget({
  title = "Daily Scrum 👋",
  time = "10:00 - 10:15",
  date = "Sep 12",
  onJoin,
  className,
}: MeetWidgetProps) {
  return (
    <div
      className={cn(
        "dashboard-card dashboard-hover rounded-dashboard-3xl flex flex-col gap-4 border-dashboard-subtle p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h3 className="font-bold text-dashboard-primary dark:text-white">Meet Schedule</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
          <button className="text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative overflow-hidden rounded-2xl aspect-video bg-gray-200">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZRoht7Su73W5-Kad4A0bZbVjoWPYb5aVl47B6wsz-lFyhCNmfgJCPzBK7qmudEvrek_-VxSgXsdYoDJNLUfrXaUSucBEAp_LeEAbJQq87CfZMjO22Dk4i9asMG57vltXNp4lCUj3Eao_C_ll_uqBemc5xJ6-0li33pTFx-U2HAEs1YlrZvRDbZJAFtZJkQNcTPXa053H5A8hcAjF6uMnpKhIlTCGmdQJh0HsH3CcozeEspUVwZPOWomh-qsUv4zjrEAURrgBFR42"
          alt="Video Call Preview"
          className="h-full w-full object-cover"
        />
        {/* Overlay with controls */}
        <div className="absolute inset-0 flex items-end bg-black/10 p-3">
          <div className="flex w-full items-center justify-between">
            <span className="bg-black/20 text-white rounded-lg px-2 py-1 text-[10px] backdrop-blur-md">
              Preview
            </span>
            <div className="flex gap-2">
              <button className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
                </svg>
              </button>
              <button className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Details */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-dashboard-primary dark:text-white">
            {title}
          </h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            📅 {date} • ⏲️ {time}
          </p>
        </div>
        <button
          onClick={onJoin}
          className="border-dashboard-subtle rounded-lg px-3 py-1.5 text-[10px] font-bold flex items-center gap-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Join Meet
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </button>
      </div>
    </div>
  );
}
