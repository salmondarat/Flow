"use client";

import { cn } from "@/lib/utils";

/**
 * Notes Widget - Quick notes widget
 *
 * Shows quick notes section
 */
export interface NotesWidgetProps {
  notes?: Array<{
    id: string;
    content: string;
    timestamp?: string;
  }>;
  onAddNote?: (content: string) => void;
  onDeleteNote?: (noteId: string) => void;
  className?: string;
}

const defaultNotes = [
  {
    id: "1",
    content: "Revamp Sidebar & Update before Sep 14 🔥",
    timestamp: "Today",
  },
];

export function NotesWidget({
  notes = defaultNotes,
  onAddNote,
  onDeleteNote,
  className,
}: NotesWidgetProps) {
  return (
    <div
      className={cn(
        "rounded-dashboard-3xl flex flex-col gap-4",
        "bg-pink-100 border-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg">📋</span>
        <h3 className="font-bold text-dashboard-primary">Notes</h3>
      </div>

      {/* Notes List */}
      <div className="flex flex-col gap-1">
        {notes.map((note) => (
          <div key={note.id} className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-dashboard-primary">
              {note.content}
            </p>
            {note.timestamp && (
              <p className="text-[10px] text-gray-500 mt-2 font-bold">
                {note.timestamp}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
