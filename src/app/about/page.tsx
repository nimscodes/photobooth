import Link from "next/link";
import type { Metadata } from "next";
import { fetchSanity } from "../../../sanity/lib/client";
import { BUSINESS_NAME, BUSINESS_CITY } from "@/lib/packages";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${BUSINESS_NAME} — luxury photo booth rentals serving ${BUSINESS_CITY} and the DFW Metroplex.`,
};

const DEFAULT_HERO = {
  eyebrow: "Our Story",
  heading: "About Us",
  subtext: "We started with one booth and a passion for making people smile. Now we bring that same energy to every event across the DFW Metroplex.",
};

const DEFAULT_WHO = {
  heading: "We Capture the Moments That Matter Most",
  paragraph1: "At Elite Event Images, we believe every celebration deserves unforgettable moments. Our modern photo booth experiences are designed to bring people together, capture genuine memories, and add excitement to every event.",
  paragraph2: "From weddings and birthdays to corporate events and private celebrations, we provide high-quality photo booth rentals that are stylish, interactive, and easy for guests of all ages to enjoy.",
  paragraph3: "With premium backdrops, fun props, instant digital sharing, and fully customizable experiences, we help turn special moments into lasting memories that people talk about long after the event ends.",
};

const DEFAULT_STATS = [
  { value: "500+", label: "Events Served" },
  { value: "5.0★", label: "Average Rating" },
  { value: "10K+", label: "Memories Made" },
  { value: "4+", label: "Years Experience" },
];

const DEFAULT_VALUES = [
  { title: "Professionalism", description: "We arrive early, stay late, and handle every detail so you don't have to think about a thing." },
  { title: "Premium Quality", description: "HD cameras, instant prints, and high-resolution digital galleries — nothing is cut-rate." },
  { title: "Guest Experience", description: "Our attendants are friendly, patient, and focused on making every guest feel like a star." },
  { title: "Reliability", description: "Over 500 events without a single no-show. Your date is locked in and protected." },
];

const DEFAULT_CTA = {
  heading: "Ready to create unforgettable memories?",
  subtext: "Serving the DFW Metroplex and Surrounding Areas.",
};

export default async function AboutPage() {
  const data = await fetchSanity<{
    hero?: typeof DEFAULT_HERO;
    whoWeAre?: typeof DEFAULT_WHO;
    stats?: typeof DEFAULT_STATS;
    values?: typeof DEFAULT_VALUES;
    cta?: typeof DEFAULT_CTA;
  }>(
    `*[_type == "aboutPage"][0]{ hero, whoWeAre, stats, values, cta }`,
    {}
  );

  const hero = { ...DEFAULT_HERO, ...data?.hero };
  const who = { ...DEFAULT_WHO, ...data?.whoWeAre };
  const stats = data?.stats?.length ? data.stats : DEFAULT_STATS;
  const values = data?.values?.length ? data.values : DEFAULT_VALUES;
  const cta = { ...DEFAULT_CTA, ...data?.cta };

  return (
    <>
      <section className="bg-[#0B1020] py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-3">{hero.eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{hero.heading}</h1>
          <p className="text-white/60 text-lg">{hero.subtext}</p>
        </div>
      </section>

      <section className="bg-[#111827] py-20 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-3">Who We Are</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">{who.heading}</h2>
              <div className="space-y-4 text-white/65 leading-relaxed">
                {who.paragraph1 && <p>{who.paragraph1}</p>}
                {who.paragraph2 && <p>{who.paragraph2}</p>}
                {who.paragraph3 && <p>{who.paragraph3}</p>}
              </div>
              <Link href="/booking" className="inline-block mt-8 px-8 py-4 rounded-full bg-[#8B5CF6] text-white font-bold hover:bg-[#7c3aed] transition-colors">
                Book Your Event →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(item => (
                <div key={item.label} className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
                  <p className="text-3xl font-bold text-[#8B5CF6] mb-1">{item.value}</p>
                  <p className="text-sm text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1020] py-20 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-2">What Drives Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-[#8B5CF6]/20 transition-colors">
                <div className="w-8 h-0.5 bg-[#8B5CF6] mb-4" />
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#8B5CF6] py-14 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">{cta.heading}</h2>
        <p className="text-white/75 mb-7">{cta.subtext}</p>
        <Link href="/booking" className="inline-block px-10 py-4 rounded-full bg-white text-[#8B5CF6] font-bold hover:bg-white/90 transition-colors">
          Check Availability →
        </Link>
      </section>
    </>
  );
}
