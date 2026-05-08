import { NextResponse } from "next/server";
import { getBookedDates, getBlockedDates } from "@/lib/storage";

export async function GET() {
  const unavailableDates = [...new Set([...getBookedDates(), ...getBlockedDates()])];
  return NextResponse.json({ unavailableDates });
}
