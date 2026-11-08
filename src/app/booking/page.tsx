import type { Metadata } from "next";
import HoneyBookLeadForm from "@/components/HoneyBookLeadForm";

export const metadata: Metadata = {
  title: "Book Your Photo Booth",
  description: "Tell Elite Event Images about your event and explore photo booth packages.",
};

export default function BookingPage() {
  return (
    <>
      <section className="bg-[#0B1020] py-14 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-3">
            Photo Booth Experiences
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Tell Us About Your Event</h1>
          <p className="text-white/60">
            Share a few details and choose the photo booth experience you&apos;re interested in. The
            Elite Event Images team will follow up to confirm availability, pricing, and booking terms.
          </p>
        </div>
      </section>

      <section className="bg-[#0B1020] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 pt-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <HoneyBookLeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
