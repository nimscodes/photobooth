import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/packages";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#0f0f1a] flex items-center justify-center text-white text-center px-4">
      <div>
        <p className="text-[#c9a84c] text-8xl font-black mb-4">404</p>
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-white/50 mb-8 max-w-sm mx-auto">
          Looks like this page took a wrong turn. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-8 py-3 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-bold hover:bg-[#e0c06a] transition-colors">
            Go Home
          </Link>
          <Link href="/booking" className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors">
            Book Now
          </Link>
        </div>
        <p className="text-white/20 text-xs mt-10">{BUSINESS_NAME}</p>
      </div>
    </div>
  );
}
