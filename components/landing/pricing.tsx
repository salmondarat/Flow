"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Rocket,
  ArrowRight,
  CheckIcon,
  MinusIcon,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface FeatureItem {
  label: string;
  values: (boolean | string)[];
}

interface PricingCardProps {
  name: string;
  badge?: string;
  price: string;
  compareAtPrice?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgGradient: string;
  isPopular: boolean;
  isLight: boolean;
  features: FeatureItem[];
  featureLimit: number;
  ctaText: string;
}

const PricingCard = ({
  name,
  badge,
  price,
  compareAtPrice,
  icon: Icon,
  iconBgGradient,
  isPopular,
  isLight,
  features,
  featureLimit,
  ctaText,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: isPopular ? 0.3 : 0.2 }}
      className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] ${
        isLight
          ? "border-zinc-900/10 bg-zinc-900/5 hover:border-zinc-900/20 hover:bg-zinc-900/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      } ${isPopular ? "after:inset-0 after:rounded-[inherit]" : ""}`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30">
          <Crown className="mr-1 h-3 w-3" />
          {badge}
        </div>
      )}
      <div className="relative p-8">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconBgGradient}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className={`mb-1 text-xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>{name}</h3>
        <div className="mb-6 flex items-baseline gap-2">
          {compareAtPrice && <span className="text-sm text-zinc-500 line-through">{compareAtPrice}</span>}
          <span className={`text-4xl font-bold ${isLight ? "bg-gradient-to-br from-zinc-900 to-zinc-600" : "bg-gradient-to-br from-white to-zinc-400"} bg-clip-text text-transparent`}>{price}</span>
          <span className="text-sm text-zinc-500">/month</span>
        </div>
        <button aria-label={ctaText} className={`mb-6 w-full rounded-full px-6 py-3 text-sm font-semibold transition-all ${isPopular ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02] hover:shadow-indigo-500/50" : isLight ? "border border-zinc-900/20 bg-zinc-900/10 text-zinc-900 hover:bg-zinc-900/20" : "border border-white/20 bg-white/10 text-white hover:bg-white/20"}`}>
          {ctaText}
        </button>
        <div className="space-y-3">
          {features.slice(0, featureLimit).map((feature, idx) => {
            const valueIdx = name === "Starter" ? 0 : name === "Professional" ? 1 : 2;
            const value = feature.values[valueIdx];
            return (
              <div key={idx} className="flex items-start gap-3">
                {value === true ? (
                  <div className={`flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full ${isLight ? "bg-zinc-900/10" : "bg-white/10"}`}>
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  </div>
                ) : value === false ? (
                  <div className={`flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full ${isLight ? "bg-zinc-900/10" : "bg-white/10"}`}>
                    <MinusIcon className="h-4 w-4 text-zinc-500" />
                  </div>
                ) : (
                  <span className={`flex-shrink-0 text-xs font-medium ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>{value as string}</span>
                )}
                <div className="flex-1"><span className={`text-sm leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{feature.label}</span></div>
              </div>
            );
          })}
          {featureLimit < features.length && <div className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>and more...</div>}
        </div>
      </div>
    </motion.div>
  );
};

export default function Pricing() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted ? theme === "light" : false;

  const features: FeatureItem[] = [
    { label: "Active Orders", values: ["Up to 50", "Unlimited", "Unlimited"] },
    { label: "Build, Repair & Repaint", values: [true, true, true] },
    { label: "Complexity-based Pricing", values: [true, true, true] },
    { label: "Client Portal Access", values: [true, true, true] },
    { label: "Reference Image Uploads", values: ["50 MB", "500 MB", "Unlimited"] },
    { label: "Progress Tracking", values: [true, true, true] },
    { label: "Email Support", values: ["Standard", "Priority", "24/7 Priority"] },
    { label: "Custom Form Templates", values: [false, true, true] },
    { label: "Analytics Dashboard", values: [false, true, true] },
    { label: "Multi-builder Support", values: [false, "Up to 3", "Unlimited"] },
    { label: "Workload Management", values: [false, true, true] },
    { label: "Change Request System", values: [false, true, true] },
    { label: "API Access", values: [false, false, true] },
    { label: "White-label Portal", values: [false, false, true] },
    { label: "Custom Branding", values: [false, false, true] },
    { label: "SSO & Team Management", values: [false, false, true] },
    { label: "Dedicated Account Manager", values: [false, false, true] },
    { label: "SLA Guarantee", values: [false, false, true] },
  ];

  return (
    <section id="pricing" className={`relative w-full ${isLight ? "bg-white text-zinc-900" : "bg-zinc-950 text-white"}`}>
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

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 text-center"
        >
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-sm ${isLight ? "border-zinc-900/10 bg-zinc-900/5" : "border-white/10 bg-white/5"}`}>
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className={`text-xs font-medium ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>Flexible Pricing</span>
          </div>

          {/* Heading */}
          <h2 className={`mt-6 text-4xl font-medium tracking-tighter sm:text-5xl md:text-6xl ${isLight ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-[#ffcd75]" : "bg-gradient-to-br from-white via-white to-[#ffcd75]"} bg-clip-text text-transparent`}>
            Flexible Plans for Every Studio
          </h2>

          {/* Description */}
          <p className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
            Choose from tailored packages that fit your business goals. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Starter Plan */}
          <PricingCard
            name="Starter"
            badge={undefined}
            price="$29"
            icon={Shield}
            iconBgGradient={isLight ? "from-zinc-300 to-zinc-500" : "from-zinc-700 to-zinc-900"}
            isPopular={false}
            isLight={isLight}
            features={features}
            featureLimit={8}
            ctaText="Get Started"
          />

          {/* Professional Plan */}
          <PricingCard
            name="Professional"
            badge="Most Popular"
            price="$89"
            compareAtPrice="$129"
            icon={Users}
            iconBgGradient="from-indigo-500 to-purple-600"
            isPopular={true}
            isLight={isLight}
            features={features}
            featureLimit={12}
            ctaText="Get Started"
          />

          {/* Enterprise Plan */}
          <PricingCard
            name="Enterprise"
            badge={undefined}
            price="$249"
            icon={Rocket}
            iconBgGradient="from-emerald-500 to-teal-600"
            isPopular={false}
            isLight={isLight}
            features={features}
            featureLimit={features.length}
            ctaText="Contact Sales"
          />
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative mt-16 max-w-3xl mx-auto"
        >
          <div className={`relative overflow-hidden rounded-3xl border p-8 sm:p-12 backdrop-blur-xl ${isLight ? "border-zinc-900/10 bg-zinc-900/5" : "border-white/10 bg-white/5"}`}>
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />

            {/* Content */}
            <div className="relative text-center">
              {/* Icon */}
              <div className={`mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20 ${isLight ? "text-zinc-900" : "text-white"}`}>
                <Zap className="h-6 w-6" />
              </div>

              {/* Heading */}
              <h2 className={`mb-4 text-2xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>Frequently Asked Questions</h2>

              {/* FAQ Items */}
              <div className="space-y-6 text-left">
                {[
                  { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Pro-rated charges will apply." },
                  { q: "Is there a free trial?", a: "Yes, we offer a 14-day free trial with full access to all features." },
                  { q: "What payment methods do you accept?", a: "We accept all major credit cards and PayPal." },
                  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time without penalty." },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                    className={`rounded-2xl border p-6 ${isLight ? "border-zinc-900/10 bg-zinc-900/5" : "border-white/10 bg-white/5"}`}
                  >
                    <h3 className={`mb-2 text-base font-semibold ${isLight ? "text-zinc-900" : "text-white"}`}>{faq.q}</h3>
                    <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="relative mt-16 max-w-3xl mx-auto"
        >
          <div className={`relative overflow-hidden rounded-3xl border p-8 sm:p-12 backdrop-blur-xl ${isLight ? "border-zinc-900/10 bg-zinc-900/5" : "border-white/10 bg-white/5"}`}>
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />

            {/* Content */}
            <div className="relative text-center">
              <p className={`text-lg ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Still have questions?</p>
              <p className={`mt-2 text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Our team is here to help you find the perfect plan for your studio.</p>

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
      </div>
    </section>
  );
}
