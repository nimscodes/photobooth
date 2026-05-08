import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try { formData = await req.formData(); }
  catch { return NextResponse.json({ error: "Invalid form data" }, { status: 400 }); }

  const file = formData.get("file") as File | null;
  const category = (formData.get("category") as string) || "General";
  const caption = (formData.get("caption") as string) || "";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const MAX_SIZE = 4 * 1024 * 1024; // 4MB
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File too large. Max 4MB." }, { status: 413 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("gallery")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from("gallery").getPublicUrl(filename);

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const { error: dbError } = await supabaseAdmin.from("gallery_photos").insert({
    id,
    url: publicUrl,
    category,
    caption,
    created_at: new Date().toISOString(),
    filename,
  });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ success: true, photo: { id, url: publicUrl, category, caption, filename } });
}
