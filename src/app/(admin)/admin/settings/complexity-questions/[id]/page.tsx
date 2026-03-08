/**
 * Edit Question Template Page
 * Allows admins to edit a complexity question template and manage its questions
 */

"use client";

import { unstable_noStore } from "next/cache";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Loader2, Save, Plus, Trash2, GripVertical, Check, Star } from "lucide-react";
import { toast } from "sonner";
import type {
  ComplexityQuestionTemplateRow,
  ComplexityQuestionRow,
  ComplexityAnswerOptionRow,
  ComplexityQuestionWithAnswers,
} from "@/types";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

interface TemplateData {
  template: ComplexityQuestionTemplateRow;
  questions: ComplexityQuestionWithAnswers[];
}

export default function EditQuestionTemplatePage() {
  unstable_noStore();
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<TemplateData | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  // Question management
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<ComplexityQuestionRow | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [deletingQuestion, setDeletingQuestion] = useState<ComplexityQuestionRow | null>(null);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);

  // Answer option management
  const [selectedQuestion, setSelectedQuestion] = useState<ComplexityQuestionWithAnswers | null>(
    null
  );
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");
  const [newOptionScore, setNewOptionScore] = useState("1");
  const [editingOption, setEditingOption] = useState<ComplexityAnswerOptionRow | null>(null);
  const [editOptionText, setEditOptionText] = useState("");
  const [editOptionScore, setEditOptionScore] = useState("");
  const [deletingOption, setDeletingOption] = useState<ComplexityAnswerOptionRow | null>(null);
  const [isSavingOption, setIsSavingOption] = useState(false);

  // Drag and drop state
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
  const [draggedOptionId, setDraggedOptionId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    fetchData();
  }, [templateId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/complexity-questions/${templateId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch template data");
      }

      const result = await response.json();

      if (!result.template) {
        toast.error("Question template not found");
        router.push("/admin/settings/complexity-questions");
        return;
      }

      setData(result);
      setFormData({
        name: result.template.name,
        description: result.template.description || "",
        isDefault: result.template.is_default,
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      toast.error("Failed to load template data");
      router.push("/admin/settings/complexity-questions");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/complexity-questions/${templateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update template");
      }

      // Handle default status change separately if needed
      if (formData.isDefault !== data?.template.is_default && formData.isDefault) {
        const defaultResponse = await fetch("/api/admin/complexity-questions", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            templateId,
            setDefault: true,
          }),
        });

        if (!defaultResponse.ok) {
          throw new Error("Failed to set as default template");
        }
      }

      toast.success("Question template updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  // Question handlers
  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) {
      toast.error("Question text is required");
      return;
    }

    setIsSavingQuestion(true);
    try {
      const response = await fetch(`/api/admin/complexity-questions/${templateId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionText: newQuestionText.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add question");
      }

      toast.success("Question added successfully");
      setNewQuestionText("");
      setIsAddingQuestion(false);
      fetchData();
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add question");
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !editQuestionText.trim()) {
      toast.error("Question text is required");
      return;
    }

    setIsSavingQuestion(true);
    try {
      const response = await fetch(
        `/api/admin/complexity-questions/${templateId}/questions/${editingQuestion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionText: editQuestionText.trim(),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update question");
      }

      toast.success("Question updated successfully");
      setEditingQuestion(null);
      setEditQuestionText("");
      fetchData();
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update question");
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!deletingQuestion) return;

    setIsSavingQuestion(true);
    try {
      const response = await fetch(
        `/api/admin/complexity-questions/${templateId}/questions/${deletingQuestion.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete question");
      }

      toast.success("Question deleted successfully");
      setDeletingQuestion(null);
      if (selectedQuestion?.id === deletingQuestion.id) {
        setSelectedQuestion(null);
      }
      fetchData();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete question");
    } finally {
      setIsSavingQuestion(false);
    }
  };

  // Reorder questions
  const handleReorderQuestions = async (draggedId: string, targetIndex: number) => {
    if (!data) return;

    const questions = [...data.questions];
    const draggedIndex = questions.findIndex((q) => q.id === draggedId);
    if (draggedIndex === -1 || draggedIndex === targetIndex) return;

    // Reorder locally first for immediate feedback
    const [draggedQuestion] = questions.splice(draggedIndex, 1);
    questions.splice(targetIndex, 0, draggedQuestion);

    // Update local state
    setData({ ...data, questions });

    // Prepare reorder data
    const orders = questions.map((q, index) => ({
      id: q.id,
      sort_order: index,
    }));

    setIsReordering(true);
    try {
      const response = await fetch(
        `/api/admin/complexity-questions/${templateId}/questions/reorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orders }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reorder questions");
      }

      toast.success("Questions reordered successfully");
    } catch (error) {
      console.error("Error reordering questions:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reorder questions");
      // Revert by fetching fresh data
      fetchData();
    } finally {
      setIsReordering(false);
      setDraggedQuestionId(null);
      setDragOverIndex(null);
    }
  };

  // Reorder answer options
  const handleReorderOptions = async (draggedId: string, targetIndex: number) => {
    if (!selectedQuestion) return;

    const options = [...selectedQuestion.answer_options];
    const draggedIndex = options.findIndex((o) => o.id === draggedId);
    if (draggedIndex === -1 || draggedIndex === targetIndex) return;

    // Reorder locally first for immediate feedback
    const [draggedOption] = options.splice(draggedIndex, 1);
    options.splice(targetIndex, 0, draggedOption);

    // Update local state
    setSelectedQuestion({ ...selectedQuestion, answer_options: options });

    // Prepare reorder data
    const orders = options.map((o, index) => ({
      id: o.id,
      sort_order: index,
    }));

    setIsReordering(true);
    try {
      const response = await fetch(
        `/api/admin/complexity-questions/${templateId}/questions/${selectedQuestion.id}/options/reorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orders }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reorder options");
      }

      toast.success("Options reordered successfully");
      fetchData();
    } catch (error) {
      console.error("Error reordering options:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reorder options");
      // Refresh to get correct state
      const updatedResponse = await fetch(`/api/admin/complexity-questions/${templateId}`);
      const updatedData = await updatedResponse.json();
      const updatedQuestion = updatedData.questions.find(
        (q: ComplexityQuestionWithAnswers) => q.id === selectedQuestion.id
      );
      if (updatedQuestion) {
        setSelectedQuestion(updatedQuestion);
      }
    } finally {
      setIsReordering(false);
      setDraggedOptionId(null);
    }
  };

  // Answer option handlers
  const handleAddOption = async () => {
    if (!selectedQuestion || !newOptionText.trim()) {
      toast.error("Option text is required");
      return;
    }

    const score = parseInt(newOptionScore);
    if (isNaN(score) || score < 0) {
      toast.error("Score must be a non-negative number");
      return;
    }

    setIsSavingOption(true);
    try {
      const response = await fetch(
        `/api/admin/complexity-questions/${templateId}/questions/${selectedQuestion.id}/options`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answerText: newOptionText.trim(),
            score,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add option");
      }

      toast.success("Answer option added successfully");
      setNewOptionText("");
      setNewOptionScore("1");
      setIsAddingOption(false);
      fetchData();

      // Refresh selected question
      const updatedResponse = await fetch(`/api/admin/complexity-questions/${templateId}`);
      const updatedData = await updatedResponse.json();
      const updatedQuestion = updatedData.questions.find(
        (q: ComplexityQuestionWithAnswers) => q.id === selectedQuestion.id
      );
      if (updatedQuestion) {
        setSelectedQuestion(updatedQuestion);
      }
    } catch (error) {
      console.error("Error adding option:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add option");
    } finally {
      setIsSavingOption(false);
    }
  };

  const handleUpdateOption = async () => {
    if (!selectedQuestion || !editingOption || !editOptionText.trim()) {
      toast.error("Option text is required");
      return;
    }

    const score = parseInt(editOptionScore);
    if (isNaN(score) || score < 0) {
      toast.error("Score must be a non-negative number");
      return;
    }

    setIsSavingOption(true);
    try {
      const response = await fetch(
        `/api/admin/complexity-questions/${templateId}/questions/${selectedQuestion.id}/options/${editingOption.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answerText: editOptionText.trim(),
            score,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update option");
      }

      toast.success("Answer option updated successfully");
      setEditingOption(null);
      setEditOptionText("");
      setEditOptionScore("");
      fetchData();

      // Refresh selected question
      const updatedResponse = await fetch(`/api/admin/complexity-questions/${templateId}`);
      const updatedData = await updatedResponse.json();
      const updatedQuestion = updatedData.questions.find(
        (q: ComplexityQuestionWithAnswers) => q.id === selectedQuestion.id
      );
      if (updatedQuestion) {
        setSelectedQuestion(updatedQuestion);
      }
    } catch (error) {
      console.error("Error updating option:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update option");
    } finally {
      setIsSavingOption(false);
    }
  };

  const handleDeleteOption = async () => {
    if (!selectedQuestion || !deletingOption) return;

    setIsSavingOption(true);
    try {
      const response = await fetch(
        `/api/admin/complexity-questions/${templateId}/questions/${selectedQuestion.id}/options/${deletingOption.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete option");
      }

      toast.success("Answer option deleted successfully");
      setDeletingOption(null);
      fetchData();

      // Refresh selected question
      const updatedResponse = await fetch(`/api/admin/complexity-questions/${templateId}`);
      const updatedData = await updatedResponse.json();
      const updatedQuestion = updatedData.questions.find(
        (q: ComplexityQuestionWithAnswers) => q.id === selectedQuestion.id
      );
      if (updatedQuestion) {
        setSelectedQuestion(updatedQuestion);
      }
    } catch (error) {
      console.error("Error deleting option:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete option");
    } finally {
      setIsSavingOption(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Template not found</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/admin/settings/complexity-questions"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Question Templates
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold">
                {data.template.name}
                {data.template.is_default && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    Default
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-2">
                {data.template.description || "No description"}
              </p>
            </div>
          </div>

          {/* Template Details */}
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Edit the template name and description</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                  />
                  {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isDefault: checked }))
                    }
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Set as default template
                  </Label>
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Questions Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Questions ({data.questions.length})</CardTitle>
                <CardDescription>Manage questions and their answer options</CardDescription>
              </div>
              <Button onClick={() => setIsAddingQuestion(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent>
              {data.questions.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">No questions yet</p>
                  <Button onClick={() => setIsAddingQuestion(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.questions.map((question, index) => (
                    <div
                      key={question.id}
                      draggable
                      onDragStart={() => {
                        setDraggedQuestionId(question.id);
                      }}
                      onDragEnd={() => {
                        if (dragOverIndex !== null && draggedQuestionId) {
                          handleReorderQuestions(draggedQuestionId, dragOverIndex);
                        }
                        setDraggedQuestionId(null);
                        setDragOverIndex(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedQuestionId && draggedQuestionId !== question.id) {
                          setDragOverIndex(index);
                        }
                      }}
                      className={`cursor-move rounded-lg border p-4 transition-all ${
                        selectedQuestion?.id === question.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-muted-foreground/25"
                      } ${draggedQuestionId === question.id ? "opacity-50" : ""} ${
                        dragOverIndex === index && draggedQuestionId !== question.id
                          ? "border-primary bg-primary/5 border-dashed"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="text-muted-foreground mt-1 cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div className="text-muted-foreground mt-1 text-sm">{index + 1}.</div>
                          <div className="flex-1">
                            <p className="font-medium">{question.question_text}</p>
                            <p className="text-muted-foreground text-sm">
                              {question.answer_options.length} answer option
                              {question.answer_options.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedQuestion(question);
                              setIsAddingOption(false);
                            }}
                          >
                            Manage Options
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingQuestion(question);
                              setEditQuestionText(question.question_text);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingQuestion(question)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Answer Options Section */}
          {selectedQuestion && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Answer Options</CardTitle>
                  <CardDescription className="max-w-lg truncate">
                    {selectedQuestion.question_text}
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddingOption(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </CardHeader>
              <CardContent>
                {selectedQuestion.answer_options.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">No answer options yet</p>
                    <Button onClick={() => setIsAddingOption(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Option
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedQuestion.answer_options
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((option, optionIndex) => (
                        <div
                          key={option.id}
                          draggable
                          onDragStart={() => {
                            setDraggedOptionId(option.id);
                          }}
                          onDragEnd={() => {
                            setDraggedOptionId(null);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedOptionId && draggedOptionId !== option.id) {
                              // Find current index of dragged item
                              const sortedOptions = [...selectedQuestion.answer_options].sort(
                                (a, b) => a.sort_order - b.sort_order
                              );
                              const draggedIdx = sortedOptions.findIndex(
                                (o) => o.id === draggedOptionId
                              );
                              if (draggedIdx !== -1 && draggedIdx !== optionIndex) {
                                handleReorderOptions(draggedOptionId, optionIndex);
                              }
                            }
                          }}
                          className={`flex cursor-move items-center justify-between rounded-lg border p-3 transition-all ${
                            draggedOptionId === option.id ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-muted-foreground cursor-grab active:cursor-grabbing">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <Badge variant="secondary">Score: {option.score}</Badge>
                            <span>{option.answer_text}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingOption(option);
                                setEditOptionText(option.answer_text);
                                setEditOptionScore(option.score.toString());
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletingOption(option)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Add Question Dialog */}
      <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
            <DialogDescription>Enter the question text for this template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newQuestion">Question</Label>
              <Input
                id="newQuestion"
                placeholder="e.g., What is the scale of the model?"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingQuestion(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestion} disabled={isSavingQuestion}>
              {isSavingQuestion ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Question"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog
        open={!!editingQuestion}
        onOpenChange={(open) => {
          if (!open) {
            setEditingQuestion(null);
            setEditQuestionText("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Update the question text</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editQuestion">Question</Label>
              <Input
                id="editQuestion"
                value={editQuestionText}
                onChange={(e) => setEditQuestionText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingQuestion(null);
                setEditQuestionText("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateQuestion} disabled={isSavingQuestion}>
              {isSavingQuestion ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Question Dialog */}
      <Dialog
        open={!!deletingQuestion}
        onOpenChange={(open) => {
          if (!open) setDeletingQuestion(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingQuestion?.question_text}&quot;? This
              will also delete all answer options for this question.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingQuestion(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQuestion}
              disabled={isSavingQuestion}
            >
              {isSavingQuestion ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Option Dialog */}
      <Dialog open={isAddingOption} onOpenChange={setIsAddingOption}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Answer Option</DialogTitle>
            <DialogDescription>Add an answer option with a score</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newOptionText">Answer Text</Label>
              <Input
                id="newOptionText"
                placeholder="e.g., 1:144 Scale"
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newOptionScore">Score</Label>
              <Input
                id="newOptionScore"
                type="number"
                min="0"
                value={newOptionScore}
                onChange={(e) => setNewOptionScore(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Higher scores indicate higher complexity
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingOption(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOption} disabled={isSavingOption}>
              {isSavingOption ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Option"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Option Dialog */}
      <Dialog
        open={!!editingOption}
        onOpenChange={(open) => {
          if (!open) {
            setEditingOption(null);
            setEditOptionText("");
            setEditOptionScore("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Answer Option</DialogTitle>
            <DialogDescription>Update the answer text and score</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editOptionText">Answer Text</Label>
              <Input
                id="editOptionText"
                value={editOptionText}
                onChange={(e) => setEditOptionText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editOptionScore">Score</Label>
              <Input
                id="editOptionScore"
                type="number"
                min="0"
                value={editOptionScore}
                onChange={(e) => setEditOptionScore(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingOption(null);
                setEditOptionText("");
                setEditOptionScore("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateOption} disabled={isSavingOption}>
              {isSavingOption ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Option Dialog */}
      <Dialog
        open={!!deletingOption}
        onOpenChange={(open) => {
          if (!open) setDeletingOption(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Answer Option</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingOption?.answer_text}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingOption(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOption} disabled={isSavingOption}>
              {isSavingOption ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
