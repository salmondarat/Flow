"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown, Box, Users, FileText, Shield, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

interface MenuItem {
  title: string;
  href: string;
  description: string;
  icon?: React.ReactNode;
}

interface MegaMenu {
  id: string;
  label: string;
  items: MenuItem[];
  description: {
    title: string;
    text: string;
  };
}

const megaMenus: MegaMenu[] = [
  {
    id: "product",
    label: "Product",
    items: [
      {
        title: "Features",
        href: "/features",
        description: "Smart order intake, AI estimation, and client portals.",
        icon: <Box className="h-4 w-4" />,
      },
      {
        title: "Pricing",
        href: "/pricing",
        description: "Flexible plans for every builder, from solo to studio.",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: "Integrations",
        href: "/integrations",
        description: "Connect with your favorite tools and services.",
        icon: <Users className="h-4 w-4" />,
      },
    ],
    description: {
      title: "Flow",
      text: "The management platform for model kit studios. Streamline your build operations with smart tracking, AI estimation, and client portals.",
    },
  },
  {
    id: "solutions",
    label: "Solutions",
    items: [
      {
        title: "New Order",
        href: "/order",
        description: "Start a new custom build commission.",
        icon: <Box className="h-4 w-4" />,
      },
      {
        title: "Track Order",
        href: "/track",
        description: "Check the status of your existing orders.",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: "Client Portal",
        href: "/client/dashboard",
        description: "Access your dashboard and manage orders.",
        icon: <Users className="h-4 w-4" />,
      },
    ],
    description: {
      title: "Build Operations",
      text: "From order intake to delivery, manage your entire custom build workflow in one place.",
    },
  },
  {
    id: "company",
    label: "Company",
    items: [
      {
        title: "About",
        href: "/about",
        description: "Learn about our mission and the team behind Flow.",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Contact",
        href: "/contact",
        description: "Get in touch with our support team.",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: "Sitemap",
        href: "/sitemap",
        description: "Navigate through all available pages.",
        icon: <Box className="h-4 w-4" />,
      },
    ],
    description: {
      title: "About Flow",
      text: "Built by builders, for builders. We're on a mission to bring modern operations software to the custom model kit industry.",
    },
  },
  {
    id: "legal",
    label: "Legal",
    items: [
      {
        title: "Privacy Policy",
        href: "/privacy",
        description: "How we collect, use, and protect your data.",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        title: "Terms & Conditions",
        href: "/terms",
        description: "Rules and guidelines for using our platform.",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: "Accessibility",
        href: "/accessibility",
        description: "Our commitment to inclusive design.",
        icon: <Users className="h-4 w-4" />,
      },
    ],
    description: {
      title: "Legal & Trust",
      text: "Your trust is our foundation. We maintain the highest standards for data privacy, security, and accessibility.",
    },
  },
];

