import Link from "next/link";
import { PACKAGES, BUSINESS_NAME, BUSINESS_CITY } from "@/lib/packages";

const FEATURES = [
  { icon: "🎥", title: "360 Video Booth", desc: "Stunning slow-motion 360° videos your guests will share instantly." },
  { icon: "📸", title: "Open-Air iPad Booth", desc: "Modern iPad booth with instant digital sharing via QR, text, or email." },
  { icon: "✨", title: "Custom Branding", desc: "Add your logo, names, or custom message to every photo and video." },
  { icon: "📱", title: "Instant Digital Sharing", desc: "Guests share photos instantly — no waiting, no extra app needed." },
  { icon: "🖼️", title: "Online Gallery", desc: "Every event gets a private online gallery delivered after the event." },
  { icon: "👤", title: "Professional Attendant", desc: "Our attendant manages everything so you can enjoy your event stress-free." },
];

const STEPS = [
  { n: "01", title: "Pick a Package", desc: "Browse our packages and choose the one that fits your event and budget." },
  { n: "02", title: "Book Your Date", desc: "Fill out our simple booking form and reserve your date in minutes." },
  { n: "03", title: "We Handle the Rest", desc: "We arrive early, set up everything, and make sure your guests have a blast." },
];

const FAQS = [
  {
    q: "How much space is needed?",
    a: "We typically require an area of approximately 8x8 feet for setup and operation. This allows enough room for the booth, backdrop, props, and guests to comfortably enjoy the experience. If your venue has limited space, let us know and we'll help find the best setup option for your event.",
  },
  {
    q: "Do you travel?",
    a: "Yes! We proudly serve Fort Worth and surrounding areas. Travel within a certain radius may be included, while events outside of our standard service area may require an additional travel fee. Contact us with your event location for details.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking as early as possible to secure your date, especially for weddings, holidays, and peak event seasons. Most clients book anywhere from 2–6 months in advance, but feel free to contact us for last-minute availability.",
  },
  {
    q: "Do you provide attendants?",
    a: "Yes! A professional booth attendant is included with select packages to assist guests, ensure everything runs smoothly, and help create the best possible experience throughout your event.",
  },
  {
    q: "Can photos be texted instantly?",
    a: "Absolutely! Guests can instantly receive their photos, GIFs, or boomerangs by text message, email, or digital sharing directly from the booth, depending on the package selected.",
  },
  {
    q: "Is setup included?",
    a: "Yes — setup and breakdown are included with every booking. We arrive before your event begins to ensure everything is fully set up and ready for your guests to enjoy.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0f0f1a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">Photo Booth Rental · {BUSINESS_CITY} & Surrounding Areas</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Luxury Photo Booth Experiences for <span className="text-[#c9a84c]">Unforgettable Events</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Modern photo booth rentals for weddings, birthdays, corporate events, and celebrations across Fort Worth and the surrounding areas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="px-8 py-4 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-bold text-base hover:bg-[#e0c06a] transition-all hover:scale-105 shadow-lg shadow-[#c9a84c]/20">
              Book Your Date →
            </Link>
            <Link href="/packages" className="px-8 py-4 rounded-full border border-white/20 text-white font-medium text-base hover:border-white/50 hover:bg-white/5 transition-colors">
              View Packages
            </Link>
          </div>
          <div className="mt-14 flex flex-wrap gap-8 justify-center">
            {[["500+", "Events Captured"], ["5.0★", "Average Rating"], ["10K+", "Memories Made"]].map(([n, l]) => (
              <div key={l}><p className="text-3xl font-bold text-[#c9a84c]">{n}</p><p className="text-white/50 text-sm mt-0.5">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">Everything You Need for the Perfect Event</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] text-lg mb-2">{f.title}</h3>
                <p className="text-[#1a1a2e]/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-[#0f0f1a] py-20 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">About Us</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">We Capture the Moments That Matter Most</h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  At {BUSINESS_NAME}, we believe every celebration deserves unforgettable moments. Our modern photo booth experiences are designed to bring people together, capture genuine memories, and add excitement to every event.
                </p>
                <p>
                  From weddings and birthdays to corporate events and private celebrations, we provide high-quality photo booth rentals that are stylish, interactive, and easy for guests of all ages to enjoy. With premium backdrops, fun props, instant digital sharing, and customizable experiences, we help turn special moments into lasting memories.
                </p>
                <p>
                  We pride ourselves on professionalism, reliability, and creating an experience your guests will talk about long after the event ends.
                </p>
              </div>
              <Link href="/booking" className="inline-block mt-8 px-8 py-4 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-bold hover:bg-[#e0c06a] transition-colors">
                Let&apos;s Make Your Event Unforgettable →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🎥", label: "360 Video Booth" },
                { icon: "📸", label: "Open-Air iPad Booth" },
                { icon: "💍", label: "Weddings" },
                { icon: "🎉", label: "Parties & Events" },
              ].map(item => (
                <div key={item.label} className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <p className="text-sm font-medium text-white/80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <div key={s.n} className="text-center">
                <div className="text-5xl font-black text-[#c9a84c]/20 mb-3">{s.n}</div>
                <h3 className="font-bold text-xl text-[#1a1a2e] mb-2">{s.title}</h3>
                <p className="text-[#1a1a2e]/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages preview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">Packages for Every Event</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PACKAGES.slice(0, 3).map(pkg => (
              <div key={pkg.id} className={`rounded-2xl p-6 relative ${pkg.popular ? "bg-[#0f0f1a] text-white ring-2 ring-[#c9a84c]" : "bg-[#faf9f7] text-[#1a1a2e] shadow-sm"}`}>
                {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-[#0f0f1a] text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>}
                <p className="font-bold text-xl mb-1">{pkg.name}</p>
                <p className={`text-3xl font-extrabold mb-1 ${pkg.popular ? "text-[#c9a84c]" : "text-[#0f0f1a]"}`}>${pkg.price}</p>
                <p className={`text-sm mb-4 ${pkg.popular ? "text-white/50" : "text-[#1a1a2e]/50"}`}>{pkg.hours} hours</p>
                <ul className="space-y-1.5 mb-6">
                  {pkg.features.map(f => (
                    <li key={f} className={`text-sm flex items-start gap-2 ${pkg.popular ? "text-white/70" : "text-[#1a1a2e]/70"}`}>
                      <span className="text-[#c9a84c] mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/booking" className={`block text-center py-2.5 rounded-full text-sm font-semibold transition-colors ${pkg.popular ? "bg-[#c9a84c] text-[#0f0f1a] hover:bg-[#e0c06a]" : "border border-[#0f0f1a]/20 text-[#0f0f1a] hover:bg-[#0f0f1a] hover:text-white"}`}>
                  Book This Package
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/packages" className="text-[#c9a84c] font-semibold hover:underline text-sm">View all packages including VIP Experience →</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="font-semibold text-[#1a1a2e] mb-2">{q}</p>
                <p className="text-[#1a1a2e]/60 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-[#1a1a2e]/50 text-sm">Still have questions?{" "}
              <Link href="/contact" className="text-[#c9a84c] font-medium hover:underline">Contact us →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#c9a84c] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f0f1a] mb-4">Ready to Make Your Event Unforgettable?</h2>
          <p className="text-[#0f0f1a]/70 text-lg mb-8">Dates fill up fast — especially for weekends and holidays. Reserve yours today.</p>
          <Link href="/booking" className="px-10 py-4 rounded-full bg-[#0f0f1a] text-white font-bold text-base hover:bg-[#1a1a2e] transition-colors shadow-lg">
            Check Availability & Book →
          </Link>
        </div>
      </section>
    </>
  );
}
