"use client";

import { unstable_noStore } from "next/cache";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DynamicForm } from "@/components/form/dynamic-form";
import { ComplexityQuestionnaire } from "@/components/public/complexity-questionnaire";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FormTemplateConfig, KitFormItem } from "@/types/form-config";
import type { ComplexityQuestionWithAnswers, ComplexityCalculationResult } from "@/types";

interface KitWithComplexity extends KitFormItem {
  complexity_score?: number;
  complexity_tier_id?: string;
  complexity_calculation?: ComplexityCalculationResult;
  complexity_answers?: Array<{ question_id: string; answer_option_id: string; score: number }>;
}

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function ClientNewOrderPage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState<FormTemplateConfig | null>(null);
  const [kits, setKits] = useState<KitWithComplexity[]>([]);
  const [currentKitIndex, setCurrentKitIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Complexity questionnaire state
  const [questionTemplate, setQuestionTemplate] = useState<{
    questions: ComplexityQuestionWithAnswers[];
  } | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentKitCalculation, setCurrentKitCalculation] =
    useState<ComplexityCalculationResult | null>(null);

  useEffect(() => {
    fetchTemplate();
    fetchQuestionTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      const response = await fetch("/api/form-templates/default");

      if (!response.ok) {
        throw new Error("Failed to fetch form template");
      }

      const result = await response.json();
      setTemplate(result.template.config);

      // Initialize with one empty kit
      setKits([{ kit_name: "", service_type: "full_build", complexity: "medium" }]);
    } catch (error) {
      console.error("Error fetching template:", error);
      toast.error("Failed to load form template");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestionTemplate = async () => {
    try {
      const response = await fetch("/api/admin/complexity-questions?includeInactive=false");
      if (response.ok) {
        const data = await response.json();
        // Use the default template or the first available one
        const defaultTemplate =
          data.templates.find((t: { is_default: boolean }) => t.is_default) || data.templates[0];
        if (defaultTemplate) {
          // Fetch full template with questions
          const templateResponse = await fetch(
            `/api/admin/complexity-questions/${defaultTemplate.id}`
          );
          if (templateResponse.ok) {
            const templateData = await templateResponse.json();
            setQuestionTemplate({ questions: templateData.questions || [] });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching question template:", error);
      // Non-critical error - questionnaire is optional
    }
  };

  const handleAddKit = (data: Record<string, unknown>) => {
    const updatedKits = [...kits];
    const kitData: KitWithComplexity = {
      kit_name: data.kit_name as string,
      kit_model: data.kit_model as string | undefined,
      service_type: data.service_type as "full_build" | "repair" | "repaint",
      complexity: data.complexity as "low" | "medium" | "high",
      notes: data.notes as string | undefined,
    };

    // If we have complexity calculation from questionnaire, add it
    if (currentKitCalculation) {
      kitData.complexity_score = currentKitCalculation.total_score;
      kitData.complexity_tier_id = currentKitCalculation.tier_id || undefined;
      kitData.complexity_calculation = currentKitCalculation;
    }

    updatedKits[currentKitIndex] = kitData;
    setKits(updatedKits);

    // Show questionnaire for complexity assessment if available
    if (questionTemplate && questionTemplate.questions.length > 0) {
      setShowQuestionnaire(true);
    } else {
      // Add new empty kit or move to next
      if (currentKitIndex < kits.length - 1) {
        setCurrentKitIndex(currentKitIndex + 1);
        setCurrentKitCalculation(null);
      } else {
        setKits([
          ...updatedKits,
          { kit_name: "", service_type: "full_build", complexity: "medium" },
        ]);
        setCurrentKitIndex(updatedKits.length);
        setCurrentKitCalculation(null);
      }
    }
  };

  const handleComplexityCalculated = (
    calculation: ComplexityCalculationResult,
    answers: Array<{ question_id: string; answer_option_id: string; score: number }>
  ) => {
    setCurrentKitCalculation(calculation);

    // Update current kit with complexity data
    const updatedKits = [...kits];
    if (updatedKits[currentKitIndex]) {
      updatedKits[currentKitIndex] = {
        ...updatedKits[currentKitIndex],
        complexity_score: calculation.total_score,
        complexity_tier_id: calculation.tier_id || undefined,
        complexity_calculation: calculation,
        complexity_answers: answers,
        // Also update the legacy complexity field for backward compatibility
        complexity: (calculation.tier_name?.toLowerCase() as "low" | "medium" | "high") || "medium",
      };
      setKits(updatedKits);
    }
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);

    // Add new empty kit or move to next
    if (currentKitIndex < kits.length - 1) {
      setCurrentKitIndex(currentKitIndex + 1);
      setCurrentKitCalculation(null);
    } else {
      const updatedKits = [...kits];
      setKits([...updatedKits, { kit_name: "", service_type: "full_build", complexity: "medium" }]);
      setCurrentKitIndex(updatedKits.length);
      setCurrentKitCalculation(null);
    }
  };

  const handleSkipQuestionnaire = () => {
    setShowQuestionnaire(false);

    // Add new empty kit or move to next
    if (currentKitIndex < kits.length - 1) {
      setCurrentKitIndex(currentKitIndex + 1);
      setCurrentKitCalculation(null);
    } else {
      const updatedKits = [...kits];
      setKits([...updatedKits, { kit_name: "", service_type: "full_build", complexity: "medium" }]);
      setCurrentKitIndex(updatedKits.length);
      setCurrentKitCalculation(null);
    }
  };

  const handleSubmitOrder = async () => {
    const validKits = kits.filter((k) => k.kit_name);
    if (validKits.length === 0) {
      toast.error("Please add at least one kit to your order");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/client/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_items: validKits.map((kit) => ({
            kit_name: kit.kit_name,
            kit_model: kit.kit_model,
            service_type: kit.service_type,
            complexity: kit.complexity,
            notes: kit.notes,
            complexity_score: kit.complexity_score,
            complexity_tier_id: kit.complexity_tier_id,
            complexity_answers: kit.complexity_answers,
          })),
          notes: "",
          status: "draft",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order");
      }

      toast.success("Order created successfully!");

      setTimeout(() => {
        router.push(`/client/orders/${result.order.id}`);
      }, 500);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveKit = (index: number) => {
    if (kits.length <= 1) {
      toast.error("You must have at least one kit in your order");
      return;
    }

    const updatedKits = kits.filter((_, i) => i !== index);
    setKits(updatedKits);

    if (currentKitIndex >= updatedKits.length) {
      setCurrentKitIndex(updatedKits.length - 1);
    }

    // Reset calculation if we removed the current kit
    if (index === currentKitIndex) {
      setCurrentKitCalculation(null);
      setShowQuestionnaire(false);
    }
  };

  const handleSelectKit = (index: number) => {
    setCurrentKitIndex(index);
    setShowQuestionnaire(false);
    setCurrentKitCalculation(kits[index]?.complexity_calculation || null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading order form...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Failed to load form template</p>
      </div>
    );
  }

  const currentKit = kits[currentKitIndex] || {
    kit_name: "",
    service_type: "full_build",
    complexity: "medium",
  };

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            href="/client/orders"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Create New Order</h1>
            <p className="text-muted-foreground mt-2">
              Add kits to your order and fill in the details for each one
            </p>
          </div>

          {/* Kit Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kits</CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setKits([
                      ...kits,
                      { kit_name: "", service_type: "full_build", complexity: "medium" },
                    ]);
                    setCurrentKitIndex(kits.length);
                    setShowQuestionnaire(false);
                    setCurrentKitCalculation(null);
                  }}
                  disabled={isSubmitting}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Kit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {kits.map((kit, index) => (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectKit(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectKit(index);
                      }
                    }}
                    className={`relative inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      index === currentKitIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    <span>Kit {index + 1}</span>
                    {kit.kit_name && (
                      <>
                        <span>·</span>
                        <span className="max-w-[150px] truncate">{kit.kit_name}</span>
                      </>
                    )}
                    {kit.complexity_calculation && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {kit.complexity_calculation.tier_name}
                      </Badge>
                    )}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveKit(index);
                        }}
                        className="text-destructive hover:text-destructive/80 ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Kit Form */}
          {!showQuestionnaire && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Kit {currentKitIndex + 1} Details</h2>

              <DynamicForm
                template={template}
                onSubmit={handleAddKit}
                submitLabel={
                  questionTemplate && questionTemplate.questions.length > 0
                    ? "Save & Assess Complexity"
                    : currentKitIndex < kits.length - 1
                      ? "Save & Next Kit"
                      : "Save Kit"
                }
                initialData={currentKit as any}
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Complexity Questionnaire */}
          {showQuestionnaire && questionTemplate && questionTemplate.questions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Calculator className="h-5 w-5" />
                  Complexity Assessment
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSkipQuestionnaire}>
                    Skip Assessment
                  </Button>
                  {currentKitCalculation && (
                    <Button onClick={handleQuestionnaireComplete}>Continue</Button>
                  )}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Kit: {currentKit.kit_name || `Kit ${currentKitIndex + 1}`}</CardTitle>
                  <CardDescription>
                    Answer the following questions to help us assess the complexity and provide an
                    accurate price estimate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ComplexityQuestionnaireWrapper
                    questions={questionTemplate.questions}
                    onCalculationComplete={handleComplexityCalculated}
                    kitServiceType={currentKit.service_type}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Submit Order */}
          {kits.some((k) => k.kit_name) && !showQuestionnaire && (
            <Card>
              <CardHeader>
                <CardTitle>Review Order</CardTitle>
                <CardDescription>
                  You have {kits.filter((k) => k.kit_name).length} kit(s) in your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show complexity summary */}
                  {kits.some((k) => k.complexity_calculation) && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="mb-2 font-medium">Complexity Assessment Summary</h4>
                      <div className="space-y-2">
                        {kits
                          .filter((k) => k.kit_name && k.complexity_calculation)
                          .map((kit, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="max-w-[200px] truncate">{kit.kit_name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  Score: {kit.complexity_calculation?.total_score}
                                </Badge>
                                <Badge>{kit.complexity_calculation?.tier_name}</Badge>
                                {kit.complexity_calculation?.estimated_min_price_cents && (
                                  <span className="text-muted-foreground">
                                    $
                                    {(
                                      kit.complexity_calculation.estimated_min_price_cents / 100
                                    ).toFixed(0)}
                                    - $
                                    {(
                                      kit.complexity_calculation.estimated_max_price_cents! / 100
                                    ).toFixed(0)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Ready to submit your order?</p>
                    </div>
                    <Button size="lg" onClick={handleSubmitOrder} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Order"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

// Wrapper component to handle questionnaire state and API calls
interface ComplexityQuestionnaireWrapperProps {
  questions: ComplexityQuestionWithAnswers[];
  onCalculationComplete: (
    calculation: ComplexityCalculationResult,
    answers: Array<{ question_id: string; answer_option_id: string; score: number }>
  ) => void;
  kitServiceType: string;
}

function ComplexityQuestionnaireWrapper({
  questions,
  onCalculationComplete,
  kitServiceType,
}: ComplexityQuestionnaireWrapperProps) {
  const [selections, setSelections] = useState<
    Array<{ question_id: string; answer_option_id: string }>
  >([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize selections
  useEffect(() => {
    if (questions.length > 0 && selections.length === 0) {
      const initialSelections = questions.map((q) => ({
        question_id: q.id,
        answer_option_id: q.answer_options[0]?.id ?? "",
      }));
      setSelections(initialSelections);
    }
  }, [questions]);

  // Calculate when all questions are answered
  useEffect(() => {
    const calculateComplexity = async () => {
      if (selections.length === 0) return;

      const answeredCount = selections.filter((s) => s.answer_option_id !== "").length;
      if (answeredCount !== questions.length) return;

      setIsCalculating(true);
      try {
        const answersParam = selections
          .filter((s) => s.answer_option_id !== "")
          .map((s) => `${s.question_id}:${s.answer_option_id}`)
          .join(",");

        const response = await fetch(
          `/api/complexity/calculate?answers=${encodeURIComponent(answersParam)}`
        );

        if (response.ok) {
          const data = await response.json();
          const answersWithScores = selections.map((s) => {
            const question = questions.find((q) => q.id === s.question_id);
            const option = question?.answer_options.find((o) => o.id === s.answer_option_id);
            return {
              question_id: s.question_id,
              answer_option_id: s.answer_option_id,
              score: option?.score || 0,
            };
          });
          onCalculationComplete(data.result, answersWithScores);
        }
      } catch (error) {
        console.error("Calculation error:", error);
      } finally {
        setIsCalculating(false);
      }
    };

    const timer = setTimeout(calculateComplexity, 500);
    return () => clearTimeout(timer);
  }, [selections, questions]);

  return (
    <ComplexityQuestionnaire
      questions={questions}
      onSelectionsChange={setSelections}
      disabled={isCalculating}
      isLoading={false}
    />
  );
}
