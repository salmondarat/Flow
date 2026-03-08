"use client";

import React from "react";
import nextDynamic from "next/dynamic";
import { FileText, Sparkles } from "lucide-react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

// Force dynamic rendering to prevent static generation issues with client components
export const dynamic = "force-dynamic";

export default function TermsPage() {
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
                <FileText className="light:text-zinc-600 h-4 w-4 text-zinc-400" />
                <span className="light:text-zinc-700 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  Terms & Conditions
                </span>
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Terms of
                <span className="light:from-zinc-900 light:via-zinc-800 block bg-linear-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
                  Service
                </span>
              </h1>

              {/* Description */}
              <p className="light:text-zinc-600 mb-12 text-xl leading-relaxed text-zinc-400">
                Please read these terms carefully before using Flow.
              </p>

              {/* Last Updated */}
              <p className="text-sm text-zinc-500">
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
                  className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-white/20 hover:bg-white/10"
                >
                  <div className="relative p-8 lg:p-12">
                    {/* Section Number Badge */}
                    <div className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    <h2 className="light:text-zinc-900 mb-6 text-2xl font-bold tracking-tight text-white">
                      {section.title}
                    </h2>

                    {section.intro && (
                      <p className="light:text-zinc-600 mb-4 text-lg leading-relaxed text-zinc-400">
                        {section.intro}
                      </p>
                    )}

                    <p className="light:text-zinc-600 text-lg leading-relaxed text-zinc-400">
                      {section.content}
                    </p>

                    {section.content && typeof section.content !== "string" && (
                      <ul className="light:text-zinc-600 mt-6 space-y-3 text-zinc-400">
                        {(section.content as string[]).map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="light:bg-zinc-400 mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-zinc-500" />
                            <span className="text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.extra && (
                      <p className="mt-6 text-base text-zinc-500 italic">{section.extra}</p>
                    )}

                    {section.email && (
                      <div className="mt-6">
                        <a
                          href={`mailto:${section.email}`}
                          className="light:text-indigo-600 inline-flex items-center gap-2 font-medium text-indigo-400 hover:underline"
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
        <section className="light:bg-zinc-50 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <FileText className="light:text-zinc-300 mx-auto mb-8 h-16 w-16 text-zinc-600" />
            <h2 className="light:text-zinc-900 mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Need Clarification?
            </h2>
            <p className="light:text-zinc-600 mx-auto max-w-2xl text-xl text-zinc-400">
              If you have any questions about these terms, please reach out to our legal team.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
