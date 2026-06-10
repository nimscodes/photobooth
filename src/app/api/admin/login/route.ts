import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildSessionToken } from "@/lib/auth";

// In-memory rate limiter — resets on cold start but provides basic brute-force protection
const attempts = new Map<string, { n: number; until: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.until) {
    attempts.set(ip, { n: 1, until: now + 15 * 60_000 });
    return false;
  }
  if (entry.n >= 10) return true;
  entry.n++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip))
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const password = typeof body.password === "string" ? body.password : "";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword)
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });

  const sessionToken = buildSessionToken();
  const jar = await cookies();
  jar.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
