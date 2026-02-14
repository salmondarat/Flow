"use client";

import { motion } from "framer-motion";
import { Package, BarChart3, RefreshCw, Layers, Share2 } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Package,
      title: "Custom Build Management",
      description:
        "Manage multiple custom build orders with ease. Track each build from submission to delivery.",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking & Client Portal",
      description:
        "Give clients real-time visibility into their build progress with a beautiful client portal.",
    },
    {
      icon: RefreshCw,
      title: "Change Request System",
      description:
        "Streamline modification requests with automated approval workflows and impact tracking.",
    },
    {
      icon: Layers,
      title: "Multi-Kit Support",
      description:
        "Manage complex projects with multiple kits in one dashboard. Track each separately.",
    },
    {
      icon: Share2,
      title: "Public Tracking",
      description:
        "Share build progress with anyone via public links. Perfect for communities and showcases.",
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
          Our Services
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center">
          From ideas into high-impact solutions that inspire and convert.
        </p>
      </motion.div>

      <div className="scrollbar-hide overflow-x-auto overflow-y-visible px-2 pt-2 pb-8">
        <div className="flex gap-6 md:justify-center">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group border-border bg-card hover:shadow-primary/20 hover:ring-primary/30 relative max-w-[350px] min-w-[280px] flex-shrink-0 overflow-visible rounded-2xl border transition-all duration-300 will-change-transform hover:shadow-xl hover:ring-2 md:max-w-[380px] md:min-w-[320px]"
            >
              {/* Background gradient */}
              <div className="from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/15 absolute inset-0 bg-gradient-to-br transition-opacity" />

              <div className="relative p-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                  }}
                  className="from-primary to-primary/80 mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br"
                >
                  <service.icon className="h-7 w-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute right-4 bottom-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="bg-primary/20 text-primary rounded-full p-2 shadow-lg">
                    <Share2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
