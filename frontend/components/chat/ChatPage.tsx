"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Message } from "../../types/chat";
import { sendMessage, fetchHistory } from "../../utils/api";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const SESSION_KEY = "spur_session_id";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return;
    setSessionId(stored);
    fetchHistory(stored)
      .then(setMessages)
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
        setSessionId(null);
      });
  }, []);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const data = await sendMessage(text, sessionId);
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (!sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(SESSION_KEY, data.sessionId);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl h-[85vh] flex flex-col rounded-3xl overflow-hidden border border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl"
        style={{
          boxShadow: "0 0 80px -20px rgba(255,255,255,0.04), 0 0 40px -10px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800/60">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm">
              ✦
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100 leading-none">ShopSpurs Support System</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">AI-powered · Usually replies instantly</p>
          </div>
        </div>

        {/* Messages */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input */}
        <div className="border-t border-zinc-800/60">
          <ChatInput
            value={inputText}
            onChange={setInputText}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </motion.div>
    </div>
  );
}
