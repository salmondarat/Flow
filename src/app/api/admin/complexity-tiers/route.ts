/**
 * Complexity Tiers API Routes
 * Handles CRUD operations for complexity tiers management
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import {
  getComplexityTiers,
  getComplexityTierById,
  createComplexityTier,
  updateComplexityTier,
  deleteComplexityTier,
} from "@/lib/api/complexity-tiers";
import type { ComplexityTierInsert, ComplexityTierRow } from "@/types";

/**
 * GET /api/admin/complexity-tiers
 * Fetch all complexity tiers (active and inactive for admin)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const tiers = await getComplexityTiers({ activeOnly });

    // Validate tier score ranges
    const validation = validateTierRanges(tiers);

    return NextResponse.json({ tiers, validation });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity tiers fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Validate tier score ranges for overlaps and gaps
 */
function validateTierRanges(tiers: ComplexityTierRow[]) {
  const overlaps: any[] = [];
  const gaps: any[] = [];
  const warnings: string[] = [];

  // Sort tiers by min_score
  const sortedTiers = [...tiers]
    .filter((t) => t.is_active)
    .sort((a, b) => a.min_score - b.min_score);

  if (sortedTiers.length === 0) {
    return { valid: true, overlaps, gaps, warnings };
  }

  // Check for overlaps
  for (let i = 0; i < sortedTiers.length - 1; i++) {
    const current = sortedTiers[i];
    const next = sortedTiers[i + 1];

    if (current.max_score !== null && next.min_score <= current.max_score) {
      overlaps.push({
        tier1: current,
        tier2: next,
        overlapStart: next.min_score,
        overlapEnd: Math.min(current.max_score, next.max_score ?? Infinity),
      });
      warnings.push(
        `Overlap detected: "${current.name}" and "${next.name}" both cover scores ${next.min_score} - ${Math.min(current.max_score, next.max_score ?? Infinity)}`
      );
    }

    // Check for gaps
    if (current.max_score !== null && next.min_score > current.max_score + 1) {
      gaps.push({
        start: current.max_score + 1,
        end: next.min_score - 1,
      });
      warnings.push(
        `Gap detected: No tier covers scores ${current.max_score + 1} - ${next.min_score - 1}`
      );
    }
  }

  // Check if first tier starts at 0 or below
  if (sortedTiers[0].min_score > 0) {
    gaps.push({
      start: 0,
      end: sortedTiers[0].min_score - 1,
    });
    warnings.push(`Gap detected: No tier covers scores 0 - ${sortedTiers[0].min_score - 1}`);
  }

  return {
    valid: overlaps.length === 0 && gaps.length === 0,
    overlaps,
    gaps,
    warnings,
  };
}

/**
 * POST /api/admin/complexity-tiers
 * Create a new complexity tier
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    // Validate required fields
    const { name, minScore, maxScore, multiplier, baseMinPriceCents, baseMaxPriceCents } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Missing required field: name" }, { status: 400 });
    }

    if (multiplier === undefined || typeof multiplier !== "number" || multiplier <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid field: multiplier (must be a positive number)" },
        { status: 400 }
      );
    }

    // Prepare tier data
    const tierData: ComplexityTierInsert = {
      name: name.trim(),
      description: body.description || null,
      min_score: minScore ?? 0,
      max_score: maxScore ?? null,
      multiplier,
      base_min_price_cents: baseMinPriceCents ?? null,
      base_max_price_cents: baseMaxPriceCents ?? null,
      is_active: body.isActive !== false,
      sort_order: body.sortOrder ?? 0,
    };

    const tier = await createComplexityTier(tierData);

    return NextResponse.json(
      { message: "Complexity tier created successfully", tier },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Complexity tier creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create complexity tier" },
      { status: 500 }
    );
  }
}
