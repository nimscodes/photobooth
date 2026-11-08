import { Suspense } from "react";
import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { PRICING_DISCLAIMER } from "@/lib/packages";
import { getPackages } from "@/lib/getPackages";

export const metadata: Metadata = {
  title: "Book Your Photo Booth",
  description: "Check real-time availability and send a photo booth booking inquiry.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const params = await searchParams;
  const packages = await getPackages();

  return (
    <>
      <section className="bg-[#0B1020] py-14 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-3">
            Real-Time Availability
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Book Your Event</h1>
          <p className="text-white/60">
            Check availability and send a booking inquiry in a few easy steps. We&apos;ll follow up
            with the details.
          </p>
          <p className="text-white/50 text-sm mt-4">{PRICING_DISCLAIMER}</p>
        </div>
      </section>

      <section className="bg-[#0B1020] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 pt-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6] rounded-full animate-spin" />
                </div>
              }
            >
              <BookingForm defaultPackage={params.package} packages={packages} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
