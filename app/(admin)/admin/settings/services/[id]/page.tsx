/**
 * Edit Service Type Page
 * Allows admins to edit a service type and configure complexity multipliers
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getServiceType, updateServiceType } from "@/lib/api/services";
import { getComplexityLevels, getComplexityForService, setServiceComplexityMultiplier } from "@/lib/api/complexities";
import type { ServiceTypeRow, ComplexityLevelRow } from "@/types";

const AVAILABLE_ICONS = [
  { value: "wrench", label: "Wrench", icon: "🔧" },
  { value: "settings", label: "Settings", icon: "⚙️" },
  { value: "brush", label: "Brush", icon: "🖌️" },
];

interface ServiceComplexity {
  id: string;
  complexityId: string;
  complexityName: string;
  complexitySlug: string;
  multiplier: number;
  overrideMultiplier: number | null;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [service, setService] = useState<ServiceTypeRow | null>(null);
  const [complexities, setComplexities] = useState<ComplexityLevelRow[]>([]);
  const [serviceComplexities, setServiceComplexities] = useState<ServiceComplexity[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    iconName: "settings",
    basePriceCents: "",
    baseDays: "",
    sortOrder: "0",
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  useEffect(() => {
    fetchData();
  }, [serviceId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [serviceData, complexitiesData] = await Promise.all([
        getServiceType(serviceId),
        getComplexityLevels({ activeOnly: true }),
      ]);

      if (!serviceData) {
        toast.error("Service not found");
        router.push("/admin/settings/services");
        return;
      }

      // Fetch service-specific complexities with overrides
      const serviceComplexitiesData = await getComplexityForService(serviceId);

      setService(serviceData);
      setComplexities(complexitiesData);

      // Build service complexities array
      const complexitiesWithOverrides: ServiceComplexity[] = complexitiesData.map((c) => {
        const override = serviceComplexitiesData.find((sc) => sc.id === c.id);
        return {
          id: override?.id || "",
          complexityId: c.id,
          complexityName: c.name,
          complexitySlug: c.slug,
          multiplier: c.multiplier,
          overrideMultiplier: override?.override_multiplier ?? null,
        };
      });

      setServiceComplexities(complexitiesWithOverrides);

      setFormData({
        name: serviceData.name,
        slug: serviceData.slug,
        description: serviceData.description || "",
        iconName: serviceData.icon_name || "settings",
        basePriceCents: (serviceData.base_price_cents / 100).toString(),
        baseDays: serviceData.base_days.toString(),
        sortOrder: serviceData.sort_order.toString(),
        isActive: serviceData.is_active,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load service data");
      router.push("/admin/settings/services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultiplierChange = async (complexityId: string, value: string) => {
    const multiplier = value === "" ? null : parseFloat(value);

    // Update local state optimistically
    setServiceComplexities((prev) =>
      prev.map((sc) =>
        sc.complexityId === complexityId ? { ...sc, overrideMultiplier: multiplier } : sc
      )
    );

    // Save to database
    try {
      await setServiceComplexityMultiplier(serviceId, complexityId, multiplier ?? null);
      toast.success("Multiplier updated");
    } catch (error) {
      console.error("Error updating multiplier:", error);
      toast.error("Failed to update multiplier");
      // Revert on error
      fetchData();
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.slug || formData.slug.trim().length < 2) {
      newErrors.slug = "Slug must be at least 2 characters";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formData.basePriceCents || isNaN(Number(formData.basePriceCents)) || Number(formData.basePriceCents) <= 0) {
      newErrors.basePriceCents = "Base price must be a positive number";
    }

    if (!formData.baseDays || isNaN(Number(formData.baseDays)) || Number(formData.baseDays) <= 0) {
      newErrors.baseDays = "Base days must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      await updateServiceType(serviceId, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        icon_name: formData.iconName || null,
        base_price_cents: Math.round(Number(formData.basePriceCents) * 100),
        base_days: Math.round(Number(formData.baseDays)),
        sort_order: Number(formData.sortOrder) || 0,
        is_active: formData.isActive,
      });

      toast.success("Service updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update service");
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(cents);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/admin/settings/services"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Edit Service Type</h1>
              <p className="text-muted-foreground mt-2">
                Configure service details and complexity multipliers
              </p>
            </div>
            {service?.is_active && (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Service Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                  <CardDescription>Basic information for this service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="e.g., Full Build"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, name: e.target.value }));
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                        />
                        {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">
                          Slug <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="slug"
                          placeholder="e.g., full-build"
                          value={formData.slug}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, slug: e.target.value }));
                            if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
                          }}
                        />
                        {errors.slug && <p className="text-destructive text-sm">{errors.slug}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of this service type..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_ICONS.map((icon) => (
                          <button
                            key={icon.value}
                            type="button"
                            className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl transition-colors ${
                              formData.iconName === icon.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-muted-foreground"
                            }`}
                            onClick={() => setFormData((prev) => ({ ...prev, iconName: icon.value }))}
                          >
                            {icon.icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="basePriceCents">
                          Base Price (IDR) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="basePriceCents"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.basePriceCents}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, basePriceCents: e.target.value }));
                            if (errors.basePriceCents) setErrors((prev) => ({ ...prev, basePriceCents: undefined }));
                          }}
                        />
                        {errors.basePriceCents && <p className="text-destructive text-sm">{errors.basePriceCents}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="baseDays">
                          Base Days <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="baseDays"
                          type="number"
                          min="1"
                          value={formData.baseDays}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, baseDays: e.target.value }));
                            if (errors.baseDays) setErrors((prev) => ({ ...prev, baseDays: undefined }));
                          }}
                        />
                        {errors.baseDays && <p className="text-destructive text-sm">{errors.baseDays}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sortOrder">Sort Order</Label>
                        <Input
                          id="sortOrder"
                          type="number"
                          min="0"
                          value={formData.sortOrder}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, sortOrder: e.target.value }));
                            if (errors.sortOrder) setErrors((prev) => ({ ...prev, sortOrder: undefined }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Active Status</p>
                        <p className="text-muted-foreground text-sm">
                          Inactive services won't be shown to clients
                        </p>
                      </div>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Complexity Multipliers */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Complexity Multipliers</CardTitle>
                  <CardDescription>
                    Override default multipliers for this service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {serviceComplexities.map((sc) => {
                    const effectiveMultiplier = sc.overrideMultiplier ?? sc.multiplier;
                    const basePrice = service ? service.base_price_cents : 0;
                    const totalPrice = Math.round(basePrice * effectiveMultiplier);

                    return (
                      <div key={sc.complexityId} className="space-y-2 rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`multiplier-${sc.complexityId}`} className="text-sm font-medium">
                            {sc.complexityName}
                          </Label>
                          <Badge variant={sc.overrideMultiplier ? "default" : "secondary"} className="text-xs">
                            {sc.overrideMultiplier ? "Custom" : "Default"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`multiplier-${sc.complexityId}`}
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder={sc.multiplier.toString()}
                            value={sc.overrideMultiplier ?? ""}
                            onChange={(e) => handleMultiplierChange(sc.complexityId, e.target.value)}
                            className="h-8"
                          />
                          <span className="text-muted-foreground text-sm">×</span>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          <p>Default: {sc.multiplier}×</p>
                          <p>Effective: {effectiveMultiplier}× = {formatPrice(totalPrice)}</p>
                        </div>
                      </div>
                    );
                  })}

                  <p className="text-muted-foreground text-xs">
                    Leave empty to use the default multiplier. Custom values override the default for this
                    service only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
