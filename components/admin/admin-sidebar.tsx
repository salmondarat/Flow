"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const menuGroups = [
  {
    label: "Main Menu",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
      { name: "Active Builds", href: "/admin/orders", icon: "handyman" },
      { name: "Estimations", href: "/admin/orders", icon: "request_quote" },
      { name: "Inventory", href: "/admin/analytics", icon: "inventory_2" },
    ],
  },
  {
    label: "Team",
    items: [
      { name: "Clients", href: "/admin/clients", icon: "engineering" },
      { name: "Messages", href: "/admin/messages", icon: "schedule" },
    ],
  },
];

export function SidebarContent() {
  const pathname = usePathname();
  const activePath = pathname === "/admin" ? "/admin/dashboard" : pathname;
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const metadata = user.user_metadata as Record<string, unknown> | null;
          setUser({
            email: user.email,
            full_name: (metadata?.full_name as string | undefined) || user.email?.split("@")[0],
          });
        }
      } catch {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  const initials = user?.email
    ? user.email.charAt(0).toUpperCase()
    : user?.full_name
      ? user.full_name.charAt(0).toUpperCase()
      : "A";

  return (
    <>
      {/* Logo Section */}
      <div className="border-border bg-base-200 flex h-16 items-center border-b px-6">
        <span className="material-symbols-outlined text-primary icon-fill mr-3 text-xl">
          deployed_code
        </span>
        <h1 className="text-text-high text-xl font-bold tracking-widest uppercase">Flow</h1>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-1">
            <p className="text-muted-foreground mb-2 px-3 text-xs font-bold tracking-wider uppercase">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = activePath === item.href || activePath.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 border-l-2 px-3 py-2.5 transition-colors",
                    isActive
                      ? "bg-primary/10 border-primary text-text-high"
                      : "text-muted-foreground hover:text-text-high border-transparent hover:bg-white/5"
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
        ))}
      </div>

      {/* Bottom Section */}
      <div className="border-border border-t p-4">
        <Link
          href="/admin/settings"
          className="text-muted-foreground hover:text-text-high flex items-center gap-3 border-l-2 border-transparent px-3 py-2 transition-colors hover:bg-white/5"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <div className="border-border bg-base-200 mt-4 flex items-center gap-3 border px-3 py-2">
          <div className="bg-primary/20 text-primary flex size-8 items-center justify-center rounded-full text-xs font-bold">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-text-high text-xs font-bold">
              {user?.full_name || "Admin User"}
            </span>
            <span className="text-muted-foreground text-[10px]">System Op</span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-text-high mt-4 w-full justify-start gap-3 hover:bg-white/5"
          asChild
        >
          <Link href="/">
            <span className="material-symbols-outlined text-lg">logout</span>
            Back to Site
          </Link>
        </Button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  return (
    <aside className="bg-card border-border z-20 hidden h-full w-64 flex-shrink-0 flex-col border-r lg:flex">
      <SidebarContent />
    </aside>
  );
}
