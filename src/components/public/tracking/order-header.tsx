/**
 * OrderHeader component
 * Displays order status, dates, and key information
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock } from "lucide-react";
import { formatPrice, formatDays } from "@/lib/estimation/utils";

interface OrderHeaderProps {
  order: {
    id: string;
    status: string;
    estimated_price_cents: number;
    estimated_days: number;
    final_price_cents: number | null;
    final_days: number | null;
    created_at: string;
    updated_at: string;
    client?: {
      full_name: string | null;
    } | null;
  };
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  estimated: { label: "Estimated", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function OrderHeader({ order }: OrderHeaderProps) {
  const statusConfig = STATUS_CONFIG[order.status] || {
    label: order.status,
    variant: "outline" as const,
  };

  const displayPrice = order.final_price_cents ?? order.estimated_price_cents;
  const displayDays = order.final_days ?? order.estimated_days;

  const createdDate = new Date(order.created_at);
  const estimatedCompletion = new Date(createdDate);
  estimatedCompletion.setDate(estimatedCompletion.getDate() + displayDays);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>Order Details</CardTitle>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {createdDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">Est. Completion:</span>
              <span className="font-medium">
                {estimatedCompletion.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {order.client?.full_name && (
              <div className="text-sm">
                <span className="text-muted-foreground">Client: </span>
                <span className="font-medium">{order.client.full_name}</span>
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Price: </span>
              <span className="text-base font-semibold">{formatPrice(displayPrice * 100)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Est. Time: </span>
              <span className="font-medium">{formatDays(displayDays)}</span>
            </div>
            {order.final_price_cents && (
              <p className="text-muted-foreground text-xs">Final price confirmed</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
