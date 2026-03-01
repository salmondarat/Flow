"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { KanbanColumnId } from "@/components/admin/kanban/types";
import { columnToOrderStatus } from "@/components/admin/kanban/types";

export interface AddTaskModalProps {
  isOpen: boolean;
  columnId: KanbanColumnId;
  onClose: () => void;
}

const columnLabels: Record<KanbanColumnId, { title: string; description: string }> = {
  "todo": {
    title: "New Task",
    description: "Create a new order that will appear in the To Do column",
  },
  "in-progress": {
    title: "New In-Progress Task",
    description: "Create a new order that will be marked as In Progress",
  },
  "under-review": {
    title: "New Task for Review",
    description: "Create a new order that needs review",
  },
  "completed": {
    title: "New Completed Task",
    description: "Create a new order marked as completed",
  },
};

export function AddTaskModal({ isOpen, columnId, onClose }: AddTaskModalProps) {
  const router = useRouter();
  const columnInfo = columnLabels[columnId];
  const targetStatus = columnToOrderStatus(columnId);

  const handleCreateOrder = () => {
    const statusParam = targetStatus !== "draft" ? `?status=${targetStatus}` : "";
    router.push(`/admin/orders/new${statusParam}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{columnInfo.title}</DialogTitle>
          <DialogDescription>{columnInfo.description}</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Clicking <strong>Create Order</strong> will take you to the order creation page.
            {targetStatus !== "draft" && (
              <> The order will be pre-set to <strong>{targetStatus.replace("_", " ")}</strong> status.</>
            )}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrder}>
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
