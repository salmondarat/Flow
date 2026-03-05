"use client";

import { unstable_noStore } from "next/cache";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Search, Package } from "lucide-react";
import type { OrderRow } from "@/types";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

interface OrderWithItems extends OrderRow {
  order_items: Array<{
    id: string;
    kit_name: string;
    service_type: string;
    complexity: string;
  }>;
}

export default function ClientOrdersPage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/client/orders");

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth");
          return;
        }
        throw new Error("Failed to fetch orders");
      }

      const result = await response.json();
      setOrders(result.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.order_items?.some((item) =>
        item.kit_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with New Order Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-6 font-semibold">My Orders</h1>
          <p className="text-meta-2 text-muted-foreground mt-1">Manage and track all your orders</p>
        </div>
        <Button asChild>
          <Link href="/client/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      {/* Filters Card */}
      <Card variant="nextadmin">
        <CardContent className="px-7.5 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-5 h-4.5 w-4.5 -translate-y-1/2" />
              <Input
                placeholder="Search by kit name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-input bg-gray-2/50 h-11 rounded-full border pl-[53px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("draft")}
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === "estimated" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("estimated")}
              >
                Estimated
              </Button>
              <Button
                variant={statusFilter === "in_progress" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("in_progress")}
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card variant="nextadmin">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <Package className="text-primary h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              {orders.length === 0 ? "No orders yet" : "No matching orders"}
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              {orders.length === 0
                ? "Get started by creating your first order"
                : "Try adjusting your search or filter"}
            </p>
            {orders.length === 0 && (
              <Button asChild>
                <Link href="/client/orders/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              variant="nextadmin"
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => router.push(`/client/orders/${order.id}`)}
            >
              <CardHeader className="px-7.5 pt-7.5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {order.order_items?.[0]?.kit_name || "Untitled Order"}
                      {order.order_items && order.order_items.length > 1 && (
                        <span className="text-muted-foreground ml-2 text-sm font-normal">
                          +{order.order_items.length - 1} more
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>Created on {formatDate(order.created_at)}</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-7.5 pb-7.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-meta-2 text-muted-foreground">
                    {order.order_items?.length || 0} kit(s)
                  </div>
                  {order.estimated_price_cents > 0 && (
                    <div className="font-medium">
                      Est. {formatPrice(order.estimated_price_cents)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
