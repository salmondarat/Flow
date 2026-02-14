/**
 * New Add-on Page
 * Allows admins to create a new service add-on
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getServiceTypes } from "@/lib/api/services";
import type { ServiceAddonInsert, ServiceTypeRow } from "@/types";

export default function NewAddonPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<ServiceTypeRow[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    serviceTypeId: "",
    description: "",
    priceCents: "",
    isRequired: false,
    sortOrder: "0",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServiceTypes({ activeOnly: true });
      setServices(data);
      if (data.length > 0 && !formData.serviceTypeId) {
        setFormData((prev) => ({ ...prev, serviceTypeId: data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.serviceTypeId) {
      newErrors.serviceTypeId = "Please select a service";
    }

    if (formData.priceCents === "" || isNaN(Number(formData.priceCents)) || Number(formData.priceCents) < 0) {
      newErrors.priceCents = "Price must be a non-negative number";
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
      const addonData: ServiceAddonInsert = {
        name: formData.name.trim(),
        service_type_id: formData.serviceTypeId,
        description: formData.description.trim() || null,
        price_cents: Math.round(Number(formData.priceCents) * 100), // Convert to cents
        is_required: formData.isRequired,
        sort_order: Number(formData.sortOrder) || 0,
      };

      const response = await fetch("/api/admin/addons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addonData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create add-on");
      }

      toast.success("Add-on created successfully");
      router.push("/admin/settings/addons");
    } catch (error) {
      console.error("Error creating add-on:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create add-on");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/admin/settings/addons"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Add-ons
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">New Add-on</h1>
            <p className="text-muted-foreground mt-2">
              Create a new add-on for a service type
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add-on Details</CardTitle>
              <CardDescription>
                Enter the basic information for the new add-on
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
                      placeholder="e.g., LED Unit Installation"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                    />
                    {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceTypeId">
                      Service <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.serviceTypeId}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, serviceTypeId: value }));
                        if (errors.serviceTypeId) setErrors((prev) => ({ ...prev, serviceTypeId: undefined }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceTypeId && <p className="text-destructive text-sm">{errors.serviceTypeId}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of this add-on..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="priceCents">
                      Price (IDR) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="priceCents"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="50000"
                      value={formData.priceCents}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, priceCents: e.target.value }));
                        if (errors.priceCents) setErrors((prev) => ({ ...prev, priceCents: undefined }));
                      }}
                    />
                    {errors.priceCents && <p className="text-destructive text-sm">{errors.priceCents}</p>}
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
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Required</p>
                    <p className="text-muted-foreground text-sm">
                      Required add-ons are automatically included with the service
                    </p>
                  </div>
                  <Switch
                    checked={formData.isRequired}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRequired: checked }))}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link href="/admin/settings/addons">
                    <Button type="button" variant="outline" disabled={isSubmitting}>
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
                      "Create Add-on"
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
