"use client";
import { motion } from "framer-motion";
import { Message } from "../../types/chat";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-1`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          message.isError
            ? "bg-red-950/60 text-red-300 border border-red-800/40"
            : isUser
            ? "bg-white text-zinc-950 rounded-br-sm"
            : "bg-zinc-900 text-zinc-100 border border-zinc-800/60 rounded-bl-sm"
        }`}
      >
        {message.text}
      </div>
      <span className="text-[11px] text-zinc-600 px-1">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </motion.div>
  );
}
