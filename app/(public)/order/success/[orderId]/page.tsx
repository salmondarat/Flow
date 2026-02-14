/**
 * Order Success Page
 * Displayed after successful order submission
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { getOrderByIdForPublic } from "@/lib/features/orders/queries";

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export const metadata = {
  title: "Order Submitted | Flow",
  description: "Your order has been submitted successfully",
};

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  // Verify order exists
  const order = await getOrderByIdForPublic(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Order Submitted Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">Your order ID is:</p>
            <p className="font-mono text-2xl font-bold">{orderId}</p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-2 text-sm">What happens next?</p>
            <ul className="space-y-1 text-left text-sm">
              <li>✓ We'll review your order details</li>
              <li>✓ You'll receive a confirmation via WhatsApp/Email</li>
              <li>✓ Track progress anytime using your order ID</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/track/${orderId}`}>Track Order</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/order">Place Another Order</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
