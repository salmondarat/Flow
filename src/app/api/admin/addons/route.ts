/**
 * Service Add-ons API Routes
 * Handles CRUD operations for service add-ons management
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { getAllAddons, createAddon } from "@/lib/api/addons";
import { getServiceTypes } from "@/lib/api/services";
import type { ServiceAddonInsert } from "@/types";

/**
 * GET /api/admin/addons
 * Fetch all add-ons (active and inactive for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const { searchParams } = new URL(request.url);
    const serviceTypeId = searchParams.get("serviceTypeId") || undefined;

    // Fetch all add-ons (include inactive for admin)
    const addons = await getAllAddons({
      activeOnly: false,
      serviceTypeId,
    });

    return NextResponse.json({ addons });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Add-ons fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/addons
 * Create a new add-on
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const body = await request.json();

    // Validate required fields
    const { name, serviceTypeId, priceCents, isRequired, sortOrder } = body;

    if (!name || !serviceTypeId || priceCents === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, serviceTypeId, priceCents" },
        { status: 400 }
      );
    }

    // Validate service exists
    const services = await getServiceTypes({ activeOnly: false });
    const service = services.find((s) => s.id === serviceTypeId);

    if (!service) {
      return NextResponse.json(
        { error: "Service type not found" },
        { status: 404 }
      );
    }

    // Validate priceCents is a positive number
    if (typeof priceCents !== "number" || priceCents < 0) {
      return NextResponse.json(
        { error: "priceCents must be a non-negative number" },
        { status: 400 }
      );
    }

    // Prepare add-on data
    const addonData: ServiceAddonInsert = {
      name,
      service_type_id: serviceTypeId,
      description: body.description || null,
      price_cents: Math.round(priceCents * 100), // Convert to cents if provided in decimal
      is_required: isRequired || false,
      sort_order: sortOrder ?? 0,
    };

    const addon = await createAddon(addonData);

    return NextResponse.json(
      { message: "Add-on created successfully", addon },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Add-on creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create add-on" },
      { status: 500 }
    );
  }
}
