/**
 * AddonSelector component
 * Displays available add-ons for a selected service with checkbox selection
 */

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { ServiceAddonRow } from "@/types";

interface AddonSelectorProps {
  addons: ServiceAddonRow[];
  selectedAddonIds: string[];
  onChange: (addonIds: string[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function AddonSelector({
  addons,
  selectedAddonIds,
  onChange,
  disabled = false,
  isLoading = false,
}: AddonSelectorProps) {
  const handleToggle = (addonId: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      onChange([...selectedAddonIds, addonId]);
    } else {
      onChange(selectedAddonIds.filter((id) => id !== addonId));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-48 rounded bg-muted" />
              </div>
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (addons.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-4 text-center">
        <p className="text-muted-foreground text-sm">No add-ons available for this service</p>
      </div>
    );
  }

  // Separate required and optional add-ons
  const requiredAddons = addons.filter((a) => a.is_required);
  const optionalAddons = addons.filter((a) => !a.is_required);

  return (
    <div className="space-y-3">
      {/* Required add-ons */}
      {requiredAddons.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium">Required Add-ons</p>
          {requiredAddons.map((addon) => {
            const isSelected = selectedAddonIds.includes(addon.id);
            return (
              <Card key={addon.id} className="p-3 bg-muted/50">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    onCheckedChange={(checked) => handleToggle(addon.id, checked ?? false)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{addon.name}</span>
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(addon.price_cents)}
                      </span>
                    </div>
                    {addon.description && (
                      <p className="text-muted-foreground text-xs">{addon.description}</p>
                    )}
                  </div>
                </label>
              </Card>
            );
          })}
        </div>
      )}

      {/* Optional add-ons */}
      {optionalAddons.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium">Optional Add-ons</p>
          {optionalAddons.map((addon) => {
            const isSelected = selectedAddonIds.includes(addon.id);
            return (
              <Card key={addon.id} className={isSelected ? "border-primary bg-primary/5" : ""}>
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    onCheckedChange={(checked) => handleToggle(addon.id, checked ?? false)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{addon.name}</span>
                      <span className="text-sm font-medium">
                        +{new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(addon.price_cents)}
                      </span>
                    </div>
                    {addon.description && (
                      <p className="text-muted-foreground text-xs">{addon.description}</p>
                    )}
                  </div>
                </label>
              </Card>
            );
          })}
        </div>
      )}

      {/* Selected add-ons summary */}
      {selectedAddonIds.length > 0 && (
        <div className="rounded-md bg-muted p-3">
          <p className="text-muted-foreground text-xs font-medium mb-2">Selected Add-ons</p>
          <div className="space-y-1">
            {addons
              .filter((a) => selectedAddonIds.includes(a.id))
              .map((addon) => (
                <div key={addon.id} className="flex justify-between text-xs">
                  <span>{addon.name}</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(addon.price_cents)}
                  </span>
                </div>
              ))}
            <div className="mt-2 border-t border-border pt-2 flex justify-between text-xs font-medium">
              <span>Add-ons Total</span>
              <span>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(
                  addons
                    .filter((a) => selectedAddonIds.includes(a.id))
                    .reduce((sum, a) => sum + a.price_cents, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
