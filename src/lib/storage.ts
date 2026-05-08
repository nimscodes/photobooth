import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function readJSON<T>(filename: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(filename: string, data: T): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

export interface Booking {
  id: string;
  createdAt: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "deposit" | "paid";
  fullName: string;
  email: string;
  phone: string;
  eventDate: string;
  intentType: "book" | "questions" | "checking";
  question?: string;
  eventStartTime?: string;
  eventEndTime?: string;
  eventType?: string;
  eventTypeOther?: string;
  guestCount?: number;
  venueName?: string;
  venueStreet?: string;
  venueCity?: string;
  venueState?: string;
  venueZip?: string;
  packageId?: string;
  addOns?: string[];
  backdropChoice?: string;
  notes?: string;
}

export function getBookings(): Booking[] {
  return readJSON<Booking[]>("bookings.json", []);
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id);
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx >= 0) bookings[idx] = booking;
  else bookings.push(booking);
  writeJSON("bookings.json", bookings);
}

export function getBookedDates(): string[] {
  return getBookings()
    .filter((b) => b.status !== "cancelled")
    .map((b) => b.eventDate);
}

export function getBlockedDates(): string[] {
  return readJSON<string[]>("blocked-dates.json", []);
}

export function setBlockedDates(dates: string[]): void {
  writeJSON("blocked-dates.json", dates);
}

export function isDateUnavailable(date: string): boolean {
  return getBookedDates().includes(date) || getBlockedDates().includes(date);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
