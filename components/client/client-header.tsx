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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { logout } from "@/lib/auth/client";

// Auth pages that should not show user information
const AUTH_PAGES = ["/auth", "/client/register"];

export function ClientHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if current page is an auth page
  const isAuthPage = AUTH_PAGES.some((path) => pathname?.startsWith(path));

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          const displayName = data.user.full_name || data.user.email?.split("@")[0] || "User";
          setUser({
            email: data.user.email,
            full_name: displayName,
          });
        }
      } catch {
        setUser(null);
      }
    }

    fetchUser();

    const handleFocus = () => fetchUser();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
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
      : "C";

  return (
    <nav className="bg-card border-border sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-6 lg:px-12">
      <div className="flex items-center gap-8">
        <Link
          href="/client/dashboard"
          className="text-primary flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="material-symbols-outlined text-3xl">token</span>
          <span className="font-display text-xl font-bold tracking-tight">FLOW // SYSTEM</span>
        </Link>
        <div className="ml-4 hidden items-center gap-1 md:flex">
          <Link
            href="/client/dashboard"
            className="text-primary bg-primary/10 border-primary border-b-2 px-4 py-2 text-sm font-semibold"
          >
            Dashboard
          </Link>
          <Link
            href="/client/orders"
            className="text-muted-foreground hover:text-primary hover:bg-muted px-4 py-2 text-sm font-medium transition-colors"
          >
            My Orders
          </Link>
          <Link
            href="/client/profile"
            className="text-muted-foreground hover:text-primary hover:bg-muted px-4 py-2 text-sm font-medium transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/client/settings"
            className="text-muted-foreground hover:text-primary hover:bg-muted px-4 py-2 text-sm font-medium transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-primary hover:bg-muted relative p-2 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="bg-secondary absolute top-2 right-2 h-2 w-2"></span>
        </button>
        {!isAuthPage && (
          <div className="border-border flex items-center gap-3 border-l pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold tracking-wide uppercase">
                {user?.full_name || "Client User"}
              </p>
              <p className="text-muted-foreground text-xs">
                Pilot ID: {user?.email?.split("@")[0] || "0079"}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-muted relative h-10 w-10 p-0">
                  <Avatar className="border-border h-10 w-10 border">
                    <AvatarFallback className="bg-primary/10 text-primary flex h-full w-full items-center justify-center font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-card border-border w-56"
                align="end"
                sideOffset={12}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-foreground text-sm leading-none font-medium">
                      {user?.full_name || "Client User"}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/client/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/client/settings")}>
                  Settings
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
          </div>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
