"use client";

import { Footer } from "@/components/layout/footer";
import nextDynamic from "next/dynamic";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));

// Force dynamic rendering to prevent static generation issues with client components
export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight uppercase">
            Terms & Conditions
          </h1>
          <div className="bg-muted dark:bg-card border-border rounded-xl border p-8">
            <p className="text-muted-foreground mb-6 text-sm">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                By accessing or using Flow ("the Service"), you agree to be bound by these Terms &
                Conditions. If you disagree with any part of these terms, you may not access the
                Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">
                2. Accounts and Registration
              </h2>
              <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                <p>
                  To access certain features of the Service, you must register for an account. You
                  agree to:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">3. Service Description</h2>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Flow provides a model kit commission management platform that includes:
              </p>
              <ul className="text-muted-foreground list-disc space-y-2 pl-6 text-sm">
                <li>Order tracking and management</li>
                <li>Client communication tools</li>
                <li>Progress photo sharing</li>
                <li>Analytics and reporting</li>
                <li>Payment processing</li>
              </ul>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We reserve the right to modify or discontinue any feature at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">4. User Conduct</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You agree not to use the Service to:
              </p>
              <ul className="text-muted-foreground list-disc space-y-2 pl-6 text-sm">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or offensive content</li>
                <li>Disrupt the service or overwhelm servers</li>
                <li>Attempt to gain unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">5. Payment and Billing</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Paid services are subject to the pricing displayed at the time of purchase. We
                reserve the right to modify prices at any time. All fees are non-refundable unless
                otherwise stated.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">6. Termination</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We may terminate or suspend your account at any time, with or without cause, with or
                without notice.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-xl font-bold">7. Contact</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                For questions about these terms, contact us at{" "}
                <a href="mailto:legal@flow.sys" className="text-gundam-cyan hover:underline">
                  legal@flow.sys
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
