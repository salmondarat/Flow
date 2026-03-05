/**
 * Individual Complexity Level API Routes
 * Handles UPDATE and DELETE operations for a single complexity level
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { getComplexityLevel, updateComplexityLevel, deleteComplexityLevel } from "@/lib/api/complexities";
import { createClient } from "@/lib/supabase/client";
import type { ComplexityLevelUpdate } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/complexities/[id]
 * Fetch a single complexity level by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    const complexity = await getComplexityLevel(id);

    if (!complexity) {
      return NextResponse.json({ error: "Complexity level not found" }, { status: 404 });
    }

    return NextResponse.json({ complexity });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity level fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/complexities/[id]
 * Update a complexity level
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    const body = await request.json();

    // Validate fields
    const { name, slug, multiplier, sortOrder, isActive } = body;

    if (name !== undefined && typeof name !== "string") {
      return NextResponse.json({ error: "name must be a string" }, { status: 400 });
    }

    if (multiplier !== undefined && (typeof multiplier !== "number" || multiplier <= 0)) {
      return NextResponse.json({ error: "multiplier must be a positive number" }, { status: 400 });
    }

    // Check if complexity exists
    const existing = await getComplexityLevel(id);
    if (!existing) {
      return NextResponse.json({ error: "Complexity level not found" }, { status: 404 });
    }

    // If slug is being changed, check for conflicts
    if (slug && slug !== existing.slug) {
      const supabase = createClient();
      const { data: slugConflict } = await supabase
        .from("complexity_levels")
        .select("id")
        .eq("slug", slug)
        .single();

      if (slugConflict) {
        return NextResponse.json(
          { error: "A complexity with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: ComplexityLevelUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (multiplier !== undefined) updateData.multiplier = multiplier;
    if (sortOrder !== undefined) updateData.sort_order = sortOrder;
    if (isActive !== undefined) updateData.is_active = isActive;

    const complexity = await updateComplexityLevel(id, updateData);

    return NextResponse.json({
      message: "Complexity level updated successfully",
      complexity,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity level update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update complexity level" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/complexities/[id]
 * Delete (soft delete) a complexity level
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    // Check if complexity exists
    const existing = await getComplexityLevel(id);
    if (!existing) {
      return NextResponse.json({ error: "Complexity level not found" }, { status: 404 });
    }

    await deleteComplexityLevel(id);

    return NextResponse.json({ message: "Complexity level deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity level deletion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete complexity level" },
      { status: 500 }
    );
  }
}
