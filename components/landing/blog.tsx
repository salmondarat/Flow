"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Tips for Customizing Your First Gundam",
      excerpt:
        "Learn the essential techniques for customizing your first Gunpla kit, from basic panel lining to advanced weathering effects.",
      author: "Alex Chen",
      readTime: "5 Min Read",
      category: "Gundam",
      date: "Jan 25, 2026",
      image: "/images/11. .jpg",
    },
    {
      id: 2,
      title: "Building a Diorama: A Complete Guide",
      excerpt:
        "Step-by-step guide to creating stunning dioramas that tell a story, from planning to final touches.",
      author: "Marcus Rodriguez",
      readTime: "8 Min Read",
      category: "Diorama",
      date: "Jan 15, 2026",
      image: "/images/12. .png",
    },
    {
      id: 3,
      title: "How to Use Progress Tracking Effectively",
      excerpt:
        "Best practices for using Flow's progress tracking features to keep clients happy and informed.",
      author: "Emma Thompson",
      readTime: "4 Min Read",
      category: "Tips",
      date: "Jan 10, 2026",
      image: "/images/13. .jpg",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-4 py-16 sm:py-20 md:px-8 md:py-24">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          From the Blog
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center">
          Latest news and updates. Stay ahead with strategies that blend design, tech, and marketing
          to drive measurable business results.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer"
          >
            <div className="border-border bg-card/50 h-full overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-xl sm:rounded-2xl">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="bg-primary/90 absolute inset-0 transition-opacity"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-primary-foreground text-lg font-semibold">
                      Read Article
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-primary/20 text-primary rounded-full px-3 py-1 text-xs font-medium">
                    {post.category}
                  </span>
                </div>

                <h3 className="mb-2 text-base leading-tight font-semibold sm:text-lg">
                  {post.title}
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="border-border/50 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      <span className="text-muted-foreground text-xs font-bold">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.author}</p>
                      <p className="text-muted-foreground text-xs">{post.readTime}</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs">{post.date}</span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
