import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  // Admin-specific optional fields
  studio_name: z.string().optional(),
  business_type: z.string().optional(),
  // Role selection
  role: z.enum(["admin", "client"]).default("client"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    const supabase = createAdminClient();

    // Check if email is already taken
    console.log("[DEBUG] Checking for existing profile with email:", validatedData.email);
    const { data: existingProfile, error: checkError } = await (supabase.from("profiles") as any)
      .select("id")
      .eq("email", validatedData.email)
      .maybeSingle();

    console.log("[DEBUG] Existing profile check:", { existingProfile, checkError });

    if (existingProfile) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Create user with Supabase Auth
    console.log("[DEBUG] Creating auth user for:", validatedData.email);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true, // Auto-confirm email for MVP
      user_metadata: {
        full_name: validatedData.full_name,
      },
    });

    console.log("[DEBUG] Auth user creation result:", {
      success: !authError && !!authData.user,
      userId: authData.user?.id,
      authError: authError?.message,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account", details: authError?.message },
        { status: 500 }
      );
    }

    // First, check if profile was auto-created by trigger
    console.log("[DEBUG] Checking if profile exists after trigger for user:", authData.user.id);
    const { data: profileAfterTrigger, error: triggerCheckError } = await (
      supabase.from("profiles") as any
    )
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle();

    console.log("[DEBUG] Profile after trigger:", {
      profile: profileAfterTrigger,
      error: triggerCheckError?.message,
      code: triggerCheckError?.code,
    });

    // Prepare profile update data
    const profileUpdateData: any = {
      email: validatedData.email,
      full_name: validatedData.full_name,
      phone: validatedData.phone || null,
      address: validatedData.address || null,
      role: validatedData.role,
    };

    // Add admin-specific fields if registering as admin
    if (validatedData.role === "admin") {
      profileUpdateData.studio_name = validatedData.studio_name || null;
      profileUpdateData.business_type = validatedData.business_type || null;
    }

    // Update profile with additional information
    console.log("[DEBUG] Attempting to update profile with:", {
      id: authData.user.id,
      ...profileUpdateData,
    });
    const { error: profileError } = await (supabase.from("profiles") as any)
      .update(profileUpdateData)
      .eq("id", authData.user.id);

    console.log("[DEBUG] Profile update result:", {
      error: profileError?.message,
      code: profileError?.code,
      details: profileError?.details,
      hint: profileError?.hint,
    });

    if (profileError) {
      // Rollback auth user if profile update fails
      console.log("[DEBUG] Rolling back auth user due to profile error");
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        {
          error: "Failed to create profile",
          details: profileError.message,
          code: profileError.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: validatedData.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
