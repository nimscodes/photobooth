import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBookings, saveBooking } from "@/lib/storage";

export async function GET() {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ bookings: getBookings() });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, paymentStatus } = await req.json();
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  saveBooking(booking);

  return NextResponse.json({ success: true, booking });
}
