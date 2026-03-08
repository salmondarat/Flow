/**
 * Individual Question API Routes
 * Handles PUT and DELETE operations for a specific question
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import {
  updateQuestion,
  deleteQuestion,
  getQuestionsByTemplateId,
} from "@/lib/api/complexity-questions";

/**
 * PUT /api/admin/complexity-questions/[templateId]/questions/[questionId]
 * Update an existing question
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; questionId: string }> }
) {
  try {
    await requireAdmin();

    const { questionId } = await params;
    const body = await request.json();

    // Validate required fields
    const { questionText } = body;

    if (!questionText || typeof questionText !== "string" || !questionText.trim()) {
      return NextResponse.json({ error: "Missing required field: questionText" }, { status: 400 });
    }

    const question = await updateQuestion(questionId, {
      question_text: questionText.trim(),
    });

    return NextResponse.json({ message: "Question updated successfully", question });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Question update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update question" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/complexity-questions/[templateId]/questions/[questionId]
 * Delete a question (cascades to answer options)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; questionId: string }> }
) {
  try {
    await requireAdmin();

    const { questionId } = await params;

    await deleteQuestion(questionId);

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Question delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete question" },
      { status: 500 }
    );
  }
}
