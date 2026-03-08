"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import nextDynamic from "next/dynamic";
import { toast } from "sonner";
import { Mail, MapPin, Send, Sparkles, Check, Clock } from "lucide-react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // Simulate form submission (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSent(true);
    toast.success("Message sent successfully! We'll get back to you soon.");

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSent(false);
      (e.target as HTMLFormElement).reset();
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      value: "support@flow.sys",
      link: "mailto:support@flow.sys",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      value: "Available worldwide",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Response Time",
      value: "Within 24 hours",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="light:bg-white light:text-zinc-900 min-h-screen bg-zinc-950 font-sans text-white transition-colors duration-300">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 hidden h-200 w-200 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-900/20 via-purple-900/10 to-transparent opacity-50 blur-3xl dark:block" />
            <div className="absolute top-0 left-1/2 block h-200 w-200 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-100 via-purple-50 to-transparent opacity-50 blur-3xl dark:hidden" />
          </div>
          <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:bg-zinc-900/10 mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-colors hover:bg-white/10">
                <Sparkles className="light:text-zinc-600 h-4 w-4 text-zinc-400" />
                <span className="light:text-zinc-700 text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                  Contact Us
                </span>
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Get in
                <span className="light:from-zinc-900 light:via-zinc-800 block bg-linear-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
                  touch
                </span>
              </h1>
              <p className="light:text-zinc-600 mb-12 text-xl leading-relaxed text-zinc-400">
                Have questions? We&apos;re here to help. Reach out and we&apos;ll get back to you
                within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
              {/* Contact Info Cards */}
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="relative p-8">
                      <div
                        className={`absolute -top-4 -right-4 h-24 w-24 rounded-full bg-linear-to-br ${info.gradient} opacity-0 blur-3xl`}
                      />
                      <div
                        className={`relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${info.gradient} text-white shadow-lg`}
                      >
                        {info.icon}
                      </div>
                      <h3 className="light:text-zinc-900 relative mb-3 text-xl font-bold text-white">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="light:text-zinc-600 relative text-lg font-medium text-zinc-400 hover:underline"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="light:text-zinc-600 relative text-lg text-zinc-400">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="light:border-zinc-900/10 light:bg-zinc-900/5 light:shadow-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-white/10 backdrop-blur-xl">
                  <div className="relative p-8 lg:p-12">
                    <h2 className="light:text-zinc-900 mb-8 text-3xl font-bold tracking-tight text-white">
                      Send us a message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="light:text-zinc-700 text-zinc-300">
                            Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                            disabled={isLoading || isSent}
                            className="light:border-zinc-900/10 light:bg-zinc-900/5 light:text-zinc-900 light:focus:border-zinc-900/20 border-white/10 bg-white/5 text-white focus:border-white/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="light:text-zinc-700 text-zinc-300">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            disabled={isLoading || isSent}
                            className="light:border-zinc-900/10 light:bg-zinc-900/5 light:text-zinc-900 light:focus:border-zinc-900/20 border-white/10 bg-white/5 text-white focus:border-white/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="light:text-zinc-700 text-zinc-300">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help?"
                          required
                          disabled={isLoading || isSent}
                          className="light:border-zinc-900/10 light:bg-zinc-900/5 light:text-zinc-900 light:focus:border-zinc-900/20 border-white/10 bg-white/5 text-white focus:border-white/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="light:text-zinc-700 text-zinc-300">
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          required
                          disabled={isLoading || isSent}
                          className="resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading || isSent}
                      >
                        {isLoading ? (
                          "Sending..."
                        ) : isSent ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Message Sent!
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="light:bg-zinc-50 bg-zinc-900/50 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="light:text-zinc-900 mb-12 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 text-left">
              {[
                {
                  question: "How quickly will you respond?",
                  answer:
                    "We aim to respond to all inquiries within 24 hours. For urgent matters, please mark your subject line accordingly.",
                },
                {
                  question: "Can I get a demo before signing up?",
                  answer:
                    "Absolutely! We offer free demos for interested teams. Contact us to schedule a personalized walkthrough.",
                },
                {
                  question: "Do you offer custom solutions?",
                  answer:
                    "Yes! We work with larger studios to build custom integrations and features that fit their specific needs.",
                },
              ].map((faq) => (
                <div
                  key={faq.question}
                  className="light:border-zinc-900/10 light:bg-zinc-900/5 light:hover:border-zinc-900/20 light:hover:bg-zinc-900/10 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
                >
                  <div className="relative p-8">
                    <h3 className="light:text-zinc-900 mb-4 text-xl font-bold text-white">
                      {faq.question}
                    </h3>
                    <p className="light:text-zinc-600 text-base text-zinc-400">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
