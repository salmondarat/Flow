import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (user.role !== "client") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = await createClient();

    // Get client's orders with related data
    const { data: orders, error } = await (supabase.from("orders") as any)
      .select(
        `
        *,
        order_items (*),
        progress_logs (*),
        change_requests (*)
      `
      )
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (user.role !== "client") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Validate order data
    const { order_items, notes, status } = body;

    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return NextResponse.json({ error: "Order must have at least one item" }, { status: 400 });
    }

    const supabase = await createClient();

    // Create order with items
    const { data: order, error: orderError } = await (supabase.from("orders") as any)
      .insert({
        client_id: user.id,
        status: status || "draft",
        notes: notes || null,
        estimated_price_cents: 0, // Will be calculated by admin
        estimated_days: 0,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    const itemsToInsert = order_items.map((item: any) => ({
      order_id: order.id,
      kit_name: item.kit_name,
      kit_model: item.kit_model || null,
      service_type: item.service_type,
      complexity: item.complexity || "medium",
      notes: item.notes || null,
    }));

    const { error: itemsError } = await (supabase.from("order_items") as any).insert(itemsToInsert);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Rollback order
      await (supabase.from("orders") as any).delete().eq("id", order.id);
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
