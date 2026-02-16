"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import nextDynamic from "next/dynamic";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));

// Force dynamic rendering to prevent static generation issues with client components
export const dynamic = "force-dynamic";

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: "Public Pages",
      links: [
        { href: "/", name: "Home" },
        { href: "/auth", name: "Login / Register" },
        { href: "/register", name: "Create Account" },
        { href: "/track", name: "Order Tracking" },
        { href: "/about", name: "About Us" },
        { href: "/contact", name: "Contact" },
      ],
    },
    {
      title: "Product",
      links: [
        { href: "/features", name: "Features" },
        { href: "/pricing", name: "Pricing" },
        { href: "/integrations", name: "Integrations" },
        { href: "/changelog", name: "Changelog" },
      ],
    },
    {
      title: "Client Portal",
      links: [
        { href: "/client/dashboard", name: "Dashboard" },
        { href: "/client/orders", name: "My Orders" },
        { href: "/client/profile", name: "Profile Settings" },
      ],
    },
    {
      title: "Admin Portal",
      links: [
        { href: "/admin/dashboard", name: "Dashboard" },
        { href: "/admin/orders", name: "Order Management" },
        { href: "/admin/clients", name: "Client Management" },
        { href: "/admin/analytics", name: "Analytics" },
        { href: "/admin/settings", name: "Settings" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", name: "Privacy Policy" },
        { href: "/terms", name: "Terms & Conditions" },
        { href: "/accessibility", name: "Accessibility" },
      ],
    },
  ];

  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight uppercase">
            Sitemap
          </h1>
          <p className="text-muted-foreground mb-12 text-lg">
            Navigate through all pages of the Flow platform
          </p>

          <div className="space-y-12">
            {sitemapSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-gundam-cyan mb-4 text-lg font-bold tracking-wider uppercase">
                  {section.title}
                </h2>
                <div className="bg-muted dark:bg-card border-border rounded-lg border p-6">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-gundam-cyan transition-colors hover:underline"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
