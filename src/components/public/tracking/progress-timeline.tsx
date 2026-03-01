/**
 * ProgressTimeline component
 * Visual timeline of progress updates
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Image as ImageIcon } from "lucide-react";

interface ProgressLog {
  id: string;
  message: string;
  photo_url: string | null;
  created_at: string;
}

interface ProgressTimelineProps {
  logs: ProgressLog[];
}

export function ProgressTimeline({ logs }: ProgressTimelineProps) {
  if (logs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div key={log.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-primary h-3 w-3 rounded-full" />
                {index < logs.length - 1 && <div className="bg-border min-h-[60px] w-0.5 flex-1" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{log.message}</p>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </Badge>
                </div>
                {log.photo_url && (
                  <div className="mt-2">
                    <a
                      href={log.photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
                    >
                      <ImageIcon className="h-3 w-3" />
                      View Photo
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
