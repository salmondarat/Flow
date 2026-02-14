import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the default form template
    const { data: template, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("is_default", true)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !template) {
      // If no default template exists, return a basic fallback
      return NextResponse.json({
        template: {
          id: "fallback",
          name: "Basic Order Form",
          description: "Basic order form",
          isDefault: true,
          version: 1,
          config: {
            steps: [
              {
                id: "kit-info",
                order: 1,
                title: "Kit Information",
                description: "Tell us about your model kit",
                fields: [
                  {
                    id: "kit-name",
                    key: "kit_name",
                    type: "text",
                    label: "Kit Name",
                    placeholder: "e.g., MG RX-78-2 Gundam",
                    required: true,
                  },
                  {
                    id: "kit-model",
                    key: "kit_model",
                    type: "text",
                    label: "Kit Model/Grade",
                    placeholder: "e.g., MG 1/100",
                    required: false,
                  },
                ],
              },
              {
                id: "service-selection",
                order: 2,
                title: "Service Selection",
                description: "Choose the type of service you need",
                fields: [
                  {
                    id: "service-type",
                    key: "service_type",
                    type: "select",
                    label: "Service Type",
                    required: true,
                    options: ["full_build", "repair", "repaint"],
                  },
                  {
                    id: "complexity",
                    key: "complexity",
                    type: "select",
                    label: "Complexity Level",
                    required: true,
                    options: ["low", "medium", "high"],
                    defaultValue: "medium",
                  },
                ],
              },
              {
                id: "additional-info",
                order: 3,
                title: "Additional Information",
                description: "Any special requests or notes?",
                fields: [
                  {
                    id: "notes",
                    key: "notes",
                    type: "textarea",
                    label: "Notes",
                    placeholder: "Describe any customizations, color preferences, etc.",
                    required: false,
                  },
                ],
              },
            ],
            serviceConfig: {
              services: [
                {
                  id: "full_build",
                  name: "Full Build",
                  description: "Complete assembly of the kit",
                },
                {
                  id: "repair",
                  name: "Repair",
                  description: "Fix broken or damaged parts",
                },
                {
                  id: "repaint",
                  name: "Repaint",
                  description: "Custom paint job",
                },
              ],
            },
            pricingConfig: {
              basePrice: 5000,
              complexityMultiplier: {
                low: 1.0,
                medium: 1.5,
                high: 2.0,
              },
              servicePricing: {
                full_build: 1.0,
                repair: 0.8,
                repaint: 1.2,
              },
            },
          },
        },
      });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Default form template fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
