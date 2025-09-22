 import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST = create transaction (deposit, withdraw, transfer, balance check)
export async function POST(req: Request) {
  try {
    const { type, amount, userId, recipientAccount } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    let updatedUser;
    let transaction;

    switch (type) {
      case "deposit":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { balance: { increment: amount } },
        });

        transaction = await prisma.transaction.create({
          data: {
            type: "deposit",
            amount,
            balance: updatedUser.balance,
            userId,
          },
        });
        break;

      case "withdraw":
        if (user.balance < amount) {
          return Response.json({ error: "Insufficient balance" }, { status: 400 });
        }

        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { balance: { decrement: amount } },
        });

        transaction = await prisma.transaction.create({
          data: {
            type: "withdraw",
            amount,
            balance: updatedUser.balance,
            userId,
          },
        });
        break;

      case "transfer":
        if (!recipientAccount) {
          return Response.json({ error: "Recipient account required" }, { status: 400 });
        }

        const recipient = await prisma.user.findUnique({
          where: { accountNo: recipientAccount },
        });

        if (!recipient) {
          return Response.json({ error: "Recipient not found" }, { status: 404 });
        }

        if (user.balance < amount) {
          return Response.json({ error: "Insufficient balance" }, { status: 400 });
        }

        // Perform transfer inside a transaction block
        const [sender, receiver] = await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { balance: { decrement: amount } },
          }),
          prisma.user.update({
            where: { id: recipient.id },
            data: { balance: { increment: amount } },
          }),
        ]);

        transaction = await prisma.transaction.create({
          data: {
            type: "transfer (sent)",
            amount,
            balance: sender.balance,
            userId,
          },
        });

        await prisma.transaction.create({
          data: {
            type: "transfer (received)",
            amount,
            balance: receiver.balance,
            userId: recipient.id,
          },
        });
        break;

      case "balance":
        return Response.json({ balance: user.balance });

      default:
        return Response.json({ error: "Invalid transaction type" }, { status: 400 });
    }

    return Response.json({
      message: "Transaction successful",
      transaction,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// GET = fetch recent transactions for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId query param is required" }, { status: 400 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
      take: 10, // fetch last 10 transactions
    });

    return Response.json({ transactions });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
