import { NextRequest, NextResponse } from "next/server";
import { getBusinessSettings, updateBusinessSettings } from "@/lib/api/business-settings";
import type { BusinessSettingsUpdate } from "@/types";

/**
 * GET /api/admin/business-settings
 * Fetch business settings
 */
export async function GET() {
  try {
    const settings = await getBusinessSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching business settings:", error);
    return NextResponse.json({ error: "Failed to fetch business settings" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/business-settings
 * Update business settings
 */
export async function PUT(request: NextRequest) {
  try {
    const updates: BusinessSettingsUpdate = await request.json();
    const settings = await updateBusinessSettings(updates);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating business settings:", error);
    return NextResponse.json({ error: "Failed to update business settings" }, { status: 500 });
  }
}
