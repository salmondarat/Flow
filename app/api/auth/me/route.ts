import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get full profile data
    // Get full profile data
    const { data: rawProfile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    const profile = rawProfile as any;

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fallback to auth user email if profile email is null
    const email = (profile as any)?.email || (authUser as any).email;

    return NextResponse.json({
      user: {
        id: profile.id,
        email: email,
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        role: profile.role,
        created_at: profile.created_at,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    console.log("PATCH /api/auth/me - User ID:", user.id, "Body:", body);

    // Only allow updating specific fields
    const allowedFields = ["full_name", "phone", "address"];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    console.log("Updates to apply:", updates);

    const supabase = await createClient();

    const { data: profile, error } = await (supabase.from("profiles") as any)
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update profile" },
        { status: 500 }
      );
    }

    if (!profile) {
      console.error("No profile returned after update");
      return NextResponse.json(
        { error: "Failed to update profile - no data returned" },
        { status: 500 }
      );
    }

    console.log("Profile updated successfully:", profile);

    return NextResponse.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
