 import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export const runtime = "nodejs"; // ✅ jwt needs node runtime

export async function GET() {
  // ✅ await the function
  const user = await getUserFromToken();  

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { balance: true },
  });

  return NextResponse.json({ balance: dbUser?.balance ?? 0 });
}
