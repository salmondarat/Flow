/**
 * ChangeRequestsList component
 * Displays pending and approved change requests
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/estimation/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ChangeRequest {
  id: string;
  description: string;
  price_impact_cents: number;
  days_impact: number;
  status: string;
  created_at: string;
}

interface ChangeRequestsListProps {
  requests: ChangeRequest[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function ChangeRequestsList({ requests }: ChangeRequestsListProps) {
  if (requests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => {
            const statusConfig = STATUS_CONFIG[request.status] || {
              label: request.status,
              variant: "outline" as const,
            };

            const priceImpact = request.price_impact_cents / 100;
            const hasPriceImpact = priceImpact !== 0;
            const hasDaysImpact = request.days_impact !== 0;

            return (
              <div key={request.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="flex-1 text-sm">{request.description}</p>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </div>

                {(hasPriceImpact || hasDaysImpact) && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex gap-4 text-xs">
                      {hasPriceImpact && (
                        <div className="flex items-center gap-1">
                          {priceImpact > 0 ? (
                            <TrendingUp className="text-destructive h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-green-600" />
                          )}
                          <span className={priceImpact > 0 ? "text-destructive" : "text-green-600"}>
                            {priceImpact > 0 ? "+" : ""}
                            {formatPrice(request.price_impact_cents)}
                          </span>
                        </div>
                      )}
                      {hasDaysImpact && (
                        <div className="flex items-center gap-1">
                          {request.days_impact > 0 ? (
                            <TrendingUp className="h-3 w-3 text-orange-600" />
                          ) : request.days_impact < 0 ? (
                            <TrendingDown className="h-3 w-3 text-green-600" />
                          ) : (
                            <Minus className="text-muted-foreground h-3 w-3" />
                          )}
                          <span>
                            {request.days_impact > 0 ? "+" : ""}
                            {request.days_impact} day{request.days_impact !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
