export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  const user = getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount } = await req.json();
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || dbUser.balance < amount) {
    return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { balance: { decrement: amount } },
  });

  await prisma.transaction.create({
    data: {
      type: "withdraw",
      amount,
      balance: updatedUser.balance,
      userId: user.id,
    },
  });

  return NextResponse.json({ message: "Withdrawal successful", balance: updatedUser.balance });
}
