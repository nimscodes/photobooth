import Link from "next/link";
import { fetchSanity } from "../../sanity/lib/client";
import TestimonialCarousel from "@/components/TestimonialCarousel";

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

const DEFAULT_HERO = {
  headline: "Luxury Photo Booth Experiences for Unforgettable Events",
  subtext: "Modern photo booth rentals for weddings, birthdays, corporate events, and celebrations across the DFW Metroplex and Surrounding Areas.",
  stat1Value: "500+", stat1Label: "Events Captured",
  stat2Value: "5.0★", stat2Label: "Average Rating",
  stat3Value: "10K+", stat3Label: "Memories Made",
};

const DEFAULT_CTA = {
  heading: "Ready to Make Your Event Unforgettable?",
  subtext: "Dates fill up fast — especially for weekends and holidays. Reserve yours today.",
};

const DEFAULT_TESTIMONIALS = [
  { _id: "t1", name: "Ashley & Marcus W.", eventLabel: "Wedding · Fort Worth, TX", quote: "Elite Event Images made our wedding reception absolutely unforgettable. Every single guest used the photo booth — even our grandparents! The attendant was so professional and kept the line moving all night.", rating: 5 },
  { _id: "t2", name: "Brianna T.", eventLabel: "Sweet 16 · Keller, TX", quote: "I hired them for my daughter's Sweet 16 and WOW. The 360 video booth was a massive hit — every kid was obsessed. The setup was gorgeous and they were on time, professional, and so easy to work with.", rating: 5 },
  { _id: "t3", name: "James K.", eventLabel: "Corporate Event · Arlington, TX", quote: "We used Elite Event Images for our company holiday party and it elevated the entire event. The custom branded overlays with our logo looked sharp, and instant digital sharing meant employees were posting on LinkedIn within minutes.", rating: 5 },
  { _id: "t4", name: "Destiny R.", eventLabel: "Birthday Party · Haslet, TX", quote: "Booked the Spotlight package for my 30th and it was worth every penny. The backdrop was stunning, the props were fun and on-theme, and the QR code sharing was so seamless. My friends are still talking about it weeks later!", rating: 5 },
  { _id: "t5", name: "The Nguyen Family", eventLabel: "Quinceañera · North Richland Hills, TX", quote: "From the moment I reached out, the communication was excellent. They arrived early, set up quickly, and our guests absolutely loved every minute. The online gallery was delivered the next day.", rating: 5 },
  { _id: "t6", name: "Michelle P.", eventLabel: "Baby Shower · Southlake, TX", quote: "Such a wonderful experience from start to finish. The attendant was sweet, patient with the little ones, and kept everything running perfectly. The photos came out beautiful and every mom left with a special memory.", rating: 5 },
];

export const revalidate = 60;

export default async function Home() {
  const [homePage, testimonials] = await Promise.all([
    fetchSanity<{ hero?: typeof DEFAULT_HERO; cta?: typeof DEFAULT_CTA }>(
      `*[_type == "homePage"][0]{ hero, cta }`,
      {}
    ),
    fetchSanity<typeof DEFAULT_TESTIMONIALS>(
      `*[_type == "testimonial" && featured != false] | order(order asc)[0...6]{ _id, name, eventLabel, quote, rating }`,
      DEFAULT_TESTIMONIALS
    ),
  ]);

  const hero = { ...DEFAULT_HERO, ...homePage?.hero };
  const cta = { ...DEFAULT_CTA, ...homePage?.cta };
  const testimonialList = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0B1020] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #8B5CF6 0%, transparent 55%), radial-gradient(circle at 80% 20%, #22d3ee 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-6">
            Serving the DFW Metroplex and Surrounding Areas
          </p>
          <div className="mb-2">
            <span className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-widest font-serif">ELITE</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-[#8B5CF6] text-xl sm:text-2xl font-bold tracking-[0.2em]">EVENT</span>
            <span className="text-white/30 text-2xl">✦</span>
            <span className="text-cyan-400 text-xl sm:text-2xl font-bold tracking-[0.2em]">IMAGES</span>
          </div>
          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10">{hero.subtext}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="px-8 py-4 rounded-full bg-[#8B5CF6] text-white font-bold text-base hover:bg-[#7c3aed] transition-all hover:scale-105">
              Book Your Date →
            </Link>
            <Link href="/packages" className="px-8 py-4 rounded-full border border-white/20 text-white font-medium text-base hover:border-white/50 hover:bg-white/5 transition-colors">
              View Packages
            </Link>
          </div>
          <div className="mt-14 flex flex-wrap gap-8 justify-center">
            {[
              [hero.stat1Value, hero.stat1Label],
              [hero.stat2Value, hero.stat2Label],
              [hero.stat3Value, hero.stat3Label],
            ].map(([n, l]) => (
              <div key={l}><p className="text-3xl font-bold text-[#8B5CF6]">{n}</p><p className="text-white/50 text-sm mt-0.5">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-2">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything You Need for the Perfect Event</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-[#8B5CF6]/20 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0B1020] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-2">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <div key={s.n} className="text-center">
                <div className="text-5xl font-black text-[#8B5CF6]/20 mb-3">{s.n}</div>
                <h3 className="font-bold text-xl text-white mb-2">{s.title}</h3>
                <p className="text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#111827] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-2">Client Love</p>
            <h2 className="text-3xl sm:text-4xl font-bold">What Our Clients Are Saying</h2>
            <div className="flex justify-center gap-0.5 mt-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-white/40 text-sm mt-2">5.0 average · 100+ happy clients</p>
          </div>
          <TestimonialCarousel testimonials={testimonialList} />
          <div className="text-center mt-10">
            <Link href="/booking" className="inline-block px-8 py-4 rounded-full bg-[#8B5CF6] text-white font-bold hover:bg-[#7c3aed] transition-colors">
              Book Your Event →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#8B5CF6] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{cta.heading}</h2>
          <p className="text-white/75 text-lg mb-8">{cta.subtext}</p>
          <Link href="/booking" className="px-10 py-4 rounded-full bg-white text-[#8B5CF6] font-bold text-base hover:bg-white/90 transition-colors">
            Check Availability &amp; Book →
          </Link>
        </div>
      </section>
    </>
  );
}
