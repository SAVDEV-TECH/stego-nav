 import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

function generateAccountNo() {
  // Example: ACCT-12345678
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `ACCT-${random}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let accountNo: string;
    let isUnique = false;

    // Keep generating until a unique account number is found
    do {
      accountNo = generateAccountNo();
      const existingAccount = await prisma.user.findUnique({
        where: { accountNo },
      });
      if (!existingAccount) isUnique = true;
    } while (!isUnique);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        accountNo,
        balance: 0,
      },
    });

    // create JWT
    const token = signToken({ id: newUser.id, email: newUser.email });

    // response with cookie + accountNo
    const res = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        accountNo: newUser.accountNo,
        balance: newUser.balance,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

