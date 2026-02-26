"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import nextDynamic from "next/dynamic";
import { FileText, Sparkles } from "lucide-react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

// Force dynamic rendering to prevent static generation issues with client components
export const dynamic = "force-dynamic";

export default function TermsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const sections = [
    {
      title: "Acceptance of Terms",
      content:
        'By accessing or using Flow ("the Service"), you agree to be bound by these Terms & Conditions. If you disagree with any part of these terms, you may not access Service.',
    },
    {
      title: "Accounts and Registration",
      intro:
        "To access certain features of Service, you must register for an account. You agree to:",
      content: [
        "Provide accurate, current, and complete information",
        "Maintain the security of your password",
        "Accept responsibility for all activities under your account",
        "Notify us immediately of any unauthorized use",
      ],
    },
    {
      title: "Service Description",
      intro: "Flow provides a model kit commission management platform that includes:",
      content: [
        "Order tracking and management",
        "Client communication tools",
        "Progress photo sharing",
        "Analytics and reporting",
        "Payment processing",
      ],
      extra: "We reserve the right to modify or discontinue any feature at any time.",
    },
    {
      title: "User Conduct",
      intro: "You agree not to use Service to:",
      content: [
        "Violate any applicable laws or regulations",
        "Infringe on intellectual property rights",
        "Transmit harmful or offensive content",
        "Disrupt service or overwhelm servers",
        "Attempt to gain unauthorized access",
      ],
    },
    {
      title: "Payment and Billing",
      content:
        "Paid services are subject to pricing displayed at time of purchase. We reserve the right to modify prices at any time. All fees are non-refundable unless otherwise stated.",
    },
    {
      title: "Termination",
      content:
        "We may terminate or suspend your account at any time, with or without cause, with or without notice.",
    },
    {
      title: "Contact",
      content: "For questions about these terms, contact us at legal@flow.sys",
      email: "legal@flow.sys",
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
                <FileText className={`h-4 w-4 ${isLight ? "text-zinc-600" : "text-zinc-400"}`} />
                <span
                  className={`text-xs font-semibold tracking-wider uppercase ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                >
                  Terms & Conditions
                </span>
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Terms of
                <span
                  className={`block bg-linear-to-br bg-clip-text text-transparent ${isLight ? "from-zinc-900 via-zinc-800 to-[#ffcd75]" : "from-white via-white to-[#ffcd75]"}`}
                >
                  Service
                </span>
              </h1>

              {/* Description */}
              <p
                className={`mb-12 text-xl leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
              >
                Please read these terms carefully before using Flow.
              </p>

              {/* Last Updated */}
              <p className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] ${
                    isLight
                      ? "border-zinc-900/10 bg-zinc-900/5 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="relative p-8 lg:p-12">
                    {/* Section Number Badge */}
                    <div
                      className={`absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br ${
                        isLight ? "from-indigo-500 to-purple-600" : "from-indigo-500 to-purple-600"
                      } text-sm font-bold text-white`}
                    >
                      {index + 1}
                    </div>

                    <h2
                      className={`mb-6 text-2xl font-bold tracking-tight ${isLight ? "text-zinc-900" : "text-white"}`}
                    >
                      {section.title}
                    </h2>

                    {section.intro && (
                      <p
                        className={`mb-4 text-lg leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                      >
                        {section.intro}
                      </p>
                    )}

                    <p
                      className={`text-lg leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      {section.content}
                    </p>

                    {section.content && typeof section.content !== "string" && (
                      <ul
                        className={`mt-6 space-y-3 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                      >
                        {(section.content as string[]).map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div
                              className={`mt-1.5 flex h-2 w-2 shrink-0 rounded-full ${
                                isLight ? "bg-zinc-400" : "bg-zinc-500"
                              }`}
                            />
                            <span className="text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.extra && (
                      <p
                        className={`mt-6 text-base italic ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
                      >
                        {section.extra}
                      </p>
                    )}

                    {section.email && (
                      <div className="mt-6">
                        <a
                          href={`mailto:${section.email}`}
                          className={`inline-flex items-center gap-2 font-medium hover:underline ${
                            isLight ? "text-indigo-600" : "text-indigo-400"
                          }`}
                        >
                          {section.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className={`py-24 ${isLight ? "bg-zinc-50" : "bg-zinc-900/50"}`}>
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <FileText
              className={`mx-auto mb-8 h-16 w-16 ${isLight ? "text-zinc-300" : "text-zinc-600"}`}
            />
            <h2
              className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl ${isLight ? "text-zinc-900" : "text-white"}`}
            >
              Need Clarification?
            </h2>
            <p
              className={`mx-auto max-w-2xl text-xl ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
            >
              If you have any questions about these terms, please reach out to our legal team.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
