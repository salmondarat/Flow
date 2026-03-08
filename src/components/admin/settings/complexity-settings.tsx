"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import {
  Layers,
  FileText,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  Star,
  StarOff,
  AlertTriangle,
  ChevronRight,
  Calculator,
  CheckCircle2,
} from "lucide-react";
import type { ComplexityTierRow } from "@/types";

interface ComplexityTemplate {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  question_count: number;
  created_at: string;
}

interface LegacyComplexity {
  id: string;
  name: string;
  slug: string;
  multiplier: number;
  is_active: boolean;
  sort_order: number;
}

export function ComplexitySettings() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Tiers state
  const [tiers, setTiers] = useState<ComplexityTierRow[]>([]);
  const [tierValidation, setTierValidation] = useState<any>(null);

  // Templates state
  const [templates, setTemplates] = useState<ComplexityTemplate[]>([]);

  // Legacy complexities state
  const [legacyComplexities, setLegacyComplexities] = useState<LegacyComplexity[]>([]);

  // Delete dialogs
  const [deleteTierOpen, setDeleteTierOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<ComplexityTierRow | null>(null);
  const [deleteTemplateOpen, setDeleteTemplateOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ComplexityTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchTiers(), fetchTemplates(), fetchLegacyComplexities()]);
    setIsLoading(false);
  };

  const fetchTiers = async () => {
    try {
      const response = await fetch("/api/admin/complexity-tiers?activeOnly=false");
      if (!response.ok) throw new Error("Failed to fetch tiers");
      const data = await response.json();
      setTiers(data.tiers || []);
      setTierValidation(data.validation);
    } catch (error) {
      console.error("Error fetching tiers:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/complexity-questions?includeInactive=true");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      // Map templates with question counts
      const templatesWithCounts = await Promise.all(
        (data.templates || []).map(async (t: any) => {
          try {
            const detailRes = await fetch(`/api/admin/complexity-questions/${t.id}`);
            const detailData = await detailRes.json();
            return {
              ...t,
              question_count: detailData.questions?.length || 0,
            };
          } catch {
            return { ...t, question_count: 0 };
          }
        })
      );
      setTemplates(templatesWithCounts);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const fetchLegacyComplexities = async () => {
    try {
      const response = await fetch("/api/admin/complexities");
      if (!response.ok) throw new Error("Failed to fetch complexities");
      const data = await response.json();
      setLegacyComplexities(data.complexities || []);
    } catch (error) {
      console.error("Error fetching legacy complexities:", error);
    }
  };

  const handleSetDefaultTemplate = async (template: ComplexityTemplate) => {
    try {
      const response = await fetch("/api/admin/complexity-questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, setDefault: true }),
      });

      if (!response.ok) throw new Error("Failed to set default");

      toast.success("Default template updated");
      fetchTemplates();
    } catch (error) {
      console.error("Error setting default:", error);
      toast.error("Failed to set default template");
    }
  };

  const handleDeleteTier = async () => {
    if (!tierToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/complexity-tiers/${tierToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Tier deleted");
      setDeleteTierOpen(false);
      setTierToDelete(null);
      fetchTiers();
    } catch (error) {
      toast.error("Failed to delete tier");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/complexity-questions/${templateToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Template deleted");
      setDeleteTemplateOpen(false);
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (error) {
      toast.error("Failed to delete template");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSeedDefaults = async () => {
    try {
      const response = await fetch("/api/admin/complexity/seed-defaults", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to seed");
      toast.success("Default complexity data created");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to create defaults");
    }
  };

  const getScoreRangeText = (tier: ComplexityTierRow) => {
    if (tier.max_score === null) return `${tier.min_score}+`;
    return `${tier.min_score} - ${tier.max_score}`;
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 1.6) return "bg-red-100 text-red-800";
    if (multiplier >= 1.3) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading complexity settings...</div>
      </div>
    );
  }

  const hasData = tiers.length > 0 || templates.length > 0 || legacyComplexities.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Complexity Management</h2>
          <p className="text-muted-foreground mt-1">
            Configure complexity assessment, tiers, and legacy levels
          </p>
        </div>
        {!hasData && (
          <Button onClick={handleSeedDefaults} variant="outline">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Create Defaults
          </Button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="hover:border-primary cursor-pointer"
          onClick={() => setActiveSection("tiers")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <BarChart3 className="text-muted-foreground h-5 w-5" />
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            </div>
            <CardTitle className="text-lg">Complexity Tiers</CardTitle>
            <CardDescription>Score ranges with multipliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tiers.length}</div>
            <p className="text-muted-foreground text-xs">
              {tiers.filter((t) => t.is_active).length} active
            </p>
            {tierValidation && !tierValidation.valid && (
              <Badge variant="destructive" className="mt-2 text-xs">
                Validation Issues
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card
          className="hover:border-primary cursor-pointer"
          onClick={() => setActiveSection("questions")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <FileText className="text-muted-foreground h-5 w-5" />
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            </div>
            <CardTitle className="text-lg">Question Templates</CardTitle>
            <CardDescription>Assessment questionnaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-muted-foreground text-xs">
              {templates.filter((t) => t.is_default).length} default
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:border-primary cursor-pointer"
          onClick={() => setActiveSection("legacy")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Layers className="text-muted-foreground h-5 w-5" />
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            </div>
            <CardTitle className="text-lg">Legacy Levels</CardTitle>
            <CardDescription>Backward compatibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{legacyComplexities.length}</div>
            <p className="text-muted-foreground text-xs">
              {legacyComplexities.filter((c) => c.is_active).length} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Alert */}
      {tierValidation && !tierValidation.valid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {tierValidation.warnings.map((warning: string, i: number) => (
                <p key={i} className="text-sm">
                  {warning}
                </p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="legacy">Legacy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                How Complexity Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Question Templates</h4>
                <p className="text-muted-foreground text-sm">
                  Create questionnaires with weighted answer options. Each answer contributes to a
                  total complexity score.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. Complexity Tiers</h4>
                <p className="text-muted-foreground text-sm">
                  Define score ranges (e.g., 0-10 = Low, 11-20 = Medium) with multipliers that
                  affect pricing.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. Client Assessment</h4>
                <p className="text-muted-foreground text-sm">
                  Clients answer questions during order creation. Their total score determines the
                  complexity tier and estimated price.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">4. Legacy Support</h4>
                <p className="text-muted-foreground text-sm">
                  Existing orders using the old complexity system continue to work. New orders use
                  the questionnaire-based system.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Complexity Tiers</h3>
            <Link href="/admin/settings/complexity-tiers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Tier
              </Button>
            </Link>
          </div>

          {tiers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No complexity tiers yet</p>
              <Link href="/admin/settings/complexity-tiers/new">
                <Button>Create Your First Tier</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tiers.map((tier) => (
                <Card key={tier.id} className={tier.is_active ? "" : "opacity-60"}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {tier.name}
                          {!tier.is_active && <Badge variant="secondary">Inactive</Badge>}
                        </CardTitle>
                        <CardDescription>{tier.description || "No description"}</CardDescription>
                      </div>
                      <Badge className={getMultiplierColor(tier.multiplier)}>
                        {tier.multiplier.toFixed(1)}x
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Score Range:</span>
                        <span className="font-medium">{getScoreRangeText(tier)}</span>
                      </div>
                      {tier.base_min_price_cents !== null && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Price Range:</span>
                          <span className="font-medium">
                            ${(tier.base_min_price_cents / 100).toFixed(0)}- $
                            {(tier.base_max_price_cents! / 100).toFixed(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/admin/settings/complexity-tiers/${tier.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Pencil className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setTierToDelete(tier);
                          setDeleteTierOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Question Templates</h3>
            <Link href="/admin/settings/complexity-questions/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </Link>
          </div>

          {templates.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No question templates yet</p>
              <Link href="/admin/settings/complexity-questions/new">
                <Button>Create Your First Template</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {template.name}
                          {template.is_default && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              Default
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {template.description || "No description"}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{template.question_count} questions</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {!template.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefaultTemplate(template)}
                        >
                          <StarOff className="h-4 w-4" />
                        </Button>
                      )}
                      <Link
                        href={`/admin/settings/complexity-questions/${template.id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Pencil className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setTemplateToDelete(template);
                          setDeleteTemplateOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="legacy" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Legacy Complexity Levels</h3>
            <Link href="/admin/settings/complexities/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Level
              </Button>
            </Link>
          </div>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Legacy complexity levels are maintained for backward compatibility with existing
              orders. New orders should use the complexity questionnaire system.
            </AlertDescription>
          </Alert>

          {legacyComplexities.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No legacy complexity levels</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {legacyComplexities.map((complexity) => (
                <Card key={complexity.id} className={complexity.is_active ? "" : "opacity-60"}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{complexity.name}</CardTitle>
                      <Badge className={getMultiplierColor(complexity.multiplier)}>
                        {complexity.multiplier.toFixed(1)}x
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Slug:</span>
                      <span className="font-mono text-xs">{complexity.slug}</span>
                    </div>
                    {!complexity.is_active && (
                      <Badge variant="secondary" className="mt-2">
                        Inactive
                      </Badge>
                    )}
                    <div className="mt-4">
                      <Link href={`/admin/settings/complexities/${complexity.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Pencil className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Tier Dialog */}
      <Dialog open={deleteTierOpen} onOpenChange={setDeleteTierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{tierToDelete?.name}&quot;? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTierOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTier} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={deleteTemplateOpen} onOpenChange={setDeleteTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{templateToDelete?.name}&quot;? This will also
              delete all questions and answers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTemplateOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
