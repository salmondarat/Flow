/**
 * Admin Order Creation Page
 * Allows admins to create orders on behalf of customers
 */

import { redirect } from "next/navigation";
import { AdminOrderFormWrapper } from "@/components/admin/admin-order-form";
import type { KitCardData } from "@/components/public/kit-card";

export const metadata = {
  title: "New Order | Flow Admin",
};

export default async function NewOrderPage() {
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
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        const error = await response.json().catch(() => ({ message: "Failed to submit order" }));
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        throw new Error(error.error?.message || error.message || "Failed to submit order");
      }

      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      const result = await response.json();
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      redirect(`/admin/orders/${result.id}`);
    } catch (error) {
      console.error("Order submission error:", error);
      throw error;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
        <p className="text-muted-foreground">Create an order on behalf of a customer</p>
      </div>

      <AdminOrderFormWrapper serverAction={submitOrder} />
    </div>
  );
}
