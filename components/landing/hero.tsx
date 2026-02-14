"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Package2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1614726365723-49faaa5f6c44?w=800&q=80",
    alt: "Gunpla Custom Build 1",
  },
  {
    src: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80",
    alt: "Gunpla Custom Build 2",
  },
  {
    src: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&q=80",
    alt: "Model Kit Build 3",
  },
  {
    src: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
    alt: "Diorama Build 4",
  },
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative items-center justify-center">
      <section className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-12 px-4 py-28 md:px-8 lg:flex-row lg:items-stretch lg:justify-between">
        {/* Left Side - Image Slider */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0 }}
          className="relative w-full lg:w-1/2"
        >
          <div className="relative aspect-square lg:aspect-auto lg:h-full">
            <AnimatePresence mode="wait">
              {heroImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                  style={{ display: currentImageIndex === index ? "block" : "none" }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="rounded-3xl object-cover shadow-2xl"
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Image navigation dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? "bg-primary w-6" : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0 }}
          className="flex w-full flex-col items-center justify-center space-y-5 text-center lg:w-1/2 lg:items-start lg:text-left"
        >
          <span className="bg-card border-border h-full w-fit rounded-full border px-2 py-1 text-sm">
            For Model Kit Studios
          </span>
          <h1 className="to-foreground dark:to-foreground mx-auto bg-linear-to-b from-sky-800 bg-clip-text text-4xl font-medium tracking-tighter text-pretty text-transparent md:text-6xl lg:mx-0 dark:from-sky-100">
            Streamline Your Custom Build Workflows
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-balance lg:mx-0">
            Manage orders, track progress, and keep clients informed with tools built for custom
            model kit builders.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="items-center justify-center space-y-3 gap-x-3 sm:flex sm:space-y-0 lg:justify-start"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button className="shadow-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Welcome to Flow</DialogTitle>
                  <DialogDescription>
                    Start your free trial and discover how Flow can transform your model kit studio
                    operations. Perfect for solo builders and growing studios.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button asChild size="sm">
                    <Link href="/register">Create Free Account</Link>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>
      </section>

      {/* Background gradient blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, type: "spring", bounce: 0 }}
        className="pointer-events-none absolute -top-32 right-0 left-0 flex h-full w-full items-center justify-end"
      >
        <div className="bg-light h-150 w-12 rounded-3xl blur-[70px] will-change-transform max-sm:rotate-15 sm:rotate-35"></div>
      </motion.div>
    </div>
  );
}
