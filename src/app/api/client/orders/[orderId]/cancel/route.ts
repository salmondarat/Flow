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
      return NextResponse.json({ error: "Only clients can cancel orders" }, { status: 403 });
    }

    const { orderId } = await params;
    const body = await request.json();
    const { reason } = body;

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

    // Check if order can be cancelled
    const cancellableStatuses = ["draft", "estimated", "approved"];
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json({ error: "This order cannot be cancelled" }, { status: 400 });
    }

    // Update order status to "cancelled" and add cancellation reason to notes
    const updatedNotes = order.notes
      ? `${order.notes}\n\nCancellation reason: ${reason}`
      : `Cancellation reason: ${reason}`;

    const { data: updatedOrder, error: updateError } = await (supabase.from("orders") as any)
      .update({ status: "cancelled", notes: updatedNotes })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error("Error cancelling order:", updateError);
      return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
