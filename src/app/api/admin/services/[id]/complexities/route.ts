/**
 * Service Complexities API Routes
 * Handles fetching and updating complexity multipliers for a specific service
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { getComplexityForService, setServiceComplexityMultiplier } from "@/lib/api/complexities";
import { getComplexityLevels } from "@/lib/api/complexities";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/services/[id]/complexities
 * Fetch complexities for a specific service (with overrides)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    // Fetch all active complexities
    const complexities = await getComplexityLevels({ activeOnly: true });

    // Fetch service-specific complexities with overrides
    const serviceComplexities = await getComplexityForService(id);

    return NextResponse.json({ complexities, serviceComplexities });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Service complexities fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/services/[id]/complexities
 * Set custom multiplier for a service-complexity combination
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    const body = await request.json();
    const { complexityId, multiplier } = body;

    if (!complexityId) {
      return NextResponse.json(
        { error: "Missing required field: complexityId" },
        { status: 400 }
      );
    }

    await setServiceComplexityMultiplier(id, complexityId, multiplier ?? null);

    return NextResponse.json({ message: "Complexity multiplier updated successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Service complexity multiplier update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update complexity multiplier" },
      { status: 500 }
    );
  }
}
