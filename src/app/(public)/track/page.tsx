/**
 * Track Order Landing Page
 * Users can enter their order ID to track their order
 */

"use client";

import { unstable_noStore } from "next/cache";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function TrackPage() {
  unstable_noStore();
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!orderId.trim()) {
      setError("Please enter an order ID");
      return;
    }

    // Navigate to the tracking page
    router.push(`/track/${orderId.trim()}`);
  };

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Track Your Order</h1>
        <p className="text-muted-foreground">
          Enter your order ID to see the latest progress updates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="orderId" className="text-sm font-medium">
                Order ID
              </label>
              <div className="flex gap-2">
                <Input
                  id="orderId"
                  type="text"
                  placeholder="ord_xxxxxxxxxxxx"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <p className="text-muted-foreground text-xs">
                Your order ID was provided when you submitted your order
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4 text-sm">Don&apos;t have an order yet?</p>
        <Button asChild variant="outline">
          <a href="/order">Place a New Order</a>
        </Button>
      </div>
    </div>
  );
}
