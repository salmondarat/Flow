"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormFieldRenderer } from "@/components/form-fields/form-field-renderer";
import type { FormTemplateConfig, FormStep } from "@/types/form-config";
import { validateFormData } from "@/lib/features/form-configuration/validation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface DynamicFormProps {
  template: FormTemplateConfig;
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
  initialData?: Record<string, unknown>;
}

export function DynamicForm({
  template,
  onSubmit,
  submitLabel = "Submit",
  disabled = false,
  initialData = {},
}: DynamicFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = template.steps.sort((a, b) => a.order - b.order);
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleFieldChange = useCallback(
    (fieldKey: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [fieldKey]: value }));
      // Clear error when value changes
      if (errors[fieldKey]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldKey];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateCurrentStep = useCallback(() => {
    const stepErrors: Record<string, string> = {};

    for (const field of currentStepData.fields) {
      const value = values[field.key];

      // Check required fields
      if (field.required && (value === null || value === undefined || value === "")) {
        stepErrors[field.key] = `${field.label} is required`;
        continue;
      }

      // Type-specific validation
      if (field.type === "select" && field.options && !field.options.includes(value as string)) {
        stepErrors[field.key] = `${field.label} must be one of the allowed options`;
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [currentStepData.fields, values]);

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (isLastStep) {
      // Validate entire form
      const validation = validateFormData(template, values);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          {currentStepData.description && (
            <CardDescription>{currentStepData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepData.fields.map((field) => (
            <FormFieldRenderer
              key={field.id}
              field={field}
              value={values[field.key]}
              onChange={(value) => handleFieldChange(field.key, value)}
              error={errors[field.key]}
              disabled={disabled || isSubmitting}
            />
          ))}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep || disabled || isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button type="button" onClick={handleNext} disabled={disabled || isSubmitting}>
          {isSubmitting ? "Submitting..." : isLastStep ? submitLabel : "Next"}
          {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => index < currentStep && setCurrentStep(index)}
            disabled={index > currentStep || disabled || isSubmitting}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentStep
                ? "bg-primary w-8"
                : index < currentStep
                  ? "bg-primary"
                  : "bg-muted"
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
