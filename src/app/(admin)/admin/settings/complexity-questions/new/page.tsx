/**
 * New Question Template Page
 * Allows admins to create a new complexity question template
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function NewQuestionTemplatePage() {
  unstable_noStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
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
      const response = await fetch("/api/admin/complexity-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          isDefault: formData.isDefault,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create question template");
      }

      const data = await response.json();
      toast.success("Question template created successfully");

      // Redirect to the edit page to add questions
      router.push(`/admin/settings/complexity-questions/${data.template.id}`);
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create question template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/admin/settings/complexity-questions"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Question Templates
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">New Question Template</h1>
            <p className="text-muted-foreground mt-2">
              Create a new question template for complexity assessment
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>
                Enter the basic information for the new question template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Standard Assessment"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                  />
                  {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose of this question template..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                  />
                  <p className="text-muted-foreground text-xs">
                    Optional description to help identify this template&apos;s purpose
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isDefault: checked === true }))
                    }
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Set as default template
                  </Label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link href="/admin/settings/complexity-questions">
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
                      "Create Template"
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
