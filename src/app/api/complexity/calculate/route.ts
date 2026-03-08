/**
 * Complexity Calculation API Routes
 * Public API for clients to calculate complexity and get pricing
 */

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import {
  getDefaultQuestionTemplate,
  getQuestionTemplateWithQuestions,
} from "@/lib/api/complexity-questions";
import { getComplexityTiers } from "@/lib/api/complexity-tiers";
import {
  calculateTotalScore,
  determineTierByScore,
  calculatePriceRange,
} from "@/lib/complexity/calculation";
import type { ComplexityAnswerSelection, ComplexityCalculationResult } from "@/types";

/**
 * GET /api/complexity/calculate
 * Get complexity calculation based on answers and service type
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("templateId");
    const serviceTypeId = searchParams.get("serviceTypeId");
    const answersParam = searchParams.get("answers");

    if (!answersParam) {
      return NextResponse.json(
        { error: "Missing required parameter: answers" },
        { status: 400 }
      );
    }

    // Parse answers (format: question_id:answer_option_id,...)
    const answers: ComplexityAnswerSelection[] = answersParam.split(",").map((a) => {
      const [questionId, answerOptionId] = a.split(":");
      return { question_id: questionId, answer_option_id: answerOptionId };
    });

    // Get template and questions
    let templateWithQuestions;
    if (templateId) {
      templateWithQuestions = await getQuestionTemplateWithQuestions(templateId);
    } else {
      // Use default template
      const defaultTemplate = await getDefaultQuestionTemplate();
      if (defaultTemplate) {
        templateWithQuestions = await getQuestionTemplateWithQuestions(defaultTemplate.id);
      }
    }

    if (!templateWithQuestions) {
      return NextResponse.json(
        { error: "No complexity questions available" },
        { status: 404 }
      );
    }

    // Get all tiers
    const tiers = await getComplexityTiers({ activeOnly: true });

    // Calculate total score
    const totalScore = calculateTotalScore(
      templateWithQuestions.questions,
      answers
    );

    // Determine tier
    const tier = determineTierByScore(totalScore, tiers);

    // Calculate price range (optional: if serviceTypeId provided)
    let priceRange: {
      minPriceCents: number;
      maxPriceCents: number;
      multiplier: number;
    } | null = null;

    if (tier && serviceTypeId) {
      // For now, we'd need to fetch service base price
      // This is a simplified version - the full implementation would fetch service details
      priceRange = calculatePriceRange(0, tier, null);
    }

    const result: ComplexityCalculationResult = {
      total_score: totalScore,
      tier_id: tier?.id ?? null,
      tier_name: tier?.name ?? null,
      multiplier: priceRange?.multiplier ?? tier?.multiplier ?? null,
      estimated_min_price_cents: priceRange?.minPriceCents ?? null,
      estimated_max_price_cents: priceRange?.maxPriceCents ?? null,
    };

    return NextResponse.json({
      result,
      questions: templateWithQuestions.questions,
      tier,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "User access required") {
      return NextResponse.json({ error: "User access required" }, { status: 403 });
    }
    console.error("Complexity calculation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to calculate complexity" },
      { status: 500 }
    );
  }
}
