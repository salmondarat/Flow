import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrderById } from "@/lib/features/orders/queries";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, ProfileRow } from "@/types";

const statusLabels: Record<OrderStatus, string> = {
  draft: "Draft",
  estimated: "Estimated",
  approved: "Approved",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusVariants: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  estimated: "outline",
  approved: "default",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  // Fetch client information
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, address")
    .eq("id", order.client_id)
    .single<{
      id: string;
      email: string | null;
      full_name: string | null;
      phone: string | null;
      address: string | null;
    }>();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(cents);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/orders">← Back to Orders</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Order {order.id?.slice(0, 8)}...</h1>
          <p className="text-muted-foreground">
            Created on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusVariants[order.status]} className="text-lg">
          {statusLabels[order.status]}
        </Badge>
      </div>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={`/api/orders/${order.id}/status`} method="POST">
            <Select name="status" defaultValue={order.status}>
              <SelectTrigger className="w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="estimated">Estimated</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="ml-2">
              Update Status
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={statusVariants[order.status]}>{statusLabels[order.status]}</Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Price:</span>
              <span className="font-medium">{formatCurrency(order.estimated_price_cents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Days:</span>
              <span className="font-medium">{order.estimated_days}</span>
            </div>
            {order.final_price_cents && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Final Price:</span>
                  <span className="font-medium">{formatCurrency(order.final_price_cents)}</span>
                </div>
              </>
            )}
            {order.notes && (
              <>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="mt-1 text-sm">{order.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {client ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{client.full_name || "N/A"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{client.email || "N/A"}</span>
                </div>
                {client.phone && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{client.phone}</span>
                    </div>
                  </>
                )}
                {client.address && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-muted-foreground">Address:</span>
                      <p className="mt-1 text-sm">{client.address}</p>
                    </div>
                  </>
                )}
                <Separator />
                <Link href={`/admin/clients/${order.client_id}`}>
                  <Button variant="outline" size="sm">
                    View Client Profile
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Client information not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {order.order_items?.length === 0 ? (
            <p className="text-muted-foreground text-sm">No items in this order</p>
          ) : (
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{item.kit_name}</h4>
                      {item.kit_model && (
                        <p className="text-muted-foreground text-sm">{item.kit_model}</p>
                      )}
                    </div>
                    <Badge variant="outline">{item.service_type.replace("_", " ")}</Badge>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>Complexity: {item.complexity}</span>
                  </div>
                  {item.notes && <p className="text-muted-foreground mt-2 text-sm">{item.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {!order.progress_logs || order.progress_logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No progress updates yet</p>
          ) : (
            <div className="space-y-4">
              {order.progress_logs.map((log) => (
                <div key={log.id} className="rounded-lg border p-4">
                  <p className="text-sm">{log.message}</p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                  {log.photo_url && (
                    <img
                      src={log.photo_url}
                      alt="Progress photo"
                      className="mt-2 max-w-xs rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Requests */}
      {order.change_requests && order.change_requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Change Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.change_requests.map((cr) => (
                <div key={cr.id} className="rounded-lg border p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{cr.description}</p>
                      <p className="text-muted-foreground text-sm">
                        Price impact: {formatCurrency(cr.price_impact_cents)}
                      </p>
                      <p className="text-muted-foreground text-sm">Days impact: {cr.days_impact}</p>
                    </div>
                    <Badge
                      variant={
                        cr.status === "approved"
                          ? "default"
                          : cr.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {cr.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
