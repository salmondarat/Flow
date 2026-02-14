"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Eye,
  Type,
  AlignLeft,
  CheckSquare,
  List,
  Hash,
  File,
} from "lucide-react";
import type { FormTemplateConfig, FormStep, FormField, FieldType } from "@/types/form-config";
import { formTemplateConfigSchema } from "@/lib/features/form-configuration/validation";

interface FormBuilderProps {
  initialConfig?: FormTemplateConfig;
  onSave: (config: FormTemplateConfig) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const fieldTypes: Array<{ type: FieldType; label: string; icon: React.ReactNode }> = [
  { type: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { type: "textarea", label: "Textarea", icon: <AlignLeft className="h-4 w-4" /> },
  { type: "select", label: "Select", icon: <List className="h-4 w-4" /> },
  { type: "checkbox", label: "Checkbox", icon: <CheckSquare className="h-4 w-4" /> },
  { type: "number", label: "Number", icon: <Hash className="h-4 w-4" /> },
  { type: "file", label: "File", icon: <File className="h-4 w-4" /> },
];

export function FormBuilder({
  initialConfig,
  onSave,
  onCancel,
  isSaving = false,
}: FormBuilderProps) {
  const [config, setConfig] = useState<FormTemplateConfig>(
    initialConfig || {
      steps: [],
      serviceConfig: {
        services: [
          { id: "full_build", name: "Full Build", description: "Complete assembly of the kit" },
          { id: "repair", name: "Repair", description: "Fix broken or damaged parts" },
          { id: "repaint", name: "Repaint", description: "Custom paint job" },
        ],
      },
      pricingConfig: {
        basePrice: 5000,
        complexityMultiplier: { low: 1.0, medium: 1.5, high: 2.0 },
        servicePricing: { full_build: 1.0, repair: 0.8, repaint: 1.2 },
      },
    }
  );

  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<{
    stepIndex: number;
    fieldIndex: number;
  } | null>(null);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);

  // Step management
  const addStep = () => {
    const newStep: FormStep = {
      id: `step-${Date.now()}`,
      order: config.steps.length + 1,
      title: `Step ${config.steps.length + 1}`,
      description: "",
      fields: [],
    };
    setConfig({ ...config, steps: [...config.steps, newStep] });
  };

  const updateStep = (index: number, updates: Partial<FormStep>) => {
    const newSteps = [...config.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setConfig({ ...config, steps: newSteps });
  };

  const deleteStep = (index: number) => {
    const newSteps = config.steps.filter((_, i) => i !== index);
    // Reorder remaining steps
    newSteps.forEach((step, i) => (step.order = i + 1));
    setConfig({ ...config, steps: newSteps });
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    const newSteps = [...config.steps];
    const [removed] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, removed);
    // Update orders
    newSteps.forEach((step, i) => (step.order = i + 1));
    setConfig({ ...config, steps: newSteps });
  };

  // Field management
  const addField = (stepIndex: number, type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      key: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
    };

    const newSteps = [...config.steps];
    newSteps[stepIndex].fields.push(newField);
    setConfig({ ...config, steps: newSteps });

    // Open edit dialog for the new field
    setEditingField({ stepIndex, fieldIndex: newSteps[stepIndex].fields.length - 1 });
    setShowFieldDialog(true);
  };

  const updateField = (stepIndex: number, fieldIndex: number, updates: Partial<FormField>) => {
    const newSteps = [...config.steps];
    newSteps[stepIndex].fields[fieldIndex] = {
      ...newSteps[stepIndex].fields[fieldIndex],
      ...updates,
    };
    setConfig({ ...config, steps: newSteps });
  };

  const deleteField = (stepIndex: number, fieldIndex: number) => {
    const newSteps = [...config.steps];
    newSteps[stepIndex].fields = newSteps[stepIndex].fields.filter((_, i) => i !== fieldIndex);
    setConfig({ ...config, steps: newSteps });
  };

  const moveField = (stepIndex: number, fromIndex: number, toIndex: number) => {
    const newSteps = [...config.steps];
    const fields = [...newSteps[stepIndex].fields];
    const [removed] = fields.splice(fromIndex, 1);
    fields.splice(toIndex, 0, removed);
    newSteps[stepIndex].fields = fields;
    setConfig({ ...config, steps: newSteps });
  };

