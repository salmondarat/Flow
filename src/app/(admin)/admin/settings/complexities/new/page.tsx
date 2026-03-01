/**
 * New Complexity Level Page
 * Allows admins to create a new complexity level
 */

"use client";


import { unstable_noStore } from "next/cache";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ComplexityLevelInsert } from "@/types";

const PRESET_MULTIPLIERS = [
  { label: "Low (1.0×)", value: 1.0, description: "Basic complexity" },
  { label: "Medium (1.5×)", value: 1.5, description: "Standard complexity" },
  { label: "High (2.0×)", value: 2.0, description: "Advanced complexity" },
];

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function NewComplexityPage() {
  unstable_noStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    multiplier: "",
    sortOrder: "0",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug || generateSlug(value),
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
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

    if (formData.sortOrder && (isNaN(Number(formData.sortOrder)) || Number(formData.sortOrder) < 0)) {
      newErrors.sortOrder = "Sort order must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const complexityData: ComplexityLevelInsert = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        multiplier: Number(formData.multiplier),
        sort_order: Number(formData.sortOrder) || 0,
      };

      const response = await fetch("/api/admin/complexities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complexityData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create complexity level");
      }

      toast.success("Complexity level created successfully");
      router.push("/admin/settings/complexities");
    } catch (error) {
      console.error("Error creating complexity:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create complexity level");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div>
            <h1 className="text-3xl font-bold">New Complexity Level</h1>
            <p className="text-muted-foreground mt-2">
              Create a new complexity level with pricing multiplier
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complexity Details</CardTitle>
              <CardDescription>
                Enter the basic information for the new complexity level
              </CardDescription>
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
                      onChange={(e) => handleNameChange(e.target.value)}
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
                  />
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
                        className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
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
                  {errors.sortOrder && <p className="text-destructive text-sm">{errors.sortOrder}</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link href="/admin/settings/complexities">
                    <Button type="button" variant="outline" disabled={isSubmitting} asChild>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Complexity"
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
