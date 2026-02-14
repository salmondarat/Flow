/**
 * OrderFormDynamic component
 * Multi-step form for order creation using dynamic service configuration
 * Supports database-driven services, complexities, and add-ons
 */

"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { KitCardDynamic, type KitCardDynamicData } from "./kit-card-dynamic";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { useServiceConfiguration } from "@/lib/hooks/use-service-configuration";

type ClientInfo = {
  clientName: string;
  phone: string;
  email?: string;
  address?: string;
};

type FormData = ClientInfo & { items: KitCardDynamicData[] };

const STEPS = [
  { id: "client", title: "Your Info", description: "Tell us about yourself" },
  { id: "kits", title: "Model Kits", description: "Add your model kits" },
  { id: "review", title: "Review", description: "Review your order" },
] as const;

interface OrderFormDynamicProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

interface ItemEstimation {
  serviceName: string;
  complexityName: string;
  basePriceCents: number;
  multiplier: number;
  addonPriceCents: number;
  totalPriceCents: number;
  days: number;
}

export function OrderFormDynamic({ onSubmit, isSubmitting = false }: OrderFormDynamicProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<KitCardDynamicData[]>([
    {
      kitName: "",
      kitGrade: "",
      serviceTypeId: undefined,
      complexityId: undefined,
      addonIds: [],
      notes: "",
    },
  ]);
  const [clientData, setClientData] = useState<ClientInfo>({
    clientName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInfo, string>>>({});

  // Fetch service configuration
  const {
    services,
    complexitiesByService,
    addonsByService,
    isLoading: configLoading,
    error: configError,
  } = useServiceConfiguration();

  // Calculate estimations for all items
  const itemEstimations = useMemo((): Array<ItemEstimation & { kitName: string; kitGrade?: string }> => {
    return items.map((item) => {
      if (!item.serviceTypeId || !item.complexityId) {
        return {
          kitName: item.kitName,
          kitGrade: item.kitGrade,
          serviceName: "Not selected",
          complexityName: "Not selected",
          basePriceCents: 0,
          multiplier: 0,
          addonPriceCents: 0,
          totalPriceCents: 0,
          days: 0,
        };
      }

      const service = services.find((s) => s.id === item.serviceTypeId);
      const complexities = complexitiesByService.get(item.serviceTypeId) || [];
      const complexity = complexities.find((c) => c.id === item.complexityId);
      const addons = addonsByService.get(item.serviceTypeId) || [];
      const selectedAddons = addons.filter((a) => item.addonIds.includes(a.id));

      if (!service || !complexity) {
        return {
          kitName: item.kitName,
          kitGrade: item.kitGrade,
          serviceName: service?.name || "Unknown",
          complexityName: complexity?.name || "Unknown",
          basePriceCents: service?.basePriceCents || 0,
          multiplier: complexity?.multiplier || 0,
          addonPriceCents: 0,
          totalPriceCents: 0,
          days: 0,
        };
      }

      const multiplier = complexity.overrideMultiplier ?? complexity.multiplier;
      const basePriceCents = service.basePriceCents;
      const addonPriceCents = selectedAddons.reduce((sum, a) => sum + a.price_cents, 0);
      const totalPriceCents = Math.round(basePriceCents * multiplier) + addonPriceCents;
      const days = Math.round(service.baseDays * multiplier);

      return {
        kitName: item.kitName,
        kitGrade: item.kitGrade,
        serviceName: service.name,
        complexityName: complexity.name,
        basePriceCents,
        multiplier,
        addonPriceCents,
        totalPriceCents,
        days,
      };
    });
  }, [items, services, complexitiesByService, addonsByService]);

  const totalEstimation = useMemo(() => {
    return itemEstimations.reduce(
      (acc, item) => ({
        totalPriceCents: acc.totalPriceCents + item.totalPriceCents,
        totalDays: acc.totalDays + item.days,
        totalAddonPriceCents: acc.totalAddonPriceCents + item.addonPriceCents,
      }),
      { totalPriceCents: 0, totalDays: 0, totalAddonPriceCents: 0 }
    );
  }, [itemEstimations]);

  const hasInvalidItems = items.some(
    (item) => !item.kitName || item.kitName.trim().length < 2 || !item.serviceTypeId || !item.complexityId
  );

  const stepProgress = ((currentStep + 1) / STEPS.length) * 100;

  const validateClientInfo = () => {
    const newErrors: Partial<Record<keyof ClientInfo, string>> = {};

    if (!clientData.clientName || clientData.clientName.trim().length < 2) {
      newErrors.clientName = "Name must be at least 2 characters";
    }
    if (!clientData.phone || !/^\+62\d{8,12}$/.test(clientData.phone)) {
      newErrors.phone = "Phone must start with +62 followed by 8-12 digits";
    }
    if (clientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return !errors.clientName && !errors.phone && clientData.clientName && clientData.phone;
      case 1:
        return (
          items.length > 0 &&
          items.every((item) => item.kitName.trim().length >= 2) &&
          items.every((item) => item.serviceTypeId && item.complexityId)
        );
      case 2:
        return !hasInvalidItems;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!validateClientInfo()) return;
    }

    if (canGoNext() && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        kitName: "",
        kitGrade: "",
        serviceTypeId: undefined,
        complexityId: undefined,
        addonIds: [],
        notes: "",
      },
    ]);
  };

  const updateItem = (index: number, data: KitCardDynamicData) => {
    const newItems = [...items];
    newItems[index] = data;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: FormData = { ...clientData, items };
    await onSubmit(formData);
  };

  if (configError) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-destructive mb-2">Failed to load service configuration</p>
            <p className="text-muted-foreground text-sm">{configError}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Step Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium">
            Step {currentStep + 1} of {STEPS.length}
          </div>
          <div className="text-muted-foreground text-sm">{Math.round(stepProgress)}%</div>
        </div>
        <Progress value={stepProgress} className="h-2" />
        <div className="mt-2 flex justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"} `}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="mt-1 hidden text-xs sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep].title}</CardTitle>
                <p className="text-muted-foreground text-sm">{STEPS[currentStep].description}</p>
              </CardHeader>
              <CardContent>
                {/* Step 1: Client Info */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="clientName"
                        placeholder="Your full name"
                        value={clientData.clientName}
                        onChange={(e) => {
                          setClientData({ ...clientData, clientName: e.target.value });
                          if (errors.clientName) setErrors({ ...errors, clientName: undefined });
                        }}
                      />
                      {errors.clientName && (
                        <p className="text-destructive text-sm">{errors.clientName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+6281234567890"
                        value={clientData.phone}
                        onChange={(e) => {
                          setClientData({ ...clientData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                      />
                      {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
                      <p className="text-muted-foreground text-xs">
                        Format: +62 followed by 8-12 digits
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={clientData.email || ""}
                        onChange={(e) => {
                          setClientData({ ...clientData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                      />
                      {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address (Optional)</Label>
                      <textarea
                        id="address"
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your address for delivery"
                        rows={3}
                        value={clientData.address || ""}
                        onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Add Kits */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <KitCardDynamic
                        key={index}
                        index={index}
                        data={item}
                        onChange={(data) => updateItem(index, data)}
                        onRemove={() => removeItem(index)}
                        canRemove={items.length > 1}
                        services={services}
                        complexitiesByService={complexitiesByService}
                        addonsByService={addonsByService}
                        isLoading={configLoading}
                      />
                    ))}
                    <Button type="button" variant="outline" onClick={addItem} className="w-full" disabled={configLoading}>
                      + Add Another Kit
                    </Button>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Client Information</h3>
                      <div className="rounded-md bg-muted p-4 space-y-1">
                        <p><span className="text-muted-foreground">Name:</span> {clientData.clientName}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {clientData.phone}</p>
                        {clientData.email && <p><span className="text-muted-foreground">Email:</span> {clientData.email}</p>}
                        {clientData.address && <p><span className="text-muted-foreground">Address:</span> {clientData.address}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Order Items ({items.length})</h3>
                      {itemEstimations.map((item, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{item.kitName}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.serviceName} • {item.complexityName} ({item.multiplier}×)
                              </p>
                            </div>
                            <p className="font-medium">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(item.totalPriceCents)}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Base Price: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.basePriceCents)}</span>
                            <span>{item.days} days</span>
                          </div>
                          {item.addonPriceCents > 0 && (
                            <p className="text-muted-foreground text-sm">
                              Add-ons: +{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.addonPriceCents)}
                            </p>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Estimation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Estimation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {configLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(totalEstimation.totalPriceCents - totalEstimation.totalAddonPriceCents)}
                        </span>
                      </div>
                      {totalEstimation.totalAddonPriceCents > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Add-ons</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(totalEstimation.totalAddonPriceCents)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Days</span>
                        <span className="font-medium">{totalEstimation.totalDays} days</span>
                      </div>
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-lg">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(totalEstimation.totalPriceCents)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Note:</p>
                      <p>This is an estimation. Final price and duration will be confirmed after review.</p>
                    </div>

                    {hasInvalidItems && (
                      <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                        Please complete all required fields for each kit.
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext} disabled={!canGoNext() || isSubmitting || configLoading}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || configLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Order
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
