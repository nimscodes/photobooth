import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/lib/storage";
import { isAdminAuthenticated } from "@/lib/auth";
import { sendHoneybookEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing booking id." }, { status: 400 });

  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  try {
    await sendHoneybookEmail(booking);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
