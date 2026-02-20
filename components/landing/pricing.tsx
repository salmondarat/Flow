"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shield, Users, Rocket, Sparkles, Zap, CheckIcon, MinusIcon } from "lucide-react";
import {
  type FeatureItem,
  PricingTable,
  PricingTableBody,
  PricingTableHeader,
  PricingTableHead,
  PricingTableRow,
  PricingTableCell,
  PricingTablePlan,
} from "@/components/ui/pricing-table";

const features: FeatureItem[] = [
  {
    label: "Active Orders",
    values: ["Up to 50", "Unlimited", "Unlimited"],
  },
  {
    label: "Build, Repair & Repaint",
    values: [true, true, true],
  },
  {
    label: "Complexity-based Pricing",
    values: [true, true, true],
  },
  {
    label: "Client Portal Access",
    values: [true, true, true],
  },
  {
    label: "Reference Image Uploads",
    values: ["50 MB", "500 MB", "Unlimited"],
  },
  {
    label: "Progress Tracking",
    values: [true, true, true],
  },
  {
    label: "Email Support",
    values: ["Standard", "Priority", "24/7 Priority"],
  },
  {
    label: "Custom Form Templates",
    values: [false, true, true],
  },
  {
    label: "Analytics Dashboard",
    values: [false, true, true],
  },
  {
    label: "Multi-builder Support",
    values: [false, "Up to 3", "Unlimited"],
  },
  {
    label: "Workload Management",
    values: [false, true, true],
  },
  {
    label: "Change Request System",
    values: [false, true, true],
  },
  {
    label: "API Access",
    values: [false, false, true],
  },
  {
    label: "White-label Portal",
    values: [false, false, true],
  },
  {
    label: "Custom Branding",
    values: [false, false, true],
  },
  {
    label: "SSO & Team Management",
    values: [false, false, true],
  },
  {
    label: "Dedicated Account Manager",
    values: [false, false, true],
  },
  {
    label: "SLA Guarantee",
    values: [false, false, true],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 z-[-10] size-full opacity-30",
            "[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]"
          )}
          style={{
            backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
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
            Simple Pricing
          </span>
        </div>
        <h2 className="bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl dark:from-white dark:to-zinc-400">
          Flexible Plans for Every Studio
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
          Choose from tailored packages that fit your business goals and timeline. No hidden fees,
          cancel anytime.
        </p>
      </motion.div>

      {/* Mobile Pricing Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:hidden"
      >
        <div className="space-y-6">
          {/* Starter Plan */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Starter</h3>
                <p className="text-xs text-zinc-500">For Solo Builders</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold">$29</span>
              <span className="text-zinc-500">/month</span>
            </div>
            <Button variant="outline" className="w-full rounded-lg">
              Get Started
            </Button>
            <div className="mt-6 space-y-3">
              {features.slice(0, 8).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  {feature.values[0] === true ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : feature.values[0] === false ? (
                    <MinusIcon className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {feature.values[0]}
                    </span>
                  )}
                  <span className="text-zinc-600 dark:text-zinc-400">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Plan */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-500 bg-gradient-to-b from-indigo-50/50 to-white p-6 dark:from-indigo-950/20 dark:to-zinc-950">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="relative">
              <div className="mb-2 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Most Popular
              </div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950">
                  <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Professional</h3>
                  <p className="text-xs text-zinc-500">For Growing Studios</p>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-bold">$89</span>
                <span className="text-sm text-zinc-400 line-through">$129</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <Button className="w-full rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                Get Started
              </Button>
              <div className="mt-6 space-y-3">
                {features.slice(0, 12).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    {feature.values[1] === true ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : feature.values[1] === false ? (
                      <MinusIcon className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {feature.values[1]}
                      </span>
                    )}
                    <span className="text-zinc-600 dark:text-zinc-400">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Enterprise</h3>
                <p className="text-xs text-zinc-500">For Large Studios</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold">$249</span>
              <span className="text-zinc-500">/month</span>
            </div>
            <Button variant="outline" className="w-full rounded-lg">
              Contact Sales
            </Button>
            <div className="mt-6 space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  {feature.values[2] === true ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : feature.values[2] === false ? (
                    <MinusIcon className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {feature.values[2]}
                    </span>
                  )}
                  <span className="text-zinc-600 dark:text-zinc-400">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Desktop Pricing Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative hidden lg:block"
      >
        <PricingTable className="mx-auto my-5 max-w-5xl">
          <PricingTableHeader>
            <PricingTableRow>
              <th />
              <th className="p-1">
                <PricingTablePlan
                  name="Starter"
                  badge="For Solo Builders"
                  price="$29"
                  icon={Shield}
                >
                  <Button variant="outline" className="w-full rounded-lg" size="lg">
                    Get Started
                  </Button>
                </PricingTablePlan>
              </th>
              <th className="p-1">
                <PricingTablePlan
                  name="Professional"
                  badge="Most Popular"
                  price="$89"
                  compareAt="$129"
                  icon={Users}
                  className="after:pointer-events-none after:absolute after:-inset-0.5 after:rounded-[inherit] after:bg-gradient-to-b after:from-indigo-500/15 after:to-transparent after:blur-[2px]"
                >
                  <Button
                    className="w-full rounded-lg border-indigo-700/60 bg-indigo-600/80 text-white hover:bg-indigo-600"
                    size="lg"
                  >
                    Get Started
                  </Button>
                </PricingTablePlan>
              </th>
              <th className="p-1">
                <PricingTablePlan
                  name="Enterprise"
                  badge="For Large Studios"
                  price="$249"
                  icon={Rocket}
                >
                  <Button variant="outline" className="w-full rounded-lg" size="lg">
                    Contact Sales
                  </Button>
                </PricingTablePlan>
              </th>
            </PricingTableRow>
          </PricingTableHeader>
          <PricingTableBody>
            {features.map((feature, index) => (
              <PricingTableRow key={index}>
                <PricingTableHead className="text-zinc-600 dark:text-zinc-400">
                  {feature.label}
                </PricingTableHead>
                {feature.values.map((value, valueIndex) => (
                  <PricingTableCell key={valueIndex}>{value}</PricingTableCell>
                ))}
              </PricingTableRow>
            ))}
          </PricingTableBody>
        </PricingTable>
      </motion.div>

      {/* Featured Testimonial */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-auto mt-12 max-w-4xl px-2 sm:mt-16 sm:px-0"
      >
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 sm:p-8 md:p-12 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
          <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="relative text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 dark:border-indigo-800 dark:bg-indigo-950/30">
              <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                Increased efficiency by 70%
              </span>
            </div>
            <p className="text-lg font-semibold text-zinc-900 sm:text-xl dark:text-white">
              "Flow transformed how our studio operates. The pricing automation and client portal
              have been game-changers."
            </p>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              — James Wilson, Studio Co-Owner
            </p>
          </div>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">Can't decide? Let's talk</p>
        <Button size="lg" className="shadow-lg shadow-indigo-500/20">
          Book a Call
        </Button>
      </motion.div>
    </section>
  );
}
