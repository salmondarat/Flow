/**
 * Complexity Question Templates Management Page
 * Allows admins to view, create, edit, and delete question templates
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
import { Plus, Pencil, Trash2, Star, StarOff } from "lucide-react";
import type { ComplexityQuestionTemplateRow, ComplexityQuestionTemplateWithQuestions } from "@/types";
import { SettingsNavigation } from "@/components/admin/settings/settings-navigation";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function ComplexityQuestionsPage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<ComplexityQuestionTemplateRow[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ComplexityQuestionTemplateRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/complexity-questions?includeInactive=true");
      if (!response.ok) {
        throw new Error("Failed to fetch question templates");
      }
      const { templates } = await response.json();
      setTemplates(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load question templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (template: ComplexityQuestionTemplateRow) => {
    try {
      const response = await fetch("/api/admin/complexity-questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, setDefault: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to set default template");
      }

      toast.success("Default template updated successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Error setting default:", error);
      toast.error("Failed to set default template");
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/complexity-questions/${templateToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete template");
      }

      toast.success("Question template deleted successfully");
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete template");
    } finally {
      setIsDeleting(false);
    }
  };

  const getQuestionCountText = (templateId: string) => {
    return "View Questions";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading question templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Complexity Questions
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage question templates for complexity assessment and pricing calculation
        </p>
      </div>

      <SettingsNavigation activeTab="complexity-questions" />

      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/settings/complexity-questions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {template.name}
                    {template.is_default && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {template.description || "No description"}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {getQuestionCountText(template.id)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <p>Created: {new Date(template.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!template.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(template)}
                      title="Set as default"
                    >
                      <StarOff className="h-4 w-4" />
                    </Button>
                  )}
                  <Link href={`/admin/settings/complexity-questions/${template.id}`}>
                    <Button variant="outline" size="sm">
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
      </div>

      {templates.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">No question templates found</p>
            <Link href="/admin/settings/complexity-questions/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Template
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{templateToDelete?.name}&quot;? This will also delete all questions and answer options within this template.
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
