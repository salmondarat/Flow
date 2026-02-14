"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { FormBuilder } from "@/components/admin/form-builder/form-builder";
import type { FormTemplateConfig } from "@/types/form-config";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type TemplateForm = z.infer<typeof templateSchema>;

const defaultConfig: FormTemplateConfig = {
  steps: [
    {
      id: "kit-info",
      order: 1,
      title: "Kit Information",
      description: "Tell us about your model kit",
      fields: [
        {
          id: "kit-name",
          key: "kit_name",
          type: "text",
          label: "Kit Name",
          placeholder: "e.g., MG RX-78-2 Gundam",
          required: true,
        },
        {
          id: "kit-model",
          key: "kit_model",
          type: "text",
          label: "Kit Model/Grade",
          placeholder: "e.g., MG 1/100",
          required: false,
        },
      ],
    },
    {
      id: "service-selection",
      order: 2,
      title: "Service Selection",
      description: "Choose the type of service you need",
      fields: [
        {
          id: "service-type",
          key: "service_type",
          type: "select",
          label: "Service Type",
          required: true,
          options: ["full_build", "repair", "repaint"],
        },
        {
          id: "complexity",
          key: "complexity",
          type: "select",
          label: "Complexity Level",
          required: true,
          options: ["low", "medium", "high"],
          defaultValue: "medium",
        },
      ],
    },
    {
      id: "additional-info",
      order: 3,
      title: "Additional Information",
      description: "Any special requests or notes?",
      fields: [
        {
          id: "notes",
          key: "notes",
          type: "textarea",
          label: "Notes",
          placeholder: "Describe any customizations, color preferences, etc.",
          required: false,
        },
      ],
    },
  ],
  serviceConfig: {
    services: [
      {
        id: "full_build",
        name: "Full Build",
        description: "Complete assembly of the kit",
      },
      {
        id: "repair",
        name: "Repair",
        description: "Fix broken or damaged parts",
      },
      {
        id: "repaint",
        name: "Repaint",
        description: "Custom paint job",
      },
    ],
  },
  pricingConfig: {
    basePrice: 5000,
    complexityMultiplier: {
      low: 1.0,
      medium: 1.5,
      high: 2.0,
    },
    servicePricing: {
      full_build: 1.0,
      repair: 0.8,
      repaint: 1.2,
    },
  },
};

export default function NewFormTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [config, setConfig] = useState<FormTemplateConfig>(defaultConfig);

  const form = useForm<TemplateForm>({
    // @ts-expect-error - resolver type mismatch
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      isDefault: false,
    },
  });

  const onSubmit = async (data: TemplateForm) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/form-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          isDefault: data.isDefault,
          version: 1,
          config,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.error) {
          toast.error(result.error);
        } else if (result.details) {
          toast.error(result.details[0]?.message || "Validation failed");
        } else {
          toast.error("Failed to create form template");
        }
        return;
      }

      toast.success("Form template created successfully!");
      router.push("/admin/settings/form-templates");
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuilderSave = (newConfig: FormTemplateConfig) => {
    setConfig(newConfig);
    setShowBuilder(false);
  };

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/admin/settings/form-templates"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form Templates
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        {showBuilder ? (
          <FormBuilder
            initialConfig={config}
            onSave={handleBuilderSave}
            onCancel={() => setShowBuilder(false)}
            isSaving={isSubmitting}
          />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold">New Form Template</h1>
              <p className="text-muted-foreground mt-2">
                Create a new order form template for clients
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Template Details</CardTitle>
                <CardDescription>
                  Enter the basic information for your form template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Template Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Standard Order Form"
                        {...form.register("name")}
                      />
                      {form.formState.errors.name && (
                        <p className="text-destructive mt-1 text-sm">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what this template is for..."
                        {...form.register("description")}
                      />
                      {form.formState.errors.description && (
                        <p className="text-destructive mt-1 text-sm">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isDefault"
                        checked={form.watch("isDefault")}
                        onCheckedChange={(checked) => form.setValue("isDefault", checked === true)}
                      />
                      <Label htmlFor="isDefault" className="cursor-pointer">
                        Set as default template
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setShowBuilder(true)}>
                      Configure Form Structure
                    </Button>
                    <div className="flex gap-2">
                      <Link href="/admin/settings/form-templates">
                        <Button type="button" variant="outline" disabled={isSubmitting}>
                          Cancel
                        </Button>
                      </Link>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Template"}
                      </Button>
                    </div>
                  </div>

                  {/* Config Summary */}
                  <div className="bg-muted/30 rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Current Configuration</h3>
                    <div className="text-muted-foreground space-y-1 text-sm">
                      <p>• {config.steps.length} step(s)</p>
                      <p>
                        • {config.steps.reduce((acc, step) => acc + step.fields.length, 0)} field(s)
                      </p>
                      <p>• {config.serviceConfig.services.length} service(s)</p>
                      <p>• Base price: ${(config.pricingConfig.basePrice / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
