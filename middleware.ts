import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } 

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  // ✅ allow request
  return NextResponse.next();
}

// Apply to protected routes only
export const config = {
  matcher: ["/api/deposit/:path*", "/api/withdraw/:path*", "/api/transfer/:path*"],
};
