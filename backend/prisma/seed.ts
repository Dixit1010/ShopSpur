import { PrismaClient, Sender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const conversation = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            sender: Sender.user,
            text: "What is your return policy?",
          },
          {
            sender: Sender.ai,
            text: "You can return any item within 30 days of purchase for a full refund.",
          },
        ],
      },
    },
  });

  console.log(`Seed complete. Created conversation: ${conversation.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
