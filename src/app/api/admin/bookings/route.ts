import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBookings, getBookingById, saveBooking } from "@/lib/storage";

export async function GET() {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ bookings: await getBookings() });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, paymentStatus } = await req.json();
  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  await saveBooking(booking);

  return NextResponse.json({ success: true, booking });
}
