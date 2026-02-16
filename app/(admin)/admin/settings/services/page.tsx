/**
 * Service Types Management Page
 * Allows admins to view, create, edit, and delete service types
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
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft, Wrench, Settings, Brush } from "lucide-react";
import { getServiceTypes } from "@/lib/api/services";
import type { ServiceTypeRow } from "@/types";

const ICON_MAP: Record<string, React.ReactNode> = {
  wrench: <Wrench className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  brush: <Brush className="h-5 w-5" />,
};

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function ServicesPage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceTypeRow[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceTypeRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServiceTypes({ activeOnly: false });
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load service types");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete service type");
      }

      toast.success("Service type deleted successfully");
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete service type");
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

  const getIcon = (iconName: string | null) => {
    if (!iconName) return <Settings className="h-5 w-5" />;
    return ICON_MAP[iconName] || <Settings className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading service types...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/admin/settings"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Service Types</h1>
              <p className="text-muted-foreground mt-2">
                Manage service types for client orders (Full Build, Repair, Repaint, etc.)
              </p>
            </div>
            <Link href="/admin/settings/services/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Service
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className={service.is_active ? "" : "opacity-60"}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {getIcon(service.icon_name)}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {service.name}
                          {!service.is_active && <Badge variant="secondary">Inactive</Badge>}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {service.slug}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-muted-foreground text-sm">
                      <p>Base Price: {formatPrice(service.base_price_cents)}</p>
                      <p>Base Days: {service.base_days} days</p>
                      <p>Sort Order: {service.sort_order}</p>
                    </div>

                    {service.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/admin/settings/services/${service.id}`}>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Pencil className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setServiceToDelete(service)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {services.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">No service types found</p>
                  <Link href="/admin/settings/services/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Service
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{serviceToDelete?.name}"? This will soft-delete the
              service (it won't appear for clients but existing orders will preserve the reference).
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setServiceToDelete(null);
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
