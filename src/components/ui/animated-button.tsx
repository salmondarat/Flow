"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "transition"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  transition?: never; // Override to avoid conflict
}

export function AnimatedButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: AnimatedButtonProps) {
  const variants = {
    primary: "bg-gundam-cyan text-primary-content",
    secondary: "bg-gundam-yellow text-accent-content",
    outline: "border border-border text-foreground hover:bg-gundam-border hover:text-background",
    ghost: "text-muted-foreground hover:text-foreground",
  };

  return (
    <motion.button
      className={`${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedLink({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <motion.a
      href={href}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.a>
  );
}
