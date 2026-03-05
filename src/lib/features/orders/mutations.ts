import { createClient } from "@/lib/supabase/server";
import type { ChangeRequestRow, ProgressLogInsert } from "@/types";

/**
 * Add a progress log to an order
 */
export async function addProgressLog(data: {
  orderId: string;
  orderItemId?: string;
  message: string;
  photoUrl?: string;
}) {
  const supabase = await createClient();

  const insertData: ProgressLogInsert = {
    order_id: data.orderId,
    order_item_id: data.orderItemId || null,
    message: data.message,
    photo_url: data.photoUrl || null,
  };

  // Type assertion workaround for Supabase's generic type inference issue
  // The Database generic causes .insert() to infer 'never' for table types
  const { error } = await (
    supabase.from("progress_logs") as unknown as {
      insert: (data: ProgressLogInsert) => Promise<{ error: { message: string } | null }>;
    }
  ).insert(insertData);

  if (error) {
    console.error("Error adding progress log:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Upload a photo to Supabase Storage
 */
export async function uploadProgressPhoto(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage.from("progress-photos").upload(filePath, file);

  if (error) {
    console.error("Error uploading photo:", error);
    return { success: false, error: error.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("progress-photos").getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}

/**
 * Approve a change request
 */
export async function approveChangeRequest(changeRequestId: string) {
  const supabase = await createClient();

  // Get the change request
  const { data: changeRequest, error: fetchError } = await supabase
    .from("change_requests")
    .select("*")
    .eq("id", changeRequestId)
    .maybeSingle<ChangeRequestRow>();

  if (fetchError || !changeRequest) {
    return { success: false, error: "Change request not found" };
  }

  // Update the change request status
  const { error: updateError } = await (
    supabase.from("change_requests") as unknown as {
      update: (data: { status: string }) => {
        eq: (field: string, value: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ status: "approved" })
    .eq("id", changeRequestId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Update the order pricing
  const { error: orderError } = await (
    supabase.from("orders") as unknown as {
      update: (data: { estimated_price_cents: number; estimated_days: number }) => {
        eq: (field: string, value: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({
      estimated_price_cents: changeRequest.price_impact_cents,
      estimated_days: changeRequest.days_impact,
    })
    .eq("id", changeRequest.order_id);

  if (orderError) {
    return { success: false, error: orderError.message };
  }

  return { success: true };
}

/**
 * Reject a change request
 */
export async function rejectChangeRequest(changeRequestId: string) {
  const supabase = await createClient();

  const { error } = await (
    supabase.from("change_requests") as unknown as {
      update: (data: { status: string }) => {
        eq: (field: string, value: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ status: "rejected" })
    .eq("id", changeRequestId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
