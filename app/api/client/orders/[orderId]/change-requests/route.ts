import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (user.role !== "client") {
      return NextResponse.json(
        { error: "Only clients can submit change requests" },
        { status: 403 }
      );
    }

    const { orderId } = await params;
    const body = await request.json();
    const { kitId, description, serviceType, newComplexity } = body;

    // Validate required fields
    if (!kitId || !description) {
      return NextResponse.json({ error: "Kit ID and description are required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get the order and verify ownership
    const { data: order, error: fetchError } = await (supabase.from("orders") as any)
      .select("*")
      .eq("id", orderId)
      .eq("client_id", user.id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order can accept change requests
    const canChangeStatuses = ["estimated", "approved", "in_progress"];
    if (!canChangeStatuses.includes(order.status)) {
      return NextResponse.json({ error: "This order cannot be modified" }, { status: 400 });
    }

    // Get the order item to calculate price/time impact
    const { data: orderItem, error: itemError } = await (supabase.from("order_items") as any)
      .select("*")
      .eq("id", kitId)
      .eq("order_id", orderId)
      .single();

    if (itemError || !orderItem) {
      return NextResponse.json({ error: "Kit not found in this order" }, { status: 404 });
    }

    // Calculate price/time impact (simplified)
    let priceImpact = 0;
    let daysImpact = 0;

    // Service type change impact
    if (serviceType && serviceType !== orderItem.service_type) {
      const serviceMultipliers: Record<string, number> = {
        full_build: 1.0,
        repair: 0.8,
        repaint: 1.2,
      };
      const currentMultiplier = serviceMultipliers[orderItem.service_type] || 1.0;
      const newMultiplier = serviceMultipliers[serviceType] || 1.0;
      priceImpact += (newMultiplier - currentMultiplier) * 5000; // Base price
    }

    // Complexity change impact
    if (newComplexity && newComplexity !== orderItem.complexity) {
      const complexityMultipliers: Record<string, number> = {
        low: 1.0,
        medium: 1.5,
        high: 2.0,
      };
      const currentMultiplier = complexityMultipliers[orderItem.complexity] || 1.5;
      const newMultiplier = complexityMultipliers[newComplexity] || 1.5;
      priceImpact += (newMultiplier - currentMultiplier) * 5000;
      daysImpact += newComplexity === "high" ? 2 : newComplexity === "low" ? -1 : 0;
    }

    // Create change request
    const { data: changeRequest, error: createError } = await (
      supabase.from("change_requests") as any
    )
      .insert({
        order_id: orderId,
        description: `${description}\n\nKit: ${orderItem.kit_name}${serviceType ? `\nService Change: ${orderItem.service_type} → ${serviceType}` : ""}${newComplexity ? `\nComplexity Change: ${orderItem.complexity} → ${newComplexity}` : ""}`,
        price_impact_cents: Math.round(priceImpact),
        days_impact: daysImpact,
        status: "pending",
      })
      .select()
      .single();

    if (createError || !changeRequest) {
      console.error("Error creating change request:", createError);
      return NextResponse.json({ error: "Failed to create change request" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Change request submitted successfully",
        changeRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Change request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
