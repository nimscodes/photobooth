import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== getAdminPassword())
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });

  const jar = await cookies();
  jar.set("admin_session", password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return NextResponse.json({ success: true });
}
