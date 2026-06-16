import { z } from "zod";

export const postMessageSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message too long"),
  sessionId: z.string().optional(),
});

export const getSessionSchema = z.object({
  sessionId: z.string().min(1),
});
