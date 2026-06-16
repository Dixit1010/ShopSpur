import { MAX_HISTORY_TURNS, MAX_HISTORY_CHARS } from "../config/llm";

export interface HistoryMessage {
  sender: "user" | "ai";
  text: string;
}

export function trimHistory(messages: HistoryMessage[]): HistoryMessage[] {
  let trimmed = messages.slice(-MAX_HISTORY_TURNS);

  while (trimmed.length > 1) {
    const charCount = trimmed.reduce((sum, m) => sum + m.text.length, 0);
    if (charCount <= MAX_HISTORY_CHARS) break;
    trimmed = trimmed.slice(2);
  }

  return trimmed;
}
