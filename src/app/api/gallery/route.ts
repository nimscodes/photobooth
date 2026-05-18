import { NextResponse } from "next/server";
import { fetchSanity } from "../../../../sanity/lib/client";
import { supabase } from "@/lib/supabase";

interface SanityPhoto {
  _id: string;
  url: string;
  caption: string;
  category: string;
}

export async function GET() {
  // Try Sanity first
  const sanityPhotos = await fetchSanity<SanityPhoto[]>(
    `*[_type == "galleryPhoto"] | order(order asc) {
      _id,
      "url": image.asset->url,
      caption,
      category
    }`,
    []
  );

  if (sanityPhotos && sanityPhotos.length > 0) {
    return NextResponse.json({ photos: sanityPhotos });
  }

  // Fall back to Supabase if no Sanity photos yet
  const { data } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ photos: data ?? [] });
}
