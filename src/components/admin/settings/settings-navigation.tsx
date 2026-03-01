"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Building,
  Bell,
  Wrench,
  Layers,
  PlusCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";

export interface SettingsTab {
  id: string;
  label: string;
  icon: typeof User;
  href: string;
  variant?: "default" | "danger";
}

const tabs: SettingsTab[] = [
  { id: "profile", label: "Profile", icon: User, href: "/admin/settings" },
  { id: "business", label: "Business", icon: Building, href: "/admin/settings" },
  { id: "notifications", label: "Notifications", icon: Bell, href: "/admin/settings" },
  { id: "services", label: "Service Types", icon: Wrench, href: "/admin/settings/services" },
  { id: "complexities", label: "Complexities", icon: Layers, href: "/admin/settings/complexities" },
  { id: "addons", label: "Add-ons", icon: PlusCircle, href: "/admin/settings/addons" },
  { id: "forms", label: "Form Templates", icon: FileText, href: "/admin/settings/form-templates" },
  {
    id: "danger",
    label: "Danger Zone",
    icon: AlertTriangle,
    href: "/admin/settings",
    variant: "danger",
  },
];

interface SettingsNavigationProps {
  activeTab?: string;
}

export function SettingsNavigation({ activeTab }: SettingsNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = activeTab || searchParams.get("tab") || "profile";

  const isActive = (tab: SettingsTab) => {
    if (tab.href !== "/admin/settings") {
      return pathname === tab.href;
    }
    return pathname === "/admin/settings" && currentTab === tab.id;
  };

  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-1 overflow-x-auto px-1 pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);

          return (
            <Link
              key={tab.id}
              href={tab.href !== "/admin/settings" ? tab.href : `/admin/settings?tab=${tab.id}`}
              className={cn(
                "group relative flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? tab.variant === "danger"
                    ? "border-destructive bg-destructive/5 text-destructive"
                    : "border-primary bg-primary/5 text-primary"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-100"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "" : "group-hover:text-gray-900 dark:group-hover:text-gray-100"
                )}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
