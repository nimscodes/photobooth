import { supabase } from "./supabase";

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
  adminNotes?: string;
  calendarEventId?: string;
}

// Map DB row (snake_case) → Booking (camelCase)
function toBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    status: row.status as Booking["status"],
    paymentStatus: row.payment_status as Booking["paymentStatus"],
    fullName: row.full_name as string,
    email: row.email as string,
    phone: row.phone as string,
    eventDate: row.event_date as string,
    intentType: row.intent_type as Booking["intentType"],
    question: row.question as string | undefined,
    eventStartTime: row.event_start_time as string | undefined,
    eventEndTime: row.event_end_time as string | undefined,
    eventType: row.event_type as string | undefined,
    eventTypeOther: row.event_type_other as string | undefined,
    guestCount: row.guest_count as number | undefined,
    venueName: row.venue_name as string | undefined,
    venueStreet: row.venue_street as string | undefined,
    venueCity: row.venue_city as string | undefined,
    venueState: row.venue_state as string | undefined,
    venueZip: row.venue_zip as string | undefined,
    packageId: row.package_id as string | undefined,
    addOns: row.add_ons as string[] | undefined,
    backdropChoice: row.backdrop_choice as string | undefined,
    notes: row.notes as string | undefined,
    adminNotes: row.admin_notes as string | undefined,
    calendarEventId: row.calendar_event_id as string | undefined,
  };
}

// Map Booking (camelCase) → DB row (snake_case)
function toRow(b: Booking): Record<string, unknown> {
  return {
    id: b.id,
    created_at: b.createdAt,
    status: b.status,
    payment_status: b.paymentStatus,
    full_name: b.fullName,
    email: b.email,
    phone: b.phone,
    event_date: b.eventDate,
    intent_type: b.intentType,
    question: b.question ?? null,
    event_start_time: b.eventStartTime ?? null,
    event_end_time: b.eventEndTime ?? null,
    event_type: b.eventType ?? null,
    event_type_other: b.eventTypeOther ?? null,
    guest_count: b.guestCount ?? null,
    venue_name: b.venueName ?? null,
    venue_street: b.venueStreet ?? null,
    venue_city: b.venueCity ?? null,
    venue_state: b.venueState ?? null,
    venue_zip: b.venueZip ?? null,
    package_id: b.packageId ?? null,
    add_ons: b.addOns ?? [],
    backdrop_choice: b.backdropChoice ?? null,
    notes: b.notes ?? null,
    admin_notes: b.adminNotes ?? null,
    calendar_event_id: b.calendarEventId ?? null,
  };
}

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("event_date", { ascending: true });
  if (error) { console.error("[DB] getBookings:", error.message); return []; }
  return (data ?? []).map(toBooking);
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();
  if (error) { console.error("[DB] getBookingById:", error.message); return undefined; }
  return data ? toBooking(data) : undefined;
}

export async function saveBooking(booking: Booking): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .upsert(toRow(booking));
  if (error) console.error("[DB] saveBooking:", error.message);
}

export async function getBookedDates(): Promise<string[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("event_date")
    .neq("status", "cancelled");
  if (error) { console.error("[DB] getBookedDates:", error.message); return []; }
  return (data ?? []).map((r) => r.event_date as string);
}

export async function getBlockedDates(): Promise<string[]> {
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("date");
  if (error) { console.error("[DB] getBlockedDates:", error.message); return []; }
  return (data ?? []).map((r) => r.date as string);
}

export async function setBlockedDates(dates: string[]): Promise<void> {
  const { error: delError } = await supabase.from("blocked_dates").delete().neq("date", "");
  if (delError) { console.error("[DB] setBlockedDates delete:", delError.message); return; }
  if (dates.length === 0) return;
  const { error: insError } = await supabase
    .from("blocked_dates")
    .insert(dates.map((d) => ({ date: d })));
  if (insError) console.error("[DB] setBlockedDates insert:", insError.message);
}

export async function isDateUnavailable(date: string): Promise<boolean> {
  const [booked, blocked] = await Promise.all([getBookedDates(), getBlockedDates()]);
  return booked.includes(date) || blocked.includes(date);
}

export function generateId(): string {
  return crypto.randomUUID();
}
