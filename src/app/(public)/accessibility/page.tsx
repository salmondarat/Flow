"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import nextDynamic from "next/dynamic";
import { Accessibility, Sparkles, Check } from "lucide-react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

// Force dynamic rendering to prevent static generation issues with client components
export const dynamic = "force-dynamic";

export default function AccessibilityPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

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
                <Accessibility
                  className={`h-4 w-4 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                />
                <span
                  className={`text-xs font-semibold tracking-wider uppercase ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                >
                  Accessibility
                </span>
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Accessible for
                <span
                  className={`block bg-linear-to-br bg-clip-text text-transparent ${isLight ? "from-zinc-900 via-zinc-800 to-[#ffcd75]" : "from-white via-white to-[#ffcd75]"}`}
                >
                  everyone
                </span>
              </h1>

              {/* Description */}
              <p
                className={`mb-12 text-xl leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
              >
                Flow is committed to ensuring digital accessibility for all users. We strive to
                follow Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>

              {/* Last Updated */}
              <p className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div
              className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl ${
                isLight
                  ? "border-zinc-900/10 bg-zinc-900/5 shadow-zinc-900/10"
                  : "border-white/10 bg-white/5 shadow-white/10"
              }`}
            >
              <div className="relative p-8 lg:p-12">
                <Accessibility
                  className={`mb-6 h-16 w-16 ${isLight ? "text-indigo-600" : "text-indigo-400"}`}
                />
                <h2
                  className={`mb-4 text-3xl font-bold tracking-tight ${isLight ? "text-zinc-900" : "text-white"}`}
                >
                  Our Commitment
                </h2>
                <p
                  className={`text-lg leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                >
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
        <section className={`py-24 ${isLight ? "bg-zinc-50" : "bg-zinc-900/50"}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2
                className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl ${isLight ? "text-zinc-900" : "text-white"}`}
              >
                Accessibility Features
              </h2>
              <p
                className={`mx-auto max-w-2xl text-xl ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
              >
                We have implemented the following accessibility features:
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                    isLight
                      ? "border-zinc-900/10 bg-zinc-900/5 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="relative p-8">
                    {/* Glow effect */}
                    <div
                      className={`absolute -top-4 -right-4 h-24 w-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 opacity-0 blur-3xl`}
                    />

                    <div className="mb-4 text-4xl">{feature.icon}</div>

                    <h3
                      className={`mb-3 text-xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                    >
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
            <div
              className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl ${
                isLight
                  ? "border-zinc-900/10 bg-zinc-900/5 shadow-zinc-900/10"
                  : "border-white/10 bg-white/5 shadow-white/10"
              }`}
            >
              <div className="relative p-8 lg:p-12">
                <h2
                  className={`mb-6 text-3xl font-bold tracking-tight ${isLight ? "text-zinc-900" : "text-white"}`}
                >
                  Ongoing Efforts
                </h2>
                <p className={`mb-6 text-lg ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                  We continuously test and improve our platform&apos;s accessibility through:
                </p>
                <ul className={`space-y-4 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                  {[
                    "Regular accessibility audits with both automated tools and manual testing",
                    "User testing with individuals who use assistive technologies",
                    "Training our development team on accessibility best practices",
                    "Monitoring industry standards and guidelines",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white`}
                      >
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
        <section className={`py-24 ${isLight ? "bg-zinc-50" : "bg-zinc-900/50"}`}>
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Sparkles
              className={`mx-auto mb-8 h-16 w-16 ${isLight ? "text-zinc-300" : "text-zinc-600"}`}
            />
            <h2
              className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl ${isLight ? "text-zinc-900" : "text-white"}`}
            >
              We Welcome Feedback
            </h2>
            <p
              className={`mx-auto mb-8 max-w-2xl text-xl ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
            >
              We welcome feedback on accessibility of our site. If you encounter any accessibility
              barriers, please contact us.
            </p>
            <a
              href="mailto:accessibility@flow.sys"
              className={`inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                isLight
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 hover:bg-zinc-800"
                  : "bg-white text-zinc-950 shadow-lg shadow-white/25 hover:bg-zinc-200"
              }`}
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
