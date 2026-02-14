/**
 * Individual Add-on API Routes
 * Handles UPDATE and DELETE operations for a single add-on
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { getAddon, updateAddon, deleteAddon } from "@/lib/api/addons";
import { getServiceTypes } from "@/lib/api/services";
import type { ServiceAddonUpdate } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/addons/[id]
 * Fetch a single add-on by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    const addon = await getAddon(id);

    if (!addon) {
      return NextResponse.json({ error: "Add-on not found" }, { status: 404 });
    }

    return NextResponse.json({ addon });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Add-on fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/addons/[id]
 * Update an add-on
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    const body = await request.json();

    // Validate fields
    const { name, serviceTypeId, priceCents, isRequired, sortOrder, isActive, description } = body;

    if (name !== undefined && typeof name !== "string") {
      return NextResponse.json({ error: "name must be a string" }, { status: 400 });
    }

    if (priceCents !== undefined && (typeof priceCents !== "number" || priceCents < 0)) {
      return NextResponse.json({ error: "priceCents must be a non-negative number" }, { status: 400 });
    }

    // Check if add-on exists
    const existing = await getAddon(id);
    if (!existing) {
      return NextResponse.json({ error: "Add-on not found" }, { status: 404 });
    }

    // If serviceTypeId is being changed, validate it exists
    if (serviceTypeId && serviceTypeId !== existing.service_type_id) {
      const services = await getServiceTypes({ activeOnly: false });
      const service = services.find((s) => s.id === serviceTypeId);

      if (!service) {
        return NextResponse.json(
          { error: "Service type not found" },
          { status: 404 }
        );
      }
    }

    // Prepare update data
    const updateData: ServiceAddonUpdate = {};
    if (name !== undefined) updateData.name = name;
    if (serviceTypeId !== undefined) updateData.service_type_id = serviceTypeId;
    if (description !== undefined) updateData.description = description;
    if (priceCents !== undefined) updateData.price_cents = Math.round(priceCents * 100);
    if (isRequired !== undefined) updateData.is_required = isRequired;
    if (sortOrder !== undefined) updateData.sort_order = sortOrder;
    if (isActive !== undefined) updateData.is_active = isActive;

    const addon = await updateAddon(id, updateData);

    return NextResponse.json({
      message: "Add-on updated successfully",
      addon,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Add-on update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update add-on" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/addons/[id]
 * Delete (soft delete) an add-on
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;

    // Check if add-on exists
    const existing = await getAddon(id);
    if (!existing) {
      return NextResponse.json({ error: "Add-on not found" }, { status: 404 });
    }

    await deleteAddon(id);

    return NextResponse.json({ message: "Add-on deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Add-on deletion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete add-on" },
      { status: 500 }
    );
  }
}
