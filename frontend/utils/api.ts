import { Message } from "../types/chat";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function sendMessage(
  text: string,
  sessionId: string | null
): Promise<{ reply: string; sessionId: string }> {
  const res = await fetch(`${BASE_URL}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, ...(sessionId && { sessionId }) }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to send message.");
  }
  return res.json();
}

export async function fetchHistory(sessionId: string): Promise<Message[]> {
  const res = await fetch(`${BASE_URL}/chat/${sessionId}`);
  if (!res.ok) throw new Error("Session not found.");
  const data = await res.json();
  return data.messages;
}
