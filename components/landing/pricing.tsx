"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";
import { Plus, Minus } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Landing Page",
      label: "Ideal for designing or redesigning a website to increase conversion rates",
      priceStart: 29,
      priceEnd: 49,
      isMostPop: false,
      features: [
        { text: "Up to 50 active orders", included: true },
        { text: "Full build, repair & repaint services", included: true },
        { text: "Complexity-based pricing", included: true },
        { text: "Client portal access", included: true },
        { text: "Reference image uploads", included: true },
        { text: "Progress tracking", included: true },
        { text: "Email support", included: true },
        { text: "No-code Development", included: false, price: "+$2k", desc: "We will build your website for an additional fee" },
      ],
    },
    {
      name: "Partnership",
      label: "Tailored for businesses with ongoing design & marketing needs to scale your business",
      priceStart: 79,
      priceEnd: 99,
      isMostPop: true,
      features: [
        { text: "Unlimited active orders", included: true },
        { text: "Everything in Landing Page", included: true },
        { text: "Custom form templates", included: true },
        { text: "Analytics dashboard", included: true },
        { text: "Multi-builder support", included: true },
        { text: "Workload management", included: true },
        { text: "Priority email support", included: true },
        { text: "Change request system", included: true },
        { text: "Accelerate: x2 availability", included: false, price: "+$2k", desc: "Double the team availability for faster turnaround" },
      ],
    },
    {
      name: "Custom",
      label: "Limited availability - Tailored digital experiences built for unique business needs",
      priceStart: 199,
      priceEnd: 299,
      isMostPop: false,
      features: [
        { text: "Everything in Partnership", included: true },
        { text: "API access for integrations", included: true },
        { text: "White-label client portal", included: true },
        { text: "Custom branding", included: true },
        { text: "SSO & team management", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "24/7 priority support", included: true },
        { text: "SLA guarantee", included: true },
        { text: "Advanced SEO & Marketing", included: false, price: "Custom", desc: "Quote based on requirements" },
      ],
    },
  ];

  return (
    <section id="pricing" className="mx-auto w-full max-w-(--breakpoint-xl) px-4 py-24 md:px-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Pricing Plans
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center">
          Flexible Pricing built to Scale Businesses. Choose from tailored packages that fits your business goals and timeline.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="relative"
          >
            <Card
              className={`relative flex h-full flex-col transition-all duration-300 ${
                plan.isMostPop
                  ? "border-primary border-2 hover:shadow-2xl dark:hover:ring-4 dark:hover:ring-primary/30"
                  : "hover:shadow-lg dark:hover:ring-2 dark:hover:ring-primary/20"
              }`}
            >
              {plan.isMostPop && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="bg-card border-primary rounded-full border-2 px-4 py-1 text-sm font-medium">
                    Popular
                  </span>
                </div>
              )}

              <CardContent className="flex flex-1 flex-col p-6 pt-8">
                <div className="mb-4">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    {plan.label}
                  </span>
                </div>

                <div className="mb-4 text-center">
                  <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">${plan.priceStart}</span>
                    <span className="text-4xl font-bold">+</span>
                    <span className="text-4xl font-bold">${plan.priceEnd}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    /month
                  </p>
                </div>

                <ul className="flex flex-1 flex-col space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={`flex items-start gap-3 text-sm ${
                        !feature.included ? "opacity-60" : ""
                      }`}
                    >
                      {feature.included ? (
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <p>{feature.text}</p>
                        {feature.price && (
                          <div className="mt-1 flex items-center justify-between gap-2 rounded-md bg-muted/50 p-2">
                            <span className="text-xs">{feature.desc}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-3 text-xs"
                            >
                              {feature.price}
                            </Button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full"
                  variant={plan.isMostPop ? "default" : "outline"}
                  size="lg"
                >
                  Get Started Now
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Featured Testimonial */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-auto mt-16 max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative text-center">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Increased efficiency by 70%
            </p>
            <p className="mt-2 text-lg font-semibold">
              "Flow transformed how our studio operates. The pricing automation and client portal have
              been game-changers."
            </p>
            <p className="text-muted-foreground mt-2">
              — James Wilson, Studio Co-Owner
            </p>
          </div>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="mb-4 text-muted-foreground">Can't decide? Let's talk</p>
        <Button size="lg" className="shadow-lg">
          Book a call
        </Button>
      </motion.div>
    </section>
  );
}
