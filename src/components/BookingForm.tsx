"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Calendar from "./Calendar";
import { PACKAGES, ADD_ONS, EVENT_TYPES, BACKDROP_OPTIONS } from "@/lib/packages";

type Intent = "book" | "questions" | "checking";

interface FormData {
  fullName: string; email: string; phone: string;
  eventDate: Date | null; intentType: Intent; question: string;
  eventStartTime: string; eventEndTime: string; eventType: string;
  eventTypeOther: string; guestCount: string; venueName: string;
  venueStreet: string; venueCity: string; venueState: string; venueZip: string;
  packageId: string; addOns: string[]; backdropChoice: string; notes: string;
}

const INIT: FormData = {
  fullName: "", email: "", phone: "", eventDate: null, intentType: "book", question: "",
  eventStartTime: "", eventEndTime: "", eventType: "", eventTypeOther: "", guestCount: "",
  venueName: "", venueStreet: "", venueCity: "", venueState: "", venueZip: "",
  packageId: "", addOns: [], backdropChoice: "", notes: "",
};

const input = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8B5CF6]/50 transition-colors";
const btn = "px-8 py-3 rounded-full bg-[#8B5CF6] text-[#0B1020] font-semibold text-sm hover:bg-[#7c3aed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/80">
        {label}{required && <span className="text-[#8B5CF6] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function BookingForm({ defaultPackage }: { defaultPackage?: string }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ ...INIT, packageId: defaultPackage ?? "" });
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/availability").then(r => r.json()).then(d => setUnavailable(d.unavailableDates ?? [])).catch(() => {});
  }, []);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function toggleAddOn(id: string) {
    setForm(p => ({ ...p, addOns: p.addOns.includes(id) ? p.addOns.filter(a => a !== id) : [...p.addOns, id] }));
  }

  function calcTotal() {
    const pkg = PACKAGES.find(p => p.id === form.packageId);
    return (pkg?.price ?? 0) + form.addOns.reduce((s, id) => s + (ADD_ONS.find(a => a.id === id)?.price ?? 0), 0);
  }

  async function step1Submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.eventDate) { setError("Please select an event date."); return; }
    if (form.intentType === "questions" && !form.question.trim()) { setError("Please enter your question."); return; }
    setError("");
    if (form.intentType === "book") { setStep(2); return; }
    await submit();
  }

  async function step2Submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.packageId) { setError("Please select a package."); return; }
    setError("");
    await submit();
  }

  async function submit() {
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventDate: form.eventDate ? format(form.eventDate, "yyyy-MM-dd") : null }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Something went wrong."); return; }
      setDone(true);
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  }

  if (done) {
    const pkg = PACKAGES.find(p => p.id === form.packageId);
    return (
      <div className="text-center py-16 px-6">
        <div className="text-5xl mb-4">✦</div>
        <h2 className="text-2xl font-bold text-white mb-3">
          {form.intentType === "book" ? "Booking Received!" : form.intentType === "questions" ? "Message Sent!" : "Availability Confirmed!"}
        </h2>
        <p className="text-white/70 max-w-md mx-auto mb-6">
          {form.intentType === "book"
            ? "We'll review your booking and send a draft invoice within 24 hours. Check your email for confirmation."
            : form.intentType === "questions"
            ? "We received your question and will reply within 1–2 business days."
            : `${form.eventDate ? format(form.eventDate, "MMMM d, yyyy") : "That date"} is available! We sent you a confirmation email.`}
        </p>
        {form.intentType === "book" && pkg && (
          <div className="bg-white/5 rounded-2xl p-6 max-w-sm mx-auto text-left">
            <p className="text-white/50 text-xs mb-2">Summary</p>
            <p className="text-white font-semibold">{pkg.name} Package</p>
            <p className="text-white/60 text-sm">{form.eventDate ? format(form.eventDate, "MMMM d, yyyy") : ""}</p>
            <p className="text-[#8B5CF6] font-bold text-2xl mt-3">${calcTotal().toLocaleString()}</p>
            <p className="text-white/30 text-xs mt-1">Invoice sent as draft for your review before payment</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {form.intentType === "book" && (
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${s === step ? "bg-[#8B5CF6] text-[#0B1020]" : s < step ? "bg-[#8B5CF6]/30 text-[#8B5CF6]" : "bg-white/10 text-white/40"}`}>
                {s < step ? "✓" : s}
              </div>
              <span className={`text-sm hidden sm:inline ${s === step ? "text-white" : "text-white/40"}`}>
                {s === 1 ? "Your Info" : "Event Details"}
              </span>
              {s < 2 && <div className="w-8 h-px bg-white/20" />}
            </div>
          ))}
        </div>
      )}

      {error && <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}

      {step === 1 && (
        <form onSubmit={step1Submit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input type="text" required value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Jane Smith" className={input} />
            </Field>
            <Field label="Email Address" required>
              <input type="email" required value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@example.com" className={input} />
            </Field>
            <Field label="Phone Number" required>
              <input type="tel" required value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" className={input} />
            </Field>
          </div>

          <Field label="Event Date" required>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <Calendar unavailableDates={unavailable} selectedDate={form.eventDate} onSelectDate={d => set("eventDate", d)} />
              {form.eventDate && <p className="mt-3 text-[#8B5CF6] text-sm font-medium">Selected: {format(form.eventDate, "MMMM d, yyyy")}</p>}
            </div>
          </Field>

          <Field label="Are you ready to book today?" required>
            <select value={form.intentType} onChange={e => set("intentType", e.target.value as Intent)} className={input}>
              <option value="book">Yes — I want to reserve now</option>
              <option value="questions">I have questions first</option>
              <option value="checking">Just checking availability</option>
            </select>
          </Field>

          {form.intentType === "questions" && (
            <Field label="Your Question" required>
              <textarea required rows={4} value={form.question} onChange={e => set("question", e.target.value)} placeholder="Ask us anything..." className={input} />
            </Field>
          )}

          <button type="submit" disabled={submitting} className={btn}>
            {submitting ? "Sending…" : form.intentType === "book" ? "Continue to Event Details →" : form.intentType === "questions" ? "Send My Question" : "Check Availability"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={step2Submit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Event Start Time" required>
              <input type="time" required value={form.eventStartTime} onChange={e => set("eventStartTime", e.target.value)} className={input} />
            </Field>
            <Field label="Event End Time" required>
              <input type="time" required value={form.eventEndTime} onChange={e => set("eventEndTime", e.target.value)} className={input} />
            </Field>
            <Field label="Event Type" required>
              <select required value={form.eventType} onChange={e => set("eventType", e.target.value)} className={input}>
                <option value="">Select event type…</option>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            {form.eventType === "Other" && (
              <Field label="Please specify" required>
                <input type="text" required value={form.eventTypeOther} onChange={e => set("eventTypeOther", e.target.value)} placeholder="Describe your event" className={input} />
              </Field>
            )}
            <Field label="Estimated Guest Count" required>
              <input type="number" required min={1} value={form.guestCount} onChange={e => set("guestCount", e.target.value)} placeholder="e.g. 75" className={input} />
            </Field>
          </div>

          <div>
            <p className="text-white font-medium text-sm mb-3">Venue Information</p>
            <div className="space-y-3">
              <Field label="Venue Name" required>
                <input type="text" required value={form.venueName} onChange={e => set("venueName", e.target.value)} placeholder="Grand Ballroom" className={input} />
              </Field>
              <Field label="Street Address" required>
                <input type="text" required value={form.venueStreet} onChange={e => set("venueStreet", e.target.value)} placeholder="123 Main St" className={input} />
              </Field>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <Field label="City" required><input type="text" required value={form.venueCity} onChange={e => set("venueCity", e.target.value)} placeholder="Atlanta" className={input} /></Field>
                </div>
                <Field label="State" required><input type="text" required maxLength={2} value={form.venueState} onChange={e => set("venueState", e.target.value.toUpperCase())} placeholder="GA" className={input} /></Field>
                <Field label="Zip" required><input type="text" required value={form.venueZip} onChange={e => set("venueZip", e.target.value)} placeholder="30301" className={input} /></Field>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white font-medium text-sm mb-3">Select a Package <span className="text-[#8B5CF6]">*</span></p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PACKAGES.map(pkg => (
                <button key={pkg.id} type="button" onClick={() => set("packageId", pkg.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${form.packageId === pkg.id ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-white/10 hover:border-white/30"}`}>
                  <p className="font-semibold text-white">
                    {pkg.name}
                    {pkg.popular && <span className="ml-2 text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-0.5 rounded-full">Popular</span>}
                  </p>
                  <p className="text-[#8B5CF6] font-bold mt-1">${pkg.price}</p>
                  <p className="text-white/40 text-xs">{pkg.hours} hours</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-medium text-sm mb-3">Add-ons (optional)</p>
            <div className="space-y-3">
              {ADD_ONS.map(addon => {
                const checked = form.addOns.includes(addon.id);
                return (
                  <div key={addon.id}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={checked} onChange={() => toggleAddOn(addon.id)} className="w-4 h-4 accent-[#8B5CF6]" />
                      <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                        {addon.name} <span className={addon.price < 0 ? "text-green-400" : "text-[#8B5CF6]"}>
                          {addon.price < 0 ? `-$${Math.abs(addon.price)}` : `+$${addon.price}`}
                        </span>
                      </span>
                    </label>
                    {checked && addon.hasOptions && (
                      <div className="mt-2 ml-7">
                        <p className="text-white/40 text-xs mb-2">Choose a backdrop:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {BACKDROP_OPTIONS.map(opt => (
                            <button key={opt} type="button" onClick={() => set("backdropChoice", opt)}
                              className={`text-xs px-3 py-2 rounded-lg border transition-colors ${form.backdropChoice === opt ? "border-[#8B5CF6] bg-[#8B5CF6]/10 text-white" : "border-white/10 text-white/50 hover:border-white/30"}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {checked && addon.hasUpload && (
                      <div className="mt-2 ml-7">
                        <p className="text-white/40 text-xs mb-1">Upload logo (or email after booking):</p>
                        <input type="file" accept="image/*" className="text-xs text-white/60 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-white/10 file:text-white/80 hover:file:bg-white/20" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Field label="Notes / Special Requests">
            <textarea rows={4} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Special themes, setup requirements, surprises…" className={input} />
          </Field>

          {form.packageId && (() => {
            const pkg = PACKAGES.find(p => p.id === form.packageId)!;
            const addTotal = form.addOns.reduce((s, id) => s + (ADD_ONS.find(a => a.id === id)?.price ?? 0), 0);
            return (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-xs mb-2">Estimated Total</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-white/70"><span>{pkg.name} Package</span><span>${pkg.price}</span></div>
                  {form.addOns.map(id => { const a = ADD_ONS.find(x => x.id === id)!; return (
                    <div key={id} className="flex justify-between text-sm text-white/70">
                      <span>{a.name}</span>
                      <span className={a.price < 0 ? "text-green-400" : ""}>{a.price < 0 ? `-$${Math.abs(a.price)}` : `+$${a.price}`}</span>
                    </div>
                  );})}
                </div>
                <div className="flex justify-between font-bold text-white mt-2 pt-2 border-t border-white/10">
                  <span>Total</span><span className="text-[#8B5CF6]">${pkg.price + addTotal}</span>
                </div>
                <p className="text-white/30 text-xs mt-2">Invoice sent as draft for review before payment</p>
              </div>
            );
          })()}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="px-6 py-3 rounded-full border border-white/20 text-white/70 text-sm hover:border-white/40 hover:text-white transition-colors">
              ← Back
            </button>
            <button type="submit" disabled={submitting} className={`${btn} flex-1`}>
              {submitting ? "Submitting…" : "Submit Booking Request"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
