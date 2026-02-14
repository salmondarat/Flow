/**
 * Admin wrapper for order form
 * Used by admins to create orders on behalf of customers
 */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OrderFormWizard } from "@/components/public/order-form";
import type { KitCardData } from "@/components/public/kit-card";

interface AdminOrderFormWrapperProps {
  serverAction: (data: {
    clientName: string;
    phone: string;
    email?: string;
    address?: string;
    items: KitCardData[];
  }) => Promise<void>;
}

export function AdminOrderFormWrapper({ serverAction }: AdminOrderFormWrapperProps) {
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
    <div className="bg-card rounded-lg border p-6">
      <OrderFormWizard onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
