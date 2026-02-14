/**
 * Order Form Page
 * Public page for clients to submit new orders
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

import { redirect } from "next/navigation";
import { OrderPageWrapper } from "@/components/public/order-page";
import type { KitCardData } from "@/components/public/kit-card";

export const metadata = {
  title: "Place an Order | Flow - Model Kit Custom Build Service",
  description:
    "Submit your model kit for custom build, repair, or repaint services. Get instant pricing estimates and track your order progress.",
};

export default async function OrderPage() {
  async function submitOrder(data: {
    clientName: string;
    phone: string;
    email?: string;
    address?: string;
    items: KitCardData[];
  }) {
    "use server";

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_URL).origin
        : "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to submit order" }));
        throw new Error(error.error?.message || error.message || "Failed to submit order");
      }

      const result = await response.json();
      redirect(`/order/success/${result.id}`);
    } catch (error) {
      console.error("Order submission error:", error);
      throw error;
    }
  }

  return <OrderPageWrapper serverAction={submitOrder} />;
}
