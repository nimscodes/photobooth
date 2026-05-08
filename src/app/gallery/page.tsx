import type { Metadata } from "next";
import Link from "next/link";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "See our photo booth in action at weddings, birthdays, and corporate events.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="bg-[#0f0f1a] py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">Past Events</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Gallery</h1>
          <p className="text-white/60">A glimpse of the magic we bring to every event. Real photos, real smiles.</p>
        </div>
      </section>

      <GalleryGrid />

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-10">What Our Clients Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { quote: "Absolute hit at our wedding! Every single guest visited the booth. The prints were gorgeous.", name: "Sarah M.", event: "Wedding" },
              { quote: "So professional and fun. The attendant was amazing and the online gallery was delivered the next morning.", name: "Marcus T.", event: "Corporate Event" },
              { quote: "My daughter's sweet 16 was a total success thanks to the photo booth. We'll definitely book again!", name: "Linda K.", event: "Birthday Party" },
            ].map(t => (
              <div key={t.name} className="bg-[#faf9f7] rounded-2xl p-6">
                <p className="text-[#c9a84c] text-xl mb-3">★★★★★</p>
                <p className="text-[#1a1a2e]/80 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-semibold text-[#1a1a2e] text-sm">{t.name}</p>
                <p className="text-[#1a1a2e]/40 text-xs">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f0f1a] py-14 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Want memories like these at your event?</h2>
        <Link href="/booking" className="inline-block px-8 py-3.5 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-bold hover:bg-[#e0c06a] transition-colors">
          Book Your Photo Booth →
        </Link>
      </section>
    </>
  );
}
