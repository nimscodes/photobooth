"use client";

import { useState } from "react";

interface Testimonial {
  _id: string;
  name: string;
  eventLabel?: string;
  quote: string;
  rating?: number;
}

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const total = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, (page + 1) * perPage);

  function prev() { setPage((page - 1 + total) % total); }
  function next() { setPage((page + 1) % total); }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {visible.map((t) => (
          <div key={t._id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#8B5CF6]/30 transition-colors">
            <div className="flex gap-0.5">
              {[...Array(t.rating ?? 5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-white/70 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
            <div className="border-t border-white/5 pt-4">
              <p className="font-semibold text-white text-sm">{t.name}</p>
              {t.eventLabel && <p className="text-[#8B5CF6] text-xs mt-0.5">{t.eventLabel}</p>}
            </div>
          </div>
        ))}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            onClick={prev}
            aria-label="Previous reviews"
            className="w-10 h-10 rounded-full border border-[#8B5CF6]/40 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors flex items-center justify-center text-lg"
          >
            &#8249;
          </button>
          <span className="text-white/30 text-sm tabular-nums">{page + 1} / {total}</span>
          <button
            onClick={next}
            aria-label="Next reviews"
            className="w-10 h-10 rounded-full border border-[#8B5CF6]/40 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors flex items-center justify-center text-lg"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}
