"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

/**
 * Chat Widget - Team chat widget with message history
 *
 * Shows chat messages and input field
 */
export interface ChatWidgetProps {
  messages?: Array<{
    id: string;
    sender: string;
    content: string;
    timestamp: string;
  }>;
  onSendMessage?: (message: string) => void;
  className?: string;
}

const defaultMessages = [
  {
    id: "1",
    sender: "Michie",
    content: "Morning Team 👋",
    timestamp: "07:00",
  },
  {
    id: "2",
    sender: "Michie",
    content: "Today we will have a scrum meeting at 10 am.",
    timestamp: "07:01",
  },
  {
    id: "3",
    sender: "me",
    content: "Okay Michie 👍",
    timestamp: "07:03",
  },
];

export function ChatWidget({
  messages = defaultMessages,
  onSendMessage,
  className,
}: ChatWidgetProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage?.(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "dashboard-card dashboard-hover rounded-dashboard-3xl flex h-full flex-col border-dashboard-subtle p-5",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <h3 className="font-bold text-dashboard-primary dark:text-white">
            Design Team Chat
          </h3>
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
          <button className="text-gray-400">•••</button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 mb-4"
      >
        {messages.map((message) => {
          const isMe = message.sender === "me";
          return (
            <div key={message.id} className={cn("flex flex-col", isMe && "items-end")}>
              {!isMe && (
                <span className="text-pink-500 text-[10px] font-bold mb-1">
                  {message.sender}
                </span>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl p-2.5 text-xs",
                  isMe
                    ? "bg-black text-white rounded-tr-none"
                    : "bg-gray-50 border-dashboard-subtle border rounded-tl-none"
                )}
              >
                <p>{message.content}</p>
                <div
                  className={cn(
                    "flex items-center gap-1 mt-1 text-[8px]",
                    isMe ? "justify-end" : ""
                  )}
                >
                  {isMe && (
                    <svg className="h-2.5 w-2.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                  <span className="text-gray-400">{message.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Message Here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border-none bg-gray-50 py-2 px-10 text-xs focus:ring-1 focus:ring-black dark:bg-gray-800 dark:focus:ring-white"
        />
        <div className="absolute inset-y-0 left-3 flex items-center">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.415-6.585a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </div>
        <div className="absolute inset-y-0 right-10 flex items-center">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </div>
        <button
          onClick={handleSend}
          className="absolute inset-y-1 right-1 rounded-lg bg-black px-2 text-white"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
