import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/packages";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#0B1020] flex items-center justify-center text-white text-center px-4">
      <div>
        <p className="text-[#8B5CF6] text-8xl font-black mb-4">404</p>
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-white/50 mb-8 max-w-sm mx-auto">
          Looks like this page took a wrong turn. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-8 py-3 rounded-full bg-[#8B5CF6] text-white font-bold hover:bg-[#7c3aed] transition-colors">
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
