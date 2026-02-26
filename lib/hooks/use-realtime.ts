"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Database } from "@/types";

type Tables = Database["public"]["Tables"];

export interface RealtimeSubscriptionOptions {
  table: keyof Tables;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onError?: (error: Error) => void;
}

export function useRealtimeSubscription(options: RealtimeSubscriptionOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const subscribe = useCallback(() => {
    const supabase = createClient();

    const channelName = `${options.table}_${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: options.event || "*",
          schema: "public",
          table: options.table as string,
          filter: options.filter,
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              options.onInsert?.(payload);
              break;
            case "UPDATE":
              options.onUpdate?.(payload);
              break;
            case "DELETE":
              options.onDelete?.(payload);
              break;
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setConnectionError(null);
        } else if (status === "TIMED_OUT" || status === "CLOSED" || status === "CHANNEL_ERROR") {
          setIsConnected(false);
          setConnectionError(new Error("Failed to connect to realtime"));
          options.onError?.(new Error("Failed to connect to realtime"));
        }
      });

    channelRef.current = channel;

    return channel;
  }, [options]);

  useEffect(() => {
    const channel = subscribe();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [subscribe]);

  return {
    isConnected,
    connectionError,
  };
}

export function useOrderRealtime(
  orderId: string,
  callbacks: {
    onUpdate?: (order: any) => void;
    onProgressLog?: (log: any) => void;
    onChangeRequest?: (request: any) => void;
  }
) {
  // Subscribe to order updates
  const orderSubscription = useRealtimeSubscription({
    table: "orders",
    filter: `id=eq.${orderId}`,
    event: "UPDATE",
    onUpdate: (payload) => {
      callbacks.onUpdate?.(payload.new);
    },
  });

  // Subscribe to progress logs
  const progressSubscription = useRealtimeSubscription({
    table: "progress_logs",
    filter: `order_id=eq.${orderId}`,
    event: "INSERT",
    onInsert: (payload) => {
      callbacks.onProgressLog?.(payload.new);
    },
  });

  // Subscribe to change requests
  const changeRequestSubscription = useRealtimeSubscription({
    table: "change_requests",
    filter: `order_id=eq.${orderId}`,
    event: "*",
    onInsert: (payload) => {
      callbacks.onChangeRequest?.(payload.new);
    },
    onUpdate: (payload) => {
      callbacks.onChangeRequest?.(payload.new);
    },
  });

  return {
    isConnected:
      orderSubscription.isConnected &&
      progressSubscription.isConnected &&
      changeRequestSubscription.isConnected,
  };
}

// Fallback polling hook for when realtime is unavailable
export function usePolling<T>(
  fetchFn: () => Promise<T>,
  callbacks: {
    onData?: (data: T) => void;
    onError?: (error: Error) => void;
  },
  options: {
    interval?: number;
    enabled?: boolean;
  } = {}
) {
  const { interval = 10000, enabled = true } = options;
  const [isPolling, setIsPolling] = useState<boolean>(enabled);

  useEffect(() => {
    if (!enabled) return;

    const poll = async () => {
      try {
        const data = await fetchFn();
        callbacks.onData?.(data);
      } catch (error) {
        callbacks.onError?.(error as Error);
      }
    };

    // Initial fetch
    poll();

    const intervalId = setInterval(poll, interval);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [fetchFn, callbacks, interval, enabled]);

  return { isPolling };
}
