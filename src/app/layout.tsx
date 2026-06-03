import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS_NAME, BUSINESS_CITY } from "@/lib/packages";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${BUSINESS_NAME} — Photo Booth Rental in ${BUSINESS_CITY}`,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: `Luxury photo booth rentals in ${BUSINESS_CITY}. 360 Video Booth & Open-Air iPad Booth for weddings, birthdays, corporate events, and celebrations across Fort Worth and surrounding areas.`,
  keywords: ["photo booth rental", "360 video booth", "photo booth Fort Worth", "photo booth Haslet TX", BUSINESS_CITY, "wedding photo booth", "birthday photo booth", "corporate event photo booth"],
  openGraph: {
    type: "website",
    siteName: BUSINESS_NAME,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
