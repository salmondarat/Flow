"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

// Menu navigation items (top section)
const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { name: "Tasks", href: "/admin/tasks", icon: CheckCircle2, badge: "12+" },
  { name: "Orders", href: "/admin/orders", icon: Package },
  { name: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Team", href: "/admin/clients", icon: Users },
];

// General navigation items (bottom section)
const generalItems = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Help", href: "/admin/help", icon: HelpCircle },
  { name: "Logout", href: "/logout", icon: LogOut },
];

export function SidebarContent() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href || pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <Link href="/" className="flex items-center space-x-3 p-6 hover:bg-sidebar-accent/20 transition-colors">
        <div className="bg-sidebar-primary flex h-10 w-10 items-center justify-center rounded-xl text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <span className="text-sidebar-primary text-2xl font-bold tracking-tight">Flow</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 overflow-y-auto px-4">
        {/* Menu Section */}
        <div>
          <h3 className="text-sidebar-muted mb-4 px-4 text-xs font-semibold tracking-wider uppercase">
            Menu
          </h3>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-4 py-3 transition-colors",
                      active
                        ? "bg-sidebar-primary shadow-soft text-white"
                        : "text-sidebar-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          active ? "text-white" : "group-hover:text-sidebar-primary"
                        )}
                      />
                      <span
                        className={cn(
                          "font-medium transition-colors",
                          active
                            ? "text-white"
                            : "group-hover:text-sidebar-text dark:group-hover:text-white"
                        )}
                      >
                        {item.name}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="bg-sidebar-primary rounded-md px-2 py-0.5 text-xs font-bold text-white">
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
        <div>
          <h3 className="text-sidebar-muted mb-4 px-4 text-xs font-semibold tracking-wider uppercase">
            General
          </h3>
          <ul className="space-y-1">
            {generalItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center space-x-3 rounded-xl px-4 py-3 transition-colors",
                      active
                        ? "bg-sidebar-primary shadow-soft text-white"
                        : "text-sidebar-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        active ? "text-white" : "group-hover:text-sidebar-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium transition-colors",
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
      </nav>

      {/* Subscriptions Offer Card */}
      <div className="mt-auto p-4">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 p-5 text-center">
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
              <Crown className="h-5 w-5" />
            </div>
            <h4 className="mb-1 text-sm font-semibold text-white">
              Upgrade to
              <br />
              Premium
            </h4>
            <p className="mb-4 text-xs text-white/80">Unlock all features</p>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-xs font-semibold text-orange-600 transition-colors hover:bg-white/90">
              <Sparkles className="h-3 w-3" />
              View Plans
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="bg-sidebar-surface-light dark:bg-sidebar-surface-dark flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-gray-200 lg:flex dark:border-gray-700">
      <SidebarContent />
    </aside>
  );
}
