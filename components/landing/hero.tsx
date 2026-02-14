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
import { motion } from "framer-motion";
import Link from "next/link";
import { Package2, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative items-center justify-center">
      <section className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center justify-center gap-12 px-4 py-28 md:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{ duration: 0.6, type: "spring", bounce: 0 }}
          className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-5 text-center"
        >
          <span className="bg-card border-border h-full w-fit rounded-full border px-2 py-1 text-sm">
            For Model Kit Studios
          </span>
          <h1 className="to-foreground dark:to-foreground mx-auto bg-linear-to-b from-sky-800 bg-clip-text text-4xl font-medium tracking-tighter text-pretty text-transparent md:text-6xl dark:from-sky-100">
            Streamline Your Custom Build Workflows
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-balance">
            Manage orders, track progress, and keep clients informed with tools built for custom
            model kit builders.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="items-center justify-center space-y-3 gap-x-3 sm:flex sm:space-y-0"
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, type: "spring", bounce: 0 }}
        className="pointer-events-none absolute -top-32 flex h-full w-full items-center justify-end"
      >
        <div className="flex w-3/4 items-center justify-center">
          <div className="bg-light h-150 w-12 rounded-3xl blur-[70px] will-change-transform max-sm:rotate-15 sm:rotate-35"></div>
        </div>
      </motion.div>
    </div>
  );
}
