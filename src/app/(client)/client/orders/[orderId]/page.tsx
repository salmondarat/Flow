"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { OrderWithItems } from "@/types";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function ClientOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const { orderId } = await params;

    try {
      const response = await fetch(`/api/client/orders`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth");
          return;
        }
        throw new Error("Failed to fetch order");
      }

      const result = await response.json();
      const foundOrder = result.orders.find((o: OrderWithItems) => o.id === orderId);

      if (!foundOrder) {
        toast.error("Order not found");
        router.push("/client/orders");
        return;
      }

      setOrder(foundOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!order) return;

    setIsApproving(true);

    try {
      const response = await fetch(`/api/client/orders/${order.id}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to approve order");
      }

      toast.success("Order approved successfully!");
      fetchOrder(); // Refresh order data
    } catch (error) {
      console.error("Error approving order:", error);
      toast.error("Failed to approve order");
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;

    const reason = prompt("Why do you want to cancel this order?");
    if (!reason) return;

    setIsCancelling(true);

    try {
      const response = await fetch(`/api/client/orders/${order.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      toast.success("Order cancelled successfully");
      router.push("/client/orders");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "estimated":
        return "default";
      case "approved":
        return "default";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "estimated":
        return "Estimated";
      case "approved":
        return "Approved";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="text-destructive h-5 w-5" />;
      case "estimated":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getServiceLabel = (service: string) => {
    switch (service) {
      case "full_build":
        return "Full Build";
      case "repair":
        return "Repair";
      case "repaint":
        return "Repaint";
      default:
        return service;
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
      default:
        return complexity;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Order not found</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            href="/client/orders"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Order ID: {order.id.slice(0, 8)}</CardDescription>
                </div>
                <Badge
                  variant={getStatusColor(order.status) as any}
                  className="flex items-center gap-2"
                >
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
              </div>

              {order.estimated_price_cents > 0 && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Estimated Price</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(order.estimated_price_cents)}
                      </p>
                    </div>
                    {order.estimated_days > 0 && (
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">Estimated Time</p>
                        <p className="text-lg font-medium">{order.estimated_days} day(s)</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Kits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{item.kit_name}</h3>
                        {item.kit_model && (
                          <p className="text-muted-foreground text-sm">{item.kit_model}</p>
                        )}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Badge variant="outline">{getServiceLabel(item.service_type)}</Badge>
                          <Badge variant="outline">
                            {getComplexityLabel(item.complexity)} Complexity
                          </Badge>
                        </div>
                        {item.notes && (
                          <p className="text-muted-foreground mt-2 text-sm">Notes: {item.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {(order.status === "estimated" || order.status === "draft") && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  {order.status === "estimated"
                    ? "Review the estimate and approve to begin work"
                    : "Submit your order to receive an estimate"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.status === "estimated" && (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="w-full"
                    size="lg"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {isApproving ? "Approving..." : "Approve Order"}
                  </Button>
                )}

                {(order.status === "estimated" || order.status === "draft") && (
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="w-full"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
