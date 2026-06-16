import { Sender } from "@prisma/client";
import { prisma } from "../db/client";

export async function saveMessage(
  conversationId: string,
  sender: Sender,
  text: string
) {
  return prisma.message.create({
    data: { conversationId, sender, text },
  });
}
