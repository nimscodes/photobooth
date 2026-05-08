import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBookingById } from "@/lib/storage";
import { PACKAGES, ADD_ONS, BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_CITY } from "@/lib/packages";
import InvoicePrintButton from "./InvoicePrintButton";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) notFound();

  const pkg = PACKAGES.find((p) => p.id === booking.packageId);
  const addOnsSelected = (booking.addOns ?? [])
    .map((aid) => ADD_ONS.find((a) => a.id === aid))
    .filter(Boolean) as typeof ADD_ONS;
  const addOnTotal = addOnsSelected.reduce((s, a) => s + a.price, 0);
  const subtotal = (pkg?.price ?? 0) + addOnTotal;
  const deposit = Math.round(subtotal * 0.5);
  const balance = subtotal - deposit;

  const invoiceNum = `INV-${booking.id.slice(0, 8).toUpperCase()}`;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Action bar — hidden on print */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <a href="/admin" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Back to Dashboard
        </a>
        <div className="flex gap-3">
          <InvoicePrintButton />
        </div>
      </div>

      {/* Invoice */}
      <div id="invoice" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12 print:rounded-none print:shadow-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">
          <div>
            <p className="text-2xl font-extrabold text-[#0f0f1a]">✦ {BUSINESS_NAME}</p>
            <p className="text-gray-500 text-sm mt-1">{BUSINESS_CITY}</p>
            <p className="text-gray-500 text-sm">{BUSINESS_PHONE}</p>
            <p className="text-gray-500 text-sm">{BUSINESS_EMAIL}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-black text-[#c9a84c]">INVOICE</p>
            <p className="text-gray-500 text-sm mt-1">#{invoiceNum}</p>
            <p className="text-gray-500 text-sm">Date: {today}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
              booking.paymentStatus === "paid" ? "bg-green-100 text-green-700"
              : booking.paymentStatus === "deposit" ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
            }`}>
              {booking.paymentStatus === "paid" ? "PAID" : booking.paymentStatus === "deposit" ? "DEPOSIT RECEIVED" : "PAYMENT DUE"}
            </span>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bill To</p>
          <p className="font-bold text-[#0f0f1a]">{booking.fullName}</p>
          <p className="text-gray-500 text-sm">{booking.email}</p>
          <p className="text-gray-500 text-sm">{booking.phone}</p>
        </div>

        {/* Event Details */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            ["Event Date", booking.eventDate],
            ["Event Type", booking.eventType === "Other" ? booking.eventTypeOther : booking.eventType],
            ["Guest Count", booking.guestCount ? `~${booking.guestCount} guests` : "—"],
            ["Start Time", booking.eventStartTime ?? "—"],
            ["End Time", booking.eventEndTime ?? "—"],
            ["Venue", booking.venueName ? `${booking.venueName}, ${booking.venueCity}` : "—"],
          ].map(([label, val]) => (
            <div key={label as string}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
              <p className="text-[#0f0f1a] text-sm font-medium">{val ?? "—"}</p>
            </div>
          ))}
        </div>

        {/* Line items */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-3">Description</th>
              <th className="text-right text-xs font-bold text-gray-400 uppercase tracking-widest pb-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {pkg && (
              <tr className="border-b border-gray-50">
                <td className="py-3">
                  <p className="font-semibold text-[#0f0f1a]">{pkg.name} Package</p>
                  <p className="text-gray-400 text-xs">{pkg.hours} hours · {pkg.description}</p>
                </td>
                <td className="py-3 text-right font-semibold text-[#0f0f1a]">${pkg.price.toLocaleString()}</td>
              </tr>
            )}
            {addOnsSelected.map((a) => (
              <tr key={a.id} className="border-b border-gray-50">
                <td className="py-3">
                  <p className="font-medium text-[#0f0f1a]">{a.name}</p>
                  <p className="text-gray-400 text-xs">Add-on</p>
                </td>
                <td className={`py-3 text-right font-medium ${a.price < 0 ? "text-green-600" : "text-[#0f0f1a]"}`}>
                  {a.price < 0 ? `-$${Math.abs(a.price)}` : `$${a.price}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex flex-col items-end gap-2 mb-8">
          <div className="flex justify-between w-48">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-48 text-sm text-gray-400">
            <span>50% Deposit</span>
            <span>${deposit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-48 pt-2 border-t-2 border-gray-100">
            <span className="font-bold text-[#0f0f1a]">Balance Due</span>
            <span className="font-bold text-[#c9a84c] text-lg">${balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
            <p className="text-gray-600 text-sm">{booking.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-6 text-center text-gray-400 text-xs">
          <p>Thank you for choosing {BUSINESS_NAME}! We can&apos;t wait to be part of your event.</p>
          <p className="mt-1">{BUSINESS_PHONE} · {BUSINESS_EMAIL}</p>
        </div>
      </div>

      <style>{`@media print { body { background: white; } }`}</style>
    </div>
  );
}
