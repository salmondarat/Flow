/**
 * ComplexityQuestionnaire component
 * Allows clients to answer complexity questions with real-time price calculation
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type {
  ComplexityQuestionWithAnswers,
  ComplexityCalculationResult,
  ComplexityAnswerSelection,
} from "@/types";

interface ComplexityQuestionnaireProps {
  questions: ComplexityQuestionWithAnswers[];
  onSelectionsChange: (selections: ComplexityAnswerSelection[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  basePriceCents?: number;
}

export function ComplexityQuestionnaire({
  questions,
  onSelectionsChange,
  disabled = false,
  isLoading = false,
  basePriceCents = 0,
}: ComplexityQuestionnaireProps) {
  const [selections, setSelections] = useState<ComplexityAnswerSelection[]>([]);
  const [calculationResult, setCalculationResult] = useState<ComplexityCalculationResult | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize selections with first option for each question
  useEffect(() => {
    if (questions.length > 0 && selections.length === 0) {
      const initialSelections = questions.map((q) => ({
        question_id: q.id,
        answer_option_id: q.answer_options[0]?.id ?? "",
      }));
      setSelections(initialSelections);
    }
  }, [questions]);

  // Calculate when selections change
  useEffect(() => {
    if (selections.length === 0) return;

    const calculateComplexity = async () => {
      setIsCalculating(true);

      try {
        // Check if all questions have been answered
        const answeredCount = selections.filter((s) => s.answer_option_id !== "").length;
        const allAnswered = answeredCount === questions.length;
        setIsValid(allAnswered);

        if (allAnswered) {
          // Format answers for API
          const answersParam = selections
            .filter((s) => s.answer_option_id !== "")
            .map((s) => `${s.question_id}:${s.answer_option_id}`)
            .join(",");

          // Call the calculation API
          const response = await fetch(
            `/api/complexity/calculate?answers=${encodeURIComponent(answersParam)}${basePriceCents ? `&serviceTypeId=` : ""}`
          );

          if (response.ok) {
            const data = await response.json();
            setCalculationResult(data.result);
          }
        } else {
          setCalculationResult(null);
        }
      } catch (error) {
        console.error("Calculation error:", error);
      } finally {
        setIsCalculating(false);
      }
    };

    // Debounce calculation
    const timer = setTimeout(calculateComplexity, 300);
    return () => clearTimeout(timer);
  }, [selections, questions, basePriceCents]);

  const handleSelectionChange = useCallback(
    (questionId: string, answerOptionId: string) => {
      setSelections((prev) =>
        prev.map((s) =>
          s.question_id === questionId
            ? { question_id: questionId, answer_option_id: answerOptionId }
            : s
        )
      );
    },
    []
  );

  const formatPrice = (cents: number | null) => {
    if (cents === null) return "-";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getTierColor = (tierName: string | null) => {
    if (!tierName) return "text-muted-foreground";
    switch (tierName.toLowerCase()) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-primary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading questions...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center">
        <p className="text-muted-foreground text-sm">No complexity questions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const currentSelection = selections.find((s) => s.question_id === question.id);
          const questionDisabled = disabled || isCalculating;

          return (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {index + 1}. {question.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={currentSelection?.answer_option_id ?? ""}
                  onValueChange={(value) =>
                    handleSelectionChange(question.id, value)
                  }
                  disabled={questionDisabled}
                  className="space-y-3"
                >
                  {question.answer_options.map((option) => (
                    <div key={option.id} className="flex items-start space-x-2">
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="mt-1"
                      >
                        <Label htmlFor={option.id} className="font-normal cursor-pointer">
                          {option.answer_text}
                        </Label>
                      </RadioGroupItem>
                      <span className="text-sm text-muted-foreground ml-2">
                        (+{option.score})
                      </span>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calculation Result */}
      {isCalculating ? (
        <div className="flex items-center justify-center py-4 bg-muted/20 rounded-md">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm">Calculating complexity...</span>
        </div>
      ) : calculationResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Complexity Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Score */}
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Score:</span>
              <span className="text-2xl font-bold">
                {calculationResult.total_score}
              </span>
            </div>

            {/* Tier */}
            <div className="flex justify-between items-center">
              <span className="text-sm">Complexity Tier:</span>
              <span className={`text-xl font-semibold ${getTierColor(calculationResult.tier_name)}`}>
                {calculationResult.tier_name || "Unknown"}
              </span>
            </div>

            {/* Multiplier */}
            <div className="flex justify-between items-center">
              <span className="text-sm">Price Multiplier:</span>
              <span className="text-lg font-semibold">
                {calculationResult.multiplier?.toFixed(2)}x
              </span>
            </div>

            {/* Estimated Price Range */}
            {calculationResult.estimated_min_price_cents !== null &&
              calculationResult.estimated_max_price_cents !== null && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Estimated Price:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(calculationResult.estimated_min_price_cents)} -{" "}
                    {formatPrice(calculationResult.estimated_max_price_cents)}
                  </span>
                </div>
              </div>
            )}

            {/* Validation Warning */}
            {!isValid && (
              <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md mt-4">
                Please answer all questions to get an accurate price estimate.
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
