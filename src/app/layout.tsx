import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estate Liquidity — Authenticated Estate Inventory & Liquidation",
  description: "AI-enabled estate inventory, authentication, appraisal, and multi-channel liquidation. Trusted by families and fiduciaries across Los Angeles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--color-background)",
          color: "var(--color-foreground)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
