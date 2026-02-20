"use client";

import { motion } from "framer-motion";
import {
  Package,
  BarChart3,
  RefreshCw,
  Layers,
  Share2,
  ArrowUpRight,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";

const services = [
  {
    icon: Package,
    title: "Custom Build Management",
    description:
      "Manage multiple custom build orders with ease. Track each build from submission to delivery with intuitive dashboards.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    size: "large",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Real-time visibility into build progress with beautiful analytics and client portals.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    size: "medium",
  },
  {
    icon: RefreshCw,
    title: "Change Requests",
    description: "Streamlined modification workflows with automated approvals and impact tracking.",
    image: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=600&q=80",
    size: "medium",
  },
  {
    icon: Layers,
    title: "Multi-Kit Support",
    description: "Manage complex projects with multiple kits in one unified dashboard.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    size: "wide",
  },
  {
    icon: Share2,
    title: "Public Tracking",
    description:
      "Share build progress with anyone via public links. Perfect for communities and showcases.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    size: "wide",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function Services() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mb-16 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-4 py-1.5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Powerful Features
          </span>
        </div>
        <h2 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl dark:from-white dark:to-zinc-400">
          Everything You Need
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
          Streamline your custom build workflow with tools designed specifically for model kit
          studios.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {/* Large Card - Build Management */}
        <motion.div
          variants={itemVariants}
          className="group relative col-span-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-2xl sm:col-span-2 lg:col-span-2 lg:row-span-2 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-zinc-700"
        >
          <div className="relative h-full">
            {/* Image */}
            <div className="relative h-48 overflow-hidden sm:h-64 lg:h-72">
              <Image
                src={services[0].image}
                alt={services[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/50" />
            </div>

            {/* Content */}
            <div className="relative p-6 lg:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-zinc-900 lg:text-2xl dark:text-white">
                {services[0].title}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-zinc-600 lg:text-base dark:text-zinc-400">
                {services[0].description}
              </p>

              <motion.button
                whileHover={{ x: 5 }}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Learn more
                <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Medium Card - Progress Tracking */}
        <motion.div
          variants={itemVariants}
          className="group relative col-span-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-zinc-700"
        >
          <div className="relative h-full">
            <div className="relative h-32 overflow-hidden">
              <Image
                src={services[1].image}
                alt={services[1].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/50" />
            </div>

            <div className="relative p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">
                {services[1].title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{services[1].description}</p>
            </div>
          </div>
        </motion.div>

        {/* Medium Card - Change Requests */}
        <motion.div
          variants={itemVariants}
          className="group relative col-span-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-zinc-700"
        >
          <div className="relative h-full">
            <div className="relative h-32 overflow-hidden">
              <Image
                src={services[2].image}
                alt={services[2].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/50" />
            </div>

            <div className="relative p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">
                {services[2].title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{services[2].description}</p>
            </div>
          </div>
        </motion.div>

        {/* Wide Card - Multi-Kit Support */}
        <motion.div
          variants={itemVariants}
          className="group relative col-span-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-2xl sm:col-span-2 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-zinc-700"
        >
          <div className="relative flex h-full flex-col sm:flex-row">
            <div className="relative h-40 w-full overflow-hidden sm:h-auto sm:w-1/2">
              <Image
                src={services[3].image}
                alt={services[3].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/90 sm:bg-gradient-to-l dark:to-zinc-950/90" />
            </div>

            <div className="relative flex flex-1 flex-col justify-center p-5 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/20">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">
                {services[3].title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{services[3].description}</p>
            </div>
          </div>
        </motion.div>

        {/* Wide Card - Public Tracking */}
        <motion.div
          variants={itemVariants}
          className="group relative col-span-1 overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-2xl sm:col-span-2 lg:col-span-1 dark:border-zinc-800 dark:from-indigo-950/20 dark:to-purple-950/20 dark:hover:border-zinc-700"
        >
          <div className="relative h-full p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">
              {services[4].title}
            </h3>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              {services[4].description}
            </p>

            {/* Feature list */}
            <div className="space-y-2">
              {["Public links", "Community sharing", "Showcase ready"].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                >
                  <Zap className="h-3 w-3 text-amber-500" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Decorative image */}
            <div className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 opacity-30">
              <Image src={services[4].image} alt="" fill className="rounded-tl-3xl object-cover" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
