"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  role: "admin" | "client";
  title?: string;
}

export function DashboardHeader({ role, title }: DashboardHeaderProps) {
  const router = useRouter();
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
    <header className="border-border bg-card/80 backdrop-blur-sm flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger - for future implementation */}
        <button className="lg:hidden text-text-medium hover:text-text-high p-2">
          <span className="material-symbols-outlined">menu</span>
        </button>
        {title && (
          <h2 className="text-text-high text-lg font-semibold">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Role-specific actions */}
        {role === "admin" && (
          <Button size="sm" className="shadow-sharp text-white">
            <span className="material-symbols-outlined mr-1 text-sm">add</span>
            New Order
          </Button>
        )}

        {/* Search (admin only) */}
        {role === "admin" && (
          <div className="hidden md:flex">
            <div className="border-border bg-muted/50 flex items-center gap-2 rounded-lg border px-3 py-1.5">
              <span className="material-symbols-outlined text-text-muted text-sm">search</span>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-text-medium placeholder:text-text-muted text-sm outline-none w-40"
              />
            </div>
          </div>
        )}

        {/* Notifications */}
        <button className="text-text-medium hover:text-text-high relative p-2 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="bg-secondary absolute top-2 right-2 h-2 w-2 rounded-full"></span>
        </button>

        {/* Help */}
        <button className="text-text-medium hover:text-text-high p-2 transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <div className="border-border flex items-center gap-3 border-l pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-text-high text-xs font-bold uppercase">
              {user?.full_name || "User"}
            </p>
            <p className="text-text-muted text-xs">
              {role === "admin" ? "Administrator" : "Client"}
            </p>
          </div>
          <button
            onClick={() => router.push(role === "admin" ? "/admin/settings" : "/client/settings")}
            className="bg-primary/20 text-primary hover:bg-primary/30 flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors"
          >
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </button>
        </div>
      </div>
    </header>
  );
}
