"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { NavSection } from "./nav-config";
import { SidebarContent } from "./sidebar-content";
import { useAuth } from "@/lib/auth/auth-context";

interface DashboardHeaderProps {
  navigation: NavSection[];
  role: "admin" | "client";
  title?: string;
}

export function DashboardHeader({ navigation, role, title }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [userState, setUserState] = useState<{ email?: string; full_name?: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUserState(data.user);
        }
      } catch {
        setUserState(null);
      }
    }
    fetchUser();
  }, []);

  // Check if current page is an auth page
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <header className="border-border bg-card/80 backdrop-blur-sm flex h-16 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white h-10 w-10"
              >
                <span className="sr-only">Toggle menu</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-hidden p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex h-full flex-col min-w-0">
                <SidebarContent navigation={navigation} role={role} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Back to Site */}
        <Link
          href="/"
          className="text-text-medium hover:text-text-high border-border hover:bg-muted/50 flex items-center gap-2 border px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm sm:text-base">home</span>
          <span className="hidden xs:inline sm:inline">Back to Site</span>
        </Link>

        {title && (
          <h2 className="text-text-high hidden xs:block text-sm sm:text-lg font-semibold truncate max-w-30 sm:max-w-none">
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search (admin only) - visible on all screens with responsive width */}
        {role === "admin" && (
          <div className="flex">
            <div className="border-border bg-muted/50 flex items-center gap-2 rounded-lg border px-2 sm:px-3 py-1.5">
              <span className="material-symbols-outlined text-text-muted text-sm">search</span>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-text-medium placeholder:text-text-muted text-sm outline-none w-24 sm:w-40 md:w-64"
              />
            </div>
          </div>
        )}

        {/* Role-specific actions - hidden on mobile */}
        {role === "admin" && (
          <Button size="sm" className="hidden sm:flex shadow-sharp text-white">
            <span className="material-symbols-outlined mr-1 text-sm">add</span>
            New Order
          </Button>
        )}

        {/* Notifications - hidden on mobile */}
        <button className="hidden sm:flex text-text-medium hover:text-text-high relative p-2 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="bg-secondary absolute top-2 right-2 h-2 w-2 rounded-full"></span>
        </button>

        {/* Help - hidden on mobile */}
        <button className="hidden sm:flex text-text-medium hover:text-text-high p-2 transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>

        {/* Theme Toggle - hidden on mobile */}
        <div className="hidden sm:flex">
          <ThemeToggle />
        </div>

        {/* User Menu */}
        <div className="border-border flex items-center gap-2 sm:gap-3 border-l pl-2 sm:pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-text-high text-xs font-bold uppercase">
              {userState?.full_name || user?.full_name || "User"}
            </p>
            <p className="text-text-muted text-xs">{role === "admin" ? "Administrator" : "Client"}</p>
          </div>
          <button
            onClick={() => router.push(role === "admin" ? "/admin/settings" : "/client/settings")}
            className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer flex size-8 sm:size-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-colors"
          >
            {userState?.email?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
          </button>
        </div>
      </div>
    </header>
  );
}
