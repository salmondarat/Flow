"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

/**
 * Search with Keyboard Shortcuts - Command palette style search
 *
 * Shows search input with keyboard shortcut badge (⌘S)
 */
export interface SearchWithShortcutsProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  shortcut?: string;
}

export function SearchWithShortcuts({
  placeholder = "Search here...",
  onSearch,
  className,
  shortcut = "⌘S",
}: SearchWithShortcutsProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Focus the search input
        const searchInput = document.getElementById("dashboard-search-input");
        searchInput?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={cn("relative w-full max-w-96", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
      <input
        id="dashboard-search-input"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="dashboard-input block w-full rounded-dashboard-xl border-none py-2 pl-10 pr-12 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <span className="text-gray-400 text-xs font-mono">{shortcut}</span>
      </div>
    </div>
  );
}
