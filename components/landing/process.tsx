"use client";

import { motion } from "framer-motion";

export default function Process() {
  const steps = [
    {
      number: "01",
      title: "Submit Request",
      description:
        "Client submits their custom model kit build request through the intuitive form builder with reference images.",
    },
    {
      number: "02",
      title: "Complexity Assessment",
      description:
        "AI-powered pricing automatically assesses build complexity and provides accurate quotes within seconds.",
    },
    {
      number: "03",
      title: "Production Tracking",
      description:
        "Real-time progress updates keep clients informed at every stage of the build process.",
    },
    {
      number: "04",
      title: "Client Approval",
      description:
        "Review and approve milestones. Clients can request changes with clear pricing and timeline impact.",
    },
    {
      number: "05",
      title: "Delivery",
      description:
        "Final quality check and shipping. Generate tracking links and share with clients automatically.",
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
          Our Process
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center">
          A proven & effective workflow process.
        </p>
      </motion.div>

      <div className="mx-auto max-w-5xl">
        <div className="relative">
          {/* Connecting line - hidden on mobile, visible on md+ */}
          <div className="bg-border absolute top-8 bottom-8 left-1/2 hidden w-px -translate-x-1/2 md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col gap-4 pb-12 md:flex-row md:gap-16 md:pb-16 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Spacer for center alignment */}
              <div className="hidden md:block md:w-[calc(50%-3rem)]" />

              {/* Content */}
              <motion.div
                initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="w-full min-w-0 md:w-[calc(50%-3rem)]"
              >
                <div className="border-border bg-card/50 hover:bg-card relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg">
                  {/* Number badge - positioned top-right corner */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1 + 0.2,
                      type: "spring",
                    }}
                    className="bg-primary text-primary-foreground ring-background absolute -top-3 -right-2 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-lg ring-2"
                  >
                    {step.number}
                  </motion.div>

                  <h3 className="mb-2 pr-4 text-lg font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
