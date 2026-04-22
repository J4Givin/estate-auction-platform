import type { Metadata } from "next";
import { DM_Sans, Barlow_Condensed, Space_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Estate Liquidity",
    template: "%s — Estate Liquidity",
  },
  description: "Verified appraisals. Authenticated provenance.",
  keywords: [
    "estate liquidation", "estate appraisal", "estate sale", "probate",
    "Los Angeles", "Beverly Hills", "Marina del Rey", "estate authentication",
  ],
  authors: [{ name: "Estate Liquidity" }],
  openGraph: {
    title: "Estate Liquidity",
    description: "Verified appraisals. Authenticated provenance.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${barlowCondensed.variable} ${spaceMono.variable}`}>
      <body className="font-sans bg-white text-[#0A0A0A]">{children}</body>
    </html>
  );
}
