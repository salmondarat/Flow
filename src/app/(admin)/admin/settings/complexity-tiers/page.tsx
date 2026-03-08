/**
 * Complexity Tiers Management Page
 * Allows admins to view, create, edit, and delete complexity tiers
 */

"use client";

import { unstable_noStore } from "next/cache";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import type { ComplexityTierRow } from "@/types";
import { SettingsNavigation } from "@/components/admin/settings/settings-navigation";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function ComplexityTiersPage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tiers, setTiers] = useState<ComplexityTierRow[]>([]);
  const [validation, setValidation] = useState<{
    valid: boolean;
    overlaps: any[];
    gaps: any[];
    warnings: string[];
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<ComplexityTierRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const response = await fetch("/api/admin/complexity-tiers?activeOnly=false");
      if (!response.ok) {
        throw new Error("Failed to fetch complexity tiers");
      }
      const data = await response.json();
      setTiers(data.tiers);
      setValidation(data.validation);
    } catch (error) {
      console.error("Error fetching tiers:", error);
      toast.error("Failed to load complexity tiers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tierToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/complexity-tiers/${tierToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tier");
      }

      toast.success("Complexity tier deleted successfully");
      setDeleteDialogOpen(false);
      setTierToDelete(null);
      fetchTiers();
    } catch (error) {
      console.error("Error deleting tier:", error);
      toast.error("Failed to delete tier");
    } finally {
      setIsDeleting(false);
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 1.6) return "destructive";
    if (multiplier >= 1.3) return "secondary";
    return "default";
  };

  const getScoreRangeText = (tier: ComplexityTierRow) => {
    if (tier.max_score === null) {
      return `${tier.min_score}+`;
    }
    return `${tier.min_score} - ${tier.max_score}`;
  };

  const getPriceRangeText = (tier: ComplexityTierRow) => {
    if (tier.base_min_price_cents === null || tier.base_max_price_cents === null) {
      return "Uses multiplier only";
    }
    const min = (tier.base_min_price_cents / 100).toFixed(2);
    const max = (tier.base_max_price_cents / 100).toFixed(2);
    return `$${min} - $${max}`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading complexity tiers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Complexity Tiers
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Configure complexity tiers with score ranges, multipliers, and price ranges
        </p>
      </div>

      <SettingsNavigation activeTab="complexity-tiers" />

      {/* Validation Warnings */}
      {validation && !validation.valid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="ml-2 space-y-1">
              {validation.warnings.map((warning: string, index: number) => (
                <p key={index}>{warning}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/settings/complexity-tiers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Tier
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id} className={!tier.is_active ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {tier.description || "No description"}
                  </CardDescription>
                </div>
                {!tier.is_active && <Badge variant="secondary">Inactive</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Score Range */}
                <div>
                  <p className="text-sm text-muted-foreground">Score Range:</p>
                  <p className="text-lg font-semibold">{getScoreRangeText(tier)}</p>
                </div>

                {/* Multiplier */}
                <div>
                  <p className="text-sm text-muted-foreground">Multiplier:</p>
                  <Badge variant={getMultiplierColor(tier.multiplier)}>
                    {tier.multiplier}×
                  </Badge>
                </div>

                {/* Price Range */}
                <div>
                  <p className="text-sm text-muted-foreground">Price Range:</p>
                  <p className="text-lg font-semibold">{getPriceRangeText(tier)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/admin/settings/complexity-tiers/${tier.id}`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pencil className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTierToDelete(tier)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tiers.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">No complexity tiers found</p>
            <Link href="/admin/settings/complexity-tiers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Tier
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Complexity Tier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{tierToDelete?.name}&quot;? This will soft-delete the tier (it won&apos;t appear for clients but existing orders will preserve references).
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setTierToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
