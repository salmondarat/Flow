"use client";

import React from "react";
import nextDynamic from "next/dynamic";
import { Shield, Sparkles, Mail } from "lucide-react";

const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Account information (name, email address, password)",
        "Profile information (phone, address, studio name for admin accounts)",
        "Order and payment information",
        "Communication data (messages, support requests)",
      ],
      intro: "Flow collects information you provide directly to us, including:",
    },
    {
      title: "How We Use Your Information",
      content: [
        "Provide, maintain, and improve our services",
        "Process orders and manage client relationships",
        "Send you technical notices and support messages",
        "Respond to your comments and questions",
        "Analyze usage patterns to improve our platform",
      ],
      intro: "We use collected information to:",
    },
    {
      title: "Data Security",
      content: null,
      intro:
        "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over Internet is 100% secure.",
    },
    {
      title: "Data Sharing",
      content: [
        "Service providers who assist in operating our platform",
        "Business partners, with your consent",
        "Legal authorities when required by law",
      ],
      intro: "We do not sell your personal data. We may share your information with:",
    },
    {
      title: "Your Rights",
      content: null,
      intro:
        "You have right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time.",
    },
    {
      title: "Contact Us",
      content: null,
      intro: "For privacy-related inquiries, contact us at privacy@flow.sys",
      email: "privacy@flow.sys",
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
                <Shield className="light:text-zinc-600 h-4 w-4 text-zinc-400" />
                <span className="light:text-zinc-700 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  Privacy Policy
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Your Privacy
                <span className="light:from-zinc-900 light:via-zinc-800 block bg-linear-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
                  matters to us
                </span>
              </h1>

              <p className="light:text-zinc-600 mb-12 text-xl leading-relaxed text-zinc-400">
                We are committed to protecting your data and being transparent about how we use it.
              </p>

              <p className="text-sm text-zinc-500">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-white/20 hover:bg-white/10"
                >
                  <div className="relative p-8 lg:p-12">
                    <div className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    <h2 className="light:text-zinc-900 mb-6 text-2xl font-bold tracking-tight text-white">
                      {section.title}
                    </h2>

                    <p className="light:text-zinc-600 text-lg leading-relaxed text-zinc-400">
                      {section.intro}
                    </p>

                    {section.content && (
                      <ul className="light:text-zinc-600 mt-6 space-y-3 text-zinc-400">
                        {section.content.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="light:bg-zinc-400 mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-zinc-500" />
                            <span className="text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.email && (
                      <div className="mt-6">
                        <a
                          href={`mailto:${section.email}`}
                          className="light:text-indigo-600 inline-flex items-center gap-2 font-medium text-indigo-400 hover:underline"
                        >
                          <Mail className="h-5 w-5" />
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

        <section className="light:bg-zinc-50 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Sparkles className="light:text-zinc-300 mx-auto mb-8 h-16 w-16 text-zinc-600" />
            <h2 className="light:text-zinc-900 mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Your Trust is Our Foundation
            </h2>
            <p className="light:text-zinc-600 mx-auto max-w-2xl text-xl text-zinc-400">
              We maintain the highest standards for data privacy, security, and accessibility. If
              you have any questions about how we handle your data, please do not hesitate to reach
              out.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
