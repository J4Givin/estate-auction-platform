import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Estate Liquidity",
    template: "%s — Estate Liquidity",
  },
  description:
    "AI-enabled estate inventory, expert authentication, appraisal, and multi-channel liquidation. Trusted by families and fiduciaries across Los Angeles.",
  keywords: [
    "estate liquidation", "estate appraisal", "estate sale", "probate",
    "Los Angeles", "Beverly Hills", "Marina del Rey", "estate authentication",
  ],
  authors: [{ name: "Estate Liquidity" }],
  openGraph: {
    title: "Estate Liquidity",
    description: "Expert estate authentication & multi-channel liquidation",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Cormorant Garamond: editorial luxury serif for display text */}
        {/* DM Sans: geometric humanist sans for all UI */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
