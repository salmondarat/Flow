import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { updateOrderStatus } from "@/lib/features/orders/queries";
import type { OrderStatus } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await requireAdmin();

    const { orderId } = await params;
    const formData = await request.formData();
    const status = formData.get("status");

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
    if (!validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await updateOrderStatus(orderId, status as OrderStatus);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.redirect(new URL(`/admin/orders/${orderId}`, request.url));
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update status" },
      { status: error instanceof Error && error.message.includes("Authentication") ? 401 : 500 }
    );
  }
}
