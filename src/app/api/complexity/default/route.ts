/**
 * Default Complexity Question Template API Route
 * Public API to get the default complexity questions
 */

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { getDefaultQuestionTemplate } from "@/lib/api/complexity-questions";
import { getQuestionTemplateWithQuestions } from "@/lib/api/complexity-questions";

/**
 * GET /api/complexity/default
 * Get the default complexity question template with questions
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();

    const defaultTemplate = await getDefaultQuestionTemplate();

    if (!defaultTemplate) {
      return NextResponse.json(
        { error: "No default complexity template found" },
        { status: 404 }
      );
    }

    const templateWithQuestions = await getQuestionTemplateWithQuestions(
      defaultTemplate.id
    );

    return NextResponse.json({
      template: templateWithQuestions,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "User access required") {
      return NextResponse.json({ error: "User access required" }, { status: 403 });
    }
    console.error("Default template fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
