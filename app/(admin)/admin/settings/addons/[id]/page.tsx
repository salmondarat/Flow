/**
 * Edit Add-on Page
 * Allows admins to edit a service add-on
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getAddon, updateAddon } from "@/lib/api/addons";
import { getServiceTypes } from "@/lib/api/services";
import type { ServiceAddonRow, ServiceTypeRow } from "@/types";

export default function EditAddonPage() {
  const router = useRouter();
  const params = useParams();
  const addonId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [addon, setAddon] = useState<ServiceAddonRow | null>(null);
  const [services, setServices] = useState<ServiceTypeRow[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    serviceTypeId: "",
    description: "",
    priceCents: "",
    isRequired: false,
    sortOrder: "0",
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  useEffect(() => {
    fetchData();
  }, [addonId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [addonData, servicesData] = await Promise.all([
        getAddon(addonId),
        getServiceTypes({ activeOnly: false }),
      ]);

      if (!addonData) {
        toast.error("Add-on not found");
        router.push("/admin/settings/addons");
        return;
      }

      setAddon(addonData);
      setServices(servicesData);

      setFormData({
        name: addonData.name,
        serviceTypeId: addonData.service_type_id,
        description: addonData.description || "",
        priceCents: (addonData.price_cents / 100).toString(),
        isRequired: addonData.is_required,
        sortOrder: addonData.sort_order.toString(),
        isActive: addonData.is_active,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load add-on data");
      router.push("/admin/settings/addons");
    } finally {
      setIsLoading(false);
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

    setIsSaving(true);

    try {
      await updateAddon(addonId, {
        name: formData.name.trim(),
        service_type_id: formData.serviceTypeId,
        description: formData.description.trim() || null,
        price_cents: Math.round(Number(formData.priceCents) * 100),
        is_required: formData.isRequired,
        sort_order: Number(formData.sortOrder) || 0,
        is_active: formData.isActive,
      });

      toast.success("Add-on updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating add-on:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update add-on");
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Edit Add-on</h1>
              <p className="text-muted-foreground mt-2">
                Update add-on details
              </p>
            </div>
            {addon?.is_active && (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add-on Details</CardTitle>
              <CardDescription>Basic information for this add-on</CardDescription>
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
                      value={formData.priceCents}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, priceCents: e.target.value }));
                        if (errors.priceCents) setErrors((prev) => ({ ...prev, priceCents: undefined }));
                      }}
                    />
                    {errors.priceCents && <p className="text-destructive text-sm">{errors.priceCents}</p>}
                    <p className="text-muted-foreground text-xs">
                      Current: {formatPrice(addon?.price_cents || 0)}
                    </p>
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

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Active Status</p>
                    <p className="text-muted-foreground text-sm">
                      Inactive add-ons won't be shown to clients
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
