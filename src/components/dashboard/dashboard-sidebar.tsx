"use client";

import { SidebarContent } from "./sidebar-content";
import type { NavSection } from "./nav-config";

interface DashboardSidebarProps {
  navigation: NavSection[];
  role: "admin" | "client";
}

export function DashboardSidebar({ navigation, role }: DashboardSidebarProps) {
  return (
    <aside className="bg-card border-border z-20 hidden h-screen w-64 shrink-0 flex-col border-r lg:flex">
      <SidebarContent navigation={navigation} role={role} />
    </aside>
  );
}
