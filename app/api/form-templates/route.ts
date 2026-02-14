import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import {
  formTemplateSchema,
  updateFormTemplateSchema,
} from "@/lib/features/form-configuration/validation";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const supabase = await createClient();

    const { data: templates, error } = await supabase
      .from("form_templates")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching form templates:", error);
      return NextResponse.json({ error: "Failed to fetch form templates" }, { status: 500 });
    }

    return NextResponse.json({ templates });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Form templates fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const body = await request.json();

    // Validate request body
    const validationResult = formTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, description, isDefault, version, config } = validationResult.data;

    const supabase = await createClient();

    // If this is set as default, remove default flag from other templates
    if (isDefault) {
      await supabase
        .from("form_templates")
        .update({ is_default: false } as never)
        .is("deleted_at", null);
    }

    const { data: template, error } = await supabase
      .from("form_templates")
      .insert({
        name,
        description,
        is_default: isDefault,
        version,
        config,
        created_by: user.id,
      } as never)
      .select()
      .single();

    if (error || !template) {
      console.error("Error creating form template:", error);
      return NextResponse.json({ error: "Failed to create form template" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Form template created successfully", template },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Form template creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
