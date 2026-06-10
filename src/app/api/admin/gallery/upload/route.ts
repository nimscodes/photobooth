import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

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

  const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
  const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

  if (!ALLOWED_MIME.has(file.type))
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed." }, { status: 415 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.has(ext))
    return NextResponse.json({ error: "Invalid file extension." }, { status: 415 });

  const MAX_SIZE = 4 * 1024 * 1024;
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File too large. Max 4MB." }, { status: 413 });

  const filename = `${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("gallery")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from("gallery").getPublicUrl(filename);

  const id = crypto.randomUUID();
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
