import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/lib/features/orders/queries";
import { Badge } from "@/components/ui/badge";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Clients | Flow Admin",
};

export default async function ClientsPage() {
  const { orders } = await getOrders({ pageSize: 100 });

  // Extract unique client info from orders
  const clientMap = new Map<string, { name: string; orderCount: number; totalSpent: number }>();

  for (const order of orders) {
    // Try to get client info from progress logs (where we stored it for public orders)
    const clientLog = order.progress_logs?.find((log) => log.message.includes("Client:"));

    if (clientLog) {
      const match = clientLog.message.match(/Client: (.+?), Phone:/);
      const clientName = match ? match[1] : `Client ${order.client_id.slice(0, 8)}`;

      const existing = clientMap.get(order.client_id);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.estimated_price_cents;
      } else {
        clientMap.set(order.client_id, {
          name: clientName,
          orderCount: 1,
          totalSpent: order.estimated_price_cents,
        });
      }
    }
  }

  const clients = Array.from(clientMap.entries()).map(([id, data]) => ({
    id,
    ...data,
  }));

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(cents);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Manage your client base and view order history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-muted-foreground text-sm">No clients found</p>
          ) : (
            <div className="space-y-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-muted-foreground text-sm">ID: {client.id.slice(0, 8)}...</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">Total Orders</p>
                      <p className="font-medium">{client.orderCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">Total Spent</p>
                      <p className="font-medium">{formatCurrency(client.totalSpent)}</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
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
