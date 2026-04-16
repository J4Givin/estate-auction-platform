import Link from "next/link";
import { Gavel, Shield, Zap, CreditCard, Radio, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Radio,
    title: "Live Bidding",
    description:
      "Realtime auction engine with sub-150ms bid acceptance, soft-close protection, and deterministic winner resolution.",
  },
  {
    icon: Shield,
    title: "Server-Authoritative",
    description:
      "Every bid is validated server-side with SELECT FOR UPDATE. No client-side cheating, no race conditions.",
  },
  {
    icon: CreditCard,
    title: "Stripe Connect",
    description:
      "Secure payments via Stripe Connect Express with manual capture. Hold funds until fulfillment confirmation.",
  },
  {
    icon: Zap,
    title: "Realtime via Ably",
    description:
      "Gap detection, automatic resync, and polling fallback ensure every bidder sees the same canonical state.",
  },
  {
    icon: BarChart3,
    title: "Estate Appraisals",
    description:
      "Professional appraisal workflow with condition notes, media uploads, and appraised value tracking.",
  },
  {
    icon: Gavel,
    title: "Multi-Tenant",
    description:
      "Org-scoped architecture supports multiple auction houses, each with their own shows, lots, and team members.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-background to-muted">
        <div className="flex items-center gap-3 mb-6">
          <Gavel className="h-10 w-10" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Estate Auctions
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          The professional live commerce platform for estate auctions. Realtime
          bidding, secure payments, and deterministic auction resolution — all in
          one place.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              <Gavel className="h-4 w-4" />
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-screen-xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Built for Professional Auctioneers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-16">
        <div className="container max-w-screen-md mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to run your first auction?</h2>
          <p className="text-muted-foreground mb-6">
            Create your organization, onboard with Stripe, and start selling in
            minutes.
          </p>
          <Link href="/auth/register">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container max-w-screen-xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            <span>Estate Auctions Platform</span>
          </div>
          <p>Sprint-1 MVP</p>
        </div>
      </footer>
    </div>
  );
}
