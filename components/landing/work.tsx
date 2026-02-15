"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Work() {
  const projects = [
    {
      id: 1,
      title: "MG Sazabi Custom",
      category: "Gundam",
      image: "https://images.unsplash.com/photo-1614726365723-49faaa5f6c44?w=800&q=80",
      span: "col-span-2 row-span-2",
    },
    {
      id: 2,
      title: "Star Wars AT-ST",
      category: "Star Wars",
      image: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&q=80",
      span: "col-span-1 row-span-2",
    },
    {
      id: 3,
      title: "Custom Diorama",
      category: "Diorama",
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
      span: "col-span-1 row-span-1",
    },
    {
      id: 4,
      title: "RX-78-2 Gundam",
      category: "Gundam",
      image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80",
      span: "col-span-1 row-span-1",
    },
    {
      id: 5,
      title: "Halo Warthog",
      category: "Halo",
      image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80",
      span: "col-span-1 row-span-1",
    },
    {
      id: 6,
      title: "Evangelion Unit-01",
      category: "Evangelion",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
      span: "col-span-1 row-span-1",
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
          Our Work
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center">
          How we've helped other builders.
        </p>
      </motion.div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px]">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${project.span} group relative overflow-hidden rounded-2xl border border-border bg-card/50 transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-primary/20`}
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span className="bg-primary/80 text-primary-foreground mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium">
                {project.category}
              </span>
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
            </motion.div>

            {/* Hover zoom effect */}
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-[-1]"
            >
              <div className="h-full w-full" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-muted-foreground hover:text-foreground text-sm font-medium underline underline-offset-4 transition-colors"
        >
          View all projects
        </motion.button>
      </motion.div>
    </section>
  );
}
