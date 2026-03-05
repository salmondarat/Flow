import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, ProfileRow, OrderRow } from "@/types";

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

export default async function AdminClientProfilePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  // Fetch client information
  const { data: client, error: clientError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", clientId)
    .maybeSingle<ProfileRow>();

  if (clientError || !client) {
    notFound();
  }

  // Fetch client's orders
  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  const orders = ordersData as OrderRow[] | null;

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const activeOrders =
    orders?.filter((o) => ["estimated", "approved", "in_progress"].includes(o.status)).length || 0;
  const completedOrders = orders?.filter((o) => o.status === "completed").length || 0;
  const totalRevenue =
    orders?.reduce((sum, o) => sum + (o.final_price_cents || o.estimated_price_cents), 0) || 0;

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(cents);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">← Back to Orders</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Client Profile</h1>
      </div>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>{client.full_name || "Unnamed Client"}</CardTitle>
          <CardDescription>Client ID: {client.id.slice(0, 8)}...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="text-muted-foreground h-4 w-4" />
            <span>{client.email || "No email"}</span>
          </div>
          {client.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span>{client.phone}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
              <span>{client.address}</span>
            </div>
          )}
          <Separator />
          <div className="text-muted-foreground text-sm">
            Member since {formatDate(client.created_at)}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Completed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>All orders from this client</CardDescription>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:underline"
                      >
                        Order {order.id.slice(0, 8)}...
                      </Link>
                      <Badge variant={statusVariants[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.estimated_price_cents)}</p>
                    <p className="text-muted-foreground text-sm">{order.estimated_days} day(s)</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
