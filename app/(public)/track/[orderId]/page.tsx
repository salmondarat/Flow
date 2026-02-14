/**
 * Public Order Tracking Page
 * Allows clients to track their order progress without authentication
 */

import { notFound } from "next/navigation";
import { getOrderByIdForPublic } from "@/lib/features/orders/queries";
import { OrderHeader } from "@/components/public/tracking/order-header";
import { OrderItems } from "@/components/public/tracking/order-items";
import { ProgressTimeline } from "@/components/public/tracking/progress-timeline";
import { ChangeRequestsList } from "@/components/public/tracking/change-requests-list";

interface TrackingPageProps {
  params: Promise<{ orderId: string }>;
}

export const metadata = {
  title: "Track Order | Flow - Model Kit Custom Build Service",
  description: "Track your model kit custom build order progress",
};

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { orderId } = await params;

  const order = await getOrderByIdForPublic(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Track Order</h1>
        <p className="text-muted-foreground">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      </div>

      <div className="space-y-6">
        <OrderHeader order={order} />
        <OrderItems items={order.order_items || []} />

        {order.progress_logs && order.progress_logs.length > 0 && (
          <ProgressTimeline logs={order.progress_logs} />
        )}

        {order.change_requests && order.change_requests.length > 0 && (
          <ChangeRequestsList requests={order.change_requests} />
        )}
      </div>
    </div>
  );
}
