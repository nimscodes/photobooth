import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/getSiteSettings";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: `${settings.businessName} — Photo Booth Rental in ${settings.city}`,
      template: `%s | ${settings.businessName}`,
    },
    description: `${settings.tagline} in ${settings.city}. 360 Video Booth & Open-Air iPad Booth for weddings, birthdays, corporate events, and celebrations across Fort Worth and surrounding areas.`,
    keywords: ["photo booth rental", "360 video booth", "photo booth Fort Worth", "photo booth Haslet TX", settings.city, "wedding photo booth", "birthday photo booth", "corporate event photo booth"],
    openGraph: {
      type: "website",
      siteName: settings.businessName,
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0B1020]">
        <Navbar businessName={settings.businessName} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
