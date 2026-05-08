"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Booking } from "@/lib/storage";
import { PACKAGES } from "@/lib/packages";
import Calendar from "@/components/Calendar";

type Tab = "bookings" | "calendar" | "settings";

export default function AdminDashboard({ bookings: init, blockedDates: initBlocked }: { bookings: Booking[]; blockedDates: string[] }) {
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>(init);
  const [blocked, setBlocked] = useState<string[]>(initBlocked);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const bookedDates = bookings.filter(b => b.status !== "cancelled").map(b => b.eventDate);
  const allUnavailable = [...new Set([...bookedDates, ...blocked])];

  async function toggleBlock() {
    if (!selectedDate) return;
    const str = format(selectedDate, "yyyy-MM-dd");
    const newBlocked = blocked.includes(str) ? blocked.filter(d => d !== str) : [...blocked, str];
    setSaving(true);
    const res = await fetch("/api/admin/block-dates", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates: newBlocked }),
    });
    setSaving(false);
    if (res.ok) {
      setBlocked(newBlocked);
      setMsg(blocked.includes(str) ? "Date unblocked." : "Date blocked.");
      setTimeout(() => setMsg(""), 3000);
    }
  }

  async function updateStatus(id: string, status: Booking["status"]) {
    const res = await fetch("/api/admin/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (res.ok) setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }

  async function updatePayment(id: string, paymentStatus: Booking["paymentStatus"]) {
    const res = await fetch("/api/admin/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, paymentStatus }) });
    if (res.ok) setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus } : b));
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    pending: bookings.filter(b => b.status === "pending").length,
    unpaid: bookings.filter(b => b.paymentStatus === "unpaid" && b.status !== "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <div className="bg-[#0a0a14] border-b border-white/5 px-4 sm:px-6 py-3 flex items-center justify-between">
        <p className="font-bold text-[#c9a84c]">✦ Admin Dashboard</p>
        <div className="flex gap-4">
          <a href="/" target="_blank" className="text-white/50 hover:text-white text-sm transition-colors">View Site ↗</a>
          <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }} className="text-white/50 hover:text-white text-sm transition-colors">Sign Out</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[["Total Inquiries", stats.total, "text-white"], ["Confirmed", stats.confirmed, "text-green-400"], ["Pending Review", stats.pending, "text-yellow-400"], ["Awaiting Payment", stats.unpaid, "text-red-400"]].map(([l, v, c]) => (
            <div key={l as string} className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className={`text-3xl font-bold ${c}`}>{v}</p>
              <p className="text-white/50 text-xs mt-1">{l}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
          {(["bookings", "calendar", "settings"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-[#c9a84c] text-[#0f0f1a]" : "text-white/50 hover:text-white"}`}>{t}</button>
          ))}
        </div>

        {tab === "bookings" && (
          <div className="space-y-3">
            {bookings.length > 0 && (
              <div className="flex justify-end mb-1">
                <a
                  href="/api/admin/export-ics"
                  className="text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  📅 Export all to Google Calendar (.ics)
                </a>
              </div>
            )}
            {bookings.length === 0 && <div className="text-center py-16 text-white/30">No bookings yet.</div>}
            {[...bookings].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()).map(b => {
              const pkg = PACKAGES.find(p => p.id === b.packageId);
              return (
                <div key={b.id} className="bg-white/5 border border-white/5 rounded-xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold">{b.fullName}</p>
                        <Badge color={{ pending: "yellow", confirmed: "green", cancelled: "red" }[b.status]}>{b.status}</Badge>
                        <Badge color={{ unpaid: "red", deposit: "blue", paid: "green" }[b.paymentStatus]}>
                          {{ unpaid: "Unpaid", deposit: "Deposit", paid: "Paid" }[b.paymentStatus]}
                        </Badge>
                        <Badge color="gray">{b.intentType}</Badge>
                      </div>
                      <p className="text-white/60 text-sm mt-1">{b.eventDate} · {b.eventType === "Other" ? b.eventTypeOther : b.eventType ?? "—"} · {pkg?.name ?? "No package"}{pkg && <span className="text-[#c9a84c] ml-1">${pkg.price}</span>}</p>
                      <p className="text-white/40 text-xs mt-0.5">{b.email} · {b.phone}</p>
                      {b.venueName && <p className="text-white/40 text-xs mt-0.5">📍 {b.venueName}, {b.venueCity}, {b.venueState}</p>}
                      {b.notes && <p className="text-white/40 text-xs mt-1 italic">&ldquo;{b.notes}&rdquo;</p>}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <select value={b.status} onChange={e => updateStatus(b.id, e.target.value as Booking["status"])} className="bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <select value={b.paymentStatus} onChange={e => updatePayment(b.id, e.target.value as Booking["paymentStatus"])} className="bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs">
                        <option value="unpaid">Unpaid</option>
                        <option value="deposit">Deposit Paid</option>
                        <option value="paid">Paid in Full</option>
                      </select>
                      <div className="flex gap-1.5">
                        <a
                          href={`/admin/invoice/${b.id}`}
                          target="_blank"
                          className="flex-1 text-center px-2 py-1.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-medium hover:bg-[#c9a84c]/30 transition-colors"
                        >
                          📄 Invoice
                        </a>
                        <a
                          href={`/api/admin/export-ics?id=${b.id}`}
                          className="flex-1 text-center px-2 py-1.5 rounded-lg bg-white/10 text-white/60 text-xs font-medium hover:bg-white/20 transition-colors"
                        >
                          📅 Cal
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "calendar" && (
          <div className="max-w-md">
            <p className="text-white/60 text-sm mb-4">Click a date to block or unblock it. Booked dates are automatically unavailable.</p>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <Calendar unavailableDates={allUnavailable} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>
            {selectedDate && (
              <div className="mt-4 flex items-center gap-3">
                <p className="text-white/70 text-sm">
                  {format(selectedDate, "MMMM d, yyyy")} — {blocked.includes(format(selectedDate, "yyyy-MM-dd")) ? "Blocked" : bookedDates.includes(format(selectedDate, "yyyy-MM-dd")) ? "Has a booking" : "Available"}
                </p>
                {!bookedDates.includes(format(selectedDate, "yyyy-MM-dd")) && (
                  <button onClick={toggleBlock} disabled={saving} className="px-4 py-1.5 rounded-full bg-[#c9a84c] text-[#0f0f1a] text-xs font-bold hover:bg-[#e0c06a] transition-colors disabled:opacity-50">
                    {saving ? "Saving…" : blocked.includes(format(selectedDate, "yyyy-MM-dd")) ? "Unblock" : "Block Date"}
                  </button>
                )}
              </div>
            )}
            {msg && <p className="mt-2 text-green-400 text-sm">{msg}</p>}
          </div>
        )}

        {tab === "settings" && (
          <div className="max-w-xl space-y-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <h3 className="font-bold mb-1">Environment Variables</h3>
              <p className="text-white/50 text-sm mb-4">Configure in <code className="bg-white/10 px-1.5 py-0.5 rounded">.env.local</code>:</p>
              <div className="space-y-3 text-sm font-mono">
                {[
                  ["ADMIN_PASSWORD", "Your admin login password"],
                  ["OWNER_EMAIL", "Email for booking notifications"],
                  ["RESEND_API_KEY", "resend.com API key for emails"],
                  ["FROM_EMAIL", "Verified sender email address"],
                  ["TWILIO_ACCOUNT_SID", "Twilio account SID for SMS"],
                  ["TWILIO_AUTH_TOKEN", "Twilio auth token"],
                  ["TWILIO_PHONE_NUMBER", "Your Twilio phone number"],
                  ["NEXT_PUBLIC_BASE_URL", "Your site URL (e.g. https://yoursite.com)"],
                  ["CRM_DUBSADO_WEBHOOK_URL", "Dubsado webhook for auto invoices"],
                  ["CRM_HONEYBOOK_WEBHOOK_URL", "HoneyBook webhook for auto invoices"],
                ].map(([k, d]) => (
                  <div key={k} className="bg-white/5 rounded-lg p-3">
                    <p className="text-[#c9a84c]">{k}</p>
                    <p className="text-white/40 text-xs mt-0.5 font-sans">{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
              <h3 className="font-bold mb-2">Customize Business Info & Pricing</h3>
              <p className="text-white/50 text-sm">Edit <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">src/lib/packages.ts</code> to update your business name, phone, prices, and packages.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const map: Record<string, string> = {
    yellow: "bg-yellow-400/10 text-yellow-400",
    green: "bg-green-400/10 text-green-400",
    red: "bg-red-400/10 text-red-400",
    blue: "bg-blue-400/10 text-blue-400",
    gray: "bg-white/10 text-white/50",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[color] ?? map.gray}`}>{children}</span>;
}
