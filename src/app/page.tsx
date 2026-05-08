import Link from "next/link";
import { PACKAGES, BUSINESS_NAME, BUSINESS_CITY } from "@/lib/packages";

const FEATURES = [
  { icon: "📸", title: "Unlimited Prints", desc: "Guests print as many times as they want — no extra charges." },
  { icon: "✨", title: "Premium Props", desc: "Curated collection of fun, stylish props for every event vibe." },
  { icon: "📱", title: "Instant Digital Sharing", desc: "Share photos instantly via text or scan-to-download QR code." },
  { icon: "🎨", title: "Custom Branding", desc: "Add your logo, names, or custom message to every photo strip." },
  { icon: "🖼️", title: "Online Gallery", desc: "Every event gets a private online gallery delivered within 24 hours." },
  { icon: "👤", title: "Dedicated Attendant", desc: "Our attendant manages the booth so you can enjoy your event." },
];

const STEPS = [
  { n: "01", title: "Pick a Package", desc: "Browse our packages and choose the one that fits your event and budget." },
  { n: "02", title: "Book Your Date", desc: "Fill out our simple booking form and reserve your date in minutes." },
  { n: "03", title: "We Handle the Rest", desc: "We arrive early, set up everything, and make sure your guests have a blast." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0f0f1a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">Photo Booth Rental · {BUSINESS_CITY}</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Make Every Moment <span className="text-[#c9a84c]">Unforgettable</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Premium photo booth rentals for weddings, birthdays, corporate events, and more. Unlimited fun, stunning prints, and memories that last forever.
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
            {[["500+", "Events Booked"], ["5.0★", "Average Rating"], ["10K+", "Photos Taken"]].map(([n, l]) => (
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

      {/* How it works */}
      <section className="bg-[#0f0f1a] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <div key={s.n} className="text-center">
                <div className="text-5xl font-black text-[#c9a84c]/20 mb-3">{s.n}</div>
                <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-white/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages preview */}
      <section className="bg-[#faf9f7] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-2">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">Packages for Every Event</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PACKAGES.slice(0, 3).map(pkg => (
              <div key={pkg.id} className={`rounded-2xl p-6 relative ${pkg.popular ? "bg-[#0f0f1a] text-white ring-2 ring-[#c9a84c]" : "bg-white text-[#1a1a2e] shadow-sm"}`}>
                {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-[#0f0f1a] text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>}
                <p className="font-bold text-xl mb-1">{pkg.name}</p>
                <p className={`text-3xl font-extrabold mb-1 ${pkg.popular ? "text-[#c9a84c]" : "text-[#0f0f1a]"}`}>${pkg.price}</p>
                <p className={`text-sm mb-4 ${pkg.popular ? "text-white/50" : "text-[#1a1a2e]/50"}`}>{pkg.hours} hours</p>
                <ul className="space-y-1.5 mb-6">
                  {pkg.features.slice(0, 4).map(f => (
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
            <Link href="/packages" className="text-[#c9a84c] font-semibold hover:underline text-sm">View all packages & add-ons →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#c9a84c] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f0f1a] mb-4">Ready to Book {BUSINESS_NAME}?</h2>
          <p className="text-[#0f0f1a]/70 text-lg mb-8">Dates fill up fast — especially for weekends and holidays. Reserve yours today.</p>
          <Link href="/booking" className="px-10 py-4 rounded-full bg-[#0f0f1a] text-white font-bold text-base hover:bg-[#1a1a2e] transition-colors shadow-lg">
            Check Availability & Book →
          </Link>
        </div>
      </section>
    </>
  );
}
