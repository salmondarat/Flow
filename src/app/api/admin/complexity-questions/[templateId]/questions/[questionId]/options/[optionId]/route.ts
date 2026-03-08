/**
 * Individual Answer Option API Routes
 * Handles PUT and DELETE operations for a specific answer option
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { updateAnswerOption, deleteAnswerOption } from "@/lib/api/complexity-questions";

/**
 * PUT /api/admin/complexity-questions/[templateId]/questions/[questionId]/options/[optionId]
 * Update an existing answer option
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; questionId: string; optionId: string }> }
) {
  try {
    await requireAdmin();

    const { optionId } = await params;
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

    const option = await updateAnswerOption(optionId, {
      answer_text: answerText.trim(),
      score,
    });

    return NextResponse.json({ message: "Answer option updated successfully", option });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Answer option update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update answer option" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/complexity-questions/[templateId]/questions/[questionId]/options/[optionId]
 * Delete an answer option
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; questionId: string; optionId: string }> }
) {
  try {
    await requireAdmin();

    const { optionId } = await params;

    await deleteAnswerOption(optionId);

    return NextResponse.json({ message: "Answer option deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Answer option delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete answer option" },
      { status: 500 }
    );
  }
}
