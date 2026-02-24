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
} from "lucide-react";

interface FeatureItem {
  label: string;
  values: (boolean | string)[];
}

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
    <section
      id="pricing"
      className={`relative w-full ${isLight ? "bg-white text-zinc-900" : "bg-zinc-950 text-white"}`}
    >
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 text-center"
        >
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-sm ${isLight ? "border-zinc-900/10 bg-zinc-900/5" : "border-white/10 bg-white/5"}`}>
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className={`text-xs font-medium ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>Flexible Pricing</span>
          </div>
          <h2 className={`mt-6 text-4xl font-medium tracking-tighter sm:text-5xl md:text-6xl ${isLight ? "bg-linear-to-br from-zinc-900 via-zinc-800 to-[#ffcd75]" : "bg-linear-to-br from-white via-white to-[#ffcd75]"} bg-clip-text text-transparent`}>
            Flexible Plans for Every Studio
          </h2>
          <p className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
            Choose from tailored packages that fit your business goals. No hidden fees, cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
