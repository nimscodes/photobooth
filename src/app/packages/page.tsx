import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BUSINESS_NAME } from "@/lib/packages";
import { getPackages, getAddOns } from "@/lib/getPackages";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description: `Luxury photo booth rental packages. 360 Video Booth & Open-Air iPad Booth for every event across the DFW Metroplex.`,
};

export default async function PackagesPage() {
  const [PACKAGES, ADD_ONS] = await Promise.all([getPackages(), getAddOns()]);

  const imageAddOns = ADD_ONS.filter(a => a.imageUrl);
  const listAddOns = ADD_ONS.filter(a => !a.imageUrl);

  return (
    <>
      <section className="bg-[#0B1020] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-3">Transparent Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Packages &amp; Pricing</h1>
          <p className="text-white/60 text-lg">No hidden fees. All packages include unlimited prints, props, and a dedicated online gallery.</p>
        </div>
      </section>

      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map(pkg => (
              <div key={pkg.id} className={`rounded-2xl p-6 relative flex flex-col ${pkg.popular ? "bg-[#8B5CF6] text-white ring-2 ring-[#8B5CF6]" : "bg-white/5 text-white border border-white/10"}`}>
                {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#8B5CF6] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">Most Popular</span>}
                <div className="mb-auto">
                  <p className="font-bold text-2xl mb-1">{pkg.name}</p>
                  <p className={`text-4xl font-extrabold mb-1 ${pkg.popular ? "text-white" : "text-[#8B5CF6]"}`}>${pkg.price}</p>
                  <p className={`text-sm mb-2 ${pkg.popular ? "text-white/70" : "text-white/50"}`}>{pkg.hours} hours</p>
                  <p className={`text-sm leading-relaxed mb-5 ${pkg.popular ? "text-white/80" : "text-white/55"}`}>{pkg.description}</p>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map(f => (
                      <li key={f} className={`text-sm flex items-start gap-2 ${pkg.popular ? "text-white/90" : "text-white/70"}`}>
                        <span className={`shrink-0 mt-0.5 ${pkg.popular ? "text-white" : "text-[#8B5CF6]"}`}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/booking?package=${pkg.id}`} className={`block text-center py-3 rounded-full text-sm font-semibold transition-colors ${pkg.popular ? "bg-white text-[#8B5CF6] hover:bg-white/90" : "border border-[#8B5CF6]/50 text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"}`}>
                  Book {pkg.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons with images from Sanity */}
      {imageAddOns.length > 0 && (
        <section className="bg-[#0B1020] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-2">Customize Your Experience</p>
              <h2 className="text-3xl font-bold text-white">Add-On Options</h2>
              <p className="text-white/50 mt-2">Enhance your photo booth with these premium additions</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {imageAddOns.map(addon => (
                <div key={addon.id} className={`bg-[#111827] rounded-2xl overflow-hidden border transition-colors ${addon.featured ? "border-[#8B5CF6]" : "border-white/10 hover:border-[#8B5CF6]/30"}`}>
                  {addon.featured && (
                    <div className="bg-[#8B5CF6] text-center py-1.5 text-xs font-semibold text-white tracking-wide">
                      Most Requested
                    </div>
                  )}
                  <div className="relative h-48 bg-white/5">
                    {addon.imageUrl ? (
                      <Image src={addon.imageUrl} alt={addon.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-white font-semibold mb-1">{addon.name}</p>
                    {addon.description && <p className="text-white/50 text-xs leading-relaxed mb-3">{addon.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-[#8B5CF6] font-semibold">+${addon.price}</span>
                      <span className="bg-[#8B5CF6]/15 text-[#a78bfa] text-xs px-3 py-1 rounded-full">Add on</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* List-style add-ons */}
      {listAddOns.length > 0 && (
        <section id="faqs" className="bg-[#111827] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white">Available Add-ons</h2>
              <p className="text-white/50 mt-2">Customize your package with these optional extras</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listAddOns.map(addon => (
                <div key={addon.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                  <div>
                    <p className="font-semibold text-white">{addon.name}</p>
                    {addon.description && <p className="text-xs text-white/45 mt-0.5">{addon.description}</p>}
                    {addon.hasOptions && <p className="text-xs text-white/45 mt-0.5">Choose from multiple backdrop styles</p>}
                    {addon.hasUpload && <p className="text-xs text-white/45 mt-0.5">Upload your own logo file</p>}
                  </div>
                  <span className={`font-bold text-lg ${addon.price < 0 ? "text-green-400" : "text-[#8B5CF6]"}`}>
                    {addon.price < 0 ? `-$${Math.abs(addon.price)}` : `+$${addon.price}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#0B1020] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Good to Know</h2>
          <div className="space-y-4">
            {[
              ["Is a deposit required?", "Yes — a 50% deposit is required to hold your date. The remaining balance is due 7 days before your event."],
              ["What's included in every package?", "All packages include setup/teardown, unlimited photo sessions, digital copies, props, and a personalized online gallery."],
              ["Do you travel outside the area?", `We serve the DFW Metroplex and surrounding areas. Travel fees may apply for events more than 30 miles away.`],
              ["When will I receive my invoice?", "Invoices are prepared as drafts so we can review and customize them. You'll receive yours within 24 hours of booking."],
              ["Can I add extra time on the day of?", "Subject to availability. We recommend booking the 'Extra 2 Hours' add-on in advance."],
            ].map(([q, a]) => (
              <div key={q} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="font-semibold text-white mb-1">{q}</p>
                <p className="text-white/55 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#8B5CF6] py-14 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to reserve your date?</h2>
        <Link href="/booking" className="inline-block px-8 py-3.5 rounded-full bg-white text-[#8B5CF6] font-bold hover:bg-white/90 transition-colors">
          Book Now →
        </Link>
      </section>
    </>
  );
}
