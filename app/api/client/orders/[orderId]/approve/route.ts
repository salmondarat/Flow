import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/server";

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
      return NextResponse.json({ error: "Only clients can approve orders" }, { status: 403 });
    }

    const { orderId } = await params;

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

    // Check if order is in "estimated" status
    if (order.status !== "estimated") {
      return NextResponse.json(
        { error: "Only orders with 'estimated' status can be approved" },
        { status: 400 }
      );
    }

    // Update order status to "approved"
    const { data: updatedOrder, error: updateError } = await (supabase.from("orders") as any)
      .update({ status: "approved" })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error("Error approving order:", updateError);
      return NextResponse.json({ error: "Failed to approve order" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Order approved successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order approval error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
