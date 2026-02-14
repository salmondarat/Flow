"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Users, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 border-border border-b py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-gundam-cyan mb-4 text-5xl font-bold tracking-tight uppercase md:text-6xl">
                About Flow
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Advanced analytics and management for smarter decisions and custom build studios
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-16 md:grid-cols-2">
              <div>
                <h2 className="text-foreground mb-6 text-3xl font-bold uppercase">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Flow was built to solve a real problem: managing custom model kit commissions is chaotic.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We've created a platform that streamlines order intake, provides AI-powered estimates, tracks progress automatically, and keeps clients informed in real-time.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Whether you're a solo builder or managing a team, Flow scales with you.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-muted dark:bg-card border-border rounded-lg border p-6">
                  <div className="bg-gundam-cyan/10 text-gundam-cyan mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-2 font-bold">Mission</h3>
                  <p className="text-muted-foreground text-sm">
                    Empower builders with tools that eliminate administrative overhead
                  </p>
                </div>
                <div className="bg-muted dark:bg-card border-border rounded-lg border p-6">
                  <div className="bg-gundam-yellow/10 text-gundam-yellow mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-2 font-bold">Values</h3>
                  <p className="text-muted-foreground text-sm">
                    Precision, transparency, and respect for the craft
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="bg-muted/30 border-border border-y py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-foreground mb-12 text-center text-3xl font-bold uppercase">
              What We Offer
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Smart Estimates",
                  description: "AI-powered quoting based on kit complexity and historical data",
                },
                {
                  icon: Users,
                  title: "Client Portal",
                  description: "Real-time progress tracking and direct communication",
                },
                {
                  icon: Target,
                  title: "Order Management",
                  description: "Complete workflow from intake to delivery",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background dark:bg-card border-border rounded-lg border p-6"
                >
                  <div className="bg-gundam-cyan/10 text-gundam-cyan mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-2 font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-foreground mb-6 text-3xl font-bold uppercase">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
              Join hundreds of builders and studio owners who have already made the switch.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="bg-gundam-yellow text-accent-content hover:bg-background border-gundam-yellow group relative flex items-center gap-2 overflow-hidden border px-8 py-4 text-lg font-bold tracking-wide uppercase transition-colors"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
