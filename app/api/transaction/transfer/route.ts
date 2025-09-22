export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  const user = getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, recipient } = await req.json();
  if (!amount || amount <= 0 || !recipient) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const sender = await prisma.user.findUnique({ where: { id: user.id } });
  const receiver = await prisma.user.findUnique({ where: { accountNo: recipient } });

  if (!sender || sender.balance < amount) {
    return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
  }
  if (!receiver) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  // Perform transfer
  const updatedSender = await prisma.user.update({
    where: { id: sender.id },
    data: { balance: { decrement: amount } },
  });

  await prisma.user.update({
    where: { id: receiver.id },
    data: { balance: { increment: amount } },
  });

  // Record transactions
  await prisma.transaction.createMany({
    data: [
      { type: "transfer-out", amount, balance: updatedSender.balance, userId: sender.id },
      { type: "transfer-in", amount, balance: receiver.balance + amount, userId: receiver.id },
    ],
  });

  return NextResponse.json({ message: "Transfer successful", balance: updatedSender.balance });
}
