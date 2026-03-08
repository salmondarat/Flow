"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/admin/admin-sidebar";
import { SearchWithShortcuts } from "@/components/admin/search/search-with-shortcuts";
import { useAuth } from "@/lib/auth/auth-context";

// Auth pages that should not show user information
const AUTH_PAGES = ["/auth"];

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title: _title = "Dashboard" }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  // Check if current page is an auth page
  const isAuthPage = AUTH_PAGES.some((path) => pathname?.startsWith(path));

  const handleLogout = async () => {
    try {
      const { logout } = await import("@/lib/auth/client");
      await logout();
      router.push("/auth");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const initials = user?.email
    ? user.email.charAt(0).toUpperCase()
    : user?.full_name
      ? user.full_name.charAt(0).toUpperCase()
      : "A";

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Brenda";
  const displayEmail = user?.email || "user@example.com";

  return (
    <header
      className="flex h-full w-full items-center justify-center px-4 py-4 md:px-8"
      suppressHydrationWarning
    >
      <div
        className="flex w-full max-w-7xl items-center justify-between gap-2 md:gap-6"
        suppressHydrationWarning
      >
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 lg:hidden flex-shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
            <SheetContent side="left" className="w-64 overflow-hidden p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex h-full flex-col min-w-0">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Bar - Compact on mobile, full width on larger screens */}
        <div className="flex-1 max-w-64 md:max-w-96 min-w-0">
          <SearchWithShortcuts placeholder="Search task" className="flex w-full" />
        </div>

        {/* Right Actions - Compact horizontal header */}
        <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
          {/* Back to Site - Always visible */}
          <Link
            href="/"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:text-emerald-600 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-emerald-400"
            suppressHydrationWarning
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
              <polyline
                points="9 22 9 12 15 12 15 22"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </Link>

          {/* Mail Icon - Hidden on mobile */}
          <button className="hidden sm:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:text-emerald-600 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-emerald-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </button>

          {/* Notifications Icon - Hidden on mobile */}
          <button className="hidden sm:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:text-emerald-600 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-emerald-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </button>

          {/* Dark Mode Toggle - Hidden on mobile */}
          <button
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="hidden sm:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:text-emerald-600 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-emerald-400"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </button>

          {/* User Profile - Avatar always visible, text hidden on mobile */}
          {!isAuthPage && user && (
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 border-l border-gray-200 pl-2 sm:pl-6 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition-colors"
              suppressHydrationWarning
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9Xia8UTvQRkZILRRog998rPqODWDugqzdgMcrdwpmI8tgycZN3wIaqRZJTJ9UGFw8a80pgxNYSPug4VfJQjxCsleHJLT5gGMyO9C_R4BV_2oIKZ9YwVqyVf_ly_3-g6mEzsCyntjBnrCLgA5PEVmAfU681RmnLr9bv4jfwOlUGfXlNNvHBTGAaLOgNKokN-x6fwHb_R5rKr_zR2FSJWiWDZXcVpPRInCJHu0ttGna34JuMx30OvrV09zsxq0HlgGaH6myCPJtj9ng"
                alt={displayName}
                width={40}
                height={40}
                className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white object-cover shadow-sm dark:border-gray-600"
              />
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
