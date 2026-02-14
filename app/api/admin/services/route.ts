/**
 * Service Types API Routes
 * Handles CRUD operations for service types management
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/client";
import { getServiceTypes, createServiceType, deleteServiceType } from "@/lib/api/services";
import type { ServiceTypeInsert } from "@/types";

/**
 * GET /api/admin/services
 * Fetch all service types (active and inactive for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin();

    // Fetch all services (include inactive for admin)
    const services = await getServiceTypes({ activeOnly: false });

    return NextResponse.json({ services });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Service types fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/services
 * Create a new service type
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const body = await request.json();

    // Validate required fields
    const { name, slug, description, iconName, basePriceCents, baseDays, sortOrder } = body;

    if (!name || !slug || !basePriceCents || !baseDays) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, basePriceCents, baseDays" },
        { status: 400 }
      );
    }

    // Validate basePriceCents is a positive number
    if (typeof basePriceCents !== "number" || basePriceCents <= 0) {
      return NextResponse.json(
        { error: "basePriceCents must be a positive number" },
        { status: 400 }
      );
    }

    // Validate baseDays is a positive number
    if (typeof baseDays !== "number" || baseDays <= 0) {
      return NextResponse.json(
        { error: "baseDays must be a positive number" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("service_types")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 409 }
      );
    }

    // Prepare service data
    const serviceData: ServiceTypeInsert = {
      name,
      slug,
      description: description || null,
      icon_name: iconName || null,
      base_price_cents: basePriceCents,
      base_days: baseDays,
      sort_order: sortOrder ?? 0,
      is_active: true,
    };

    const service = await createServiceType(serviceData);

    return NextResponse.json(
      { message: "Service type created successfully", service },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Service type creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create service type" },
      { status: 500 }
    );
  }
}
