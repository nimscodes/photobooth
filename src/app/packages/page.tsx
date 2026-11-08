import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPackages, getAddOns } from "@/lib/getPackages";
import { PRICING_DISCLAIMER } from "@/lib/packages";
import { fetchSanity } from "../../../sanity/lib/client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description: "Explore four tiered photo booth experiences for events across the DFW Metroplex.",
};

const DEFAULT_FAQS = [
  { _id: "deposit", question: "Is a deposit required?", answer: "Deposit requirements and the payment schedule will be confirmed with your booking terms before your booking is finalized." },
  { _id: "included", question: "What's included in each package?", answer: "Each tier builds on the previous one, from digital sharing and a standard layout to printing, enhanced customization, and an online gallery. See each package for its details." },
  { _id: "travel", question: "Do you travel outside the area?", answer: "We serve the DFW Metroplex and surrounding areas. Any travel fees will be confirmed based on your event location." },
  { _id: "invoice", question: "When will I receive an estimate?", answer: "We'll follow up with a draft estimate and confirm the booking details and terms with you." },
  { _id: "extra-time", question: "Can I add extra time on the day of?", answer: "Additional time is subject to availability. Ask us about options when you inquire." },
];

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

export default async function PackagesPage() {
  const [PACKAGES, ADD_ONS, faqs] = await Promise.all([
    getPackages(),
    getAddOns(),
    fetchSanity<FAQItem[]>(
      `*[_type == "faqItem" && defined(question) && defined(answer)] | order(order asc){ _id, question, answer }`,
      []
    ),
  ]);

  const faqList = faqs.length > 0 ? faqs : DEFAULT_FAQS;
  const imageAddOns = ADD_ONS.filter(a => a.imageUrl);
  const listAddOns = ADD_ONS.filter(a => !a.imageUrl);

  return (
    <>
      <section className="bg-[#0B1020] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-3">Photo Booth Experiences</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Packages &amp; Pricing</h1>
          <p className="text-white/60 text-lg">Make every moment unforgettable with Elite Event Images. From intimate celebrations to unforgettable parties, our photo booth experiences bring personalized keepsakes and fun to your event. Explore our packages and find the perfect fit for your occasion.</p>
          <p className="mt-5 text-sm text-white/70">{PRICING_DISCLAIMER}</p>
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
                  Inquire about {pkg.name}
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
        <section className="bg-[#111827] py-16">
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

      <section id="faqs" className="bg-[#0B1020] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Good to Know</h2>
          <div className="space-y-4">
            {faqList.map(faq => (
              <div key={faq._id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="font-semibold text-white mb-1">{faq.question}</p>
                <p className="text-white/55 text-sm leading-relaxed">{faq.answer}</p>
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
