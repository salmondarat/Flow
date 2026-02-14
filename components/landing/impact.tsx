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
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-4 py-24 md:px-8">
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

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 transition-all duration-300 hover:shadow-lg hover:bg-card"
          >
            {/* Background gradient */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />

            <div className="relative">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                className="mb-4"
              >
                <h3 className="text-5xl font-bold md:text-6xl lg:text-7xl">
                  <span className="from-primary to-purple-600 bg-linear-to-br bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </h3>
              </motion.div>

              <motion.h4
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {stat.label}
              </motion.h4>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                className="text-muted-foreground text-sm"
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
