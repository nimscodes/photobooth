import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBookings, getBookingById, saveBooking } from "@/lib/storage";
import { updateCalendarEvent, deleteCalendarEvent } from "@/lib/googleCalendar";

export async function GET() {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ bookings: await getBookings() });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, paymentStatus, adminNotes } = await req.json();
  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  const prevStatus = booking.status;

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  if (adminNotes !== undefined) booking.adminNotes = adminNotes;

  await saveBooking(booking);

  // Sync calendar if status changed
  if (status && status !== prevStatus && booking.calendarEventId) {
    if (status === "cancelled") {
      deleteCalendarEvent(booking.calendarEventId).catch(console.error);
    } else {
      updateCalendarEvent(booking.calendarEventId, booking).catch(console.error);
    }
  }

  return NextResponse.json({ success: true, booking });
}
