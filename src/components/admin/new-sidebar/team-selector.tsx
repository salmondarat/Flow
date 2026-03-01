"use client";

import { cn } from "@/lib/utils";

/**
 * Team Selector - Dropdown for switching between teams/projects
 *
 * Displays selected team with privacy status and dropdown arrow
 */
export interface Team {
  id: string;
  name: string;
  privacy: "private" | "public";
  initials: string;
}

export interface TeamSelectorProps {
  currentTeam: Team;
  teams: Team[];
  onTeamChange: (teamId: string) => void;
  className?: string;
}

export function TeamSelector({
  currentTeam,
  teams,
  onTeamChange,
  className,
}: TeamSelectorProps) {
  return (
    <div
      className={cn(
        "dashboard-card rounded-dashboard-xl flex items-center justify-between border-dashboard-subtle p-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          {currentTeam.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-dashboard-primary">
            {currentTeam.name}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            {currentTeam.privacy === "private" ? "Private" : "Public"}
          </p>
        </div>
      </div>
      <svg
        className="h-4 w-4 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M19 9l-7 7-7-7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}

/**
 * Team Selector Dropdown - Full dropdown with team list
 */
export interface TeamSelectorDropdownProps extends TeamSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function TeamSelectorDropdown({
  currentTeam,
  teams,
  onTeamChange,
  isOpen,
  onToggle,
  className,
}: TeamSelectorDropdownProps) {
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={onToggle}
        className="dashboard-card w-full rounded-dashboard-xl flex items-center justify-between border-dashboard-subtle p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {currentTeam.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-dashboard-primary">
              {currentTeam.name}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {currentTeam.privacy === "private" ? "Private" : "Public"}
            </p>
          </div>
        </div>
        <svg
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform dark:text-gray-500",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {isOpen && (
        <div className="dashboard-card absolute left-0 right-0 top-full z-50 mt-2 rounded-dashboard-xl border-dashboard-subtle p-2 shadow-lg">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                onTeamChange(team.id);
                onToggle();
              }}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                team.id === currentTeam.id
                  ? "bg-gray-100 text-dashboard-primary font-semibold dark:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {team.initials}
                </div>
                <span>{team.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
