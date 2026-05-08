import Link from "next/link";
import { BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_CITY } from "@/lib/packages";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f1a] border-t border-white/5 text-white/60 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-[#c9a84c] font-bold text-base mb-3">✦ {BUSINESS_NAME}</p>
            <p className="leading-relaxed">
              Premium photo booth rental for weddings, birthdays, corporate events, and more in {BUSINESS_CITY}.
            </p>
          </div>
          <div>
            <p className="text-white font-medium mb-3">Quick Links</p>
            <ul className="space-y-2">
              {[["Home", "/"], ["Packages & Pricing", "/packages"], ["Gallery", "/gallery"], ["Book Now", "/booking"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-[#c9a84c] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-medium mb-3">Get in Touch</p>
            <ul className="space-y-2">
              <li><a href={`tel:${BUSINESS_PHONE.replace(/\D/g, "")}`} className="hover:text-[#c9a84c] transition-colors">{BUSINESS_PHONE}</a></li>
              <li><a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-[#c9a84c] transition-colors">{BUSINESS_EMAIL}</a></li>
              <li>{BUSINESS_CITY}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/30">
          <p>© {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.</p>
          <Link href="/admin" className="hover:text-white/60 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
