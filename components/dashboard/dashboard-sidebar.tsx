"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavSection } from "./nav-config";
import { useAuth } from "@/lib/auth/auth-context";

interface DashboardSidebarProps {
  navigation: NavSection[];
  role: "admin" | "client";
}

export function DashboardSidebar({ navigation, role }: DashboardSidebarProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const activePath = pathname || "";

  return (
    <aside className="bg-card border-border z-20 hidden h-screen w-64 shrink-0 flex-col border-r lg:flex">
      {/* Fixed: Logo Section */}
      <Link
        href="/"
        className="border-border hover:bg-primary/10 flex h-16 items-center border-b px-6 transition-colors"
      >
        <div className="bg-sidebar-primary flex h-10 w-10 items-center justify-center rounded-xl text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check h-6 w-6" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <span className="text-sidebar-primary text-2xl font-bold tracking-tight">Flow</span>
      </Link>

      {/* Scrollable: Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-6">
        {navigation.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <p className="text-text-muted mb-2 px-2 text-xs font-bold tracking-wider uppercase">
              {group.label}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = activePath === item.href || activePath.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 border-l-2 px-2 py-2 transition-all",
                      isActive
                        ? "bg-primary/20 border-primary text-text-high shadow-sm"
                        : "text-text-medium hover:text-text-high border-transparent hover:bg-white/10"
                    )}
                  >
                    <span className={cn("material-symbols-outlined", isActive ? "icon-fill" : "")}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed: Bottom Section */}
      <div className="border-border border-t p-4">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <div className="size-8 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-2 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </div>
        ) : user ? (
          <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border px-3 py-2">
            <div className="bg-sidebar-primary flex size-8 items-center justify-center rounded-full text-xs font-bold text-white">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-text-high text-xs font-bold">
                {user.full_name || `${role === "admin" ? "Admin" : "Client"} User`}
              </span>
              <span className="text-text-muted text-[10px] uppercase">
                {user.role === "admin" ? "System Op" : "Pilot"}
              </span>
            </div>
          </div>
        ) : null}
        <Link
          href="/"
          className="text-text-medium hover:text-text-high border-border hover:bg-muted/50 mt-3 flex items-center gap-3 border-l-2 px-3 py-2 text-sm transition-all"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
