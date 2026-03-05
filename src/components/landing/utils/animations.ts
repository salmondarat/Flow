import { Variants, Transition } from "framer-motion";

// Fade in from bottom animation with blur
export const fadeInUp = {
  initial: { y: 20, opacity: 0, filter: "blur(3px)" },
  whileInView: { y: 0, opacity: 1, filter: "blur(0px)" },
  viewport: { once: true },
  transition: { duration: 0.5, type: "spring", bounce: 0 } as Transition,
};

// Fade in from left
export const fadeInLeft = {
  initial: { x: -20, opacity: 0, filter: "blur(3px)" },
  whileInView: { x: 0, opacity: 1, filter: "blur(0px)" },
  viewport: { once: true },
  transition: { duration: 0.5, type: "spring", bounce: 0 } as Transition,
};

// Fade in from right
export const fadeInRight = {
  initial: { x: 20, opacity: 0, filter: "blur(3px)" },
  whileInView: { x: 0, opacity: 1, filter: "blur(0px)" },
  viewport: { once: true },
  transition: { duration: 0.5, type: "spring", bounce: 0 } as Transition,
};

// Scale in animation
export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, type: "spring", bounce: 0 } as Transition,
};

// Floating effect for elements
export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Staggered container variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0, filter: "blur(3px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0 },
  },
};

// Slide variants for carousel
export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

// Card hover effect
export const cardHover = {
  whileHover: { scale: 1.02, y: -5 },
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

// Button press effect
export const buttonPress = {
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 20 },
};
