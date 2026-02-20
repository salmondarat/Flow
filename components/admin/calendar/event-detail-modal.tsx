"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import type { CalendarEvent, EventColor } from "./types";

export interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}

const colorLabels: Record<EventColor, string> = {
  overdue: "Overdue",
  "due-today": "Due Today",
  upcoming: "Upcoming",
  completed: "Completed",
  created: "New Order",
};

export function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            {colorLabels[event.color]} - {event.type.replace("-", " ")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Calendar className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-muted-foreground text-sm">
                {event.date.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Badge variant="outline">{event.status.replace("_", " ")}</Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button asChild>
            <Link href={`/admin/orders/${event.orderId}`}>View Order</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
