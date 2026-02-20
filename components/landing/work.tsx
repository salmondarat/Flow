"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronRight, Share, Info } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "MG Sazabi Custom",
    client: "Private Collector",
    year: "2023",
    category: "Gundam",
    description: "Premium custom paint job with weathering effects and LED lighting system. This project showcases advanced airbrushing techniques and precise color modulation.",
    image: "/images/5. .jpg",
  },
  {
    id: 2,
    title: "Star Wars AT-ST",
    client: "Disney Interactive",
    year: "2024",
    category: "Star Wars",
    description: "Movie-accurate detailing with battle damage effects and custom base. Created for promotional display with full weathering work.",
    image: "/images/6. .jpg",
  },
  {
    id: 3,
    title: "Custom Diorama",
    client: "Bandai Namco",
    year: "2023",
    category: "Diorama",
    description: "Urban battle scene with dynamic posing and environmental storytelling. Features custom-built terrain and lighting effects.",
    image: "/images/7. .jpg",
  },
  {
    id: 4,
    title: "RX-78-2 Gundam",
    client: "Private Collector",
    year: "2024",
    category: "Gundam",
    description: "Classic rebuild with modern articulation and metallic finish. Enhanced with additional panel line detailing and custom decals.",
    image: "/images/8. .jpg",
  },
  {
    id: 5,
    title: "Halo Warthog",
    client: "343 Industries",
    year: "2023",
    category: "Halo",
    description: "1:35 scale replica with opening doors and detailed interior. Commissioned for limited edition promotional materials.",
    image: "/images/9. .jpg",
  },
  {
    id: 6,
    title: "Evangelion Unit-01",
    client: "Anime Studio",
    year: "2024",
    category: "Evangelion",
    description: "Bio-mechanical transformation with progressive color shading. Features translucent parts and LED eye system.",
    image: "/images/10. .jpg",
  },
];

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active thumbnail
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const activeThumb = container.children[activeIndex] as HTMLElement;
      if (activeThumb) {
        const scrollLeft = activeThumb.offsetLeft - container.offsetLeft - container.clientWidth / 2 + activeThumb.clientWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  const activeProject = PROJECTS[activeIndex];
  const goToPrev = () => setActiveIndex((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
  const goToNext = () => setActiveIndex((prev) => (prev === PROJECTS.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative mx-auto w-full max-w-360 px-4 py-16 sm:px-6 md:px-8 lg:px-10">
      {/* Section Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Work</h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
          Explore the digital journeys we've crafted with precision and passion.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:gap-12">
        {/* Info Panel + Image Display */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left Info Panel */}
          <div className="lg:w-1/4 flex flex-col justify-end pb-4 order-2 lg:order-1">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold tracking-widest uppercase mb-2 block text-[#13ec5b]">
                  Featured Project
                </span>
                <motion.h1
                  key={activeProject.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl font-bold leading-tight mb-4 sm:text-5xl"
                >
                  {activeProject.title}
                </motion.h1>
                <motion.p
                  key={`desc-${activeProject.id}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-sm leading-relaxed text-slate-500 dark:text-slate-400"
                >
                  {activeProject.description}
                </motion.p>
              </div>

              <div className="flex gap-4 items-center pt-4 border-t border-[#13ec5b]/10">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Client</p>
                  <p className="text-sm font-medium">{activeProject.client}</p>
                </div>
                <div className="h-8 w-px bg-[#13ec5b]/20"></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Year</p>
                  <p className="text-sm font-medium">{activeProject.year}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-700 text-slate-400 hover:border-[#13ec5b] hover:text-[#13ec5b] transition-colors">
                  <Share className="h-5 w-5" />
                </button>
                <button className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-700 text-slate-400 hover:border-[#13ec5b] hover:text-[#13ec5b] transition-colors">
                  <Info className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Image Display */}
          <div className="lg:w-3/4 order-1 lg:order-2">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full min-h-100 lg:min-h-150 rounded-xl overflow-hidden relative bg-slate-900 dark:bg-zinc-900"
            >
              {/* Main Image */}
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
              </motion.div>

              {/* Navigation Arrows */}
              <div className="absolute bottom-6 right-6 flex gap-2 z-10">
                <button
                  onClick={goToPrev}
                  className="bg-black/50 backdrop-blur-md hover:bg-[#13ec5b] hover:text-background-dark text-white h-12 w-12 rounded-full flex items-center justify-center transition-all"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="bg-black/50 backdrop-blur-md hover:bg-[#13ec5b] hover:text-background-dark text-white h-12 w-12 rounded-full flex items-center justify-center transition-all"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {/* Image Counter */}
              <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-10">
                <span className="text-xs font-mono text-[#13ec5b]">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-mono text-slate-400">/</span>
                <span className="text-xs font-mono text-white">
                  {String(PROJECTS.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-2"></div>

        {/* Thumbnail Slider Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end px-1">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Gallery Index</h3>
            <div className="flex gap-2 text-[#13ec5b]/50 text-xs font-mono items-center">
              <span>SCROLL</span>
              <ChevronRight className="h-4 w-4 animate-pulse" />
            </div>
          </div>

          <div className="relative group/slider">
            {/* Thumbnails Container */}
            <div
              ref={thumbnailContainerRef}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {PROJECTS.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setActiveIndex(index)}
                  className="shrink-0 w-32 md:w-48 aspect-video relative cursor-pointer group/thumb"
                >
                  {index === activeIndex && (
                    <div className="absolute inset-0 border-2 border-[#13ec5b] rounded-lg z-20 pointer-events-none"></div>
                  )}
                  <div
                    className={`w-full h-full rounded-lg transition-all ${
                      index === activeIndex
                        ? "opacity-100"
                        : "opacity-50 grayscale group-hover/thumb:opacity-100 group-hover/thumb:grayscale-0"
                    }`}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 128px, 192px"
                    />
                  </div>
                  {index === activeIndex && (
                    <div className="absolute inset-0 bg-[#13ec5b]/10 rounded-lg"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Hide scrollbar style */}
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}
