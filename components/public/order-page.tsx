/**
 * Client wrapper for order form page with toast notifications
 */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OrderFormWizard } from "./order-form";
import type { KitCardData } from "./kit-card";

interface OrderPageWrapperProps {
  serverAction: (data: {
    clientName: string;
    phone: string;
    email?: string;
    address?: string;
    items: KitCardData[];
  }) => Promise<void>;
}

export function OrderPageWrapper({ serverAction }: OrderPageWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: {
    clientName: string;
    phone: string;
    email?: string;
    address?: string;
    items: KitCardData[];
  }) => {
    setIsSubmitting(true);
    try {
      await serverAction(data);
      // Redirect is handled by the server action
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Place Your Order</h1>
        <p className="text-muted-foreground">
          Fill in the details below to get started with your custom build project
        </p>
      </div>

      <OrderFormWizard onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
