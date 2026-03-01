/**
 * EstimationSummary component
 * Displays real-time price and time estimation for the order
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";
import type { FormattedEstimation } from "@/lib/estimation/types";

interface EstimationSummaryProps {
  formatted: FormattedEstimation | null;
  hasInvalidItems?: boolean;
  isLoading?: boolean;
}

export function EstimationSummary({
  formatted,
  hasInvalidItems = false,
  isLoading = false,
}: EstimationSummaryProps) {
  if (isLoading) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5" />
            Estimation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="bg-muted h-4 w-3/4 rounded" />
            <div className="bg-muted h-4 w-1/2 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!formatted) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5" />
            Estimation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Add kits and select services to see your estimation
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Estimation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasInvalidItems && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Complete all required fields for accurate estimation
            </p>
          </div>
        )}

        <div className="space-y-2">
          {formatted.breakdown.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-2 text-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.kitName}</p>
                <p className="text-muted-foreground text-xs">
                  {item.service} · {item.complexity}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-medium">{item.price}</p>
                <p className="text-muted-foreground text-xs">{item.days}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Total Price</span>
            <Badge variant="secondary" className="px-3 py-1 text-base font-semibold">
              {formatted.price}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Est. Time</span>
            <span className="text-sm font-medium">{formatted.days}</span>
          </div>
        </div>

        <p className="text-muted-foreground pt-2 text-xs">
          Final price may vary based on actual work required
        </p>
      </CardContent>
    </Card>
  );
}
