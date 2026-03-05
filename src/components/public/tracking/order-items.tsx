/**
 * OrderItems component
 * Displays all kits in the order with their services
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICE_NAMES, COMPLEXITY_NAMES } from "@/lib/estimation/constants";

interface OrderItemsProps {
  items: Array<{
    id: string;
    kit_name: string;
    kit_model: string | null;
    service_type: string;
    complexity: string;
    notes: string | null;
  }>;
}

export function OrderItems({ items }: OrderItemsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-muted/30 rounded-lg border p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium">{item.kit_name}</span>
                    {item.kit_model && (
                      <span className="text-muted-foreground text-xs">({item.kit_model})</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5">
                      {SERVICE_NAMES[item.service_type as keyof typeof SERVICE_NAMES] ||
                        item.service_type}
                    </span>
                    <span className="bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                      {COMPLEXITY_NAMES[item.complexity as keyof typeof COMPLEXITY_NAMES] ||
                        item.complexity}
                    </span>
                  </div>
                  {item.notes && <p className="text-muted-foreground mt-2 text-xs">{item.notes}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
