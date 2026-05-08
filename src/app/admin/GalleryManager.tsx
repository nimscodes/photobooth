"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
  category: string;
  caption: string;
  filename?: string;
}

const CATEGORIES = ["Wedding", "Birthday", "Corporate", "Party", "General"];

export default function GalleryManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [category, setCategory] = useState("General");
  const [caption, setCaption] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then(r => r.json())
      .then(d => setPhotos(d.photos ?? []))
      .finally(() => setLoading(false));
  }, []);

  function showMsg(text: string, type: "success" | "error" = "success") {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  }

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (arr.length === 0) { showMsg("Please select image files only.", "error"); return; }

    setUploading(true);
    setUploadProgress([]);
    const uploaded: Photo[] = [];

    for (const file of arr) {
      setUploadProgress(prev => [...prev, `Uploading ${file.name}…`]);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", category);
      fd.append("caption", caption);

      const res = await fetch("/api/admin/gallery/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok && data.photo) {
        uploaded.push(data.photo);
        setUploadProgress(prev => [...prev.slice(0, -1), `✓ ${file.name}`]);
      } else {
        setUploadProgress(prev => [...prev.slice(0, -1), `✗ ${file.name}: ${data.error}`]);
      }
    }

    setPhotos(prev => [...uploaded, ...prev]);
    setUploading(false);
    setCaption("");
    showMsg(`${uploaded.length} photo${uploaded.length !== 1 ? "s" : ""} uploaded!`);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  }, [category, caption]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  async function deletePhoto(photo: Photo) {
    if (!confirm("Delete this photo?")) return;
    const res = await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: photo.id, filename: photo.filename }),
    });
    if (res.ok) {
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      showMsg("Photo deleted.");
    } else {
      showMsg("Failed to delete photo.", "error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
        <h3 className="font-bold mb-4">Upload Photos</h3>

        {/* Category + Caption row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div>
            <label className="text-white/50 text-xs mb-1 block">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-white/50 text-xs mb-1 block">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="e.g. Smith Wedding 2025"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20"
            />
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-[#c9a84c] bg-[#c9a84c]/5"
              : "border-white/10 hover:border-white/30"
          } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <p className="text-4xl mb-3">{dragging ? "📂" : "📸"}</p>
          <p className="text-white/70 font-medium">
            {dragging ? "Drop to upload" : "Drag & drop photos here"}
          </p>
          <p className="text-white/30 text-sm mt-1">or click to browse · max 4MB per photo</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => e.target.files && uploadFiles(e.target.files)}
          />
        </div>

        {/* Upload progress */}
        {uploadProgress.length > 0 && (
          <div className="mt-3 space-y-1">
            {uploadProgress.map((p, i) => (
              <p key={i} className={`text-xs ${p.startsWith("✓") ? "text-green-400" : p.startsWith("✗") ? "text-red-400" : "text-white/50"}`}>{p}</p>
            ))}
          </div>
        )}

        {msg && (
          <p className={`mt-3 text-sm ${msg.type === "error" ? "text-red-400" : "text-green-400"}`}>
            {msg.text}
          </p>
        )}
      </div>

      {/* Photo grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">{photos.length} Photo{photos.length !== 1 ? "s" : ""}</h3>
        </div>

        {loading && <p className="text-white/30 text-sm">Loading gallery…</p>}

        {!loading && photos.length === 0 && (
          <div className="text-center py-12 text-white/20 border border-dashed border-white/10 rounded-xl">
            No photos yet. Upload your first one above.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-white/5">
              <Image
                src={photo.url}
                alt={photo.caption || photo.category}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#0f0f1a]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <button
                  onClick={() => deletePhoto(photo)}
                  className="self-end bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg transition-colors"
                >
                  🗑 Delete
                </button>
                <div>
                  <span className="bg-[#c9a84c] text-[#0f0f1a] text-xs font-bold px-2 py-0.5 rounded-full">
                    {photo.category}
                  </span>
                  {photo.caption && (
                    <p className="text-white text-xs mt-1 truncate">{photo.caption}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
