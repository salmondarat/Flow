"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavSection } from "./nav-config";
import { useState, useEffect } from "react";

interface DashboardSidebarProps {
  navigation: NavSection[];
  role: "admin" | "client";
  user: { email?: string; full_name?: string } | null;
}

export function DashboardSidebar({ navigation, role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const activePath = pathname || "";
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <aside className="bg-card border-border z-20 hidden h-screen w-64 flex-shrink-0 flex-col border-r lg:flex">
      {/* Fixed: Logo Section */}
      <div className="border-border from-primary/5 to-transparent bg-gradient-to-b flex h-16 items-center border-b px-6">
        <span className="material-symbols-outlined text-primary icon-fill mr-3 text-xl">
          deployed_code
        </span>
        <h1 className="text-text-high text-xl font-bold tracking-widest uppercase">
          Flow<span className="text-primary">.sys</span>
        </h1>
      </div>

      {/* Scrollable: Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        {navigation.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <p className="text-text-muted mb-2 px-3 text-xs font-bold tracking-wider uppercase">
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
                      "flex items-center gap-3 border-l-2 px-3 py-2.5 transition-all",
                      isActive
                        ? "bg-primary/20 border-primary text-text-high shadow-sm"
                        : "text-text-medium border-transparent hover:bg-white/10 hover:text-text-high"
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
        <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border px-3 py-2">
          <div className="bg-primary/20 text-primary flex size-8 items-center justify-center rounded-full text-xs font-bold">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-text-high text-xs font-bold">
              {user?.full_name || `${role === "admin" ? "Admin" : "Client"} User`}
            </span>
            <span className="text-text-muted text-[10px] uppercase">
              {role === "admin" ? "System Op" : "Pilot"}
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="text-text-medium hover:text-text-high border-border hover:bg-muted/50 mt-3 flex items-center gap-3 border-l-2 border-transparent px-3 py-2 text-sm transition-all"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
