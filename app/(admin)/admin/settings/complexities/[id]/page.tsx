/**
 * Edit Complexity Level Page
 * Allows admins to edit a complexity level
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getComplexityLevel, updateComplexityLevel } from "@/lib/api/complexities";
import type { ComplexityLevelRow } from "@/types";

const PRESET_MULTIPLIERS = [
  { label: "Low (1.0×)", value: 1.0, description: "Basic complexity" },
  { label: "Medium (1.5×)", value: 1.5, description: "Standard complexity" },
  { label: "High (2.0×)", value: 2.0, description: "Advanced complexity" },
];

export default function EditComplexityPage() {
  const router = useRouter();
  const params = useParams();
  const complexityId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [complexity, setComplexity] = useState<ComplexityLevelRow | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    multiplier: "",
    sortOrder: "0",
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  useEffect(() => {
    fetchData();
  }, [complexityId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getComplexityLevel(complexityId);

      if (!data) {
        toast.error("Complexity level not found");
        router.push("/admin/settings/complexities");
        return;
      }

      setComplexity(data);
      setFormData({
        name: data.name,
        slug: data.slug,
        multiplier: data.multiplier.toString(),
        sortOrder: data.sort_order.toString(),
        isActive: data.is_active,
      });
    } catch (error) {
      console.error("Error fetching complexity:", error);
      toast.error("Failed to load complexity data");
      router.push("/admin/settings/complexities");
    } finally {
      setIsLoading(false);
    }
  };

  const setPresetMultiplier = (value: number) => {
    setFormData((prev) => ({ ...prev, multiplier: value.toString() }));
    if (errors.multiplier) setErrors((prev) => ({ ...prev, multiplier: undefined }));
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

    if (!formData.multiplier || isNaN(Number(formData.multiplier)) || Number(formData.multiplier) <= 0) {
      newErrors.multiplier = "Multiplier must be a positive number";
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
      await updateComplexityLevel(complexityId, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        multiplier: Number(formData.multiplier),
        sort_order: Number(formData.sortOrder) || 0,
        is_active: formData.isActive,
      });

      toast.success("Complexity level updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating complexity:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update complexity level");
    } finally {
      setIsSaving(false);
    }
  };

  const getMultiplierBadge = (multiplier: number) => {
    if (multiplier >= 2.0) return "destructive";
    if (multiplier >= 1.5) return "secondary";
    return "default";
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
            href="/admin/settings/complexities"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Complexities
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Edit Complexity Level</h1>
              <p className="text-muted-foreground mt-2">
                Update complexity level details and multiplier
              </p>
            </div>
            {complexity?.is_active && (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complexity Details</CardTitle>
              <CardDescription>Basic information for this complexity level</CardDescription>
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
                      placeholder="e.g., High Detail"
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
                      placeholder="e.g., high-detail"
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
                  <Label htmlFor="multiplier">
                    Multiplier <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="multiplier"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="1.5"
                      value={formData.multiplier}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, multiplier: e.target.value }));
                        if (errors.multiplier) setErrors((prev) => ({ ...prev, multiplier: undefined }));
                      }}
                      className="flex-1"
                    />
                    <Badge variant={getMultiplierBadge(Number(formData.multiplier))} className="h-10 px-4">
                      {Number(formData.multiplier).toFixed(1)}×
                    </Badge>
                  </div>
                  {errors.multiplier && <p className="text-destructive text-sm">{errors.multiplier}</p>}
                  <p className="text-muted-foreground text-xs">
                    The price multiplier applied to the base service price
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Quick Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_MULTIPLIERS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                          Number(formData.multiplier) === preset.value
                            ? "border-primary bg-primary/10"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setPresetMultiplier(preset.value)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sortOrder}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, sortOrder: e.target.value }));
                      if (errors.sortOrder) setErrors((prev) => ({ ...prev, sortOrder: undefined }));
                    }}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Active Status</p>
                    <p className="text-muted-foreground text-sm">
                      Inactive complexities won't be shown to clients
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
      </main>
    </div>
  );
}
