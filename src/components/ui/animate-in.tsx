"use client";

import { motion } from "framer-motion";

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  from?: "left" | "right" | "bottom" | "top" | "opacity" | "scale";
}

export function AnimateIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  from = "bottom",
}: AnimateInProps) {
  const variants = {
    left: { opacity: 0, x: -50 },
    right: { opacity: 0, x: 50 },
    bottom: { opacity: 0, y: 50 },
    top: { opacity: 0, y: -50 },
    scale: { opacity: 0, scale: 0.9 },
    opacity: { opacity: 0 },
  };

  return (
    <motion.div
      initial={variants[from]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerIn({
  children,
  staggerDelay = 0.1,
  className = "",
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  from = "bottom",
}: {
  children: React.ReactNode;
  className?: string;
  from?: "left" | "right" | "bottom" | "top" | "opacity" | "scale";
}) {
  const variants = {
    left: { opacity: 0, x: -30 },
    right: { opacity: 0, x: 30 },
    bottom: { opacity: 0, y: 30 },
    top: { opacity: 0, y: -30 },
    scale: { opacity: 0, scale: 0.95 },
    opacity: { opacity: 0 },
  };

  return (
    <motion.div
      variants={{
        hidden: variants[from],
        visible: { opacity: 1, x: 0, y: 0, scale: 1 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
