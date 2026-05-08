"use client";

import { useState } from "react";

const GALLERY = [
  { id: 1, category: "Wedding", label: "Smith & Johnson Wedding", bg: "#1a1a2e" },
  { id: 2, category: "Birthday", label: "Sweet 16 Party", bg: "#4a0e8f" },
  { id: 3, category: "Corporate", label: "Tech Corp Annual Gala", bg: "#0f3460" },
  { id: 4, category: "Wedding", label: "Outdoor Garden Wedding", bg: "#2d1b69" },
  { id: 5, category: "Party", label: "New Year's Eve Bash", bg: "#1a1a2e" },
  { id: 6, category: "Birthday", label: "50th Birthday Celebration", bg: "#4a0e8f" },
  { id: 7, category: "Corporate", label: "Product Launch Event", bg: "#0f3460" },
  { id: 8, category: "Wedding", label: "Rooftop Wedding Reception", bg: "#2d1b69" },
  { id: 9, category: "Party", label: "Holiday Office Party", bg: "#1a1a2e" },
];

const CATEGORIES = ["All", "Wedding", "Birthday", "Corporate", "Party"];

export default function GalleryGrid() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? GALLERY : GALLERY.filter((g) => g.category === active);

  return (
    <>
      {/* Filter tabs */}
      <div className="bg-[#faf9f7] py-4 border-b border-black/5 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cat === active
                  ? "bg-[#0f0f1a] text-white"
                  : "bg-white text-[#1a1a2e]/60 hover:bg-[#0f0f1a]/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="bg-[#faf9f7] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
                style={{ backgroundColor: item.bg }}
              >
                {/* Replace this div with <Image> once you add real photos */}
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <span className="text-5xl mb-3 opacity-30">📸</span>
                  <span className="text-white/30 text-sm text-center">Add your photo here</span>
                </div>
                <div className="absolute inset-0 bg-[#0f0f1a]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <span className="bg-[#c9a84c] text-[#0f0f1a] text-xs font-bold px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <p className="text-white font-semibold text-center px-4">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#1a1a2e]/30">
              No photos in this category yet.
            </div>
          )}

          <div className="mt-12 bg-white rounded-2xl p-8 text-center border border-dashed border-[#c9a84c]/30">
            <p className="text-2xl mb-2">🖼️</p>
            <p className="font-semibold text-[#1a1a2e] mb-1">Add your event photos</p>
            <p className="text-[#1a1a2e]/50 text-sm max-w-sm mx-auto">
              Place photos in{" "}
              <code className="bg-[#faf9f7] px-1.5 py-0.5 rounded text-xs">public/gallery/</code>{" "}
              and update the <code className="bg-[#faf9f7] px-1.5 py-0.5 rounded text-xs">GALLERY</code> array in{" "}
              <code className="bg-[#faf9f7] px-1.5 py-0.5 rounded text-xs">src/app/gallery/GalleryGrid.tsx</code>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
