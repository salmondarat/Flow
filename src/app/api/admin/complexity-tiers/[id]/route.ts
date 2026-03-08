/**
 * Individual Complexity Tier API Routes
 * Handles GET, PUT, DELETE operations for a specific tier
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import {
  getComplexityTierById,
  updateComplexityTier,
  deleteComplexityTier,
} from "@/lib/api/complexity-tiers";
import type { ComplexityTierUpdate } from "@/types";

/**
 * GET /api/admin/complexity-tiers/[id]
 * Fetch a single complexity tier by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const tier = await getComplexityTierById(id);

    if (!tier) {
      return NextResponse.json({ error: "Complexity tier not found" }, { status: 404 });
    }

    return NextResponse.json({ tier });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity tier fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/complexity-tiers/[id]
 * Update an existing complexity tier
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();

    // Validate that at least one field is being updated
    const { name, description, minScore, maxScore, multiplier, isActive } = body;

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return NextResponse.json({ error: "Name must be a non-empty string" }, { status: 400 });
    }

    const updates: ComplexityTierUpdate = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (minScore !== undefined) updates.min_score = minScore;
    if (maxScore !== undefined) updates.max_score = maxScore;
    if (multiplier !== undefined) updates.multiplier = multiplier;
    if (body.baseMinPriceCents !== undefined) updates.base_min_price_cents = body.baseMinPriceCents;
    if (body.baseMaxPriceCents !== undefined) updates.base_max_price_cents = body.baseMaxPriceCents;
    if (isActive !== undefined) updates.is_active = isActive;
    if (body.sortOrder !== undefined) updates.sort_order = body.sortOrder;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const tier = await updateComplexityTier(id, updates);

    return NextResponse.json({ message: "Complexity tier updated successfully", tier });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity tier update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update complexity tier" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/complexity-tiers/[id]
 * Delete a complexity tier
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await deleteComplexityTier(id);

    return NextResponse.json({ message: "Complexity tier deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity tier delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete complexity tier" },
      { status: 500 }
    );
  }
}
