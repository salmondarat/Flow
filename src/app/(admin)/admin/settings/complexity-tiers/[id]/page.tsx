/**
 * Edit Complexity Tier Page
 * Allows admins to edit an existing complexity tier
 */

"use client";

import { unstable_noStore } from "next/cache";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, Settings } from "lucide-react";
import type { ComplexityTierRow, ComplexityTierUpdate } from "@/types";
import { SettingsNavigation } from "@/components/admin/settings/settings-navigation";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

interface ServiceOverride {
  serviceTypeId: string;
  serviceName: string;
  multiplier: number | null;
}

export default function EditComplexityTierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tier, setTier] = useState<ComplexityTierRow | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minScore: 0,
    maxScore: null as number | null,
    multiplier: 1.0,
    baseMinPriceCents: null as number | null,
    baseMaxPriceCents: null as number | null,
    sortOrder: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serviceOverrides, setServiceOverrides] = useState<ServiceOverride[]>([]);
  const [showServiceOverrides, setShowServiceOverrides] = useState(false);

  useEffect(() => {
    fetchTier();
  }, [id]);

  const fetchTier = async () => {
    try {
      const response = await fetch(`/api/admin/complexity-tiers/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tier");
      }
      const { tier } = await response.json();
      setTier(tier);
      setFormData({
        name: tier.name,
        description: tier.description || "",
        minScore: tier.min_score,
        maxScore: tier.max_score,
        multiplier: tier.multiplier,
        baseMinPriceCents: tier.base_min_price_cents,
        baseMaxPriceCents: tier.base_max_price_cents,
        sortOrder: tier.sort_order,
        isActive: tier.is_active,
      });
    } catch (error) {
      console.error("Error fetching tier:", error);
      toast.error("Failed to load tier");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.minScore < 0) {
      newErrors.minScore = "Minimum score must be >= 0";
    }

    if (formData.maxScore !== null && formData.minScore > formData.maxScore) {
      newErrors.maxScore = "Maximum score must be >= minimum score";
    }

    if (formData.multiplier <= 0) {
      newErrors.multiplier = "Multiplier must be > 0";
    }

    if (
      formData.baseMinPriceCents !== null &&
      formData.baseMaxPriceCents !== null &&
      formData.baseMinPriceCents > formData.baseMaxPriceCents
    ) {
      newErrors.baseMaxPriceCents = "Maximum price must be >= minimum price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSaving(true);

    try {
      const tierData: ComplexityTierUpdate = {
        name: formData.name,
        description: formData.description || null,
        min_score: formData.minScore,
        max_score: formData.maxScore,
        multiplier: formData.multiplier,
        base_min_price_cents: formData.baseMinPriceCents,
        base_max_price_cents: formData.baseMaxPriceCents,
        sort_order: formData.sortOrder,
      };

      const response = await fetch(`/api/admin/complexity-tiers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tierData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update tier");
      }

      toast.success("Complexity tier updated successfully");
      router.push("/admin/settings/complexity-tiers");
    } catch (error) {
      console.error("Error updating tier:", error);
      toast.error("Failed to update tier");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddServiceOverride = () => {
    setServiceOverrides([
      ...serviceOverrides,
      {
        serviceTypeId: "",
        serviceName: "",
        multiplier: null,
      },
    ]);
  };

  const handleOverrideChange = (
    index: number,
    field: "serviceTypeId" | "serviceName" | "multiplier",
    value: string | number | null
  ) => {
    const newOverrides = [...serviceOverrides];
    newOverrides[index] = { ...newOverrides[index], [field]: value };
    setServiceOverrides(newOverrides);
  };

  const handleSaveServiceOverrides = async () => {
    const promises = serviceOverrides
      .filter((override) => override.serviceTypeId && override.multiplier !== null)
      .map((override) =>
        fetch(`/api/admin/complexity-tiers/${id}/service-override`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceTypeId: override.serviceTypeId,
            multiplier: override.multiplier,
          }),
        })
      );

    try {
      const results = await Promise.all(promises);
      const allSuccessful = results.every((r) => r.ok);
      if (allSuccessful) {
        toast.success("Service overrides saved successfully");
      } else {
        toast.error("Some overrides failed to save");
      }
    } catch (error) {
      console.error("Error saving service overrides:", error);
      toast.error("Failed to save service overrides");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading tier details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Complexity Tier
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {tier?.name || "Edit"} tier configuration
        </p>
      </div>

      <SettingsNavigation activeTab="complexity-tiers" />

      <Card>
        <CardHeader>
          <CardTitle>Tier Details</CardTitle>
          <CardDescription>
            Modify the score range, multiplier, and optional price range for this tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Tier Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isSaving}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isSaving}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
                disabled={isSaving}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            {/* Score Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minScore">Minimum Score *</Label>
                <Input
                  id="minScore"
                  type="number"
                  min="0"
                  value={formData.minScore}
                  onChange={(e) => handleChange("minScore", parseInt(e.target.value) || 0)}
                  disabled={isSaving}
                />
                {errors.minScore && (
                  <p className="text-sm text-destructive">{errors.minScore}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxScore">Maximum Score (optional)</Label>
                <Input
                  id="maxScore"
                  type="number"
                  min="0"
                  value={formData.maxScore ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "maxScore",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  disabled={isSaving}
                />
                {errors.maxScore && (
                  <p className="text-sm text-destructive">{errors.maxScore}</p>
                )}
              </div>
            </div>

            {/* Multiplier */}
            <div className="space-y-2">
              <Label htmlFor="multiplier">Price Multiplier *</Label>
              <Input
                id="multiplier"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.multiplier}
                onChange={(e) => handleChange("multiplier", parseFloat(e.target.value) || 1.0)}
                disabled={isSaving}
              />
              {errors.multiplier && (
                <p className="text-sm text-destructive">{errors.multiplier}</p>
              )}
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseMinPriceCents">Minimum Base Price (cents)</Label>
                <Input
                  id="baseMinPriceCents"
                  type="number"
                  min="0"
                  value={formData.baseMinPriceCents ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "baseMinPriceCents",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  placeholder="Optional"
                  disabled={isSaving}
                />
                {errors.baseMinPriceCents && (
                  <p className="text-sm text-destructive">{errors.baseMinPriceCents}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseMaxPriceCents">Maximum Base Price (cents)</Label>
                <Input
                  id="baseMaxPriceCents"
                  type="number"
                  min="0"
                  value={formData.baseMaxPriceCents ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "baseMaxPriceCents",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  placeholder="Optional"
                  disabled={isSaving}
                />
                {errors.baseMaxPriceCents && (
                  <p className="text-sm text-destructive">{errors.baseMaxPriceCents}</p>
                )}
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => handleChange("sortOrder", parseInt(e.target.value) || 0)}
                disabled={isSaving}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Service Overrides Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Service-Specific Overrides
          </CardTitle>
          <CardDescription>
            Override the multiplier for specific services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceOverrides.map((override, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-end">
              <div>
                <Label className="text-sm">Service</Label>
                <Input
                  value={override.serviceName}
                  onChange={(e) => handleOverrideChange(index, "serviceName", e.target.value)}
                  placeholder="Select or enter service"
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label className="text-sm">Service ID</Label>
                <Input
                  value={override.serviceTypeId}
                  onChange={(e) => handleOverrideChange(index, "serviceTypeId", e.target.value)}
                  placeholder="Service type ID"
                  disabled={isSaving}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-sm">Override Multiplier</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={override.multiplier ?? ""}
                    onChange={(e) =>
                      handleOverrideChange(
                        index,
                        "multiplier",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    placeholder="Leave empty to use tier default"
                    disabled={isSaving}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddServiceOverride}
                  disabled={isSaving}
                >
                  +
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSaveServiceOverrides}
              disabled={isSaving || serviceOverrides.length === 0}
            >
              Save Overrides
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
