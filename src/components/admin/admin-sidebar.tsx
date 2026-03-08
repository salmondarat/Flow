"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  CheckCircle2,
  CalendarDays,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Crown,
  ArrowRight,
  Package,
  Bell,
  Moon,
  Sun,
  Plus,
} from "lucide-react";

// Menu navigation items (top section)
const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { name: "Tasks", href: "/admin/tasks", icon: CheckCircle2, badge: "12+" },
  { name: "Orders", href: "/admin/orders", icon: Package },
  { name: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Clients", href: "/admin/clients", icon: Users },
];

// General navigation items (bottom section)
const generalItems = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Help", href: "/admin/help", icon: HelpCircle },
  { name: "Logout", href: "/logout", icon: LogOut },
];

// Mobile-only action buttons
const mobileActionButtons = [
  {
    name: "Notifications",
    icon: Bell,
    action: () => console.log("Notifications clicked"),
  },
  {
    name: "Help",
    icon: HelpCircle,
    action: () => console.log("Help clicked"),
  },
  {
    name: "New Order",
    icon: Plus,
    action: () => console.log("New Order clicked"),
  },
];

export function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href || pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by using theme || checking mounted
  const currentTheme = theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden">
      {/* Logo Section */}
      <Link
        href="/"
        className="hover:bg-sidebar-accent/20 flex min-w-0 shrink-0 items-center space-x-2 overflow-hidden p-4 transition-colors"
      >
        <div className="bg-sidebar-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <span className="text-sidebar-primary truncate text-xl font-bold tracking-tight">Flow</span>
      </Link>

      {/* Navigation */}
      <nav className="min-w-0 flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-2">
        {/* Menu Section */}
        <div className="min-w-0">
          <h3 className="text-sidebar-muted mb-3 truncate px-2 text-xs font-semibold tracking-wider uppercase">
            Menu
          </h3>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name} className="min-w-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2 overflow-hidden rounded-lg px-2 py-2.5 transition-colors",
                      active
                        ? "bg-sidebar-primary shadow-soft text-white"
                        : "text-sidebar-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        active ? "text-white" : "group-hover:text-sidebar-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "truncate text-sm font-medium transition-colors",
                        active
                          ? "text-white"
                          : "group-hover:text-sidebar-text dark:group-hover:text-white"
                      )}
                    >
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="bg-sidebar-primary ml-auto shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* General Section */}
        <div className="min-w-0">
          <h3 className="text-sidebar-muted mb-3 truncate px-2 text-xs font-semibold tracking-wider uppercase">
            General
          </h3>
          <ul className="space-y-1">
            {generalItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name} className="min-w-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2 overflow-hidden rounded-lg px-2 py-2.5 transition-colors",
                      active
                        ? "bg-sidebar-primary shadow-soft text-white"
                        : "text-sidebar-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    onClick={(e) => {
                      if (item.name === "Logout") {
                        e.preventDefault();
                        handleLogout();
                      }
                    }}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        active ? "text-white" : "group-hover:text-sidebar-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "truncate text-sm font-medium transition-colors",
                        active
                          ? "text-white"
                          : "group-hover:text-sidebar-text dark:group-hover:text-white"
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Actions Section - Mobile Only */}
        <div className="min-w-0 lg:hidden">
          <h3 className="text-sidebar-muted mb-3 truncate px-2 text-xs font-semibold tracking-wider uppercase">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-2 px-2">
            {mobileActionButtons.map((button) => {
              const Icon = button.icon;
              return (
                <button
                  key={button.name}
                  onClick={button.action}
                  className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-sidebar-muted transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label={button.name}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-[10px] font-medium truncate w-full text-center">
                    {button.name}
                  </span>
                </button>
              );
            })}
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-sidebar-muted transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {mounted && (
                <>
                  {isDark ? (
                    <Sun className="h-5 w-5 shrink-0" />
                  ) : (
                    <Moon className="h-5 w-5 shrink-0" />
                  )}
                  <span className="text-[10px] font-medium truncate w-full text-center">
                    Theme
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Subscriptions Offer Card - Hidden on mobile */}
      <div className="mt-auto min-w-0 shrink-0 overflow-hidden p-3 max-lg:hidden">
        <div className="relative w-full max-w-full min-w-0 overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-4">
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 flex w-full max-w-full min-w-0 flex-col items-center">
            <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <Crown className="h-4.5 w-4.5 shrink-0" />
            </div>
            <h4 className="mb-1 w-full truncate text-xs font-semibold text-white">
              Upgrade to Premium
            </h4>
            <p className="mb-3 w-full truncate text-[10px] text-white/80">Unlock all features</p>
            <button className="inline-flex w-full max-w-full min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-orange-600 transition-colors hover:bg-white/90">
              <Sparkles className="h-3 w-3 shrink-0" />
              <span className="truncate">View Plans</span>
              <ArrowRight className="h-3 w-3 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="bg-sidebar-surface-light dark:bg-sidebar-surface-dark hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-gray-200 lg:flex dark:border-gray-700">
      <SidebarContent />
    </aside>
  );
}
