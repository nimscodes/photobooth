import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_CITY } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${BUSINESS_NAME}. Serving ${BUSINESS_CITY} and surrounding areas.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#0f0f1a] py-14 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">Let&apos;s Connect</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Contact Us</h1>
          <p className="text-white/60">Questions? Ready to chat? We typically respond within a few hours.</p>
        </div>
      </section>

      <section className="bg-[#faf9f7] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">We&apos;d Love to Hear From You</h2>
            <div className="space-y-5">
              {[
                { icon: "📞", label: "Phone", value: BUSINESS_PHONE, href: `tel:${BUSINESS_PHONE.replace(/\D/g, "")}` },
                { icon: "✉️", label: "Email", value: BUSINESS_EMAIL, href: `mailto:${BUSINESS_EMAIL}` },
                { icon: "📍", label: "Service Area", value: `${BUSINESS_CITY} & Surrounding Areas` },
                { icon: "🕐", label: "Response Time", value: "Typically within 1–4 hours" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-[#c9a84c] hover:underline">{item.value}</a>
                      : <p className="text-[#1a1a2e]/60">{item.value}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 bg-[#0f0f1a] rounded-2xl p-6 text-white">
              <p className="font-bold mb-2 text-[#c9a84c]">Pro Tip</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Weekends book fast — especially May through October. Check our{" "}
                <a href="/booking" className="text-[#c9a84c] hover:underline">availability calendar</a>{" "}
                and lock in your date before it&apos;s gone.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
