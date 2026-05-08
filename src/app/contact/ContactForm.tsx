"use client";

import { useState } from "react";

const input = "w-full border border-black/10 rounded-xl px-4 py-3 text-[#1a1a2e] placeholder-black/30 text-sm focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-colors";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Something went wrong."); return; }
      setSent(true);
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  }

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">✉️</div>
        <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Message Sent!</h3>
        <p className="text-[#1a1a2e]/60">Thanks, {form.name.split(" ")[0]}! We&apos;ll get back to you within 1–4 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Send Us a Message</h3>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/80 mb-1.5">Full Name <span className="text-[#c9a84c]">*</span></label>
        <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Smith" className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/80 mb-1.5">Email <span className="text-[#c9a84c]">*</span></label>
        <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@example.com" className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/80 mb-1.5">Phone (optional)</label>
        <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="(555) 000-0000" className={input} />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/80 mb-1.5">Message <span className="text-[#c9a84c]">*</span></label>
        <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us about your event, ask a question, or just say hi!" className={input} />
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-bold text-sm hover:bg-[#e0c06a] transition-colors disabled:opacity-50">
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
