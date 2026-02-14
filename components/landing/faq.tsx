"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  const accordionItems = [
    {
      title: "How do clients place custom build orders?",
      content: (
        <div className="text-muted-foreground">
          Clients can easily place orders through our public order form. They can specify multiple
          kits, select service types (Full Build, Repair, Repaint), choose complexity levels, and
          upload reference images for inspiration.
        </div>
      ),
    },
    {
      title: "How does pricing work?",
      content: (
        <div className="text-muted-foreground">
          Pricing is automatically calculated based on service type and complexity. Full Builds have
          a base price, while Repairs and Repaints have their own base rates. Complexity levels
          (Low, Medium, High) apply multipliers to adjust for difficulty. You can also offer service
          add-ons.
        </div>
      ),
    },
    {
      title: "Can clients request changes to their orders?",
      content: (
        <div className="text-muted-foreground">
          Yes! Clients can submit change requests through their portal, and you can approve or
          reject them. The system automatically shows the price and timeline impact, so both you and
          the client have full visibility before any changes are made.
        </div>
      ),
    },
    {
      title: "How do I track and update order progress?",
      content: (
        <div className="text-muted-foreground">
          You can add progress logs with optional photos to each order. Clients see a real-time
          timeline of all updates. The system tracks percentage completion and automatically updates
          order status from estimated through approved, in-progress, to completed.
        </div>
      ),
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
      transition={{ duration: 0.5, delay: 0.5, type: "spring", bounce: 0 }}
      className="relative mx-auto flex w-full max-w-(--breakpoint-xl) flex-col items-center justify-center gap-5 px-4 py-28 md:px-8"
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <h4 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          FAQ
        </h4>
        <p className="text-muted-foreground max-w-xl text-center">
          Common questions about Flow's model kit studio features.
        </p>
      </div>
      <div className="flex w-full max-w-lg">
        <Accordion type="multiple" className="w-full">
          {accordionItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="text-muted-foreground">
              <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
