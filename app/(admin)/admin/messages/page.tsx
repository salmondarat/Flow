import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/lib/features/orders/queries";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages | Flow Admin",
};

export default async function MessagesPage() {
  const { orders } = await getOrders({ pageSize: 50 });

  // Extract messages from progress logs (where client contact info is stored)
  const messages = orders
    .flatMap((order) =>
      (order.progress_logs || [])
        .filter((log) => log.message.includes("Client:"))
        .map((log) => ({
          id: log.id,
          orderId: order.id,
          clientInfo: log.message,
          createdAt: log.created_at,
          read: false,
        }))
    )
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Client inquiries and communications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{messages.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{messages.filter((m) => !m.read).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">~2h</p>
            <p className="text-muted-foreground mt-1 text-xs">Average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-sm">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <span className="text-primary font-semibold">
                      {message.clientInfo.charAt(7)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">New Order Inquiry</p>
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-xs">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">{message.clientInfo}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Order: {message.orderId.slice(0, 8)}...
                    </p>
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
