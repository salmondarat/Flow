"use client";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Partners() {
  const icons = [
    {
      name: "Gundam Base",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 2l2.5-1.25L12 8.75 9.5 10 12 8.75l2.5 1.25L12 4zm0 5l5 2.5-5 2.5-5-2.5 5-2.5zm0 2l8 4-8-4-8 4 8 4zm0 5l10 5-10-5-10 5 10 5z" />
        </svg>
      ),
    },
    {
      name: "Hobby Search",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 14.64 5 13.5 5c-2.76 0-5 2.24-5 5s2.24 5 5 5c.59 0 1.23-.08 1.62-.27l.27-.28h.79l1.59 1.59c.63.63 1.59 1.59 2.41 0 1.78-1.2 2.78-2.79 2.78H17c-1.1 0-2-.9-2-2s.9-2 2-2h-2.59c.59-.59 1.59-1.59 2.78-2.79l.28-.27c-.63-.63-.63-1.59 0-2.18-.27-1.62-.63-1.62H13.5zm-3 8c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5c.69 0 1.35.18 1.95.49l-1.59 1.59c-.63.63-1.59 1.59-2.79 0-1.78 1.2-2.78 2.79-2.79H17c1.1 0 2 .9 2 2s-.9 2-2 2h-2.59c-.59.59-1.59 1.59-2.78 2.79l-.28.27c.63.63.63 1.59 0 2.18.27 1.62.63 1.62H13.5z" />
        </svg>
      ),
    },
    {
      name: "Figma",
      svg: (
        <svg
          viewBox="0 0 28 28"
          width="32"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 14c0-3.86 3.13-7 7-7s7 3.14 7 7-3.13 7-7 7-7-3.14-7-7 7z"
            fill="#A259FF"
          />
          <path
            d="M7 21c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5v3.5c0 1.93-1.57 3.5-3.5 3.5S7 26.43 7 24.5V21z"
            fill="#1ABCFE"
          />
          <path
            d="M14 7c0-1.93-1.57-3.5-3.5-3.5S7 5.07 7 7v3.5c0 1.93 1.57 3.5 3.5S14 12.43 14 10.5V7z"
            fill="#0ACF83"
          />
          <path
            d="M7 14c0 1.93 1.57 3.5 3.5 3.5S14 15.93 14 14v-3.5c0-1.93-1.57-3.5-3.5-3.5S7 8.57 7 10.5V14z"
            fill="#FF7262"
          />
        </svg>
      ),
    },
    {
      name: "Dalong",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7v-2h10v2z" />
        </svg>
      ),
    },
    {
      name: "Mandarake",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-3.21 2.08-6.27 6-6.93V10H6v-6c0-2.97 2.16-6 6-6.93 0-4.08 3.05-7.44 7-7.93v6h8zM19 12h-6v5.66c0 2.21-2.09 4-4.5 4-4.92 0-3.66-2.93-6.74-6.5-6.93V9.5c0-4.25 3.32-7.75 7.5-7.93V12h6z" />
        </svg>
      ),
    },
    {
      name: "HLJ",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
        >
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 22c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 14H9V8h2v10zm-5 0h2V8H6v10zm10 0h-2V8h2v10z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-(--breakpoint-md) flex-col items-center justify-center gap-10 px-4 py-24 text-center md:px-8">
      <motion.div
        initial={{ y: 20, opacity: 0, filter: "blur(3px)" }}
        whileInView={{
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: "spring", bounce: 0 }}
        className="flex flex-col gap-3"
      >
        <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Trusted by Model Kit Builders
        </h2>
      </motion.div>
      <div className="grid w-full grid-cols-3 grid-rows-3 place-items-center gap-5 sm:grid-cols-6 sm:grid-rows-1">
        <TooltipProvider>
          {icons.map((icon, index) => (
            <Tooltip key={icon.name}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ y: 20, opacity: 0, filter: "blur(3px)" }}
                  whileInView={{
                    y: 0,
                    filter: "blur(0px)",
                    opacity: 1,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                    type: "spring",
                    bounce: 0,
                  }}
                >
                  {icon.svg}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>{icon.name}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </section>
  );
}
