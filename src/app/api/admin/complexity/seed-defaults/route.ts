/**
 * Seed Default Complexity Data API Route
 * Creates default tiers, question template, and questions
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = createAdminClient();
    const results = {
      tiers: { created: 0, skipped: 0 },
      template: { created: false, id: null as string | null, skipped: false },
      questions: { created: 0 },
    };

    // 1. Create default complexity tiers if none exist
    const { data: existingTiers } = await supabase.from("complexity_tiers").select("id").limit(1);

    if (!existingTiers || existingTiers.length === 0) {
      const defaultTiers = [
        {
          name: "Low Complexity",
          description: "Simple builds with minimal customization",
          min_score: 0,
          max_score: 10,
          multiplier: 1.0,
          base_min_price_cents: 5000,
          base_max_price_cents: 10000,
          is_active: true,
          sort_order: 0,
        },
        {
          name: "Medium Complexity",
          description: "Standard builds with moderate customization",
          min_score: 11,
          max_score: 20,
          multiplier: 1.3,
          base_min_price_cents: 10000,
          base_max_price_cents: 20000,
          is_active: true,
          sort_order: 1,
        },
        {
          name: "High Complexity",
          description: "Complex builds with extensive customization",
          min_score: 21,
          max_score: null, // Open-ended
          multiplier: 1.6,
          base_min_price_cents: 20000,
          base_max_price_cents: 50000,
          is_active: true,
          sort_order: 2,
        },
      ];

      for (const tier of defaultTiers) {
        const { error } = await supabase
          .from("complexity_tiers")
          .insert(tier as any);
        if (!error) {
          results.tiers.created++;
        }
      }
    } else {
      results.tiers.skipped = 1;
    }

    // 2. Create default question template if none exist
    const { data: existingTemplates } = await supabase
      .from("complexity_question_templates")
      .select("id")
      .limit(1);

    let templateId: string | null = null;

    if (!existingTemplates || existingTemplates.length === 0) {
      const { data: template, error: templateError } = await supabase
        .from("complexity_question_templates")
        .insert({
          name: "Standard Assessment",
          description: "Default complexity assessment questionnaire for gunpla builds",
          is_default: true,
        } as any)
        .select()
        .single() as any;

      if (!templateError && template) {
        results.template.created = true;
        results.template.id = template.id;
        templateId = template.id;

        // 3. Create default questions with answer options
        const defaultQuestions = [
          {
            question_text: "What is the grade/scale of the kit?",
            answer_options: [
              { answer_text: "SD (Super Deformed)", score: 1 },
              { answer_text: "HG (High Grade) 1/144", score: 2 },
              { answer_text: "RG (Real Grade) 1/144", score: 3 },
              { answer_text: "MG (Master Grade) 1/100", score: 4 },
              { answer_text: "PG (Perfect Grade) 1/60", score: 5 },
            ],
          },
          {
            question_text: "How much panel lining is required?",
            answer_options: [
              { answer_text: "Minimal (just a few lines)", score: 1 },
              { answer_text: "Moderate (some details)", score: 2 },
              { answer_text: "Extensive (many panel lines)", score: 3 },
              { answer_text: "Full detail (all panel lines)", score: 4 },
            ],
          },
          {
            question_text: "Will you need custom painting?",
            answer_options: [
              { answer_text: "No painting needed", score: 1 },
              { answer_text: "Basic color correction only", score: 2 },
              { answer_text: "Partial custom paint (1-2 colors)", score: 3 },
              { answer_text: "Full custom paint job", score: 5 },
            ],
          },
          {
            question_text: "What type of weathering/effects are needed?",
            answer_options: [
              { answer_text: "No weathering", score: 1 },
              { answer_text: "Light panel line accent", score: 2 },
              { answer_text: "Moderate weathering (panel lines + decals)", score: 3 },
              { answer_text: "Heavy weathering (battle damage, rust, etc.)", score: 5 },
            ],
          },
          {
            question_text: "Any additional modifications?",
            answer_options: [
              { answer_text: "None - straight build", score: 1 },
              { answer_text: "Minor modifications (seam removal)", score: 2 },
              { answer_text: "Moderate mods (scratch building parts)", score: 4 },
              { answer_text: "Major customization (kitbash, resin parts)", score: 6 },
            ],
          },
        ];

        for (let qIndex = 0; qIndex < defaultQuestions.length; qIndex++) {
          const q = defaultQuestions[qIndex];
          const { data: question, error: questionError } = await supabase
            .from("complexity_questions")
            .insert({
              template_id: templateId,
              question_text: q.question_text,
              sort_order: qIndex,
            } as any)
            .select()
            .single() as any;

          if (!questionError && question) {
            // Insert answer options
            const answerOptions = q.answer_options.map((opt, optIndex) => ({
              question_id: question.id,
              answer_text: opt.answer_text,
              score: opt.score,
              sort_order: optIndex,
            }));

            const { error: optionsError } = await supabase
              .from("complexity_answer_options")
              .insert(answerOptions as any);

            if (!optionsError) {
              results.questions.created++;
            }
          }
        }
      }
    } else {
      results.template.skipped = true;
    }

    return NextResponse.json({
      message: "Default complexity data created successfully",
      results,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    console.error("Seed defaults error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed defaults" },
      { status: 500 }
    );
  }
}
