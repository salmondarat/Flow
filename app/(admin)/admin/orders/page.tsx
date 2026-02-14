import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getOrders } from "@/lib/features/orders/queries";
import type { OrderStatus } from "@/types";

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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: OrderStatus; page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const status = params.status;

  const { orders, total } = await getOrders({
    status,
    page,
    pageSize: 20,
  });

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(cents);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant={!status ? "default" : "outline"} size="sm" asChild>
            <Link href="/admin/orders">All</Link>
          </Button>
          <Button variant={status === "draft" ? "default" : "outline"} size="sm" asChild>
            <Link href="/admin/orders?status=draft">Draft</Link>
          </Button>
          <Button variant={status === "in_progress" ? "default" : "outline"} size="sm" asChild>
            <Link href="/admin/orders?status=in_progress">In Progress</Link>
          </Button>
          <Button variant={status === "completed" ? "default" : "outline"} size="sm" asChild>
            <Link href="/admin/orders?status=completed">Completed</Link>
          </Button>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/orders/new">
            <Plus className="mr-1 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Est. Price</TableHead>
              <TableHead>Est. Days</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      {order.id.slice(0, 8)}...
                    </Link>
                  </TableCell>
                  <TableCell>
                    {(order as any).client ? (
                      <Link href={`/admin/clients/${order.client_id}`} className="hover:underline">
                        {(order as any).client.full_name ||
                          (order as any).client.email ||
                          "Unknown"}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">No client</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.order_items?.length || 0}</TableCell>
                  <TableCell>{formatCurrency(order.estimated_price_cents)}</TableCell>
                  <TableCell>{order.estimated_days}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/orders?page=${page - 1}${status ? `&status=${status}` : ""}`}>
                Previous
              </Link>
            </Button>
          )}
          <span className="flex items-center px-4 text-sm">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          {page < Math.ceil(total / 20) && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/orders?page=${page + 1}${status ? `&status=${status}` : ""}`}>
                Next
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
