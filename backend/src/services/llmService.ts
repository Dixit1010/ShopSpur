import Groq from "groq-sdk";
import { MODEL_NAME, MAX_TOKENS_OUTPUT } from "../config/llm";
import { STORE_POLICIES } from "../config/storePolicies";
import { trimHistory, HistoryMessage } from "../utils/trimHistory";
import { buildPrompt } from "../utils/buildPrompt";

let groq: Groq;
try {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "missing" });
} catch (e) {
  // Prevent server crash if env is completely missing
  groq = new Groq({ apiKey: "missing" });
}

export async function generateReply(
  history: HistoryMessage[],
  userMessage: string
): Promise<string> {
  try {
    const trimmed = trimHistory(history);
    const prompt = buildPrompt(STORE_POLICIES, trimmed, userMessage);

    const completion = await groq.chat.completions.create({
      model: MODEL_NAME,
      max_tokens: MAX_TOKENS_OUTPUT,
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return "I didn't get a response. Please rephrase your question.";
    }

    return reply;
  } catch (err: unknown) {
    const error = err as { status?: number; code?: string; message?: string };

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
    if (error.status === 429) {
      return "Our AI assistant is a bit busy. Please wait a few seconds and try again.";
    }
    if (error.status === 401) {
      return "Something went wrong on our end. Please try again.";
    }

    process.stderr.write(
      `[LLM ERROR] ${new Date().toISOString()} ${error.message}\n`
    );
    return "Something went wrong on our end. Please try again.";
  }
}
