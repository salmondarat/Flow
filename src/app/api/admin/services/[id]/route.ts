/**
 * Individual Service Type API Routes
 * Handles UPDATE and DELETE operations for a single service type
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { getServiceType, updateServiceType, deleteServiceType } from "@/lib/api/services";
import { createClient } from "@/lib/supabase/client";
import type { ServiceTypeUpdate } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/services/[id]
 * Fetch a single service type by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    const service = await getServiceType(id);

    if (!service) {
      return NextResponse.json({ error: "Service type not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Service type fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/services/[id]
 * Update a service type
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    const body = await request.json();

    // Validate fields
    const { name, slug, description, iconName, basePriceCents, baseDays, sortOrder, isActive } = body;

    if (name !== undefined && typeof name !== "string") {
      return NextResponse.json({ error: "name must be a string" }, { status: 400 });
    }

    if (basePriceCents !== undefined && (typeof basePriceCents !== "number" || basePriceCents <= 0)) {
      return NextResponse.json({ error: "basePriceCents must be a positive number" }, { status: 400 });
    }

    if (baseDays !== undefined && (typeof baseDays !== "number" || baseDays <= 0)) {
      return NextResponse.json({ error: "baseDays must be a positive number" }, { status: 400 });
    }

    // Check if service exists
    const existing = await getServiceType(id);
    if (!existing) {
      return NextResponse.json({ error: "Service type not found" }, { status: 404 });
    }

    // If slug is being changed, check for conflicts
    if (slug && slug !== existing.slug) {
      const supabase = createClient();
      const { data: slugConflict } = await supabase
        .from("service_types")
        .select("id")
        .eq("slug", slug)
        .single();

      if (slugConflict) {
        return NextResponse.json(
          { error: "A service with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: ServiceTypeUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (iconName !== undefined) updateData.icon_name = iconName;
    if (basePriceCents !== undefined) updateData.base_price_cents = basePriceCents;
    if (baseDays !== undefined) updateData.base_days = baseDays;
    if (sortOrder !== undefined) updateData.sort_order = sortOrder;
    if (isActive !== undefined) updateData.is_active = isActive;

    const service = await updateServiceType(id, updateData);

    return NextResponse.json({
      message: "Service type updated successfully",
      service,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Service type update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update service type" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/services/[id]
 * Delete (soft delete) a service type
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    // Check if service exists
    const existing = await getServiceType(id);
    if (!existing) {
      return NextResponse.json({ error: "Service type not found" }, { status: 404 });
    }

    await deleteServiceType(id);

    return NextResponse.json({ message: "Service type deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Service type deletion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete service type" },
      { status: 500 }
    );
  }
}
