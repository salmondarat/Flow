"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, MapPin, Send } from "lucide-react";

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

  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 border-border border-b py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-gundam-cyan mb-4 text-5xl font-bold tracking-tight uppercase md:text-6xl">
              Contact Us
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Have questions? We're here to help. Reach out and we'll get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <div className="grid gap-12 md:grid-cols-3">
                {/* Contact Info Cards */}
                <div className="space-y-6">
                  <Card className="border">
                    <CardContent className="p-6">
                      <div className="bg-gundam-cyan/10 text-gundam-cyan mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                        <Mail className="h-6 w-6" />
                      </div>
                      <h3 className="text-foreground mb-2 font-bold">Email</h3>
                      <p className="text-muted-foreground text-sm">
                        <a href="mailto:support@flow.sys" className="text-gundam-cyan hover:underline">
                          support@flow.sys
                        </a>
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border">
                    <CardContent className="p-6">
                      <div className="bg-gundam-yellow/10 text-gundam-yellow mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <h3 className="text-foreground mb-2 font-bold">Location</h3>
                      <p className="text-muted-foreground text-sm">
                        Available worldwide
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border">
                    <CardContent className="p-6">
                      <div className="bg-gundam-red/10 text-gundam-red mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                        <Send className="h-6 w-6" />
                      </div>
                      <h3 className="text-foreground mb-2 font-bold">Response Time</h3>
                      <p className="text-muted-foreground text-sm">
                        Within 24 hours
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2">
                  <Card className="border">
                    <CardContent className="p-8">
                      <h2 className="text-foreground mb-6 text-2xl font-bold">Send us a message</h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input id="name" name="name" placeholder="Your name" required disabled={isLoading || isSent} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" name="email" type="email" placeholder="your@email.com" required disabled={isLoading || isSent} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input id="subject" name="subject" placeholder="How can we help?" required disabled={isLoading || isSent} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
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
                          {isLoading ? "Sending..." : isSent ? "Message Sent!" : "Send Message"}
                          {!isLoading && !isSent && <Send className="ml-2 h-4 w-4" />}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
