import { NextResponse } from "next/server";
import { getBookedDates, getBlockedDates } from "@/lib/storage";

export async function GET() {
  const [booked, blocked] = await Promise.all([getBookedDates(), getBlockedDates()]);
  const unavailableDates = [...new Set([...booked, ...blocked])];
  return NextResponse.json({ unavailableDates });
}
