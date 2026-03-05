"use client";

import { motion } from "framer-motion";

export default function Impact() {
  const stats = [
    {
      value: "500+",
      label: "Studios Worldwide",
      description: "From solo builders to large studios using Flow",
    },
    {
      value: "10K+",
      label: "Orders Managed",
      description: "Custom builds tracked from start to finish",
    },
    {
      value: "$1M+",
      label: "Revenue Generated",
      description: "Helping builders grow their businesses",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-4 py-8 sm:py-10 md:px-8 md:py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Impact
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center">
          Bravio simplifies the process, and delivers results.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -3 }}
            className="group border-border bg-card/50 hover:bg-card relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-lg sm:rounded-2xl sm:p-8"
          >
            {/* Background gradient */}
            <div className="bg-primary/10 absolute -top-20 -right-20 h-32 w-32 rounded-full opacity-50 blur-3xl transition-opacity group-hover:opacity-100 sm:h-40 sm:w-40" />

            <div className="relative">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                className="mb-3 sm:mb-4"
              >
                <h3 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="from-primary bg-linear-to-br to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </h3>
              </motion.div>

              <motion.h4
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase sm:text-sm"
              >
                {stat.label}
              </motion.h4>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                className="text-muted-foreground text-xs sm:text-sm"
              >
                {stat.description}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
