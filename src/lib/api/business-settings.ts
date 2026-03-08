/**
 * Business Settings API Functions
 * Handles CRUD operations for business configuration
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { BusinessSettingsRow, BusinessSettingsUpdate } from "@/types";

const createClient = createAdminClient;

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Fetch business settings
 */
export async function getBusinessSettings(): Promise<BusinessSettingsRow> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .eq("id", SETTINGS_ID)
    .single();

  if (error) {
    console.error("Error fetching business settings:", error);
    throw new Error(`Failed to fetch business settings: ${error.message}`);
  }

  return data;
}

/**
 * Update business settings
 */
export async function updateBusinessSettings(
  updates: BusinessSettingsUpdate
): Promise<BusinessSettingsRow> {
  const supabase = createClient();

  const { data, error } = await (
    supabase as unknown as {
      from: (table: "business_settings") => {
        update: (data: BusinessSettingsUpdate) => {
          eq: (
            field: "id",
            value: string
          ) => {
            select: () => {
              single: () => Promise<{
                data: BusinessSettingsRow | null;
                error: { message: string } | null;
              }>;
            };
          };
        };
      };
    }
  )
    .from("business_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", SETTINGS_ID)
    .select()
    .single();

  if (error) {
    console.error("Error updating business settings:", error);
    throw new Error(`Failed to update business settings: ${error.message}`);
  }

  return data as BusinessSettingsRow;
}

/**
 * Upload business logo
 */
export async function uploadBusinessLogo(file: File): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `business-logo-${Date.now()}.${fileExt}`;
  const filePath = `business/${fileName}`;

  const { error: uploadError } = await supabase.storage.from("logos").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (uploadError) {
    console.error("Error uploading logo:", uploadError);
    throw new Error(`Failed to upload logo: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("logos").getPublicUrl(filePath);

  // Update the business settings with the new logo URL
  await updateBusinessSettings({ logo_url: publicUrl });

  return publicUrl;
}
