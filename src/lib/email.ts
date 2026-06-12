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
