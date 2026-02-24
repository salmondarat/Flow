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

  // Features data will be added in next task
  const features: FeatureItem[] = [];

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
    </section>
  );
}