export function Header() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeMegaMenu = megaMenus.find((menu) => menu.id === activeMenu);

  const handleSignOut = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getDashboardPath = () => {
    if (!user) return "/client/dashboard";
    return user?.role === "admin" ? "/admin/dashboard" : "/client/dashboard";
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clearHideTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMenuEnter = useCallback(
    (menuId: string) => {
      clearHideTimeout();
      setActiveMenu(menuId);
    },
    [clearHideTimeout]
  );

  const handleMenuLeave = useCallback(() => {
    clearHideTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300); // 300ms delay before closing
  }, [clearHideTimeout]);

  const handleDropdownEnter = useCallback(() => {
    clearHideTimeout();
  }, [clearHideTimeout]);

  const handleDropdownLeave = useCallback(() => {
    clearHideTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  }, [clearHideTimeout]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navigation Bar */}
      <nav className="bg-background/80 border-b border-neutral-200/50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2"
            suppressHydrationWarning
          >
            <div className="bg-sidebar-primary flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check h-6 w-6" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <span className="text-sidebar-primary text-2xl font-bold tracking-tight">Flow</span>
          </Link>

          {/* Menu Items */}
          <div className="hidden items-center gap-8 md:flex">
            {megaMenus.map((menu) => (
              <button
                key={menu.id}
                className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeMenu === menu.id
                    ? "text-brand-500"
                    : "text-text-muted hover:text-text-high dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
                onMouseEnter={() => handleMenuEnter(menu.id)}
                onMouseLeave={handleMenuLeave}
              >
                {menu.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    activeMenu === menu.id ? "rotate-180" : ""
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Desktop Actions */}
            <div className="hidden items-center gap-4 md:flex">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={getDashboardPath()}
                    className="text-text-muted hover:text-text-high flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <div className="border-border flex items-center gap-3 rounded-full border px-3 py-1.5">
                    <div className="bg-sidebar-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-text-high text-sm font-medium">
                      {user.full_name || user.email?.split("@")[0]}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-text-muted hover:text-text-high"
                      onClick={handleSignOut}
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-text-muted hover:text-text-high text-sm font-medium transition-colors dark:text-neutral-400 dark:hover:text-neutral-200"
                    suppressHydrationWarning
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-brand-500 hover:bg-brand-600 text-muted dark:text-base-200 transition-color rounded-lg px-4 py-2 text-sm font-medium dark:text-neutral-200 dark:hover:text-neutral-200"
                    suppressHydrationWarning
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75 sm:w-100">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex h-full flex-col">
                  {/* Mobile Menu Header */}
                  <div className="border-border flex items-center justify-between border-b pb-4">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="bg-sidebar-primary flex h-10 w-10 items-center justify-center rounded-xl text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check h-6 w-6" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                      </div>
                      <span className="text-sidebar-primary text-2xl font-bold tracking-tight">
                        Flow
                      </span>
                    </Link>
                  </div>

                  {/* Mobile Menu Links */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-6">
                      {megaMenus.map((menu) => (
                        <div key={menu.id} className="space-y-3">
                          <h3 className="text-text-high text-sm font-semibold tracking-wider uppercase">
                            {menu.label}
                          </h3>
                          <ul className="space-y-2">
                            {menu.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="text-text-muted hover:text-text-high flex items-center gap-3 rounded-lg p-2 text-sm transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <span className="text-neutral-400">{item.icon}</span>
                                  <span>{item.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="border-border border-t pt-4">
                    {isLoading ? (
                      <div className="h-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                    ) : user ? (
                      <div className="flex flex-col gap-3">
                        <div className="border-border flex items-center gap-3 rounded-lg border p-3">
                          <div className="bg-sidebar-primary flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold text-white">
                            {user.email?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-text-high text-sm font-semibold">
                              {user.full_name || user.email?.split("@")[0]}
                            </span>
                            <span className="text-text-muted text-xs capitalize">
                              {user.role || "User"}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={getDashboardPath()}
                          className="text-text-muted hover:text-text-high flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium transition-colors dark:border-neutral-700"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Go to Dashboard
                        </Link>
                        <Button
                          variant="outline"
                          className="text-text-muted hover:text-text-high"
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link
                          href="/auth"
                          className="text-text-muted hover:text-text-high text-center text-sm font-medium transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="bg-brand-500 hover:bg-brand-600 text-high rounded-lg px-4 py-3 text-center text-sm font-medium transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Get Started
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Mega Menu Dropdown */}
      <div
        className={`absolute top-full right-0 left-0 overflow-hidden border-b border-neutral-200 bg-white shadow-sm transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 ${
          activeMenu ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
        }`}
        onMouseEnter={handleDropdownEnter}
        onMouseLeave={handleDropdownLeave}
      >
        {activeMegaMenu && (
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-2 gap-12">
              {/* Left Column - Menu Items */}
              <div className="space-y-1">
                {activeMegaMenu.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    suppressHydrationWarning
                  >
                    <div className="group-hover:text-brand-500 mt-0.5 text-neutral-400 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-text-high group-hover:text-brand-500 text-sm font-medium transition-colors dark:text-neutral-100">
                        {item.title}
                      </div>
                      <div className="text-text-muted mt-0.5 text-xs dark:text-neutral-400">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right Column - Description */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-text-high mb-2 text-sm font-medium dark:text-neutral-100">
                    {activeMegaMenu.description.title}
                  </h3>
                  <p className="text-text-medium text-sm leading-relaxed dark:text-neutral-400">
                    {activeMegaMenu.description.text}
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/register"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm font-medium"
                    suppressHydrationWarning
                  >
                    Get started free →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
