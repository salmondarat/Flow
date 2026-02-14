"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DynamicForm } from "@/components/form/dynamic-form";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormTemplateConfig, KitFormItem } from "@/types/form-config";

interface KitFormData extends Record<string, unknown> {
  kit_name: string;
  kit_model?: string;
  service_type: string;
  complexity: string;
  notes?: string;
}

export default function ClientNewOrderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState<FormTemplateConfig | null>(null);
  const [kits, setKits] = useState<KitFormItem[]>([]);
  const [currentKitIndex, setCurrentKitIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      const response = await fetch("/api/form-templates/default");

      if (!response.ok) {
        throw new Error("Failed to fetch form template");
      }

      const result = await response.json();
      setTemplate(result.template.config);

      // Initialize with one empty kit
      setKits([{ kit_name: "", service_type: "full_build", complexity: "medium" }]);
    } catch (error) {
      console.error("Error fetching template:", error);
      toast.error("Failed to load form template");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKit = (data: Record<string, unknown>) => {
    const updatedKits = [...kits];
    updatedKits[currentKitIndex] = {
      kit_name: data.kit_name as string,
      kit_model: data.kit_model as string | undefined,
      service_type: data.service_type as "full_build" | "repair" | "repaint",
      complexity: data.complexity as "low" | "medium" | "high",
      notes: data.notes as string | undefined,
    };

    setKits(updatedKits);

    // Add new empty kit or submit if this is the last one
    if (currentKitIndex < kits.length - 1) {
      setCurrentKitIndex(currentKitIndex + 1);
    } else {
      // Add new kit
      setKits([...updatedKits, { kit_name: "", service_type: "full_build", complexity: "medium" }]);
      setCurrentKitIndex(updatedKits.length);
    }
  };

  const handleSubmitOrder = async () => {
    if (kits.filter((k) => k.kit_name).length === 0) {
      toast.error("Please add at least one kit to your order");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/client/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_items: kits.filter((k) => k.kit_name),
          notes: "",
          status: "draft",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order");
      }

      toast.success("Order created successfully!");

      setTimeout(() => {
        router.push(`/client/orders/${result.order.id}`);
      }, 500);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveKit = (index: number) => {
    if (kits.length <= 1) {
      toast.error("You must have at least one kit in your order");
      return;
    }

    const updatedKits = kits.filter((_, i) => i !== index);
    setKits(updatedKits);

    if (currentKitIndex >= updatedKits.length) {
      setCurrentKitIndex(updatedKits.length - 1);
    }
  };

  const handleSelectKit = (index: number) => {
    setCurrentKitIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading order form...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Failed to load form template</p>
      </div>
    );
  }

  const currentKit = kits[currentKitIndex] || {
    kit_name: "",
    service_type: "full_build",
    complexity: "medium",
  };

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            href="/client/orders"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Create New Order</h1>
            <p className="text-muted-foreground mt-2">
              Add kits to your order and fill in the details for each one
            </p>
          </div>

          {/* Kit Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kits</CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setKits([
                      ...kits,
                      { kit_name: "", service_type: "full_build", complexity: "medium" },
                    ]);
                    setCurrentKitIndex(kits.length);
                  }}
                  disabled={isSubmitting}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Kit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {kits.map((kit, index) => (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectKit(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectKit(index);
                      }
                    }}
                    className={`relative inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      index === currentKitIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    <span>Kit {index + 1}</span>
                    {kit.kit_name && (
                      <>
                        <span>·</span>
                        <span className="max-w-[150px] truncate">{kit.kit_name}</span>
                      </>
                    )}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveKit(index);
                        }}
                        className="text-destructive hover:text-destructive/80 ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Kit Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Kit {currentKitIndex + 1} Details</h2>

            <DynamicForm
              template={template}
              onSubmit={handleAddKit}
              submitLabel={currentKitIndex < kits.length - 1 ? "Save & Next Kit" : "Save Kit"}
              initialData={currentKit as any}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Order */}
          {kits.some((k) => k.kit_name) && (
            <Card>
              <CardHeader>
                <CardTitle>Review Order</CardTitle>
                <CardDescription>
                  You have {kits.filter((k) => k.kit_name).length} kit(s) in your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Ready to submit your order?</p>
                  </div>
                  <Button size="lg" onClick={handleSubmitOrder} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
