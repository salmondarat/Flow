/**
 * Complexity Levels API Routes
 * Handles CRUD operations for complexity levels management
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/client";
import { getComplexityLevels, createComplexityLevel } from "@/lib/api/complexities";
import type { ComplexityLevelInsert } from "@/types";

/**
 * GET /api/admin/complexities
 * Fetch all complexity levels (active and inactive for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin();

    // Fetch all complexities (include inactive for admin)
    const complexities = await getComplexityLevels({ activeOnly: false });

    return NextResponse.json({ complexities });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity levels fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/complexities
 * Create a new complexity level
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const body = await request.json();

    // Validate required fields
    const { name, slug, multiplier, sortOrder } = body;

    if (!name || !slug || multiplier === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, multiplier" },
        { status: 400 }
      );
    }

    // Validate multiplier is a positive number
    if (typeof multiplier !== "number" || multiplier <= 0) {
      return NextResponse.json(
        { error: "multiplier must be a positive number" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("complexity_levels")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A complexity with this slug already exists" },
        { status: 409 }
      );
    }

    // Prepare complexity data
    const complexityData: ComplexityLevelInsert = {
      name,
      slug,
      multiplier,
      sort_order: sortOrder ?? 0,
    };

    const complexity = await createComplexityLevel(complexityData);

    return NextResponse.json(
      { message: "Complexity level created successfully", complexity },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity level creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create complexity level" },
      { status: 500 }
    );
  }
}
