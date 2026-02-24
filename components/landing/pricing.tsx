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
      {/* Background layers will be added in next task */}
    </section>
  );
}
