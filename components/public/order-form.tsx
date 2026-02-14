/**
 * OrderFormWizard component
 * Multi-step form for order creation
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { KitCard, type KitCardData } from "./kit-card";
import { EstimationSummary } from "./estimation-summary";
import { useEstimation } from "@/lib/features/estimation/use-estimation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

type ClientInfo = {
  clientName: string;
  phone: string;
  email?: string;
  address?: string;
};

type FormData = ClientInfo & { items: KitCardData[] };

const STEPS = [
  { id: "client", title: "Your Info", description: "Tell us about yourself" },
  { id: "kits", title: "Model Kits", description: "Add your model kits" },
  { id: "services", title: "Services", description: "Select services for each kit" },
  { id: "review", title: "Review", description: "Review your order" },
] as const;

interface OrderFormWizardProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function OrderFormWizard({ onSubmit, isSubmitting = false }: OrderFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<KitCardData[]>([
    { kitName: "", kitGrade: "", serviceType: undefined, complexity: undefined, notes: "" },
  ]);
  const [clientData, setClientData] = useState<ClientInfo>({
    clientName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInfo, string>>>({});

  const { formatted, hasInvalidItems } = useEstimation(items);

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
        return items.length > 0 && items.every((item) => item.kitName.trim().length >= 2);
      case 2:
        return items.every((item) => item.serviceType && item.complexity);
      case 3:
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
      { kitName: "", kitGrade: "", serviceType: undefined, complexity: undefined, notes: "" },
    ]);
  };

  const updateItem = (index: number, data: KitCardData) => {
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
                      <KitCard
                        key={index}
                        index={index}
                        data={item}
                        onChange={(data) => updateItem(index, data)}
                        onRemove={() => removeItem(index)}
                        canRemove={items.length > 1}
                      />
                    ))}
                    <Button type="button" variant="outline" onClick={addItem} className="w-full">
                      Add Another Kit
                    </Button>
                  </div>
                )}

                {/* Step 3: Services */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <KitCard
                        key={index}
                        index={index}
                        data={item}
                        onChange={(data) => updateItem(index, data)}
                        onRemove={() => removeItem(index)}
                        canRemove={items.length > 1}
                        error={
                          !item.serviceType || !item.complexity
                            ? "Please select service and complexity"
                            : undefined
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <h4 className="font-semibold">Client Information</h4>
                      <p>
                        <strong>Name:</strong> {clientData.clientName || "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {clientData.phone || "N/A"}
                      </p>
                      {clientData.email && (
                        <p>
                          <strong>Email:</strong> {clientData.email}
                        </p>
                      )}
                    </div>

                    <div className="bg-border h-px" />

                    <div>
                      <h4 className="mb-2 font-semibold">Order Items</h4>
                      <div className="space-y-2">
                        {formatted?.breakdown.map((item, index) => (
                          <div
                            key={index}
                            className="bg-muted flex items-center justify-between rounded p-2 text-sm"
                          >
                            <div>
                              <p className="font-medium">{item.kitName}</p>
                              <p className="text-muted-foreground text-xs">
                                {item.service} · {item.complexity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{item.price}</p>
                              <p className="text-muted-foreground text-xs">{item.days}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="mt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext} disabled={!canGoNext() || isSubmitting}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={!canGoNext() || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Order"}
                  {isSubmitting ? null : <Check className="ml-1 h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>

          {/* Estimation Summary - Sticky Sidebar */}
          <div className="hidden lg:col-span-1 lg:block">
            <EstimationSummary formatted={formatted} hasInvalidItems={hasInvalidItems} />
          </div>
        </div>
      </form>
    </div>
  );
}
