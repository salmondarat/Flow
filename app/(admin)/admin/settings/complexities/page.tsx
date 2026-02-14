/**
 * Complexity Levels Management Page
 * Allows admins to view, create, edit, and delete complexity levels
 */

"use client";

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
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { getComplexityLevels } from "@/lib/api/complexities";
import type { ComplexityLevelRow } from "@/types";

export default function ComplexitiesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [complexities, setComplexities] = useState<ComplexityLevelRow[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [complexityToDelete, setComplexityToDelete] = useState<ComplexityLevelRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchComplexities();
  }, []);

  const fetchComplexities = async () => {
    try {
      const data = await getComplexityLevels({ activeOnly: false });
      setComplexities(data.sort((a, b) => a.sort_order - b.sort_order));
    } catch (error) {
      console.error("Error fetching complexities:", error);
      toast.error("Failed to load complexity levels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!complexityToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/complexities/${complexityToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete complexity level");
      }

      toast.success("Complexity level deleted successfully");
      setDeleteDialogOpen(false);
      setComplexityToDelete(null);
      fetchComplexities();
    } catch (error) {
      console.error("Error deleting complexity:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete complexity level");
    } finally {
      setIsDeleting(false);
    }
  };

  const getMultiplierBadge = (multiplier: number) => {
    if (multiplier >= 2.0) return "destructive";
    if (multiplier >= 1.5) return "secondary";
    return "default";
  };

  const getMultiplierLabel = (multiplier: number) => {
    if (multiplier >= 2.0) return "High";
    if (multiplier >= 1.3) return "Medium";
    return "Low";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading complexity levels...</p>
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
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Complexity Levels</h1>
              <p className="text-muted-foreground mt-2">
                Manage complexity levels and their pricing multipliers
              </p>
            </div>
            <Link href="/admin/settings/complexities/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Complexity
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {complexities.map((complexity) => (
              <Card key={complexity.id} className={complexity.is_active ? "" : "opacity-60"}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {complexity.name}
                        {!complexity.is_active && <Badge variant="secondary">Inactive</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {complexity.slug}
                      </CardDescription>
                    </div>
                    <Badge variant={getMultiplierBadge(complexity.multiplier)}>
                      {complexity.multiplier}× {getMultiplierLabel(complexity.multiplier)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-muted-foreground text-sm">
                      <p>Multiplier: {complexity.multiplier}×</p>
                      <p>Sort Order: {complexity.sort_order}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/admin/settings/complexities/${complexity.id}`}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Pencil className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setComplexityToDelete(complexity)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {complexities.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">No complexity levels found</p>
                  <Link href="/admin/settings/complexities/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Complexity Level
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
            <DialogTitle>Delete Complexity Level</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{complexityToDelete?.name}"? This will soft-delete the
              complexity level (it won't appear for clients but existing orders will preserve the reference).
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setComplexityToDelete(null);
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
