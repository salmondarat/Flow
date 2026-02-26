/**
 * Service Add-ons Management Page
 * Allows admins to view, create, edit, and delete service add-ons
 */

"use client";

import { unstable_noStore } from "next/cache";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import { getAllAddons } from "@/lib/api/addons";
import { getServiceTypes } from "@/lib/api/services";
import type { ServiceAddonRow, ServiceTypeRow } from "@/types";
import { SettingsNavigation } from "@/components/admin/settings/settings-navigation";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function AddonsPage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [addons, setAddons] = useState<Array<ServiceAddonRow & { service_name: string }>>([]);
  const [services, setServices] = useState<ServiceTypeRow[]>([]);
  const [filterServiceId, setFilterServiceId] = useState<string | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState<ServiceAddonRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filterServiceId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [addonsData, servicesData] = await Promise.all([
        getAllAddons({
          activeOnly: false,
          serviceTypeId: filterServiceId === "all" ? undefined : filterServiceId,
        }),
        getServiceTypes({ activeOnly: false }),
      ]);

      setAddons(addonsData);
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching add-ons:", error);
      toast.error("Failed to load add-ons");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!addonToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/addons/${addonToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete add-on");
      }

      toast.success("Add-on deleted successfully");
      setDeleteDialogOpen(false);
      setAddonToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting add-on:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete add-on");
    } finally {
      setIsDeleting(false);
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
        <p className="text-muted-foreground">Loading add-ons...</p>
      </div>
    );
  }

  const filteredAddons =
    filterServiceId === "all"
      ? addons
      : addons.filter((a) => a.service_type_id === filterServiceId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Add-ons</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage add-ons for service types (optional extras, required items, etc.)
        </p>
      </div>

      <SettingsNavigation activeTab="addons" />

      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/settings/addons/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Add-on
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter by service:</span>
        </div>
        <Select value={filterServiceId} onValueChange={setFilterServiceId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAddons.map((addon) => (
          <Card key={addon.id} className={addon.is_active ? "" : "opacity-60"}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {addon.name}
                    {addon.is_required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {!addon.is_active && <Badge variant="secondary">Inactive</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1">{addon.service_name}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {addon.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">{addon.description}</p>
                )}

                <div className="text-muted-foreground text-sm">
                  <p>Price: {formatPrice(addon.price_cents)}</p>
                  <p>Sort Order: {addon.sort_order}</p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/settings/addons/${addon.id}`}>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Pencil className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddonToDelete(addon)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAddons.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">
                {filterServiceId === "all" ? "No add-ons found" : "No add-ons for this service"}
              </p>
              <Link href="/admin/settings/addons/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Add-on
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Add-on</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{addonToDelete?.name}&quot;? This will
              soft-delete the add-on (it won&apos;t appear for clients but existing orders will
              preserve reference).
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setAddonToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
