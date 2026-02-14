"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Auth pages that should not show user information
const AUTH_PAGES = ["/auth"];

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title: _title = "Dashboard" }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if current page is an auth page
  const isAuthPage = AUTH_PAGES.some((path) => pathname?.startsWith(path));

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

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/auth");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const initials = user?.email
    ? user.email.charAt(0).toUpperCase()
    : user?.full_name
      ? user.full_name.charAt(0).toUpperCase()
      : "A";

  return (
    <header className="border-border bg-background/95 sticky top-0 z-10 flex h-16 items-center justify-between border-b px-8 backdrop-blur">
      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
              <span className="sr-only">Toggle menu</span>
              <span className="material-symbols-outlined">menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="bg-card flex h-full flex-col">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        <div className="text-text-high font-bold tracking-widest uppercase">Flow</div>
      </div>

      {/* Search Bar */}
      <div className="hidden w-96 max-w-lg items-center md:flex">
        <div className="relative w-full">
          <span className="text-muted-foreground material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2">
            search
          </span>
          <input
            type="search"
            placeholder="Search projects, parts, or builders..."
            className="bg-card border-border text-foreground focus:border-primary focus:ring-primary placeholder-muted-foreground/50 w-full border py-2 pr-4 pl-10 text-sm focus:ring-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Button
          asChild
          size="sm"
          className="bg-primary hover:bg-primary-hover shadow-sharp hidden text-xs font-bold tracking-wider text-white uppercase sm:flex"
        >
          <a href="/admin/orders/new">
            <span className="material-symbols-outlined mr-2 text-base">add_circle</span>
            New Order
          </a>
        </Button>

        <button className="text-muted-foreground relative p-2 transition-colors hover:text-white">
          <span className="material-symbols-outlined">notifications</span>
          <span className="bg-accent border-background absolute top-2 right-2 size-2 rounded-full border-2"></span>
        </button>

        <button className="text-muted-foreground flex items-center justify-center p-2 transition-colors hover:text-white">
          <span className="material-symbols-outlined">help</span>
        </button>

        {!isAuthPage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 p-0 hover:bg-white/5">
                <Avatar className="border-border h-10 w-10 border">
                  <AvatarFallback className="bg-primary/10 text-primary flex h-full w-full items-center justify-center font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border w-56" align="end" sideOffset={12}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-foreground text-sm leading-none font-medium">
                    {user?.full_name || "Admin User"}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/admin/settings" className="flex w-full items-center gap-2">
                  <span className="material-symbols-outlined text-lg">settings</span>
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoading}
                className="text-destructive focus:text-destructive"
              >
                <span className="material-symbols-outlined mr-2 text-lg">logout</span>
                {isLoading ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
