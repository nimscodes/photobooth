import { Booking } from "./storage";
import { PACKAGES, ADD_ONS, BUSINESS_NAME, BUSINESS_EMAIL, BUSINESS_PHONE } from "./packages";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

function esc(text: unknown): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL ?? "info@eliteeventimages.com";

  if (!apiKey) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${BUSINESS_NAME} <${fromEmail}>`,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!res.ok) console.error("[EMAIL] Send failed:", res.status);
}

async function sendSMS(to: string, body: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return;

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    }
  );
  if (!res.ok) console.error("[SMS] Send failed:", res.status);
}

function pkgName(id?: string) {
  return PACKAGES.find((p) => p.id === id)?.name ?? id ?? "N/A";
}
function addOnNames(ids?: string[]) {
  if (!ids?.length) return "None";
  return ids.map((id) => ADD_ONS.find((a) => a.id === id)?.name ?? id).join(", ");
}

export async function sendBookingConfirmation(booking: Booking): Promise<void> {
  const pkg = PACKAGES.find((p) => p.id === booking.packageId);
  const addOnTotal = (booking.addOns ?? []).reduce(
    (s, id) => s + (ADD_ONS.find((a) => a.id === id)?.price ?? 0), 0
  );
  const total = (pkg?.price ?? 0) + addOnTotal;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;color:#1a1a2e">
      <h2 style="color:#8B5CF6">${esc(BUSINESS_NAME)} — Inquiry Received</h2>
      <p>Hi ${esc(booking.fullName)},</p>
      <p>Thanks for reaching out! We received your inquiry for <strong>${esc(booking.eventDate)}</strong>.</p>
      ${booking.intentType === "book" ? `
        <h3>Booking Summary</h3>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0"><b>Event Date:</b></td><td>${esc(booking.eventDate)}</td></tr>
          <tr><td style="padding:4px 0"><b>Event Type:</b></td><td>${esc(booking.eventType === "Other" ? booking.eventTypeOther : booking.eventType)}</td></tr>
          <tr><td style="padding:4px 0"><b>Package:</b></td><td>${esc(pkgName(booking.packageId))} — $${pkg?.price ?? 0}</td></tr>
          <tr><td style="padding:4px 0"><b>Add-ons:</b></td><td>${esc(addOnNames(booking.addOns))}</td></tr>
          <tr><td style="padding:4px 0"><b>Est. Total:</b></td><td><b>$${total}</b></td></tr>
        </table>
        <p>We'll be in touch within 24 hours to confirm and send your <b>draft invoice</b> for review.</p>
      ` : booking.intentType === "questions" ? `
        <p>Your question:</p>
        <blockquote style="border-left:3px solid #8B5CF6;padding-left:12px;color:#555">${esc(booking.question)}</blockquote>
        <p>We'll reply within 1–2 business days.</p>
      ` : `
        <p>Great news — <b>${esc(booking.eventDate)}</b> is available! Book anytime at our website.</p>
      `}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="font-size:12px;color:#999">${esc(BUSINESS_NAME)} | ${esc(BUSINESS_PHONE)} | ${esc(BUSINESS_EMAIL)}</p>
    </div>`;

  await sendEmail({
    to: booking.email,
    subject: `${BUSINESS_NAME} — Your Inquiry for ${booking.eventDate}`,
    html,
  });
}

