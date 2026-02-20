"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function Faq() {
  const accordionItems = [
    {
      title: "How do clients place custom build orders?",
      content:
        "Clients can easily place orders through our public order form. They can specify multiple kits, select service types (Full Build, Repair, Repaint), choose complexity levels, and upload reference images for inspiration.",
    },
    {
      title: "How does pricing work?",
      content:
        "Pricing is automatically calculated based on service type and complexity. Full Builds have a base price, while Repairs and Repaints have their own base rates. Complexity levels (Low, Medium, High) apply multipliers to adjust for difficulty. You can also offer service add-ons.",
    },
    {
      title: "Can clients request changes to their orders?",
      content:
        "Yes! Clients can submit change requests through their portal, and you can approve or reject them. The system automatically shows price and timeline impact, so both you and client have full visibility before any changes are made.",
    },
    {
      title: "How do I track and update order progress?",
      content:
        "You can add progress logs with optional photos to each order. Clients see a real-time timeline of all updates. The system tracks percentage completion and automatically updates order status from estimated through approved, in-progress, to completed.",
    },
    {
      title: "What happens if a client wants to cancel?",
      content:
        "Clients can cancel at any time before work begins. Once work has started, cancellation terms apply based on the progress completed. You can customize cancellation policies in your studio settings.",
    },
    {
      title: "Is there a limit on the number of orders?",
      content:
        "The Starter plan supports up to 50 active orders, Studio Pro offers unlimited orders, and Enterprise plans have no restrictions. You can always upgrade your plan as your business grows.",
    },
  ];

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-full max-w-(--breakpoint-xl) px-4 py-16 sm:py-20 md:px-8 md:py-24"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h4 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          FAQs
        </h4>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-center">
          Have questions? We got answers.
        </p>
      </motion.div>

      <div className="mx-auto max-w-4xl">
        <Accordion type="multiple" className="w-full space-y-3 sm:space-y-4">
          {accordionItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border bg-card/50 data-[state=open]:border-primary/50 overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg data-[state=open]:shadow-xl sm:rounded-2xl"
            >
              <AccordionTrigger className="group flex w-full items-center justify-between px-4 py-4 text-left hover:no-underline sm:px-6 sm:py-5">
                <span className="pr-4 text-sm font-semibold sm:text-base">{item.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 sm:px-6 sm:pb-5">
                <p className="text-muted-foreground text-sm leading-relaxed">{item.content}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 text-center"
      >
        <p className="text-muted-foreground mb-4">Can't find your answer?</p>
        <p className="text-muted-foreground mb-4 text-sm">
          Get in touch with our support team, they are friendly!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border-border bg-card hover:bg-accent mx-auto flex items-center justify-center gap-2 rounded-full border px-6 py-3 transition-all duration-300 hover:shadow-lg"
        >
          <Mail className="h-4 w-4" />
          <span className="font-medium">Contact us</span>
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
