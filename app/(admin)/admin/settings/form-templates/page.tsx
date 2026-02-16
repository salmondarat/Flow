"use client";


import { unstable_noStore } from "next/cache";
import { useState, useEffect, useCallback } from "react";
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
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react";

interface FormTemplate {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

interface FormTemplatesResponse {
  templates: FormTemplate[];
}

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function FormTemplatesPage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<FormTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/form-templates");

      if (!response.ok) {
        if (response.status === 403) {
          router.push("/auth");
          return;
        }
        throw new Error("Failed to fetch form templates");
      }

      const result = (await response.json()) as FormTemplatesResponse;
      setTemplates(result.templates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load form templates");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/form-templates/${templateToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete form template");
      }

      toast.success("Form template deleted successfully");
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete form template");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading form templates...</p>
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
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Form Templates</h1>
              <p className="text-muted-foreground mt-2">
                Manage order form templates for client orders
              </p>
            </div>
            <Link href="/admin/settings/form-templates/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {template.name}
                        {template.is_default && <Badge variant="default">Default</Badge>}
                      </CardTitle>
                      {template.description && (
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-muted-foreground text-sm">
                      <p>Version: {template.version}</p>
                      <p>Updated: {formatDate(template.updated_at)}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/admin/settings/form-templates/${template.id}`}>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Pencil className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTemplateToDelete(template)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {templates.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">No form templates found</p>
                  <Link href="/admin/settings/form-templates/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Template
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
            <DialogTitle>Delete Form Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setTemplateToDelete(null);
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
