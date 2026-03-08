/**
 * Answer Options API Routes
 * Handles CRUD operations for answer options within a question
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAnswerOption } from "@/lib/api/complexity-questions";

/**
 * POST /api/admin/complexity-questions/[templateId]/questions/[questionId]/options
 * Create a new answer option for a question
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; questionId: string }> }
) {
  try {
    await requireAdmin();

    const { questionId } = await params;
    const body = await request.json();

    // Validate required fields
    const { answerText, score } = body;

    if (!answerText || typeof answerText !== "string" || !answerText.trim()) {
      return NextResponse.json({ error: "Missing required field: answerText" }, { status: 400 });
    }

    if (score === undefined || typeof score !== "number" || score < 0) {
      return NextResponse.json(
        { error: "Missing or invalid field: score (must be a non-negative number)" },
        { status: 400 }
      );
    }

    const option = await createAnswerOption({
      question_id: questionId,
      answer_text: answerText.trim(),
      score,
      sort_order: 0, // Will be auto-assigned
    });

    return NextResponse.json(
      { message: "Answer option created successfully", option },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Answer option creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create answer option" },
      { status: 500 }
    );
  }
}
