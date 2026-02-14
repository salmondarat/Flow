"use client";
import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { number: "500+", label: "Studios" },
    { number: "10K+", label: "Orders Completed" },
    { number: "99%", label: "On-Time Delivery" },
    { number: "50+", label: "Countries" },
  ];

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="text-center"
            >
              <div className="mb-2 text-3xl font-bold md:text-4xl">{stat.number}</div>
              <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
