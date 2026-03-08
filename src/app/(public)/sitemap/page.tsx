"use client";

import React from "react";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { Layout, Sparkles, ArrowRight } from "lucide-react";

const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

export const dynamic = "force-dynamic";

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: "Public Pages",
      description: "Main pages for all visitors",
      gradient: "from-blue-500 to-indigo-600",
      links: [
        { href: "/", name: "Home", icon: "🏠" },
        { href: "/auth", name: "Login / Register", icon: "🔐" },
        { href: "/register", name: "Create Account", icon: "📝" },
        { href: "/track", name: "Order Tracking", icon: "📦" },
        { href: "/about", name: "About Us", icon: "ℹ️" },
        { href: "/contact", name: "Contact", icon: "📧" },
      ],
    },
    {
      title: "Product",
      description: "Learn about Flow's features and pricing",
      gradient: "from-purple-500 to-pink-600",
      links: [
        { href: "/features", name: "Features", icon: "⚡" },
        { href: "/pricing", name: "Pricing", icon: "💰" },
        { href: "/integrations", name: "Integrations", icon: "🔗" },
        { href: "/changelog", name: "Changelog", icon: "📋" },
      ],
    },
    {
      title: "Client Portal",
      description: "Manage your orders and account",
      gradient: "from-emerald-500 to-teal-600",
      links: [
        { href: "/client/dashboard", name: "Dashboard", icon: "📊" },
        { href: "/client/orders", name: "My Orders", icon: "📦" },
        { href: "/client/profile", name: "Profile Settings", icon: "⚙️" },
      ],
    },
    {
      title: "Admin Portal",
      description: "Studio management and administration",
      gradient: "from-orange-500 to-red-600",
      links: [
        { href: "/admin/dashboard", name: "Dashboard", icon: "🎯" },
        { href: "/admin/orders", name: "Order Management", icon: "📦" },
        { href: "/admin/clients", name: "Client Management", icon: "👥" },
        { href: "/admin/analytics", name: "Analytics", icon: "📈" },
        { href: "/admin/settings", name: "Settings", icon: "⚙️" },
      ],
    },
    {
      title: "Legal",
      description: "Terms, privacy, and accessibility information",
      gradient: "from-cyan-500 to-blue-600",
      links: [
        { href: "/privacy", name: "Privacy Policy", icon: "🔒" },
        { href: "/terms", name: "Terms & Conditions", icon: "📜" },
        { href: "/accessibility", name: "Accessibility", icon: "♿" },
      ],
    },
  ];

  return (
    <div className="light:bg-white light:text-zinc-900 min-h-screen bg-zinc-950 font-sans text-white transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="light:from-indigo-100 light:via-purple-50 absolute top-0 left-1/2 h-200 w-200 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-900/20 via-purple-900/10 to-transparent opacity-50 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10">
                <Layout className="light:text-zinc-600 h-4 w-4 text-zinc-400" />
                <span className="light:text-zinc-700 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  Sitemap
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Navigate
                <span className="light:from-zinc-900 light:via-zinc-800 block bg-linear-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
                  the platform
                </span>
              </h1>

              <p className="light:text-zinc-600 mb-12 text-xl leading-relaxed text-zinc-400">
                Explore all pages and features of the Flow platform
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {sitemapSections.map((section) => (
                <div
                  key={section.title}
                  className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
                >
                  <div className="relative p-8">
                    <div
                      className={`absolute -top-4 -right-4 h-24 w-24 rounded-full bg-linear-to-br ${section.gradient} opacity-0 blur-3xl`}
                    />

                    <div className="mb-6 flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${section.gradient} text-white shadow-lg`}
                      >
                        <Layout className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="light:text-zinc-900 mb-1 text-xl font-bold text-white">
                          {section.title}
                        </h2>
                        <p className="text-sm text-zinc-500">{section.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="group light:text-zinc-700 light:hover:bg-zinc-900/5 flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition-all hover:bg-white/5"
                        >
                          <span className="text-lg">{link.icon}</span>
                          <span className="flex-1">{link.name}</span>
                          <ArrowRight className="light:text-zinc-400 h-4 w-4 text-zinc-600 opacity-0 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="light:bg-zinc-50 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Sparkles className="light:text-zinc-300 mx-auto mb-8 h-16 w-16 text-zinc-600" />
            <h2 className="light:text-zinc-900 mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Cannot Find What You Are Looking For?
            </h2>
            <p className="light:text-zinc-600 mx-auto mb-8 max-w-2xl text-xl text-zinc-400">
              Need help navigating or finding a specific page? Our support team is here to assist
              you.
            </p>
            <Link
              href="/contact"
              className="light:bg-zinc-900 light:text-white light:shadow-zinc-900/25 light:hover:bg-zinc-800 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/25 transition-all hover:scale-105 hover:bg-zinc-200 active:scale-95"
            >
              Contact Support
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
