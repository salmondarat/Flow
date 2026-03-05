/**
 * New Service Type Page
 * Allows admins to create a new service type
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ServiceTypeInsert } from "@/types";

const AVAILABLE_ICONS = [
  { value: "wrench", label: "Wrench", icon: "🔧" },
  { value: "settings", label: "Settings", icon: "⚙️" },
  { value: "brush", label: "Brush", icon: "🖌️" },
];

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function NewServicePage() {
  unstable_noStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    iconName: "settings",
    basePriceCents: "",
    baseDays: "",
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
      const serviceData: ServiceTypeInsert = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        icon_name: formData.iconName || null,
        base_price_cents: Math.round(Number(formData.basePriceCents) * 100), // Convert to cents
        base_days: Math.round(Number(formData.baseDays)),
        sort_order: Number(formData.sortOrder) || 0,
      };

      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create service type");
      }

      const result = await response.json();

      toast.success("Service type created successfully");

      // Redirect to edit page to configure complexities
      router.push(`/admin/settings/services/${result.service.id}`);
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create service type");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">New Service Type</h1>
            <p className="text-muted-foreground mt-2">
              Create a new service type for client orders
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>
                Enter the basic information for the new service type
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
                      placeholder="e.g., Full Build"
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
                      placeholder="e.g., full-build"
                      value={formData.slug}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, slug: e.target.value }));
                        if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
                      }}
                    />
                    {errors.slug && <p className="text-destructive text-sm">{errors.slug}</p>}
                    <p className="text-muted-foreground text-xs">
                      Used in URLs and API calls
                    </p>
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
                      placeholder="500000"
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
                      placeholder="30"
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
                      placeholder="0"
                      value={formData.sortOrder}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, sortOrder: e.target.value }));
                        if (errors.sortOrder) setErrors((prev) => ({ ...prev, sortOrder: undefined }));
                      }}
                    />
                    {errors.sortOrder && <p className="text-destructive text-sm">{errors.sortOrder}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link href="/admin/settings/services">
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
                      "Create Service"
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
