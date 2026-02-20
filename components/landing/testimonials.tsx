"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { CleanTestimonial } from "@/components/ui/clean-testimonial";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/5 to-cyan-500/5 blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 text-center"
      >
        <h2 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl dark:from-white dark:to-zinc-400">
          Loved by Builders
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
          Join hundreds of studios who trust Flow to manage their custom build workflows.
        </p>
      </motion.div>

      {/* Clean Testimonial Component */}
      <CleanTestimonial />

      {/* Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative mt-8 text-center sm:mt-12"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          1500+ satisfied clients love our services
        </p>
        <div className="mt-2 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
          ))}
        </div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">4.9 Based on 1.5k reviews</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-4 text-sm font-medium text-zinc-600 underline underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          View all reviews
        </motion.button>
      </motion.div>
    </section>
  );
}
