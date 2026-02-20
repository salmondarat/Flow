"use client";

import Hero from "@/components/landing/hero";
import Partners from "@/components/landing/partners";
import Impact from "@/components/landing/impact";
import Services from "@/components/landing/services";
import Process from "@/components/landing/process";
import Work from "@/components/landing/work";
import Testimonials from "@/components/landing/testimonials";
import Pricing from "@/components/landing/pricing";
import Faq from "@/components/landing/faq";
import Blog from "@/components/landing/blog";
import Cta from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import nextDynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

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
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Partners />
      <Impact />
      <Services />
      <Process />
      <Work />
      <Testimonials />
      <Pricing />
      <Faq />
      <Blog />
      <Cta />
      <Footer />
    </main>
  );
}
