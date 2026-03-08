/**
 * Complexity Questions API Functions
 * Handles CRUD operations for complexity question templates, questions, and answer options
 */

import { createAdminClient } from "@/lib/supabase/admin";

const createClient = createAdminClient;
import type {
  ComplexityQuestionTemplateRow,
  ComplexityQuestionTemplateInsert,
  ComplexityQuestionTemplateUpdate,
  ComplexityQuestionRow,
  ComplexityQuestionInsert,
  ComplexityQuestionUpdate,
  ComplexityAnswerOptionRow,
  ComplexityAnswerOptionInsert,
  ComplexityAnswerOptionUpdate,
  ComplexityQuestionWithAnswers,
  ComplexityQuestionTemplateWithQuestions,
} from "@/types";

// ============================================================================
// QUESTION TEMPLATES
// ============================================================================

/**
 * Fetch all question templates
 */
export async function getQuestionTemplates(
  options: { includeInactive?: boolean } = {}
): Promise<ComplexityQuestionTemplateRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("complexity_question_templates")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (!options.includeInactive) {
    // Only filter by created_by to get active templates
    query = query.not("created_by", "is", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching question templates:", error);
    throw new Error(`Failed to fetch question templates: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch a single question template by ID
 */
export async function getQuestionTemplateById(
  id: string
): Promise<ComplexityQuestionTemplateRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complexity_question_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching question template:", error);
    throw new Error(`Failed to fetch question template: ${error.message}`);
  }

  return data;
}

/**
 * Fetch the default question template
 */
export async function getDefaultQuestionTemplate(): Promise<ComplexityQuestionTemplateRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complexity_question_templates")
    .select("*")
    .eq("is_default", true)
    .single();

  if (error) {
    console.error("Error fetching default question template:", error);
    throw new Error(`Failed to fetch default question template: ${error.message}`);
  }

  return data;
}

/**
 * Create a new question template
 */
export async function createQuestionTemplate(
  template: ComplexityQuestionTemplateInsert
): Promise<ComplexityQuestionTemplateRow> {
  const supabase = createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_question_templates") => {
      insert: (data: ComplexityQuestionTemplateInsert) => {
        select: () => {
          single: () => Promise<{
            data: ComplexityQuestionTemplateRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  })
    .from("complexity_question_templates")
    .insert(template)
    .select()
    .single();

  if (error) {
    console.error("Error creating question template:", error);
    throw new Error(`Failed to create question template: ${error.message}`);
  }

  return data as ComplexityQuestionTemplateRow;
}

/**
 * Update an existing question template
 */
export async function updateQuestionTemplate(
  id: string,
  updates: ComplexityQuestionTemplateUpdate
): Promise<ComplexityQuestionTemplateRow> {
  const supabase = createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_question_templates") => {
      update: (data: ComplexityQuestionTemplateUpdate) => {
        eq: (field: "id", value: string) => {
          select: () => {
            single: () => Promise<{
              data: ComplexityQuestionTemplateRow | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("complexity_question_templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating question template:", error);
    throw new Error(`Failed to update question template: ${error.message}`);
  }

  return data as ComplexityQuestionTemplateRow;
}

/**
 * Delete a question template (cascades to questions and answers)
 */
export async function deleteQuestionTemplate(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await (supabase as unknown as {
    from: (table: "complexity_question_templates") => {
      delete: () => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("complexity_question_templates")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting question template:", error);
    throw new Error(`Failed to delete question template: ${error.message}`);
  }
}

/**
 * Set a template as default (ensures only one default)
 */
export async function setDefaultTemplate(id: string): Promise<void> {
  const supabase = createClient();

  // First, unset all defaults
  const { error: updateError } = await (supabase as unknown as {
    from: (table: "complexity_question_templates") => {
      update: (data: { is_default: boolean }) => {
        neq: (field: string, value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("complexity_question_templates")
    .update({ is_default: false })
    .neq("id", id);

  if (updateError) {
    console.error("Error unsetting default template:", updateError);
    throw new Error(`Failed to unset default template: ${updateError.message}`);
  }

  // Then set the new default
  const { error: setDefaultError } = await (supabase as unknown as {
    from: (table: "complexity_question_templates") => {
      update: (data: { is_default: boolean }) => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("complexity_question_templates")
    .update({ is_default: true })
    .eq("id", id);

  if (setDefaultError) {
    console.error("Error setting default template:", setDefaultError);
    throw new Error(`Failed to set default template: ${setDefaultError.message}`);
  }
}

// ============================================================================
// QUESTIONS
// ============================================================================

/**
 * Fetch questions by template ID with answer options
 */
export async function getQuestionsByTemplateId(
  templateId: string
): Promise<ComplexityQuestionWithAnswers[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complexity_questions")
    .select(`
      *,
      answer_options (
        *,
        sort_order
      )
    `)
    .eq("template_id", templateId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching questions:", error);
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }

  return (
    data?.map((item) => {
      const typed = item as unknown as {
        id: string;
        template_id: string;
        question_text: string;
        sort_order: number;
        created_at: string;
        updated_at: string;
        answer_options: ComplexityAnswerOptionRow[];
      };
      return {
        id: typed.id,
        template_id: typed.template_id,
        question_text: typed.question_text,
        sort_order: typed.sort_order,
        created_at: typed.created_at,
        updated_at: typed.updated_at,
        answer_options: typed.answer_options.map((opt) => ({
          id: opt.id,
          question_id: opt.question_id,
          answer_text: opt.answer_text,
          score: opt.score,
          sort_order: opt.sort_order,
          created_at: opt.created_at,
          updated_at: opt.updated_at,
        })),
      };
    }) || []
  );
}

/**
 * Fetch full template with questions and answers
 */
export async function getQuestionTemplateWithQuestions(
  templateId: string
): Promise<ComplexityQuestionTemplateWithQuestions | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("complexity_question_templates")
    .select(`
      *,
      questions (
        *,
        answer_options (*)
      )
    `)
    .eq("id", templateId)
    .single();

  if (error) {
    console.error("Error fetching template with questions:", error);
    throw new Error(`Failed to fetch template with questions: ${error.message}`);
  }

  if (!data) return null;

  const typed = data as unknown as {
    id: string;
    name: string;
    description: string | null;
    is_default: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    questions: Array<{
      id: string;
      template_id: string;
      question_text: string;
      sort_order: number;
      created_at: string;
      updated_at: string;
      answer_options: ComplexityAnswerOptionRow[];
    }>;
  };

  return {
    id: typed.id,
    name: typed.name,
    description: typed.description,
    is_default: typed.is_default,
    created_by: typed.created_by,
    created_at: typed.created_at,
    updated_at: typed.updated_at,
    questions: typed.questions.map((q) => ({
      id: q.id,
      template_id: q.template_id,
      question_text: q.question_text,
      sort_order: q.sort_order,
      created_at: q.created_at,
      updated_at: q.updated_at,
      answer_options: q.answer_options.map((opt) => ({
        id: opt.id,
        question_id: opt.question_id,
        answer_text: opt.answer_text,
        score: opt.score,
        sort_order: opt.sort_order,
        created_at: opt.created_at,
        updated_at: opt.updated_at,
      })),
    })),
  };
}

/**
 * Create a new question
 */
export async function createQuestion(
  question: ComplexityQuestionInsert
): Promise<ComplexityQuestionRow> {
  const supabase = createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_questions") => {
      insert: (data: ComplexityQuestionInsert) => {
        select: () => {
          single: () => Promise<{
            data: ComplexityQuestionRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  })
    .from("complexity_questions")
    .insert(question)
    .select()
    .single();

  if (error) {
    console.error("Error creating question:", error);
    throw new Error(`Failed to create question: ${error.message}`);
  }

  return data as ComplexityQuestionRow;
}

/**
 * Update an existing question
 */
export async function updateQuestion(
  id: string,
  updates: ComplexityQuestionUpdate
): Promise<ComplexityQuestionRow> {
  const supabase = createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_questions") => {
      update: (data: ComplexityQuestionUpdate) => {
        eq: (field: "id", value: string) => {
          select: () => {
            single: () => Promise<{
              data: ComplexityQuestionRow | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("complexity_questions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating question:", error);
    throw new Error(`Failed to update question: ${error.message}`);
  }

  return data as ComplexityQuestionRow;
}

/**
 * Delete a question (cascades to answer options)
 */
export async function deleteQuestion(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await (supabase as unknown as {
    from: (table: "complexity_questions") => {
      delete: () => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("complexity_questions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting question:", error);
    throw new Error(`Failed to delete question: ${error.message}`);
  }
}

/**
 * Reorder questions within a template
 */
export async function reorderQuestions(
  orders: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const supabase = createClient();

  const promises = orders.map(({ id, sort_order }) =>
    (supabase as unknown as {
      from: (table: "complexity_questions") => {
        update: (data: { sort_order: number; updated_at: string }) => {
          eq: (field: "id", value: string) => Promise<{
            error: { message: string } | null;
          }>;
        };
      };
    })
      .from("complexity_questions")
      .update({ sort_order, updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result.error) {
      console.error("Error reordering questions:", result.error);
      throw new Error(`Failed to reorder questions: ${result.error.message}`);
    }
  }
}

// ============================================================================
// ANSWER OPTIONS
// ============================================================================

/**
 * Create a new answer option
 */
export async function createAnswerOption(
  option: ComplexityAnswerOptionInsert
): Promise<ComplexityAnswerOptionRow> {
  const supabase = createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_answer_options") => {
      insert: (data: ComplexityAnswerOptionInsert) => {
        select: () => {
          single: () => Promise<{
            data: ComplexityAnswerOptionRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  })
    .from("complexity_answer_options")
    .insert(option)
    .select()
    .single();

  if (error) {
    console.error("Error creating answer option:", error);
    throw new Error(`Failed to create answer option: ${error.message}`);
  }

  return data as ComplexityAnswerOptionRow;
}

/**
 * Update an existing answer option
 */
export async function updateAnswerOption(
  id: string,
  updates: ComplexityAnswerOptionUpdate
): Promise<ComplexityAnswerOptionRow> {
  const supabase = createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: "complexity_answer_options") => {
      update: (data: ComplexityAnswerOptionUpdate) => {
        eq: (field: "id", value: string) => {
          select: () => {
            single: () => Promise<{
              data: ComplexityAnswerOptionRow | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  })
    .from("complexity_answer_options")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating answer option:", error);
    throw new Error(`Failed to update answer option: ${error.message}`);
  }

  return data as ComplexityAnswerOptionRow;
}

/**
 * Delete an answer option
 */
export async function deleteAnswerOption(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await (supabase as unknown as {
    from: (table: "complexity_answer_options") => {
      delete: () => {
        eq: (field: "id", value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
    };
  })
    .from("complexity_answer_options")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting answer option:", error);
    throw new Error(`Failed to delete answer option: ${error.message}`);
  }
}

/**
 * Reorder answer options within a question
 */
export async function reorderAnswerOptions(
  orders: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const supabase = createClient();

  const promises = orders.map(({ id, sort_order }) =>
    (supabase as unknown as {
      from: (table: "complexity_answer_options") => {
        update: (data: { sort_order: number; updated_at: string }) => {
          eq: (field: "id", value: string) => Promise<{
            error: { message: string } | null;
          }>;
        };
      };
    })
      .from("complexity_answer_options")
      .update({ sort_order, updated_at: new Date().toISOString() })
      .eq("id", id)
  );

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result.error) {
      console.error("Error reordering answer options:", result.error);
      throw new Error(`Failed to reorder answer options: ${result.error.message}`);
    }
  }
}
