"use client";

import React from "react";
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

const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return (
          <span className="light:text-green-600 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            <Check className="mr-1 inline h-3 w-3" />
            {status}
          </span>
        );
      case "Built-in":
        return (
          <span className="light:text-indigo-600 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            Built-in
          </span>
        );
      default:
        return (
          <span className="light:bg-zinc-900/10 light:text-zinc-500 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-400">
            Coming Soon
          </span>
        );
    }
  };

  return (
    <div className="light:bg-white light:text-zinc-900 min-h-screen bg-zinc-950 font-sans text-white transition-colors duration-300">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient mesh */}
          <div className="absolute inset-0 -z-10">
            <div className="light:from-indigo-100 light:via-purple-50 absolute top-0 left-1/2 h-200 w-200 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-900/20 via-purple-900/10 to-transparent opacity-50 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10">
                <Sparkles className="light:text-zinc-600 h-4 w-4 text-zinc-400" />
                <span className="light:text-zinc-700 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  Integrations
                </span>
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Connect Flow with
                <span className="light:from-zinc-900 light:via-zinc-800 block bg-linear-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
                  tools you use
                </span>
              </h1>

              {/* Description */}
              <p className="light:text-zinc-600 mb-12 text-xl leading-relaxed text-zinc-400">
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
              {integrations.map((category) => (
                <div key={category.category} className="space-y-8">
                  {/* Category Header */}
                  <div className="flex items-center gap-4">
                    <div className="light:from-zinc-100 light:to-zinc-200 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 backdrop-blur-xl">
                      <span className="light:text-zinc-900 text-white">{category.icon}</span>
                    </div>
                    <div>
                      <h2 className="light:text-zinc-900 text-3xl font-bold tracking-tight text-white">
                        {category.category}
                      </h2>
                      <p className="light:text-zinc-600 text-lg text-zinc-400">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Tools Grid */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {category.tools.map((tool) => (
                      <div
                        key={tool.name}
                        className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
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
                            <h3 className="light:text-zinc-900 text-xl font-bold text-white">
                              {tool.name}
                            </h3>
                            <div className="mt-2">{getStatusBadge(tool.status)}</div>
                          </div>

                          {/* Description */}
                          <p className="light:text-zinc-600 text-sm text-zinc-400">
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
          <div className="light:bg-zinc-50 absolute inset-0 -z-10 bg-zinc-900/50" />
          <div className="light:from-indigo-50/50 light:to-purple-50/50 absolute inset-0 -z-10 bg-linear-to-br from-indigo-900/10 to-purple-900/10" />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="light:text-zinc-900 mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Need a Custom Integration?
            </h2>
            <p className="light:text-zinc-600 mb-10 text-xl text-zinc-400">
              Let&apos;s talk about how we can integrate with your existing workflow.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:integrations@flow.sys"
                className="group light:bg-zinc-900 light:text-white light:shadow-zinc-900/25 light:hover:bg-zinc-800 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/25 transition-all hover:scale-105 hover:bg-zinc-200 active:scale-95"
              >
                <LinkIcon className="h-4 w-4" />
                Contact Our Team
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {["API access available", "Easy setup", "Dedicated support"].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-500">
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
