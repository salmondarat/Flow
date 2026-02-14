"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { OrderRow } from "@/types";

const changeRequestSchema = z.object({
  kitId: z.string().min(1, "Please select a kit"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  serviceType: z.string().optional(),
  newComplexity: z.string().optional(),
});

type ChangeRequestForm = z.infer<typeof changeRequestSchema>;

interface ChangeRequestFormProps {
  order: OrderRow & {
    order_items: Array<{
      id: string;
      kit_name: string;
      kit_model: string | null;
      service_type: string;
      complexity: string;
    }>;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function ChangeRequestForm({ order, onSuccess, onCancel }: ChangeRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangeRequestForm>({
    resolver: zodResolver(changeRequestSchema),
    defaultValues: {
      kitId: "",
      description: "",
      serviceType: "",
      newComplexity: "",
    },
  });

  const onSubmit = async (data: ChangeRequestForm) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/client/orders/${order.id}/change-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to submit change request");
      }

      toast.success("Change request submitted successfully!");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting change request:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit change request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceLabel = (service: string) => {
    switch (service) {
      case "full_build":
        return "Full Build";
      case "repair":
        return "Repair";
      case "repaint":
        return "Repaint";
      default:
        return service;
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
      default:
        return complexity;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Change</CardTitle>
        <CardDescription>Submit a change request for your order</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="kitId">Select Kit *</Label>
            <Select
              value={form.watch("kitId")}
              onValueChange={(value) => form.setValue("kitId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a kit" />
              </SelectTrigger>
              <SelectContent>
                {order.order_items?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.kit_name}
                    {item.kit_model && ` (${item.kit_model})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.kitId && (
              <p className="text-destructive mt-1 text-sm">{form.formState.errors.kitId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceType">New Service Type (Optional)</Label>
              <Select
                value={form.watch("serviceType")}
                onValueChange={(value) => form.setValue("serviceType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Same service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_build">Full Build</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="repaint">Repaint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="newComplexity">New Complexity (Optional)</Label>
              <Select
                value={form.watch("newComplexity")}
                onValueChange={(value) => form.setValue("newComplexity", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Same complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the changes you'd like to make..."
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-destructive mt-1 text-sm">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
