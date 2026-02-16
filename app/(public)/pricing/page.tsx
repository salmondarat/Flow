"use client";

import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import nextDynamic from "next/dynamic";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function PricingPage() {
  unstable_noStore();
  const plans = [
    {
      name: "Starter",
      type: "Civilian",
      price: 29,
      description: "Perfect for solo builders just getting started",
      features: [
        "5 active projects",
        "Basic invoicing",
        "Client portal access",
        "Email support",
        "Order tracking",
      ],
      highlighted: false,
    },
    {
      name: "Studio Pro",
      type: "Newtype",
      price: 79,
      description: "For growing studios with a team",
      features: [
        "Unlimited projects",
        "Advanced AI estimates",
        "Inventory tracking",
        "White-label reports",
        "Priority support",
        "Team collaboration",
        "Analytics dashboard",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      type: "Fleet",
      price: 199,
      description: "For large-scale operations",
      features: [
        "Everything in Studio Pro",
        "Unlimited team members",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "Custom branding",
        "SLA guarantee",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 border-border border-b py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-gundam-cyan mb-4 text-5xl font-bold tracking-tight uppercase md:text-6xl">
              Pricing
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Simple, transparent pricing that scales with your business
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex flex-col rounded-2xl border p-8 ${
                    plan.highlighted
                      ? "border-gundam-yellow bg-gundam-yellow/5 dark:bg-gundam-yellow/10 shadow-xl"
                      : "border-border bg-muted dark:bg-card"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="bg-gundam-yellow text-accent-content mx-auto -mt-12 mb-6 w-fit rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-foreground text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground font-mono text-sm uppercase">{plan.type}</p>
                  </div>
                  <div className="mb-6 flex items-baseline">
                    <span className="text-foreground text-5xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground ml-1">/mo</span>
                  </div>
                  <p className="text-muted-foreground mb-8 text-sm">{plan.description}</p>
                  <ul className="text-foreground mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="text-gundam-cyan h-4 w-4 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`w-full py-3 text-center font-bold tracking-wider uppercase transition-colors ${
                      plan.highlighted
                        ? "bg-gundam-yellow text-accent-content hover:bg-background"
                        : "border-border hover:bg-muted/50 text-foreground"
                    } rounded-lg`}
                  >
                    Select Plan
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/30 border-border border-y py-24">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-foreground mb-12 text-center text-3xl font-bold uppercase">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I change plans later?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Prorated charges will apply.",
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
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="bg-background dark:bg-card border-border rounded-lg border p-6"
                >
                  <h3 className="text-foreground mb-2 font-bold">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
