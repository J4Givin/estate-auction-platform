import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ActorRoleBadge } from "@/components/portal/ActorRoleBadge";
import { AnalyticsBoot } from "@/components/AnalyticsBoot";

// Inter — humanist sans for body and UI. Quiet, neutral, premium.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Fraunces — editorial display serif for headings. Variable axis for "soft"
// gives a humane, advisory feel rather than brutal/condensed display type.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// IBM Plex Mono — used very sparingly for tabular labels and small caps motifs.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://auction-repo.vercel.app"),
  title: {
    default: "Estate Liquidity — Estate Liquidation, Auction & Appraisal",
    template: "%s — Estate Liquidity",
  },
  description:
    "A modern estate liquidation and asset-disposition partner for families, executors, fiduciaries, and real estate professionals in Los Angeles. Inventory, appraisal, authentication, multi-channel sale, and itemized settlement.",
  applicationName: "Estate Liquidity",
  keywords: [
    "estate liquidation Los Angeles",
    "estate auction Los Angeles",
    "estate sale alternative",
    "probate estate liquidation",
    "estate appraisal Los Angeles",
    "sell inherited items",
    "estate cleanout and auction",
    "jewelry appraisal estate sale",
    "art and antique estate liquidation",
    "downsizing estate sale service",
  ],
  authors: [{ name: "Estate Liquidity" }],
  openGraph: {
    title: "Estate Liquidity — Estate Liquidation, Auction & Appraisal",
    description:
      "Inventory, appraisal, authentication, multi-channel sale, and itemized settlement. Los Angeles.",
    type: "website",
    locale: "en_US",
    siteName: "Estate Liquidity",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estate Liquidity",
    description:
      "Estate liquidation, appraisal, and authentication for Los Angeles families and professionals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  formatDetection: { email: false, address: false, telephone: false },
};

const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://auction-repo.vercel.app/#org",
  name: "Estate Liquidity",
  description:
    "Estate liquidation, appraisal, authentication, and asset disposition partner for Los Angeles families, executors, trustees, and real estate professionals.",
  areaServed: { "@type": "City", name: "Los Angeles" },
  address: { "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" },
  serviceType: [
    "Estate liquidation",
    "Estate auction",
    "Estate appraisal",
    "Authentication coordination",
    "Estate cleanout",
    "Estate buyout",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${plexMono.variable}`}>
      <body className="font-sans bg-[#FBF8F1] text-[#1E1B17]">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:bg-[#1E1B17] focus:text-[#FBF8F1] focus:rounded-md focus:label">
          Skip to main content
        </a>
        {children}
        <AnalyticsBoot />
        {/* Server-rendered, role-aware dev badge. Hidden in production. */}
        <ActorRoleBadge />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }}
        />
      </body>
    </html>
  );
}
