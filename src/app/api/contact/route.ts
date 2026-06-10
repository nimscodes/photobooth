import { NextRequest, NextResponse } from "next/server";
import { sendContactResponse } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

  const { name, email, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim())
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });

  if (name.trim().length > 200)
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });

  if (message.trim().length > 5000)
    return NextResponse.json({ error: "Message is too long (max 5000 characters)." }, { status: 400 });

  await sendContactResponse(name.trim(), email.trim(), message.trim()).catch(err => console.error("[CONTACT]", err));
  return NextResponse.json({ success: true });
}
