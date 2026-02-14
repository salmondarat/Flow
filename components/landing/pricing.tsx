"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      desc: "Perfect for solo builders",
      price: 29,
      isMostPop: false,
      features: [
        "Up to 50 active orders",
        "Full build, repair & repaint services",
        "Complexity-based pricing",
        "Client portal access",
        "Reference image uploads",
        "Progress tracking",
        "Email support",
      ],
    },
    {
      name: "Studio Pro",
      desc: "Best for growing studios",
      price: 79,
      isMostPop: true,
      features: [
        "Unlimited active orders",
        "Everything in Starter",
        "Custom form templates",
        "Analytics dashboard",
        "Multi-builder support",
        "Workload management",
        "Priority email support",
        "Change request system",
      ],
    },
    {
      name: "Enterprise",
      desc: "For large studios",
      price: 199,
      isMostPop: false,
      features: [
        "Everything in Studio Pro",
        "API access for integrations",
        "White-label client portal",
        "Custom branding",
        "SSO & team management",
        "Dedicated account manager",
        "24/7 priority support",
        "SLA guarantee",
      ],
    },
  ];

  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16 flex flex-col gap-3 text-center"
      >
        <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-center">
          Choose the perfect plan for your studio. All plans include core features.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative ${plan.isMostPop ? "scale-105" : ""}`}
          >
            <Card
              className={`relative h-full ${
                plan.isMostPop ? "border-primary border-2 shadow-xl" : ""
              }`}
            >
              {plan.isMostPop && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="bg-card border-primary rounded-full border-2 px-4 py-1 text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardContent className="p-6 pt-8">
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{plan.desc}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckIcon className="mr-3 h-4 w-4 flex-shrink-0 text-green-500" />
                      {feature}
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
                  {plan.price === 29 ? "Start Free Trial" : "Choose Plan"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
