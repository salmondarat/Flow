/**
 * Complexity Questions API Routes
 * Handles CRUD operations for questions within a template
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createQuestion, getQuestionsByTemplateId } from "@/lib/api/complexity-questions";

/**
 * GET /api/admin/complexity-questions/[templateId]/questions
 * Fetch all questions for a template
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    await requireAdmin();

    const { templateId } = await params;
    const questions = await getQuestionsByTemplateId(templateId);

    return NextResponse.json({ questions });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Questions fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/complexity-questions/[templateId]/questions
 * Create a new question for a template
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    await requireAdmin();

    const { templateId } = await params;
    const body = await request.json();

    // Validate required fields
    const { questionText } = body;

    if (!questionText || typeof questionText !== "string" || !questionText.trim()) {
      return NextResponse.json({ error: "Missing required field: questionText" }, { status: 400 });
    }

    const question = await createQuestion({
      template_id: templateId,
      question_text: questionText.trim(),
      sort_order: 0, // Will be auto-assigned
    });

    return NextResponse.json(
      { message: "Question created successfully", question },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Question creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create question" },
      { status: 500 }
    );
  }
}
