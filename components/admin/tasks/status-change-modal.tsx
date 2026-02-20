"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OrderStatus } from "@/types";

export interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  taskTitle: string;
}

const statusLabels: Record<OrderStatus, string> = {
  draft: "Draft",
  estimated: "Estimated",
  approved: "Approved",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function StatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  fromStatus,
  toStatus,
  taskTitle,
}: StatusChangeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogDescription>
            Change status for <strong>{taskTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">From</p>
            <p className="font-semibold">{statusLabels[fromStatus]}</p>
          </div>
          <div className="text-muted-foreground">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm text-muted-foreground">To</p>
            <p className="font-semibold">{statusLabels[toStatus]}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
