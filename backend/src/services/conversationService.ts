import { prisma } from "../db/client";

export async function createConversation() {
  return prisma.conversation.create({ data: {} });
}

export async function getConversation(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { timestamp: "asc" } } },
  });
}
