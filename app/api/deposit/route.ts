import { NextResponse } from "next/server";
import prisma from '@/lib/prisma' // adjust path if needed
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount } = body;

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update balance
    const newBalance = user.balance + amount;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });

    // Record transaction
    await prisma.transaction.create({
      data: {
        type: "deposit",
        amount,
        balance: newBalance,
        userId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      balance: updatedUser.balance,
    });
  } catch (err) {
    console.error("Deposit error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
