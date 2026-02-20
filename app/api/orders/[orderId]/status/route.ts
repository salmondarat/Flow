import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { updateOrderStatus } from "@/lib/features/orders/queries";
import type { OrderStatus } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await requireAdmin();

    const { orderId } = await params;
    const body = await request.json() as { status: OrderStatus };
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Validate status is a valid OrderStatus
    const validStatuses: OrderStatus[] = [
      "draft",
      "estimated",
      "approved",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await updateOrderStatus(orderId, status);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update status" },
      { status: error instanceof Error && error.message.includes("Authentication") ? 401 : 500 }
    );
  }
}
