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
    <section className="border-border/50 bg-muted/30 relative overflow-hidden border-y">
      <div className="mx-auto w-full max-w-(--breakpoint-xl) px-4 py-8 sm:py-10 md:px-8 md:py-12">
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
            className="mb-4 sm:mb-6"
          >
            <span className="bg-primary text-primary-foreground inline-block rounded-full px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm">
              Only 2 open slots available!
            </span>
          </motion.div>

          <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl lg:text-5xl">
            Book a call
          </h2>

          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base sm:mt-4 sm:text-lg md:text-xl">
            Join 500+ professionals elevating their brand. Schedule a free discovery call with us to
            talk strategy, goals, and how we can help you grow.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 sm:mt-8"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-base shadow-xl transition-all hover:shadow-2xl sm:h-14 sm:px-12 sm:text-lg"
            >
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
          className="mt-12 text-center sm:mt-16"
        >
          <p className="text-muted-foreground mb-4 text-sm sm:mb-6 sm:text-base">
            Strategic web design and campaigns tailored to drive result and conversions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {partners.map((partner, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-muted-foreground text-xs font-medium sm:text-sm"
              >
                {partner.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="bg-primary/5 absolute -top-40 -left-40 h-80 w-80 rounded-full blur-[100px]" />
      <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-purple-500/5 blur-[100px]" />
    </section>
  );
}
