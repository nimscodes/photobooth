import { google } from "googleapis";
import { Booking } from "./storage";
import { PACKAGES } from "./packages";

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

function isConfigured(): boolean {
  return !!(CALENDAR_ID && CLIENT_EMAIL && PRIVATE_KEY);
}

function getCalendar() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return google.calendar({ version: "v3", auth });
}

export async function createCalendarEvent(booking: Booking): Promise<string | null> {
  if (!isConfigured()) return null;

  try {
    const calendar = getCalendar();
    const pkg = PACKAGES.find((p) => p.id === booking.packageId);

    const lines = [
      `👤 ${booking.fullName}`,
      `📞 ${booking.phone}`,
      `✉️ ${booking.email}`,
      pkg ? `📦 ${pkg.name} — $${pkg.price}` : null,
      booking.eventType ? `🎉 ${booking.eventType === "Other" ? booking.eventTypeOther : booking.eventType}` : null,
      booking.guestCount ? `👥 ~${booking.guestCount} guests` : null,
      booking.venueName ? `📍 ${booking.venueName}, ${booking.venueCity ?? ""} ${booking.venueState ?? ""}`.trim() : null,
      booking.addOns?.length ? `✨ Add-ons: ${booking.addOns.join(", ")}` : null,
      booking.notes ? `📝 Notes: ${booking.notes}` : null,
    ].filter(Boolean).join("\n");

    const startDateTime = booking.eventStartTime
      ? `${booking.eventDate}T${booking.eventStartTime}:00`
      : booking.eventDate;
    const endDateTime = booking.eventEndTime
      ? `${booking.eventDate}T${booking.eventEndTime}:00`
      : booking.eventDate;

    const isAllDay = !booking.eventStartTime;

    const event = {
      summary: `📸 ${booking.fullName} — ${pkg?.name ?? "Photo Booth"}`,
      description: lines,
      location: booking.venueName
        ? [booking.venueName, booking.venueStreet, booking.venueCity, booking.venueState, booking.venueZip]
            .filter(Boolean).join(", ")
        : undefined,
      ...(isAllDay
        ? { start: { date: startDateTime }, end: { date: endDateTime } }
        : {
            start: { dateTime: startDateTime, timeZone: "America/Chicago" },
            end: { dateTime: endDateTime, timeZone: "America/Chicago" },
          }),
      colorId: booking.status === "confirmed" ? "2" : "5", // green = confirmed, yellow = pending
    };

    const res = await calendar.events.insert({
      calendarId: CALENDAR_ID!,
      requestBody: event,
    });

    console.log("[Calendar] Event created:", res.data.id);
    return res.data.id ?? null;
  } catch (err) {
    console.error("[Calendar] Failed to create event:", err);
    return null;
  }
}

export async function updateCalendarEvent(eventId: string, booking: Booking): Promise<void> {
  if (!isConfigured() || !eventId) return;

  try {
    const calendar = getCalendar();
    const pkg = PACKAGES.find((p) => p.id === booking.packageId);

    await calendar.events.patch({
      calendarId: CALENDAR_ID!,
      eventId,
      requestBody: {
        summary: `📸 ${booking.fullName} — ${pkg?.name ?? "Photo Booth"}`,
        colorId: booking.status === "confirmed" ? "2" : booking.status === "cancelled" ? "11" : "5",
      },
    });
    console.log("[Calendar] Event updated:", eventId);
  } catch (err) {
    console.error("[Calendar] Failed to update event:", err);
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  if (!isConfigured() || !eventId) return;

  try {
    const calendar = getCalendar();
    await calendar.events.delete({ calendarId: CALENDAR_ID!, eventId });
    console.log("[Calendar] Event deleted:", eventId);
  } catch (err) {
    console.error("[Calendar] Failed to delete event:", err);
  }
}
