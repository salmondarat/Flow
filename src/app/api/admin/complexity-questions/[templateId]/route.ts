/**
 * Complexity Question Template Individual API Routes
 * Handles GET, PUT, DELETE operations for a specific template
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import {
  getQuestionTemplateById,
  getQuestionTemplateWithQuestions,
  updateQuestionTemplate,
  deleteQuestionTemplate,
} from "@/lib/api/complexity-questions";
import type { ComplexityQuestionTemplateUpdate } from "@/types";

/**
 * GET /api/admin/complexity-questions/[templateId]
 * Fetch a single question template by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    await requireAdmin();

    const { templateId } = await params;
    const templateWithQuestions = await getQuestionTemplateWithQuestions(templateId);

    if (!templateWithQuestions) {
      return NextResponse.json({ error: "Question template not found" }, { status: 404 });
    }

    return NextResponse.json({
      template: {
        id: templateWithQuestions.id,
        name: templateWithQuestions.name,
        description: templateWithQuestions.description,
        is_default: templateWithQuestions.is_default,
        created_by: templateWithQuestions.created_by,
        created_at: templateWithQuestions.created_at,
        updated_at: templateWithQuestions.updated_at,
      },
      questions: templateWithQuestions.questions,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Question template fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/complexity-questions/[templateId]
 * Update an existing question template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    await requireAdmin();

    const { templateId } = await params;
    const body = await request.json();

    // Validate that at least one field is being updated
    const { name, description } = body;

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return NextResponse.json({ error: "Name must be a non-empty string" }, { status: 400 });
    }

    const updates: ComplexityQuestionTemplateUpdate = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const template = await updateQuestionTemplate(templateId, updates);

    return NextResponse.json({ message: "Question template updated successfully", template });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Question template update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update question template" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/complexity-questions/[templateId]
 * Delete a question template (and its questions/answers via cascade)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    await requireAdmin();

    const { templateId } = await params;

    // Check if template exists
    const template = await getQuestionTemplateById(templateId);
    if (!template) {
      return NextResponse.json({ error: "Question template not found" }, { status: 404 });
    }

    // Prevent deleting the default template
    if (template.is_default) {
      return NextResponse.json({ error: "Cannot delete the default template" }, { status: 400 });
    }

    await deleteQuestionTemplate(templateId);

    return NextResponse.json({ message: "Question template deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Question template delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete question template" },
      { status: 500 }
    );
  }
}
