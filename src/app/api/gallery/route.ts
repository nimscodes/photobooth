import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ photos: [] });
  return NextResponse.json({ photos: data ?? [] });
}
