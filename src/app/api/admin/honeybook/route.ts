import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/lib/storage";
import { PACKAGES, ADD_ONS } from "@/lib/packages";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const webhookUrl = process.env.HONEYBOOK_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "HONEYBOOK_ZAPIER_WEBHOOK_URL is not set." }, { status: 500 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing booking id." }, { status: 400 });

  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  const pkg = PACKAGES.find((p) => p.id === booking.packageId);
  const addOnNames = (booking.addOns ?? [])
    .map((aId) => ADD_ONS.find((a) => a.id === aId)?.name ?? aId)
    .join(", ");

  const venue = [booking.venueName, booking.venueStreet, booking.venueCity, booking.venueState, booking.venueZip]
    .filter(Boolean)
    .join(", ");

  const payload = {
    // Client
    client_name: booking.fullName,
    client_email: booking.email,
    client_phone: booking.phone,

    // Event
    event_date: booking.eventDate,
    event_start_time: booking.eventStartTime ?? "",
    event_end_time: booking.eventEndTime ?? "",
    event_type: booking.eventType === "Other" ? (booking.eventTypeOther ?? "Other") : (booking.eventType ?? ""),
    guest_count: booking.guestCount ?? "",
    venue,

    // Package & pricing
    package_name: pkg?.name ?? booking.packageId ?? "",
    package_price: pkg?.price ?? "",
    package_hours: pkg?.hours ?? "",
    add_ons: addOnNames,
    backdrop_choice: booking.backdropChoice ?? "",

    // Notes
    client_notes: booking.notes ?? "",
    admin_notes: booking.adminNotes ?? "",

    // Meta
    booking_id: booking.id,
    booking_created_at: booking.createdAt,
    intent_type: booking.intentType,
    status: booking.status,
    payment_status: booking.paymentStatus,
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Zapier webhook returned ${res.status}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
