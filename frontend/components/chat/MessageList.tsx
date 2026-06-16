"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Message } from "../../types/chat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface Props {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 scrollbar-hide">
      {messages.length === 0 && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-16">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <span className="text-lg">✦</span>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs">
            Ask about shipping, returns, orders, or support hours.
          </p>
        </div>
      )}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <AnimatePresence>
        {isLoading && <TypingIndicator />}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
