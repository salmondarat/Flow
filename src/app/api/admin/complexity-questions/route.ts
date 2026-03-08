/**
 * Complexity Question Templates API Routes
 * Handles CRUD operations for complexity question templates management
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import {
  getQuestionTemplates,
  createQuestionTemplate,
  setDefaultTemplate,
} from "@/lib/api/complexity-questions";
import type { ComplexityQuestionTemplateInsert } from "@/types";

/**
 * GET /api/admin/complexity-questions
 * Fetch all question templates (optionally including inactive)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const templates = await getQuestionTemplates({ includeInactive });

    return NextResponse.json({ templates });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Question templates fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/complexity-questions
 * Create a new question template
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    // Validate required fields
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Missing required field: name" }, { status: 400 });
    }

    // Prepare template data
    const templateData: ComplexityQuestionTemplateInsert = {
      name: name.trim(),
      description: body.description || null,
      is_default: body.isDefault || false,
      created_by: null, // Set by the database or auth context
    };

    const template = await createQuestionTemplate(templateData);

    return NextResponse.json(
      { message: "Question template created successfully", template },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Question template creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create question template" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/complexity-questions
 * Set a template as default
 */
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    // Validate required fields
    const { templateId, setDefault } = body;

    if (!templateId || typeof templateId !== "string") {
      return NextResponse.json({ error: "Missing required field: templateId" }, { status: 400 });
    }

    if (setDefault !== true) {
      return NextResponse.json({ error: "setDefault must be true" }, { status: 400 });
    }

    await setDefaultTemplate(templateId);

    return NextResponse.json({ message: "Default template set successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Set default template error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to set default template" },
      { status: 500 }
    );
  }
}
