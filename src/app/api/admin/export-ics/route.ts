import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBookingById, getBookings } from "@/lib/storage";
import { BUSINESS_NAME } from "@/lib/packages";

function toICSDate(dateStr: string, timeStr?: string): string {
  const [year, month, day] = dateStr.split("-");
  if (timeStr) {
    const [h, m] = timeStr.split(":");
    return `${year}${month}${day}T${h}${m}00`;
  }
  return `${year}${month}${day}`;
}

function escapeICS(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function buildEvent(b: ReturnType<typeof getBookingById>): string {
  if (!b) return "";
  const uid = `${b.id}@flashphotobooth`;
  const dtStart = toICSDate(b.eventDate, b.eventStartTime);
  const dtEnd = toICSDate(b.eventDate, b.eventEndTime ?? b.eventStartTime);
  const summary = escapeICS(`${BUSINESS_NAME} — ${b.fullName} (${b.eventType ?? "Event"})`);
  const desc = escapeICS(
    [
      `Client: ${b.fullName}`,
      `Email: ${b.email}`,
      `Phone: ${b.phone}`,
      `Package: ${b.packageId ?? "TBD"}`,
      b.notes ? `Notes: ${b.notes}` : "",
    ]
      .filter(Boolean)
      .join("\\n")
  );
  const location = b.venueName
    ? escapeICS(`${b.venueName}, ${b.venueStreet ?? ""}, ${b.venueCity ?? ""}, ${b.venueState ?? ""}`)
    : "";

  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date().toISOString().split("T")[0])}T000000Z`,
    b.eventStartTime ? `DTSTART:${dtStart}` : `DTSTART;VALUE=DATE:${dtStart}`,
    b.eventEndTime ? `DTEND:${dtEnd}` : `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    location ? `LOCATION:${location}` : "",
    "END:VEVENT",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  let events: string[];
  if (id) {
    const b = getBookingById(id);
    if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
    events = [buildEvent(b)];
  } else {
    events = getBookings()
      .filter((b) => b.status !== "cancelled" && b.intentType === "book")
      .map(buildEvent)
      .filter(Boolean);
  }

  const cal = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${BUSINESS_NAME}//Bookings//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(cal, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${id ? `booking-${id}` : "all-bookings"}.ics"`,
    },
  });
}
