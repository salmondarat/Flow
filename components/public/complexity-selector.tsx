/**
 * ComplexitySelector component
 * Allows user to select complexity level with visual buttons
 * Now supports dynamic complexity configuration from database
 */

"use client";

import { Button } from "@/components/ui/button";
import type { ComplexityLevelData } from "@/lib/estimation/calculate";

interface ComplexitySelectorProps {
  // New: Accept dynamic complexities data
  complexities: Array<ComplexityLevelData & { overrideMultiplier?: number }>;
  // New: Use complexity ID instead of enum
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  // Optional: Show loading state
  isLoading?: boolean;
}

export function ComplexitySelector({
  complexities,
  value,
  onChange,
  disabled = false,
  isLoading = false,
}: ComplexitySelectorProps) {
  const getVariant = (complexity: ComplexityLevelData & { overrideMultiplier?: number }) => {
    if (value === complexity.id) {
      // Use different variants based on multiplier range
      const multiplier = complexity.overrideMultiplier ?? complexity.multiplier;
      if (multiplier >= 2.0) return "destructive";
      if (multiplier >= 1.5) return "secondary";
      return "default";
    }
    return "outline";
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <Button
            key={i}
            disabled
            variant="outline"
            className="min-w-25 flex-1 animate-pulse"
          >
            <div className="h-4 w-12 rounded bg-muted" />
          </Button>
        ))}
      </div>
    );
  }

  if (complexities.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-4 text-center">
        <p className="text-muted-foreground text-sm">No complexity levels available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {complexities.map((complexity) => {
        const multiplier = complexity.overrideMultiplier ?? complexity.multiplier;

        return (
          <Button
            key={complexity.id}
            type="button"
            variant={getVariant(complexity)}
            onClick={() => !disabled && onChange(complexity.id)}
            disabled={disabled}
            className="min-w-25 flex-1"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">{complexity.name}</span>
              <span className="text-xs opacity-75">{multiplier}×</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

// ============================================================================
// LEGACY: Backward compatible version for existing code
// ============================================================================

import { COMPLEXITY_NAMES, COMPLEXITY_MULTIPLIERS } from "@/lib/estimation/constants";
import type { Complexity } from "@/types";

interface LegacyComplexitySelectorProps {
  value: Complexity | undefined;
  onChange: (value: Complexity) => void;
  disabled?: boolean;
}

/**
 * @deprecated Use ComplexitySelector with dynamic complexities data instead
 * This version uses hardcoded constants for backward compatibility
 */
export function LegacyComplexitySelector({
  value,
  onChange,
  disabled = false,
}: LegacyComplexitySelectorProps) {
  const complexities: Complexity[] = ["low", "medium", "high"];

  const getVariant = (complexity: Complexity) => {
    if (value === complexity) {
      switch (complexity) {
        case "low":
          return "default";
        case "medium":
          return "secondary";
        case "high":
          return "destructive";
      }
    }
    return "outline";
  };

  return (
    <div className="flex flex-wrap gap-2">
      {complexities.map((complexity) => {
        const multiplier = COMPLEXITY_MULTIPLIERS[complexity];

        return (
          <Button
            key={complexity}
            type="button"
            variant={getVariant(complexity)}
            onClick={() => !disabled && onChange(complexity)}
            disabled={disabled}
            className="min-w-25 flex-1"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">{COMPLEXITY_NAMES[complexity]}</span>
              <span className="text-xs opacity-75">{multiplier}×</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
