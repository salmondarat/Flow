/**
 * Reorder Answer Options API Route
 * Handles reordering answer options within a question
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { reorderAnswerOptions } from "@/lib/api/complexity-questions";

/**
 * POST /api/admin/complexity-questions/[templateId]/questions/[questionId]/options/reorder
 * Reorder answer options within a question
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string; questionId: string }> }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { orders } = body;

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: orders (array of {id, sort_order})" },
        { status: 400 }
      );
    }

    // Validate orders format
    for (const order of orders) {
      if (!order.id || typeof order.sort_order !== "number") {
        return NextResponse.json(
          { error: "Each order must have id and sort_order fields" },
          { status: 400 }
        );
      }
    }

    await reorderAnswerOptions(orders);

    return NextResponse.json({ message: "Answer options reordered successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Answer options reorder error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reorder answer options" },
      { status: 500 }
    );
  }
}
