/**
 * KitCardDynamic component
 * Form card for a single kit with dynamic service and complexity selection
 * Supports add-ons and uses database-driven configuration
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ServiceSelector } from "./service-selector";
import { ComplexitySelector } from "./complexity-selector";
import { AddonSelector } from "./addon-selector";
import { Trash2, Loader2 } from "lucide-react";
import type { ServicePricingData, ComplexityLevelData } from "@/lib/estimation/calculate";
import type { ServiceAddonRow } from "@/types";

export interface KitCardDynamicData {
  kitName: string;
  kitGrade?: string;
  serviceTypeId?: string;
  complexityId?: string;
  addonIds: string[];
  notes?: string;
}

interface KitCardDynamicProps {
  index: number;
  data: KitCardDynamicData;
  onChange: (data: KitCardDynamicData) => void;
  onRemove: () => void;
  canRemove?: boolean;
  error?: string;
  // Dynamic data from hook
  services: ServicePricingData[];
  complexitiesByService: Map<string, Array<ComplexityLevelData & { overrideMultiplier?: number }>>;
  addonsByService: Map<string, ServiceAddonRow[]>;
  isLoading?: boolean;
}

export function KitCardDynamic({
  index,
  data,
  onChange,
  onRemove,
  canRemove = true,
  error,
  services,
  complexitiesByService,
  addonsByService,
  isLoading = false,
}: KitCardDynamicProps) {
  // Get complexities for selected service
  const complexities = data.serviceTypeId
    ? (complexitiesByService.get(data.serviceTypeId) || [])
    : [];

  // Get addons for selected service
  const addons = data.serviceTypeId
    ? (addonsByService.get(data.serviceTypeId) || [])
    : [];

  const updateField = <K extends keyof KitCardDynamicData>(
    key: K,
    value: KitCardDynamicData[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  // Reset complexity and addons when service changes
  const handleServiceChange = (serviceId: string) => {
    onChange({
      ...data,
      serviceTypeId: serviceId,
      complexityId: undefined,
      addonIds: [],
    });
  };

  return (
    <Card className={error ? "border-destructive" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Kit #{index + 1}</CardTitle>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`kit-name-${index}`}>
                  Kit Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`kit-name-${index}`}
                  placeholder="e.g., RG Gundam"
                  value={data.kitName}
                  onChange={(e) => updateField("kitName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`kit-grade-${index}`}>Grade (Optional)</Label>
                <Input
                  id={`kit-grade-${index}`}
                  placeholder="e.g., RG 1/144"
                  value={data.kitGrade || ""}
                  onChange={(e) => updateField("kitGrade", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Service <span className="text-destructive">*</span>
              </Label>
              <ServiceSelector
                services={services}
                value={data.serviceTypeId}
                onChange={handleServiceChange}
                isLoading={isLoading}
              />
            </div>

            {data.serviceTypeId && (
              <>
                <div className="space-y-2">
                  <Label>
                    Complexity <span className="text-destructive">*</span>
                  </Label>
                  <ComplexitySelector
                    complexities={complexities}
                    value={data.complexityId}
                    onChange={(value) => updateField("complexityId", value)}
                    isLoading={isLoading}
                  />
                </div>

                {addons.length > 0 && (
                  <div className="space-y-2">
                    <Label>Add-ons (Optional)</Label>
                    <AddonSelector
                      addons={addons}
                      selectedAddonIds={data.addonIds}
                      onChange={(ids) => updateField("addonIds", ids)}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor={`kit-notes-${index}`}>Notes (Optional)</Label>
              <textarea
                id={`kit-notes-${index}`}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any special requests or instructions..."
                value={data.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={2}
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
