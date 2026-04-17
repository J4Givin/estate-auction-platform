import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estate Liquidity — Authenticated Estate Inventory & Liquidation",
  description:
    "AI-enabled estate inventory, authentication, appraisal, and multi-channel liquidation. Trusted by families and fiduciaries across Los Angeles.",
  keywords:
    "estate liquidation, estate appraisal, estate sale, probate, Los Angeles, Beverly Hills, Marina del Rey",
  openGraph: {
    title: "Estate Liquidity",
    description: "Authenticated estate inventory & multi-channel liquidation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
