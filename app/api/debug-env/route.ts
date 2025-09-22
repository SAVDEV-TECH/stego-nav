import { NextResponse } from "next/server";

export const runtime = "nodejs"; // make sure this runs in Node.js

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL ? "✅ Loaded" : "❌ Missing",
    JWT_SECRET: process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing",
  });
}
