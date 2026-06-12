"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
  category: string;
  caption: string;
}

const CATEGORIES = ["All", "Wedding", "Birthday", "Corporate", "Party", "General"];

export default function GalleryGrid() {
  const [active, setActive] = useState("All");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(d => setPhotos(d.photos ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "All" ? photos : photos.filter(p => p.category === active);

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
                  ? "bg-[#0B1020] text-white"
                  : "bg-white text-[#1a1a2e]/60 hover:bg-[#0B1020]/5"
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

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl aspect-[4/3] bg-[#0B1020]/5 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer bg-[#0B1020]/5"
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || photo.category}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-[#0B1020]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="bg-[#8B5CF6] text-[#0B1020] text-xs font-bold px-3 py-1 rounded-full">
                      {photo.category}
                    </span>
                    {photo.caption && (
                      <p className="text-white font-semibold text-center px-4">{photo.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-[#1a1a2e]/30">
              {photos.length === 0
                ? "No photos yet — check back soon!"
                : "No photos in this category yet."}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
