"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Cta() {
  const partners = [
    { name: "Gundam Builders" },
    { name: "Scale Model Works" },
    { name: "Custom Kits Int." },
    { name: "Gunpla Universe" },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-muted/30">
      <div className="mx-auto w-full max-w-(--breakpoint-xl) px-4 py-24 md:px-8 md:py-32">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Urgency badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <span className="bg-primary text-primary-foreground inline-block rounded-full px-4 py-2 text-sm font-semibold">
              Only 2 open slots available!
            </span>
          </motion.div>

          <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl">
            Book a call
          </h2>

          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg md:text-xl">
            Join 500+ professionals elevating their brand. Schedule a free discovery call with us to
            talk strategy, goals, and how we can help you grow.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Button size="lg" className="h-14 px-12 text-lg shadow-xl transition-all hover:shadow-2xl">
              Book a 15-Min call
            </Button>
          </motion.div>
        </motion.div>

        {/* Partner logos */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Strategic web design and campaigns tailored to drive result and conversions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((partner, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-muted-foreground text-sm font-medium"
              >
                {partner.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-purple-500/5 blur-[100px]" />
    </section>
  );
}
