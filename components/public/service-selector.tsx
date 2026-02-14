/**
 * ServiceSelector component
 * Allows user to select a service type with visual cards
 * Now supports dynamic service configuration from database
 */

"use client";

import { Card } from "@/components/ui/card";
import type { ServicePricingData } from "@/lib/estimation/calculate";
import { Hammer, Wrench, Palette, Sparkles, Star, Crown, Settings, Zap, Shield } from "lucide-react";

// Icon mapping from icon_name to Lucide icon component
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  hammer: Hammer,
  wrench: Wrench,
  palette: Palette,
  sparkles: Sparkles,
  star: Star,
  crown: Crown,
  settings: Settings,
  zap: Zap,
  shield: Shield,
};

interface ServiceSelectorProps {
  // New: Accept dynamic services data
  services: ServicePricingData[];
  // New: Use service ID instead of enum
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  // Optional: Show loading state
  isLoading?: boolean;
}

export function ServiceSelector({
  services,
  value,
  onChange,
  disabled = false,
  isLoading = false,
}: ServiceSelectorProps) {
  const getIcon = (iconName: string | null) => {
    if (!iconName) return <Settings className="h-5 w-5" />;
    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Settings className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">No services available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {services.map((service) => {
        const isSelected = value === service.id;

        return (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary/5 ring-primary/20 ring-2"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""} `}
            onClick={() => !disabled && onChange(service.id)}
            tabIndex={disabled ? -1 : 0}
            role="radio"
            aria-checked={isSelected}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-lg p-2 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} `}
                >
                  {getIcon(service.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-semibold">{service.name}</h3>
                  {service.description && (
                    <p className="text-muted-foreground mb-2 text-xs">
                      {service.description}
                    </p>
                  )}
                  <p className="text-xs font-medium">
                    From{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(service.basePriceCents)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ============================================================================
// LEGACY: Backward compatible version for existing code
// ============================================================================

import { SERVICE_NAMES, SERVICE_DESCRIPTIONS, PRICING_RULES } from "@/lib/estimation/constants";
import type { ServiceType } from "@/types";

const LEGACY_SERVICE_ICONS: Record<ServiceType, React.ReactNode> = {
  full_build: <Hammer className="h-5 w-5" />,
  repair: <Wrench className="h-5 w-5" />,
  repaint: <Palette className="h-5 w-5" />,
};

interface LegacyServiceSelectorProps {
  value: ServiceType | undefined;
  onChange: (value: ServiceType) => void;
  disabled?: boolean;
}

/**
 * @deprecated Use ServiceSelector with dynamic services data instead
 * This version uses hardcoded constants for backward compatibility
 */
export function LegacyServiceSelector({
  value,
  onChange,
  disabled = false,
}: LegacyServiceSelectorProps) {
  const services: ServiceType[] = ["full_build", "repair", "repaint"];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {services.map((service) => {
        const isSelected = value === service;
        const pricing = PRICING_RULES[service];

        return (
          <Card
            key={service}
            className={`cursor-pointer transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary/5 ring-primary/20 ring-2"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""} `}
            onClick={() => !disabled && onChange(service)}
            tabIndex={disabled ? -1 : 0}
            role="radio"
            aria-checked={isSelected}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-lg p-2 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} `}
                >
                  {LEGACY_SERVICE_ICONS[service]}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-semibold">{SERVICE_NAMES[service]}</h3>
                  <p className="text-muted-foreground mb-2 text-xs">
                    {SERVICE_DESCRIPTIONS[service]}
                  </p>
                  <p className="text-xs font-medium">
                    From{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(pricing.basePrice)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
