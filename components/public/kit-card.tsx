/**
 * KitCard component
 * Form card for a single kit with service and complexity selection
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LegacyServiceSelector as ServiceSelector } from "./service-selector";
import { LegacyComplexitySelector as ComplexitySelector } from "./complexity-selector";
import { Trash2 } from "lucide-react";
import type { ServiceType, Complexity } from "@/types";

export interface KitCardData {
  kitName: string;
  kitGrade?: string;
  serviceType?: ServiceType;
  complexity?: Complexity;
  notes?: string;
}

interface KitCardProps {
  index: number;
  data: KitCardData;
  onChange: (data: KitCardData) => void;
  onRemove: () => void;
  canRemove?: boolean;
  error?: string;
}

export function KitCard({
  index,
  data,
  onChange,
  onRemove,
  canRemove = true,
  error,
}: KitCardProps) {
  const updateField = <K extends keyof KitCardData>(key: K, value: KitCardData[K]) => {
    onChange({ ...data, [key]: value });
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
            value={data.serviceType}
            onChange={(value) => updateField("serviceType", value)}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Complexity <span className="text-destructive">*</span>
          </Label>
          <ComplexitySelector
            value={data.complexity}
            onChange={(value) => updateField("complexity", value)}
          />
        </div>

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
      </CardContent>
    </Card>
  );
}
