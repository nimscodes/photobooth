import Link from "next/link";
import type { Metadata } from "next";
import { BUSINESS_NAME, BUSINESS_CITY } from "@/lib/packages";
import { getPackages, getAddOns } from "@/lib/getPackages";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description: `Luxury photo booth rental packages starting at $350. 360 Video Booth & Open-Air iPad Booth for every event in ${BUSINESS_CITY}.`,
};

export default async function PackagesPage() {
  const [PACKAGES, ADD_ONS] = await Promise.all([getPackages(), getAddOns()]);
  return (
    <>
      <section className="bg-[#0f0f1a] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">Transparent Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Packages & Pricing</h1>
          <p className="text-white/60 text-lg">No hidden fees. All packages include unlimited prints, props, and a dedicated online gallery.</p>
        </div>
      </section>

      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map(pkg => (
              <div key={pkg.id} className={`rounded-2xl p-6 relative flex flex-col ${pkg.popular ? "bg-[#0f0f1a] text-white ring-2 ring-[#c9a84c] shadow-xl" : "bg-white text-[#1a1a2e] shadow-sm"}`}>
                {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-[#0f0f1a] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">Most Popular</span>}
                <div className="mb-auto">
                  <p className="font-bold text-2xl mb-1">{pkg.name}</p>
                  <p className={`text-4xl font-extrabold mb-1 ${pkg.popular ? "text-[#c9a84c]" : "text-[#0f0f1a]"}`}>${pkg.price}</p>
                  <p className={`text-sm mb-2 ${pkg.popular ? "text-white/50" : "text-[#1a1a2e]/50"}`}>{pkg.hours} hours</p>
                  <p className={`text-sm leading-relaxed mb-5 ${pkg.popular ? "text-white/60" : "text-[#1a1a2e]/60"}`}>{pkg.description}</p>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map(f => (
                      <li key={f} className={`text-sm flex items-start gap-2 ${pkg.popular ? "text-white/80" : "text-[#1a1a2e]/80"}`}>
                        <span className="text-[#c9a84c] shrink-0 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/booking?package=${pkg.id}`} className={`block text-center py-3 rounded-full text-sm font-semibold transition-colors ${pkg.popular ? "bg-[#c9a84c] text-[#0f0f1a] hover:bg-[#e0c06a]" : "border-2 border-[#0f0f1a]/20 text-[#0f0f1a] hover:bg-[#0f0f1a] hover:text-white hover:border-[#0f0f1a]"}`}>
                  Book {pkg.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1a1a2e]">Available Add-ons</h2>
            <p className="text-[#1a1a2e]/60 mt-2">Customize your package with these optional extras</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADD_ONS.map(addon => (
              <div key={addon.id} className="flex items-center justify-between bg-[#faf9f7] rounded-xl px-5 py-4">
                <div>
                  <p className="font-semibold text-[#1a1a2e]">{addon.name}</p>
                  {addon.hasOptions && <p className="text-xs text-[#1a1a2e]/50 mt-0.5">Choose from multiple backdrop styles</p>}
                  {addon.hasUpload && <p className="text-xs text-[#1a1a2e]/50 mt-0.5">Upload your own logo file</p>}
                </div>
                <span className={`font-bold text-lg ${addon.price < 0 ? "text-green-600" : "text-[#c9a84c]"}`}>
                  {addon.price < 0 ? `-$${Math.abs(addon.price)}` : `+$${addon.price}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#faf9f7] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8 text-center">Good to Know</h2>
          <div className="space-y-4">
            {[
              ["Is a deposit required?", "Yes — a 50% deposit is required to hold your date. The remaining balance is due 7 days before your event."],
              ["What's included in every package?", "All packages include setup/teardown, unlimited photo sessions, digital copies, props, and a personalized online gallery."],
              ["Do you travel outside the area?", `We serve the greater ${BUSINESS_CITY} area. Travel fees may apply for events more than 30 miles away.`],
              ["When will I receive my invoice?", "Invoices are prepared as drafts so we can review and customize them. You'll receive yours within 24 hours of booking."],
              ["Can I add extra time on the day of?", "Subject to availability. We recommend booking the 'Extra 2 Hours' add-on in advance."],
            ].map(([q, a]) => (
              <div key={q} className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-semibold text-[#1a1a2e] mb-1">{q}</p>
                <p className="text-[#1a1a2e]/60 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f0f1a] py-14 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to reserve your date?</h2>
        <Link href="/booking" className="inline-block px-8 py-3.5 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-bold hover:bg-[#e0c06a] transition-colors">
          Book Now →
        </Link>
      </section>
    </>
  );
}
