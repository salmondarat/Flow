"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Solo Builder",
      avatar: "https://i.pravatar.cc/150?img=1",
      content:
        "Flow has completely transformed how I manage my custom build commissions. The progress tracking and client portal have saved me countless hours and my clients love being able to see real-time updates.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Studio Owner, Scale Model Works",
      avatar: "https://i.pravatar.cc/150?img=3",
      content:
        "Since switching to Flow, our studio's efficiency has improved dramatically. The automated pricing and order management tools have reduced our administrative work by 70%. We can focus more on building.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Professional Builder",
      avatar: "https://i.pravatar.cc/150?img=5",
      content:
        "The reference image upload feature is a game-changer. Clients can share inspiration directly through the platform, which eliminates miscommunications and ensures we're always aligned on their vision.",
      rating: 5,
    },
    {
      name: "Robert Taylor",
      role: "Commission Artist",
      avatar: "https://i.pravatar.cc/150?img=15",
      content:
        "I've tried multiple project management tools, but Flow is first one that actually understands the custom model kit workflow. The form templates and service configurability are exactly what I needed.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Studio Manager, Custom Kits International",
      avatar: "https://i.pravatar.cc/150?img=17",
      content:
        "The change request system has solved one of our biggest pain points. Clients can request modifications, and we can approve or reject them with full visibility into price and timeline impact.",
      rating: 5,
    },
    {
      name: "Kevin Lee",
      role: "Independent Builder",
      avatar: "https://i.pravatar.cc/150?img=19",
      content:
        "Flow's multi-kit support is perfect for my Gundam diorama projects. I can manage multiple orders in one dashboard, track each separately, and keep all my client communications organized.",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prevIndex) => (prevIndex + newDirection + testimonials.length) % testimonials.length
    );
  };

  const StarIcon = () => <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="mx-auto w-full max-w-(--breakpoint-xl) px-4 py-24 md:px-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Testimonials
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center">
          Results that speaks volume. Read success stories.
        </p>
      </motion.div>

      {/* Single unified carousel */}
      <div className="mx-auto max-w-3xl">
        <div className="relative min-h-[400px]">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="border-border bg-card/50 w-full rounded-2xl border p-8 shadow-lg md:p-12">
                {/* Large avatar */}
                <div className="mb-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  >
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="border-primary/20 h-20 w-20 rounded-full border-4 shadow-xl"
                    />
                  </motion.div>
                </div>

                {/* Star rating */}
                <div className="mb-4 flex justify-center gap-1">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <StarIcon />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground mb-6 text-center text-lg leading-relaxed md:text-xl"
                >
                  &ldquo;{currentTestimonial.content}&rdquo;
                </motion.p>

                {/* Author info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <p className="text-lg font-semibold">{currentTestimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{currentTestimonial.role}</p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <motion.button
            onClick={() => paginate(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="border-border bg-card text-foreground hover:bg-accent flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  i === currentIndex ? "bg-primary w-6" : "bg-muted hover:bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={() => paginate(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="border-border bg-card text-foreground hover:bg-accent flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-muted-foreground text-sm">1500 satisfied clients love our services</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
          ))}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">4.9 Based on 1.5k reviews</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-muted-foreground hover:text-foreground mt-4 text-sm font-medium underline underline-offset-4 transition-colors"
        >
          View all reviews
        </motion.button>
      </motion.div>
    </section>
  );
}
