"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import nextDynamic from "next/dynamic";
import {
  CreditCard,
  Mail,
  BarChart,
  HardDrive,
  Sparkles,
  Link as LinkIcon,
  Check,
} from "lucide-react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

// Force dynamic rendering to prevent static generation issues with client components
export const dynamic = "force-dynamic";

interface IntegrationCategory {
  category: string;
  description: string;
  icon: React.ReactNode;
  tools: {
    name: string;
    status: "Available" | "Built-in" | "Coming Soon";
    description: string;
  }[];
}

const integrations: IntegrationCategory[] = [
  {
    category: "Payment Processing",
    description: "Accept payments globally with trusted payment providers",
    icon: <CreditCard className="h-5 w-5" />,
    tools: [
      { name: "Stripe", status: "Available", description: "Accept payments globally" },
      { name: "PayPal", status: "Available", description: "Popular payment option" },
    ],
  },
  {
    category: "Communication",
    description: "Keep your clients informed with automated notifications",
    icon: <Mail className="h-5 w-5" />,
    tools: [
      { name: "Email Notifications", status: "Built-in", description: "Automated updates" },
      { name: "SMS Alerts", status: "Coming Soon", description: "SMS notifications" },
    ],
  },
  {
    category: "Analytics",
    description: "Track performance with powerful analytics tools",
    icon: <BarChart className="h-5 w-5" />,
    tools: [
      { name: "Google Analytics", status: "Available", description: "Track your site" },
      { name: "Custom Reports", status: "Built-in", description: "Export detailed data" },
    ],
  },
  {
    category: "Storage",
    description: "Manage your media with cloud storage solutions",
    icon: <HardDrive className="h-5 w-5" />,
    tools: [
      { name: "Supabase Storage", status: "Built-in", description: "Image hosting" },
      { name: "Cloudinary", status: "Coming Soon", description: "Enhanced media delivery" },
    ],
  },
];

export default function IntegrationsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isLight ? "bg-green-500/10 text-green-600" : "bg-green-500/10 text-green-400"
            }`}
          >
            <Check className="mr-1 inline h-3 w-3" />
            {status}
          </span>
        );
      case "Built-in":
        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isLight ? "bg-indigo-500/10 text-indigo-600" : "bg-indigo-500/10 text-indigo-400"
            }`}
          >
            Built-in
          </span>
        );
      default:
        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isLight ? "bg-zinc-900/10 text-zinc-500" : "bg-white/10 text-zinc-400"
            }`}
          >
            Coming Soon
          </span>
        );
    }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isLight ? "bg-white text-zinc-900" : "bg-zinc-950 text-white"
      }`}
    >
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient mesh */}
          <div className="absolute inset-0 -z-10">
            <div
              className={`absolute top-0 left-1/2 h-200 w-200 -translate-x-1/2 rounded-full blur-3xl ${
                isLight
                  ? "bg-linear-to-br from-indigo-100 via-purple-50 to-transparent opacity-50"
                  : "bg-linear-to-br from-indigo-900/20 via-purple-900/10 to-transparent opacity-50"
              }`}
            />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div
                className={`mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md transition-colors ${
                  isLight
                    ? "border-zinc-900/10 bg-zinc-900/5 hover:bg-zinc-900/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Sparkles className={`h-4 w-4 ${isLight ? "text-zinc-600" : "text-zinc-400"}`} />
                <span
                  className={`text-xs font-semibold tracking-wider uppercase ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                >
                  Integrations
                </span>
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Connect Flow with
                <span
                  className={`block bg-linear-to-br bg-clip-text text-transparent ${isLight ? "from-zinc-900 via-zinc-800 to-[#ffcd75]" : "from-white via-white to-[#ffcd75]"}`}
                >
                  tools you use
                </span>
              </h1>

              {/* Description */}
              <p
                className={`mb-12 text-xl leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
              >
                Seamlessly integrate with your favorite tools and services to create a workflow that
                works for you.
              </p>
            </div>
          </div>
        </section>

        {/* Integrations List */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-20">
              {integrations.map((category, i) => (
                <div key={category.category} className="space-y-8">
                  {/* Category Header */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${
                        isLight ? "from-zinc-100 to-zinc-200" : "from-zinc-800 to-zinc-900"
                      } backdrop-blur-xl`}
                    >
                      <span className={isLight ? "text-zinc-900" : "text-white"}>
                        {category.icon}
                      </span>
                    </div>
                    <div>
                      <h2
                        className={`text-3xl font-bold tracking-tight ${isLight ? "text-zinc-900" : "text-white"}`}
                      >
                        {category.category}
                      </h2>
                      <p className={`text-lg ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Tools Grid */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {category.tools.map((tool) => (
                      <div
                        key={tool.name}
                        className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                          isLight
                            ? "border-zinc-900/10 bg-zinc-900/5 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="relative p-6">
                          {/* Glow effect */}
                          {tool.status === "Available" || tool.status === "Built-in" ? (
                            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-green-500/20 blur-2xl" />
                          ) : (
                            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-zinc-500/20 blur-2xl" />
                          )}

                          {/* Tool Name and Status */}
                          <div className="mb-4">
                            <h3
                              className={`text-xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}
                            >
                              {tool.name}
                            </h3>
                            <div className="mt-2">{getStatusBadge(tool.status)}</div>
                          </div>

                          {/* Description */}
                          <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-32">
          {/* Background */}
          <div className={`absolute inset-0 -z-10 ${isLight ? "bg-zinc-50" : "bg-zinc-900/50"}`} />
          <div
            className={`absolute inset-0 -z-10 bg-linear-to-br ${
              isLight ? "from-indigo-50/50 to-purple-50/50" : "from-indigo-900/10 to-purple-900/10"
            }`}
          />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2
              className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl ${isLight ? "text-zinc-900" : "text-white"}`}
            >
              Need a Custom Integration?
            </h2>
            <p className={`mb-10 text-xl ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
              Let&apos;s talk about how we can integrate with your existing workflow.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:integrations@flow.sys"
                className={`group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                  isLight
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 hover:bg-zinc-800"
                    : "bg-white text-zinc-950 shadow-lg shadow-white/25 hover:bg-zinc-200"
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                Contact Our Team
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {["API access available", "Easy setup", "Dedicated support"].map((text, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
                >
                  <Check className="h-4 w-4 text-green-500" strokeWidth={3} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
