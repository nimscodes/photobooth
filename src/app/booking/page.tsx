import { Suspense } from "react";
import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book Your Photo Booth",
  description: "Reserve your photo booth rental online. Check real-time availability and book in minutes.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <section className="bg-[#0f0f1a] py-14 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-3">
            Real-Time Availability
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Book Your Event</h1>
          <p className="text-white/60">
            Check availability and submit your booking in a few easy steps. We&apos;ll send your
            invoice within 24 hours.
          </p>
        </div>
      </section>

      <section className="bg-[#0f0f1a] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 pt-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
                </div>
              }
            >
              <BookingForm defaultPackage={params.package} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
