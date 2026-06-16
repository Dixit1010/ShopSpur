import { Request, Response, NextFunction } from "express";
import { Sender } from "@prisma/client";
import { createConversation, getConversation } from "../services/conversationService";
import { saveMessage } from "../services/messageService";
import { generateReply } from "../services/llmService";

export async function postMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { message, sessionId } = req.body;

    let conversationId = sessionId as string | undefined;
    let history: { sender: "user" | "ai"; text: string }[] = [];

    if (conversationId) {
      const existing = await getConversation(conversationId);
      if (!existing) {
        res.status(404).json({ error: "Session not found." });
        return;
      }
      history = existing.messages.map((m) => ({
        sender: m.sender as "user" | "ai",
        text: m.text,
      }));
    } else {
      const conversation = await createConversation();
      conversationId = conversation.id;
    }

    await saveMessage(conversationId, Sender.user, message);

    const reply = await generateReply(history, message);
    await saveMessage(conversationId, Sender.ai, reply);

    res.status(200).json({ reply, sessionId: conversationId });
  } catch (err) {
    next(err);
  }
}

export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { sessionId } = req.params;
    const conversation = await getConversation(sessionId);

    if (!conversation) {
      res.status(404).json({ error: "Session not found." });
      return;
    }

    res.status(200).json({
      sessionId: conversation.id,
      messages: conversation.messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
}
