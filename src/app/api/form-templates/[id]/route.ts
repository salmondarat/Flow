import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { formTemplateSchema } from "@/lib/features/form-configuration/validation";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = await params;

    const supabase = await createClient();

    const { data: template, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error || !template) {
      return NextResponse.json({ error: "Form template not found" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Form template fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin();

    const { id } = await params;
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

    // Check if template exists
    const { data: existing } = await supabase
      .from("form_templates")
      .select("id, version")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Form template not found" }, { status: 404 });
    }

    // If this is set as default, remove default flag from other templates
    if (isDefault) {
      await supabase
        .from("form_templates")
        .update({ is_default: false } as never)
        .is("deleted_at", null)
        .neq("id", id);
    }

    // Increment version on update
    const newVersion = (existing as any).version + 1;

    const { data: template, error } = await supabase
      .from("form_templates")
      .update({
        name,
        description,
        is_default: isDefault,
        version: newVersion,
        config,
      } as never)
      .eq("id", id)
      .select()
      .single();

    if (error || !template) {
      console.error("Error updating form template:", error);
      return NextResponse.json({ error: "Failed to update form template" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Form template updated successfully",
      template,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Form template update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const supabase = await createClient();

    // Soft delete by setting deleted_at
    const { data: template, error } = await supabase
      .from("form_templates")
      .update({ deleted_at: new Date().toISOString() } as never)
      .eq("id", id)
      .select()
      .single();

    if (error || !template) {
      console.error("Error deleting form template:", error);
      return NextResponse.json({ error: "Failed to delete form template" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Form template deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Form template deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