  const handleSave = () => {
    // Validate config
    const result = formTemplateConfigSchema.safeParse(config);
    if (!result.success) {
      toast.error("Invalid configuration: " + result.error.errors[0].message);
      return;
    }

    onSave(config);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Form Builder</h2>
          <p className="text-muted-foreground text-sm">
            Configure the form structure, steps, and fields
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreviewDialog(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Steps */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Steps</CardTitle>
              <CardDescription>Define the multi-step form structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.steps.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <p>No steps yet. Add your first step to get started.</p>
                </div>
              ) : (
                config.steps.map((step, stepIndex) => (
                  <Card key={step.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="text-muted-foreground h-5 w-5 cursor-move" />
                          <div>
                            <CardTitle className="text-base">{step.title}</CardTitle>
                            {step.description && (
                              <CardDescription className="text-xs">
                                {step.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingStep(stepIndex)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteStep(stepIndex)}
                            disabled={isSaving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Fields in this step */}
                      <div className="space-y-2">
                        {step.fields.map((field, fieldIndex) => (
                          <div
                            key={field.id}
                            className="bg-muted/30 group flex items-center justify-between rounded border p-2"
                          >
                            <div className="flex items-center gap-2">
                              <GripVertical className="text-muted-foreground h-4 w-4 cursor-move" />
                              {fieldTypes.find((ft) => ft.type === field.type)?.icon}
                              <span className="text-sm">{field.label}</span>
                              {field.required && (
                                <span className="text-destructive text-xs">*</span>
                              )}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingField({ stepIndex, fieldIndex });
                                  setShowFieldDialog(true);
                                }}
                              >
                                <Settings className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteField(stepIndex, fieldIndex)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {/* Add field button */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {fieldTypes.map((ft) => (
                            <Button
                              key={ft.type}
                              variant="outline"
                              size="sm"
                              onClick={() => addField(stepIndex, ft.type)}
                              disabled={isSaving}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              {ft.icon}
                              <span className="ml-1">{ft.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          <Button onClick={addStep} disabled={isSaving} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        </div>

        {/* Service & Pricing Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Configure available services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {config.serviceConfig.services.map((service) => (
                  <div key={service.id} className="rounded border p-2 text-sm">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-muted-foreground text-xs">{service.description}</div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => setShowServiceDialog(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure Services
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set base pricing and multipliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="font-medium">
                    ${(config.pricingConfig.basePrice / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Low Multiplier</span>
                  <span className="font-medium">
                    {config.pricingConfig.complexityMultiplier.low}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Multiplier</span>
                  <span className="font-medium">
                    {config.pricingConfig.complexityMultiplier.medium}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>High Multiplier</span>
                  <span className="font-medium">
                    {config.pricingConfig.complexityMultiplier.high}x
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => setShowPricingDialog(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure Pricing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Step Edit Dialog */}
      <Dialog open={editingStep !== null} onOpenChange={() => setEditingStep(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Step</DialogTitle>
            <DialogDescription>Update the step title and description</DialogDescription>
          </DialogHeader>
          {editingStep !== null && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="step-title">Title</Label>
                <Input
                  id="step-title"
                  value={config.steps[editingStep]?.title || ""}
                  onChange={(e) => updateStep(editingStep, { title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="step-description">Description</Label>
                <Textarea
                  id="step-description"
                  value={config.steps[editingStep]?.description || ""}
                  onChange={(e) => updateStep(editingStep, { description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStep(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Field Edit Dialog */}
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>Configure the field properties</DialogDescription>
          </DialogHeader>
          {editingField && (
            <FieldEditor
              field={config.steps[editingField.stepIndex]?.fields[editingField.fieldIndex] ?? null}
              onChange={(updates) =>
                updateField(editingField.stepIndex, editingField.fieldIndex, updates)
              }
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFieldDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Configuration Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Services</DialogTitle>
            <DialogDescription>Define available services for clients</DialogDescription>
          </DialogHeader>
          <ServiceConfigEditor
            config={config.serviceConfig}
            onChange={(serviceConfig) => setConfig({ ...config, serviceConfig })}
          />
          <DialogFooter>
            <Button onClick={() => setShowServiceDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Configuration Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Pricing</DialogTitle>
            <DialogDescription>Set base price and multipliers</DialogDescription>
          </DialogHeader>
          <PricingConfigEditor
            config={config.pricingConfig}
            onChange={(pricingConfig) => setConfig({ ...config, pricingConfig })}
          />
          <DialogFooter>
            <Button onClick={() => setShowPricingDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Preview</DialogTitle>
            <DialogDescription>Preview how the form will appear to clients</DialogDescription>
          </DialogHeader>
          <FormPreview config={config} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Field Editor Component
function FieldEditor({
  field,
  onChange,
}: {
  field: FormField;
  onChange: (updates: Partial<FormField>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="field-label">Label</Label>
        <Input
          id="field-label"
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="field-key">Field Key</Label>
        <Input
          id="field-key"
          value={field.key}
          onChange={(e) => onChange({ key: e.target.value })}
        />
        <p className="text-muted-foreground mt-1 text-xs">
          Unique identifier for this field (use snake_case)
        </p>
      </div>
      <div>
        <Label htmlFor="field-placeholder">Placeholder</Label>
        <Input
          id="field-placeholder"
          value={field.placeholder || ""}
          onChange={(e) => onChange({ placeholder: e.target.value })}
        />
      </div>

      {field.type === "select" && (
        <div>
          <Label htmlFor="field-options">Options (comma-separated)</Label>
          <Textarea
            id="field-options"
            value={field.options?.join(", ") || ""}
            onChange={(e) =>
              onChange({
                options: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="option1, option2, option3"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="field-required"
          checked={field.required}
          onCheckedChange={(checked) => onChange({ required: checked === true })}
        />
        <Label htmlFor="field-required">Required field</Label>
      </div>

      {/* Validation for number fields */}
      {field.type === "number" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="field-min">Minimum</Label>
            <Input
              id="field-min"
              type="number"
              value={field.validation?.min ?? ""}
              onChange={(e) =>
                onChange({
                  validation: {
                    ...field.validation,
                    min: e.target.value ? Number(e.target.value) : undefined,
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="field-max">Maximum</Label>
            <Input
              id="field-max"
              type="number"
              value={field.validation?.max ?? ""}
              onChange={(e) =>
                onChange({
                  validation: {
                    ...field.validation,
                    max: e.target.value ? Number(e.target.value) : undefined,
                  },
                })
              }
            />
          </div>
        </div>
      )}

      {/* Validation for text fields */}
      {(field.type === "text" || field.type === "textarea") && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="field-min-length">Min Length</Label>
            <Input
              id="field-min-length"
              type="number"
              value={field.validation?.minLength ?? ""}
              onChange={(e) =>
                onChange({
                  validation: {
                    ...field.validation,
                    minLength: e.target.value ? Number(e.target.value) : undefined,
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="field-max-length">Max Length</Label>
            <Input
              id="field-max-length"
              type="number"
              value={field.validation?.maxLength ?? ""}
              onChange={(e) =>
                onChange({
                  validation: {
                    ...field.validation,
                    maxLength: e.target.value ? Number(e.target.value) : undefined,
                  },
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Service Config Editor Component
function ServiceConfigEditor({
  config,
  onChange,
}: {
  config: FormTemplateConfig["serviceConfig"];
  onChange: (config: FormTemplateConfig["serviceConfig"]) => void;
}) {
  return (
    <div className="space-y-4">
      {config.services.map((service, index) => (
        <div key={service.id} className="space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Service {index + 1}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newServices = config.services.filter((_, i) => i !== index);
                onChange({ ...config, services: newServices });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Label>ID</Label>
            <Input
              value={service.id}
              onChange={(e) => {
                const newServices = [...config.services];
                newServices[index] = { ...service, id: e.target.value };
                onChange({ ...config, services: newServices });
              }}
            />
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={service.name}
              onChange={(e) => {
                const newServices = [...config.services];
                newServices[index] = { ...service, name: e.target.value };
                onChange({ ...config, services: newServices });
              }}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={service.description}
              onChange={(e) => {
                const newServices = [...config.services];
                newServices[index] = { ...service, description: e.target.value };
                onChange({ ...config, services: newServices });
              }}
            />
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onChange({
            ...config,
            services: [
              ...config.services,
              { id: `service-${Date.now()}`, name: "New Service", description: "" },
            ],
          });
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Service
      </Button>
    </div>
  );
}

// Pricing Config Editor Component
function PricingConfigEditor({
  config,
  onChange,
}: {
  config: FormTemplateConfig["pricingConfig"];
  onChange: (config: FormTemplateConfig["pricingConfig"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="base-price">Base Price (cents)</Label>
        <Input
          id="base-price"
          type="number"
          value={config.basePrice}
          onChange={(e) => onChange({ ...config, basePrice: Number(e.target.value) })}
        />
        <p className="text-muted-foreground mt-1 text-xs">
          Current: ${(config.basePrice / 100).toFixed(2)}
        </p>
      </div>

      <div>
        <Label>Complexity Multipliers</Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="mult-low" className="text-xs">
              Low
            </Label>
            <Input
              id="mult-low"
              type="number"
              step="0.1"
              value={config.complexityMultiplier.low}
              onChange={(e) =>
                onChange({
                  ...config,
                  complexityMultiplier: {
                    ...config.complexityMultiplier,
                    low: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="mult-medium" className="text-xs">
              Medium
            </Label>
            <Input
              id="mult-medium"
              type="number"
              step="0.1"
              value={config.complexityMultiplier.medium}
              onChange={(e) =>
                onChange({
                  ...config,
                  complexityMultiplier: {
                    ...config.complexityMultiplier,
                    medium: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="mult-high" className="text-xs">
              High
            </Label>
            <Input
              id="mult-high"
              type="number"
              step="0.1"
              value={config.complexityMultiplier.high}
              onChange={(e) =>
                onChange({
                  ...config,
                  complexityMultiplier: {
                    ...config.complexityMultiplier,
                    high: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Service Pricing Multipliers</Label>
        <div className="mt-2 space-y-2">
          {config.servicePricing.full_build !== undefined && (
            <div className="flex items-center gap-2">
              <Label htmlFor="sp-full" className="w-24 text-sm">
                Full Build
              </Label>
              <Input
                id="sp-full"
                type="number"
                step="0.1"
                value={config.servicePricing.full_build}
                onChange={(e) =>
                  onChange({
                    ...config,
                    servicePricing: {
                      ...config.servicePricing,
                      full_build: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          )}
          {config.servicePricing.repair !== undefined && (
            <div className="flex items-center gap-2">
              <Label htmlFor="sp-repair" className="w-24 text-sm">
                Repair
              </Label>
              <Input
                id="sp-repair"
                type="number"
                step="0.1"
                value={config.servicePricing.repair}
                onChange={(e) =>
                  onChange({
                    ...config,
                    servicePricing: { ...config.servicePricing, repair: Number(e.target.value) },
                  })
                }
              />
            </div>
          )}
          {config.servicePricing.repaint !== undefined && (
            <div className="flex items-center gap-2">
              <Label htmlFor="sp-repaint" className="w-24 text-sm">
                Repaint
              </Label>
              <Input
                id="sp-repaint"
                type="number"
                step="0.1"
                value={config.servicePricing.repaint}
                onChange={(e) =>
                  onChange({
                    ...config,
                    servicePricing: { ...config.servicePricing, repaint: Number(e.target.value) },
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Form Preview Component
function FormPreview({ config }: { config: FormTemplateConfig }) {
  return (
    <div className="space-y-6">
      {config.steps.map((step, index) => (
        <Card key={step.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              Step {step.order}: {step.title}
            </CardTitle>
            {step.description && <CardDescription>{step.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {step.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={`preview-${field.id}`}>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {field.type === "text" && (
                  <Input id={`preview-${field.id}`} placeholder={field.placeholder} disabled />
                )}
                {field.type === "textarea" && (
                  <Textarea id={`preview-${field.id}`} placeholder={field.placeholder} disabled />
                )}
                {field.type === "select" && (
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || "Select..."} />
                    </SelectTrigger>
                  </Select>
                )}
                {field.type === "checkbox" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`preview-${field.id}`} disabled />
                    <Label htmlFor={`preview-${field.id}`} className="text-sm font-normal">
                      {field.placeholder || "Check this option"}
                    </Label>
                  </div>
                )}
                {field.type === "number" && (
                  <Input
                    id={`preview-${field.id}`}
                    type="number"
                    placeholder={field.placeholder}
                    disabled
                  />
                )}
                {field.type === "file" && (
                  <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
                    File upload field
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
