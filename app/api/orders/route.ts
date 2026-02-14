/**
 * API Route: POST /api/orders
 * Creates a new order with draft status
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createOrderRequestSchema } from "@/lib/features/orders/form-schema";
import { calculateOrderTotal } from "@/lib/estimation/calculate";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createOrderRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Calculate estimation on server
    const estimation = calculateOrderTotal(data.items);

    // Create order ID (using proper UUID format for database)
    const orderId = randomUUID();

    const supabase = await createClient();

    // Type cast to bypass strict typing issues with supabase client
    const ordersTable = supabase.from("orders") as any;
    const orderItemsTable = supabase.from("order_items") as any;
    const progressLogsTable = supabase.from("progress_logs") as any;

    // Create the order
    const { data: order, error: orderError } = await ordersTable
      .insert({
        id: orderId,
        client_id: null,
        status: "draft",
        estimated_price_cents: estimation.totalPriceCents,
        estimated_days: estimation.totalDays,
        final_price_cents: null,
        final_days: null,
        notes: data.address || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    const itemsToInsert = data.items.map((item, index) => ({
      order_id: orderId,
      kit_name: item.kitName,
      kit_model: item.kitGrade || null,
      service_type: item.serviceType,
      complexity: item.complexity,
      notes: item.notes || null,
      sort_order: index,
    }));

    const { error: itemsError } = await orderItemsTable.insert(itemsToInsert);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Attempt to clean up the order
      await ordersTable.delete().eq("id", orderId);
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 });
    }

    // Store client contact info in a progress log for reference
    const { error: logError } = await progressLogsTable.insert({
      id: randomUUID(),
      order_id: orderId,
      order_item_id: null,
      message: `Client: ${data.clientName}, Phone: ${data.phone}${data.email ? `, Email: ${data.email}` : ""}`,
      photo_url: null,
    });

    if (logError) {
      console.error("Warning: Failed to store client info in progress log:", logError);
      // Non-fatal, continue
    }

    return NextResponse.json(
      {
        id: orderId,
        status: "draft",
        estimatedPriceCents: estimation.totalPriceCents,
        estimatedDays: estimation.totalDays,
        createdAt: order.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
