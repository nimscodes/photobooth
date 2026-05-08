"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BUSINESS_NAME } from "@/lib/packages";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/booking", label: "Book Now" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f1a]/95 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-[#c9a84c] text-xl font-bold tracking-tight">
            ✦ {BUSINESS_NAME}
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              const isBook = link.href === "/booking";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isBook
                      ? "ml-4 px-5 py-2 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-semibold text-sm hover:bg-[#e0c06a] transition-colors"
                      : `px-4 py-2 rounded-md text-sm transition-colors ${active ? "text-[#c9a84c]" : "text-white/70 hover:text-white"}`
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="md:hidden text-white/80 hover:text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0f0f1a] border-t border-white/5 px-4 pb-4">
          {LINKS.map((link) => {
            const isBook = link.href === "/booking";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={
                  isBook
                    ? "block mt-3 px-5 py-3 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-semibold text-center text-sm"
                    : `block py-3 text-sm border-b border-white/5 ${pathname === link.href ? "text-[#c9a84c]" : "text-white/70"}`
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