export async function sendOwnerNotification(booking: Booking): Promise<void> {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) return;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;color:#1a1a2e">
      <h2 style="color:#8B5CF6">New Booking Inquiry</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:3px 0"><b>Name:</b></td><td>${esc(booking.fullName)}</td></tr>
        <tr><td style="padding:3px 0"><b>Email:</b></td><td>${esc(booking.email)}</td></tr>
        <tr><td style="padding:3px 0"><b>Phone:</b></td><td>${esc(booking.phone)}</td></tr>
        <tr><td style="padding:3px 0"><b>Date:</b></td><td>${esc(booking.eventDate)}</td></tr>
        <tr><td style="padding:3px 0"><b>Intent:</b></td><td>${esc(booking.intentType)}</td></tr>
        <tr><td style="padding:3px 0"><b>Package:</b></td><td>${esc(pkgName(booking.packageId))}</td></tr>
        <tr><td style="padding:3px 0"><b>Add-ons:</b></td><td>${esc(addOnNames(booking.addOns))}</td></tr>
        ${booking.notes ? `<tr><td style="padding:3px 0"><b>Notes:</b></td><td>${esc(booking.notes)}</td></tr>` : ""}
      </table>
      <p><a href="${esc(process.env.NEXT_PUBLIC_BASE_URL ?? "https://eliteeventimages.com")}/admin">Open Admin Dashboard →</a></p>
    </div>`;

  await sendEmail({ to: ownerEmail, subject: `New Booking: ${booking.fullName} — ${booking.eventDate}`, html });

  if (booking.phone && booking.intentType === "book") {
    await sendSMS(
      booking.phone,
      `Hi ${booking.fullName.split(" ")[0]}! Your ${BUSINESS_NAME} booking for ${booking.eventDate} is confirmed. Invoice coming soon. Questions? ${BUSINESS_PHONE}`
    );
  }
}

export async function sendHoneybookEmail(booking: Booking): Promise<void> {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) throw new Error("OWNER_EMAIL is not set.");

  const pkg = PACKAGES.find((p) => p.id === booking.packageId);
  const addOnList = (booking.addOns ?? []).map((id) => ADD_ONS.find((a) => a.id === id)?.name ?? id);
  const addOnTotal = (booking.addOns ?? []).reduce((s, id) => s + (ADD_ONS.find((a) => a.id === id)?.price ?? 0), 0);
  const total = (pkg?.price ?? 0) + addOnTotal;
  const venue = [booking.venueName, booking.venueStreet, booking.venueCity, booking.venueState, booking.venueZip].filter(Boolean).join(", ");
  const eventType = booking.eventType === "Other" ? (booking.eventTypeOther ?? "Other") : (booking.eventType ?? "—");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eliteeventimages.com";

  const row = (label: string, value: string | number) =>
    value ? `<tr><td style="padding:5px 12px 5px 0;color:#666;white-space:nowrap;font-size:14px"><b>${esc(label)}</b></td><td style="padding:5px 0;font-size:14px;color:#1a1a2e">${esc(String(value))}</td></tr>` : "";

  const html = `
    <div style="font-family:sans-serif;max-width:640px;margin:auto;color:#1a1a2e">
      <div style="background:#8B5CF6;padding:24px 28px;border-radius:12px 12px 0 0">
        <h2 style="margin:0;color:#fff;font-size:20px">🍯 Ready for HoneyBook</h2>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px">${esc(booking.fullName)} · ${esc(booking.eventDate)}</p>
      </div>

      <div style="background:#f9f9fb;padding:24px 28px;border-radius:0 0 12px 12px;border:1px solid #eee;border-top:none">

        <h3 style="margin:0 0 12px;font-size:15px;color:#8B5CF6;text-transform:uppercase;letter-spacing:.05em">Client</h3>
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
          ${row("Name", booking.fullName)}
          ${row("Email", booking.email)}
          ${row("Phone", booking.phone)}
        </table>

        <h3 style="margin:0 0 12px;font-size:15px;color:#8B5CF6;text-transform:uppercase;letter-spacing:.05em">Event</h3>
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
          ${row("Date", booking.eventDate)}
          ${row("Type", eventType)}
          ${row("Time", [booking.eventStartTime, booking.eventEndTime].filter(Boolean).join(" – "))}
          ${row("Guests", booking.guestCount ?? "")}
          ${row("Venue", venue)}
        </table>

        <h3 style="margin:0 0 12px;font-size:15px;color:#8B5CF6;text-transform:uppercase;letter-spacing:.05em">Package & Pricing</h3>
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
          ${row("Package", pkg ? `${pkg.name} (${pkg.hours} hrs)` : booking.packageId ?? "—")}
          ${row("Package Price", pkg ? `$${pkg.price}` : "")}
          ${addOnList.length ? row("Add-ons", addOnList.join(", ")) : ""}
          ${addOnList.length ? row("Add-on Total", `+$${addOnTotal}`) : ""}
          ${row("Backdrop", booking.backdropChoice ?? "")}
          <tr style="border-top:2px solid #8B5CF6">
            <td style="padding:8px 12px 5px 0;font-size:15px"><b>Estimated Total</b></td>
            <td style="padding:8px 0;font-size:15px;color:#8B5CF6"><b>$${total}</b></td>
          </tr>
        </table>

        ${booking.notes ? `
        <h3 style="margin:0 0 8px;font-size:15px;color:#8B5CF6;text-transform:uppercase;letter-spacing:.05em">Client Notes</h3>
        <p style="background:#fff;border-left:3px solid #8B5CF6;padding:10px 14px;border-radius:4px;font-size:14px;color:#444;margin:0 0 20px">${esc(booking.notes)}</p>
        ` : ""}

        ${booking.adminNotes ? `
        <h3 style="margin:0 0 8px;font-size:15px;color:#8B5CF6;text-transform:uppercase;letter-spacing:.05em">Your Notes</h3>
        <p style="background:#fff;border-left:3px solid #ccc;padding:10px 14px;border-radius:4px;font-size:14px;color:#444;margin:0 0 20px">${esc(booking.adminNotes)}</p>
        ` : ""}

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
          <a href="https://app.honeybook.com" target="_blank"
            style="background:#8B5CF6;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block">
            Open HoneyBook →
          </a>
          <a href="${esc(baseUrl)}/admin"
            style="background:#fff;color:#8B5CF6;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block;border:1px solid #8B5CF6">
            View in Admin
          </a>
        </div>

        <p style="font-size:11px;color:#aaa;margin:20px 0 0">Booking ID: ${esc(booking.id)} · Submitted ${esc(new Date(booking.createdAt).toLocaleDateString())}</p>
      </div>
    </div>`;

  await sendEmail({
    to: ownerEmail,
    subject: `🍯 HoneyBook Ready: ${booking.fullName} — ${booking.eventDate}`,
    html,
  });
}

export async function sendContactResponse(name: string, email: string, message: string): Promise<void> {
  const ownerEmail = process.env.OWNER_EMAIL;

  await sendEmail({
    to: email,
    subject: `${BUSINESS_NAME} — Got your message!`,
    html: `<div style="font-family:sans-serif;color:#1a1a2e"><h2 style="color:#8B5CF6">${esc(BUSINESS_NAME)}</h2><p>Hi ${esc(name)}, thanks for reaching out! We'll reply within 1–2 business days.</p><p style="font-size:12px;color:#999">${esc(BUSINESS_PHONE)}</p></div>`,
  });

  if (ownerEmail) {
    await sendEmail({
      to: ownerEmail,
      subject: `Contact Form: ${name}`,
      html: `<div style="font-family:sans-serif;color:#1a1a2e"><h2 style="color:#8B5CF6">Contact Form</h2><p><b>Name:</b> ${esc(name)}</p><p><b>Email:</b> ${esc(email)}</p><p><b>Message:</b><br/>${esc(message)}</p></div>`,
    });
  }
}
