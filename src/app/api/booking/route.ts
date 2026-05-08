import { NextRequest, NextResponse } from "next/server";
import { saveBooking, isDateUnavailable, generateId, Booking } from "@/lib/storage";
import { sendBookingConfirmation, sendOwnerNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

  const { fullName, email, phone, eventDate, intentType } = body as Record<string, string>;

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !eventDate || !intentType)
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });

  if (await isDateUnavailable(eventDate))
    return NextResponse.json({ error: "That date is no longer available. Please choose another." }, { status: 409 });

  if (intentType === "questions" && !body.question)
    return NextResponse.json({ error: "Please include your question." }, { status: 400 });

  if (intentType === "book" && !body.packageId)
    return NextResponse.json({ error: "Please select a package." }, { status: 400 });

  const booking: Booking = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: "pending",
    paymentStatus: "unpaid",
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    eventDate,
    intentType: intentType as Booking["intentType"],
    question: typeof body.question === "string" ? body.question : undefined,
    eventStartTime: typeof body.eventStartTime === "string" ? body.eventStartTime : undefined,
    eventEndTime: typeof body.eventEndTime === "string" ? body.eventEndTime : undefined,
    eventType: typeof body.eventType === "string" ? body.eventType : undefined,
    eventTypeOther: typeof body.eventTypeOther === "string" ? body.eventTypeOther : undefined,
    guestCount: body.guestCount ? Number(body.guestCount) : undefined,
    venueName: typeof body.venueName === "string" ? body.venueName : undefined,
    venueStreet: typeof body.venueStreet === "string" ? body.venueStreet : undefined,
    venueCity: typeof body.venueCity === "string" ? body.venueCity : undefined,
    venueState: typeof body.venueState === "string" ? body.venueState : undefined,
    venueZip: typeof body.venueZip === "string" ? body.venueZip : undefined,
    packageId: typeof body.packageId === "string" ? body.packageId : undefined,
    addOns: Array.isArray(body.addOns) ? (body.addOns as string[]) : [],
    backdropChoice: typeof body.backdropChoice === "string" ? body.backdropChoice : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  };

  await saveBooking(booking);

  Promise.all([sendBookingConfirmation(booking), sendOwnerNotification(booking)])
    .catch(err => console.error("[EMAIL]", err));

  const crmUrl = process.env.CRM_DUBSADO_WEBHOOK_URL ?? process.env.CRM_HONEYBOOK_WEBHOOK_URL;
  if (crmUrl) fetch(crmUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(booking) }).catch(err => console.error("[CRM]", err));

  return NextResponse.json({ success: true, id: booking.id }, { status: 201 });
}
