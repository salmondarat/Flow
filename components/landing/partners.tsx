"use client";
import { motion } from "framer-motion";

export default function Partners() {
  const partners = [
    { name: "Gundam Builders", logo: "GUNDAM BUILDERS" },
    { name: "Scale Model Works", logo: "SCALE MODEL WORKS" },
    { name: "Custom Kits Int.", logo: "CUSTOM KITS INT." },
    { name: "Gunpla Universe", logo: "GUNPLA UNIVERSE" },
    { name: "Model Art Studio", logo: "MODEL ART STUDIO" },
    { name: "Hobby Pro", logo: "HOBBY PRO" },
  ];

  // Duplicate partners for seamless marquee loop
  const marqueePartners = [...partners, ...partners, ...partners];

  return (
    <section className="relative w-full overflow-hidden border-y border-border/50 bg-muted/30 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-(--breakpoint-md) mb-8 px-4 text-center md:px-8"
      >
        <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Trusted by Model Kit Builders Worldwide
        </h2>
      </motion.div>

      {/* Marquee container */}
      <div className="relative w-full overflow-hidden">
        <div className="marquee-container flex gap-12 py-4">
          {marqueePartners.map((partner, index) => (
            <motion.div
              key={`${partner.name}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="shrink-0 text-muted-foreground/60 text-lg font-semibold tracking-wide transition-all hover:text-foreground"
            >
              {partner.logo}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-20 bg-linear-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-background to-transparent" />

      <style jsx>{`
        .marquee-container {
          animation: marquee 30s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 3rem));
          }
        }
      `}</style>
    </section>
  );
}
