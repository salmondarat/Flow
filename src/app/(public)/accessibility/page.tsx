"use client";

import React from "react";
import nextDynamic from "next/dynamic";
import { Accessibility, Sparkles, Check } from "lucide-react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

// Force dynamic rendering to prevent static generation issues with client components
export const dynamic = "force-dynamic";

export default function AccessibilityPage() {
  const features = [
    {
      icon: "⌨️",
      title: "Keyboard Navigation",
      description:
        "All functionality is accessible via keyboard without requiring a mouse or trackpad.",
    },
    {
      icon: "🔊",
      title: "Screen Reader Support",
      description:
        "Proper semantic HTML and ARIA labels ensure compatibility with screen reading software.",
    },
    {
      icon: "🎨",
      title: "Color Contrast",
      description:
        "Text meets minimum contrast ratios for readability across all visual impairments.",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description:
        "Works seamlessly across desktop, tablet, and mobile devices with consistent functionality.",
    },
    {
      icon: "🎯",
      title: "Focus Indicators",
      description: "Clear visual indicators for keyboard focus help users navigate efficiently.",
    },
  ];

  return (
    <div className="light:bg-white light:text-zinc-900 min-h-screen bg-zinc-950 font-sans text-white transition-colors duration-300">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 hidden h-200 w-200 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-900/20 via-purple-900/10 to-transparent opacity-50 blur-3xl dark:block" />
            <div className="absolute top-0 left-1/2 block h-200 w-200 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-100 via-purple-50 to-transparent opacity-50 blur-3xl dark:hidden" />
          </div>
          <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:bg-zinc-900/10 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-colors hover:bg-white/10">
                <Accessibility className="light:text-zinc-600 h-4 w-4 text-zinc-400" />
                <span className="light:text-zinc-700 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  Accessibility
                </span>
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Accessible for
                <span className="light:from-zinc-900 light:via-zinc-800 block bg-linear-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
                  everyone
                </span>
              </h1>
              <p className="light:text-zinc-600 mb-12 text-xl leading-relaxed text-zinc-400">
                Flow is committed to ensuring digital accessibility for all users. We strive to
                follow Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
              <p className="text-sm text-zinc-500">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="light:border-zinc-900/10 light:bg-zinc-900/5 light:shadow-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-white/10 backdrop-blur-xl">
              <div className="relative p-8 lg:p-12">
                <Accessibility className="light:text-indigo-600 mb-6 h-16 w-16 text-indigo-400" />
                <h2 className="light:text-zinc-900 mb-4 text-3xl font-bold tracking-tight text-white">
                  Our Commitment
                </h2>
                <p className="light:text-zinc-600 text-lg leading-relaxed text-zinc-400">
                  We believe that everyone should have equal access to information and functionality
                  on the web. Our commitment to accessibility means that we are continuously working
                  to improve the user experience for all visitors, regardless of their abilities or
                  technologies they use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="light:bg-zinc-50 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="light:text-zinc-900 mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Accessibility Features
              </h2>
              <p className="light:text-zinc-600 mx-auto max-w-2xl text-xl text-zinc-400">
                We have implemented the following accessibility features:
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
                >
                  <div className="relative p-8">
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 opacity-0 blur-3xl" />
                    <div className="mb-4 text-4xl">{feature.icon}</div>
                    <h3 className="light:text-zinc-900 mb-3 text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="light:text-zinc-600 text-sm leading-relaxed text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ongoing Efforts Section */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="light:border-zinc-900/10 light:bg-zinc-900/5 light:shadow-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-white/10 backdrop-blur-xl">
              <div className="relative p-8 lg:p-12">
                <h2 className="light:text-zinc-900 mb-6 text-3xl font-bold tracking-tight text-white">
                  Ongoing Efforts
                </h2>
                <p className="light:text-zinc-600 mb-6 text-lg text-zinc-400">
                  We continuously test and improve our platform&apos;s accessibility through:
                </p>
                <ul className="light:text-zinc-600 space-y-4 text-zinc-400">
                  {[
                    "Regular accessibility audits with both automated tools and manual testing",
                    "User testing with individuals who use assistive technologies",
                    "Training our development team on accessibility best practices",
                    "Monitoring industry standards and guidelines",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </div>
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="light:bg-zinc-50 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Sparkles className="light:text-zinc-300 mx-auto mb-8 h-16 w-16 text-zinc-600" />
            <h2 className="light:text-zinc-900 mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              We Welcome Feedback
            </h2>
            <p className="light:text-zinc-600 mx-auto mb-8 max-w-2xl text-xl text-zinc-400">
              We welcome feedback on accessibility of our site. If you encounter any accessibility
              barriers, please contact us.
            </p>
            <a
              href="mailto:accessibility@flow.sys"
              className="light:bg-zinc-900 light:text-white light:shadow-zinc-900/25 light:hover:bg-zinc-800 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/25 transition-all hover:scale-105 hover:bg-zinc-200 active:scale-95"
            >
              Report an Issue
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
