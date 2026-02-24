"use client";

import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Crown, Zap, Shield, Users, Rocket } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import nextDynamic from "next/dynamic";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function PricingPage() {
  unstable_noStore();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted ? theme === "light" : false;

  const plans = [
    {
      name: "Starter",
      type: "Civilian",
      price: 29,
      compareAtPrice: null,
      description: "Perfect for solo builders just getting started",
      icon: Shield,
      iconBgGradient: isLight ? "from-zinc-300 to-zinc-500" : "from-zinc-700 to-zinc-900",
      features: [
        "5 active projects",
        "Basic invoicing",
        "Client portal access",
        "Email support",
        "Order tracking",
        "Progress visibility",
      ],
      highlighted: false,
    },
    {
      name: "Studio Pro",
      type: "Newtype",
      price: 79,
      compareAtPrice: 99,
      description: "For growing studios with a team",
      icon: Users,
      iconBgGradient: "from-indigo-500 to-purple-600",
      features: [
        "Unlimited projects",
        "Advanced AI estimates",
        "Inventory tracking",
        "White-label reports",
        "Priority support",
        "Team collaboration",
        "Analytics dashboard",
        "Custom templates",
        "Workload management",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      type: "Fleet",
      price: 199,
      compareAtPrice: null,
      description: "For large-scale operations",
      icon: Rocket,
      iconBgGradient: "from-emerald-500 to-teal-600",
      features: [
        "Everything in Studio Pro",
        "Unlimited team members",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "Custom branding",
        "SLA guarantee",
        "SSO & team management",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className={`relative w-full font-sans ${isLight ? "bg-white text-zinc-900" : "bg-zinc-950 text-white"}`}>
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: isLight ? "url(/gund_bg-white.png)" : "url(/gund_bg.webp)",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      />

      {/* Gradient Blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Dot Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <Header />

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-sm ${
                isLight ? "border-zinc-900/10 bg-zinc-900/5" : "border-white/10 bg-white/5"
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span
                className={`text-xs font-medium ${
                  isLight ? "text-zinc-700" : "text-zinc-400"
                }`}
              >
                Flexible Pricing
              </span>
            </div>

            {/* Heading */}
            <h2
              className={`mt-6 text-4xl font-medium tracking-tighter sm:text-5xl md:text-6xl ${
                isLight
                  ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-[#ffcd75]"
                  : "bg-gradient-to-br from-white via-white to-[#ffcd75]"
              } bg-clip-text text-transparent`}
            >
              Plans That Scale With You
            </h2>

            {/* Description */}
            <p
              className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${
                isLight ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              Simple, transparent pricing that scales with your business. No hidden fees, cancel anytime.
            </p>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] ${
                  isLight
                    ? "border-zinc-900/10 bg-zinc-900/5 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                } ${plan.highlighted ? "after:inset-0 after:rounded-[inherit]" : ""}`}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30">
                    <Crown className="mr-1 h-3 w-3" />
                    Most Popular
                  </div>
                )}

                {/* Card Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${plan.iconBgGradient}`}
                  >
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3
                    className={`mb-1 text-xl font-bold ${
                      isLight ? "text-zinc-900" : "text-white"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Plan Type */}
                  <p
                    className={`mb-4 text-xs font-mono uppercase ${
                      isLight ? "text-zinc-500" : "text-zinc-500"
                    }`}
                  >
                    {plan.type}
                  </p>

                  {/* Pricing */}
                  <div className="mb-6 flex items-baseline gap-2">
                    {plan.compareAtPrice && (
                      <span className="text-sm text-zinc-500 line-through">
                        ${plan.compareAtPrice}
                      </span>
                    )}
                    <span
                      className={`text-4xl font-bold ${
                        isLight
                          ? "bg-gradient-to-br from-zinc-900 to-zinc-600"
                          : "bg-gradient-to-br from-white to-zinc-400"
                      } bg-clip-text text-transparent`}
                    >
                      ${plan.price}
                    </span>
                    <span className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                      /mo
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={`mb-6 text-sm ${
                      isLight ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-3 text-sm ${
                          isLight ? "text-zinc-700" : "text-zinc-300"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full ${
                            isLight ? "bg-zinc-900/10" : "bg-white/10"
                          }`}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href="/register"
                    className={`inline-flex items-center justify-center w-full rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02] hover:shadow-indigo-500/50"
                        : isLight
                        ? "border border-zinc-900/20 bg-zinc-900/10 text-zinc-900 hover:bg-zinc-900/20"
                        : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                    aria-label={`Select ${plan.name} plan`}
                  >
                    {plan.highlighted ? "Get Started" : "Select Plan"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border backdrop-blur-xl mx-auto max-w-3xl">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />

            <div className="relative p-8 sm:p-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center"
              >
                {/* Icon */}
                <div
                  className={`mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20 ${
                    isLight ? "text-zinc-900" : "text-white"
                  }`}
                >
                  <Zap className="h-6 w-6" />
                </div>

                {/* Heading */}
                <h2
                  className={`mb-4 text-2xl font-bold ${
                    isLight ? "text-zinc-900" : "text-white"
                  }`}
                >
                  Frequently Asked Questions
                </h2>

                {/* FAQ Items */}
                <div className="space-y-6 text-left">
                  {[
                    {
                      q: "Can I change plans later?",
                      a: "Yes, you can upgrade or downgrade your plan at any time. Pro-rated charges will apply.",
                    },
                    {
                      q: "Is there a free trial?",
                      a: "Yes, we offer a 14-day free trial with full access to all features.",
                    },
                    {
                      q: "What payment methods do you accept?",
                      a: "We accept all major credit cards and PayPal.",
                    },
                    {
                      q: "Can I cancel anytime?",
                      a: "Yes, you can cancel your subscription at any time without penalty.",
                    },
                  ].map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                      className={`rounded-2xl border p-6 ${
                        isLight
                          ? "border-zinc-900/10 bg-zinc-900/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <h3
                        className={`mb-2 text-base font-semibold ${
                          isLight ? "text-zinc-900" : "text-white"
                        }`}
                      >
                        {faq.q}
                      </h3>
                      <p
                        className={`text-sm ${
                          isLight ? "text-zinc-600" : "text-zinc-400"
                        }`}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="relative mx-auto max-w-3xl"
          >
            <div
              className={`relative overflow-hidden rounded-3xl border p-8 sm:p-12 backdrop-blur-xl ${
                isLight
                  ? "border-zinc-900/10 bg-zinc-900/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />

              {/* Content */}
              <div className="relative text-center">
                <p
                  className={`text-lg ${
                    isLight ? "text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  Still have questions?
                </p>
                <p
                  className={`mt-2 text-sm ${
                    isLight ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  Our team is here to help you find the perfect plan for your studio.
                </p>

                {/* CTA Button */}
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-indigo-500/50"
                >
                  Book a Free Consultation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
