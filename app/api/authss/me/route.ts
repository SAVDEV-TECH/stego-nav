// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

    if (!token) return NextResponse.json({ user: null });

    const payload = verifyToken(token);
    if (!payload || !payload.id) return NextResponse.json({ user: null });

    const user = await prisma.user.findUnique({
      where: { id: payload.id as number },
      select: { name: true, accountNo: true, balance: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
