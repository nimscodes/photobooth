"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BUSINESS_NAME } from "@/lib/packages";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) { router.push("/admin"); router.refresh(); }
    else setError("Incorrect password.");
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[#c9a84c] font-bold text-xl">✦ {BUSINESS_NAME}</p>
          <p className="text-white/50 text-sm mt-1">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
          <h1 className="text-white font-bold text-xl text-center">Sign In</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm text-center">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-bold text-sm hover:bg-[#e0c06a] transition-colors disabled:opacity-50">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="text-white/20 text-xs text-center mt-4">Set ADMIN_PASSWORD in your .env.local file</p>
      </div>
    </div>
  );
}
