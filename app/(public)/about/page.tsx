"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { ArrowRight, Target, Shield, Zap, Users, Heart, Sparkles, Check, Play } from "lucide-react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function AboutPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

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
                  About Us
                </span>
              </div>

              {/* Heading */}
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Built by builders,
                <span
                  className={`block bg-linear-to-br bg-clip-text text-transparent ${isLight ? "from-zinc-900 via-zinc-800 to-[#ffcd75]" : "from-white via-white to-[#ffcd75]"}`}
                >
                  for builders
                </span>
              </h1>

              {/* Description */}
              <p
                className={`mb-12 text-xl leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
              >
                We&apos;re on a mission to bring modern operations software to the custom model kit
                industry, empowering studios to focus on what matters most—the craft.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Mission Content */}
              <div className="space-y-8">
                <h2
                  className={`text-4xl font-bold tracking-tight ${isLight ? "text-zinc-900" : "text-white"}`}
                >
                  Our Mission
                </h2>
                <div className="space-y-6">
                  <p
                    className={`text-lg leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                  >
                    Flow was built to solve a real problem: managing custom model kit commissions is
                    chaotic. Builders spend countless hours on administrative tasks instead of
                    focusing on their craft.
                  </p>
                  <p
                    className={`text-lg leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                  >
                    We&apos;ve created a platform that streamlines order intake, provides AI-powered
                    estimates, tracks progress automatically, and keeps clients informed in
                    real-time.
                  </p>
                  <p
                    className={`text-lg leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                  >
                    Whether you&apos;re a solo builder or managing a team, Flow scales with
                    you—growing alongside your business and adapting to your unique needs.
                  </p>
                </div>
              </div>

              {/* Mission Cards */}
              <div className="space-y-6">
                <div
                  className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                    isLight
                      ? "border-zinc-900/10 bg-zinc-900/5 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="relative p-8">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${
                        isLight ? "from-indigo-500 to-purple-600" : "from-indigo-500 to-purple-600"
                      } mb-6 text-white shadow-lg`}
                    >
                      <Target className="h-7 w-7" />
                    </div>
                    <h3
                      className={`mb-3 text-xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}
                    >
                      Mission
                    </h3>
                    <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                      Empower builders with tools that eliminate administrative overhead, so you can
                      focus on what you do best—building.
                    </p>
                  </div>
                </div>

                <div
                  className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                    isLight
                      ? "border-zinc-900/10 bg-zinc-900/5 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="relative p-8">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${
                        isLight ? "from-emerald-500 to-teal-600" : "from-emerald-500 to-teal-600"
                      } mb-6 text-white shadow-lg`}
                    >
                      <Shield className="h-7 w-7" />
                    </div>
                    <h3
                      className={`mb-3 text-xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}
                    >
                      Values
                    </h3>
                    <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                      Precision, transparency, and respect for the craft. We believe in building
                      software that honors the artistry of our users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className={`py-24 ${isLight ? "bg-zinc-50" : "bg-zinc-900/50"}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2
                className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl ${isLight ? "text-zinc-900" : "text-white"}`}
              >
                What We Offer
              </h2>
              <p
                className={`mx-auto max-w-2xl text-xl ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
              >
                Comprehensive tools designed specifically for custom build studios
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Smart Estimates",
                  description: "AI-powered quoting based on kit complexity and historical data",
                  gradient: "from-amber-500 to-orange-600",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Client Portal",
                  description: "Real-time progress tracking and direct communication",
                  gradient: "from-blue-500 to-indigo-600",
                },
                {
                  icon: <Target className="h-6 w-6" />,
                  title: "Order Management",
                  description: "Complete workflow from intake to delivery",
                  gradient: "from-emerald-500 to-teal-600",
                },
              ].map((feature, i) => (
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
                      className={`absolute top-8 right-8 h-32 w-32 rounded-full bg-linear-to-br ${feature.gradient} opacity-0 blur-3xl`}
                    />

                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${feature.gradient} mb-6 text-white shadow-lg`}
                    >
                      {feature.icon}
                    </div>

                    <h3
                      className={`relative mb-3 text-xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`relative text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2
                className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl ${isLight ? "text-zinc-900" : "text-white"}`}
              >
                Why Flow?
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  icon: <Heart className="h-6 w-6" />,
                  title: "Craftsmanship First",
                  description:
                    "We understand the artistry involved in custom builds. Our software respects the craft and enhances it, never replaces it.",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Built on Trust",
                  description:
                    "Your data and your clients' data are secure. We prioritize privacy and transparency in everything we build.",
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Constantly Evolving",
                  description:
                    "We listen to our community and continuously improve. Your feedback shapes the future of Flow.",
                },
              ].map((value, i) => (
                <div
                  key={value.title}
                  className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                    isLight
                      ? "border-zinc-900/10 bg-zinc-900/5 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="relative p-8">
                    <div
                      className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${
                        isLight ? "from-zinc-100 to-zinc-200" : "from-zinc-800 to-zinc-900"
                      } backdrop-blur-xl`}
                    >
                      <span className={isLight ? "text-zinc-900" : "text-white"}>{value.icon}</span>
                    </div>

                    <h3
                      className={`mb-3 text-xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}
                    >
                      {value.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      {value.description}
                    </p>
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
              Ready to Transform Your Workflow?
            </h2>
            <p className={`mb-10 text-xl ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
              Join hundreds of builders and studio owners who have already made the switch.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className={`group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                  isLight
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 hover:bg-zinc-800"
                    : "bg-white text-zinc-950 shadow-lg shadow-white/25 hover:bg-zinc-200"
                }`}
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                className={`group inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold transition-all hover:scale-105 ${
                  isLight
                    ? "border-zinc-900/10 bg-zinc-900/5 text-zinc-900 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                    : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {["No credit card required", "14-day free trial", "Cancel anytime"].map((text, i) => (
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
