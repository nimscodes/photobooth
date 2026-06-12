import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_EMAIL } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${BUSINESS_NAME}. Serving the DFW Metroplex and surrounding areas.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#0B1020] py-14 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-3">Let&apos;s Connect</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Contact Us</h1>
          <p className="text-white/60">Questions? Ready to chat? We typically respond within a few hours.</p>
        </div>
      </section>

      <section className="bg-[#111827] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">We&apos;d Love to Hear From You</h2>
            <div className="space-y-5">
              {[
                { label: "Phone", value: BUSINESS_PHONE, href: `tel:${BUSINESS_PHONE.replace(/\D/g, "")}` },
                { label: "Email", value: BUSINESS_EMAIL, href: `mailto:${BUSINESS_EMAIL}` },
                { label: "Service Area", value: "DFW Metroplex & Surrounding Areas" },
                { label: "Response Time", value: "Typically within 1–4 hours" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-[#8B5CF6] hover:underline">{item.value}</a>
                      : <p className="text-white/55">{item.value}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-2xl p-6 text-white">
              <p className="font-bold mb-2 text-[#8B5CF6]">Pro Tip</p>
              <p className="text-white/65 text-sm leading-relaxed">
                Weekends book fast — especially May through October. Check our{" "}
                <a href="/booking" className="text-[#8B5CF6] hover:underline">availability calendar</a>{" "}
                and lock in your date before it&apos;s gone.
              </p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
