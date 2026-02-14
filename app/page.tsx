"use client";

import Hero from "@/components/landing/hero";
import Partners from "@/components/landing/partners";
import Testimonials from "@/components/landing/testimonials";
import Stats from "@/components/landing/stats";
import Pricing from "@/components/landing/pricing";
import Faq from "@/components/landing/faq";
import Footer from "@/components/landing/footer";
import { Header } from "@/components/layout/header";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <section className="relative flex min-h-screen items-center justify-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-semibold tracking-tight">Loading...</h1>
          </div>
        </section>
      </div>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <Header />
      <Hero />
      <Partners />
      <Testimonials />
      <Stats />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  );
}
