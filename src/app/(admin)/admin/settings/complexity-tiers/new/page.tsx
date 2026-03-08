/**
 * New Complexity Tier Page
 * Allows admins to create a new complexity tier
 */

"use client";

import { unstable_noStore } from "next/cache";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import type { ComplexityTierInsert } from "@/types";
import { SettingsNavigation } from "@/components/admin/settings/settings-navigation";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function NewComplexityTierPage() {
  unstable_noStore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minScore: 0,
    maxScore: null as number | null,
    multiplier: 1.0,
    baseMinPriceCents: null as number | null,
    baseMaxPriceCents: null as number | null,
    sortOrder: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user changes it
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
      const tierData: ComplexityTierInsert = {
        name: formData.name,
        description: formData.description || null,
        min_score: formData.minScore,
        max_score: formData.maxScore,
        multiplier: formData.multiplier,
        base_min_price_cents: formData.baseMinPriceCents,
        base_max_price_cents: formData.baseMaxPriceCents,
        is_active: true,
        sort_order: formData.sortOrder,
      };

      const response = await fetch("/api/admin/complexity-tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tierData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create tier");
      }

      toast.success("Complexity tier created successfully");
      router.push("/admin/settings/complexity-tiers");
    } catch (error) {
      console.error("Error creating tier:", error);
      toast.error("Failed to create tier");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          New Complexity Tier
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Create a new complexity tier for pricing calculation
        </p>
      </div>

      <SettingsNavigation activeTab="complexity-tiers" />

      <Card>
        <CardHeader>
          <CardTitle>Tier Details</CardTitle>
          <CardDescription>
            Define the score range, multiplier, and optional price range for this tier
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
                placeholder="e.g., Low, Medium, High"
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
                placeholder="Optional description of this tier"
                disabled={isSaving}
              />
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
                  placeholder="Leave empty for no upper limit"
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
                placeholder="e.g., 1.0, 1.3, 1.6"
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
                {isSaving ? "Saving..." : "Create Tier"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
