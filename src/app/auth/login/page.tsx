"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel — compact header on mobile, half on md */}
      <div className="w-full md:w-1/2 min-h-[180px] md:min-h-screen bg-[#111827] flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
        {/* Background texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        <div className="relative text-center md:text-left max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <ShieldCheck className="h-7 w-7 text-gold-j-mid" />
            <span
              className="text-2xl md:text-3xl font-medium text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estate Liquidity
            </span>
          </Link>
          <p className="text-sm text-white/60 hidden md:block">
            Trusted appraisals. Authenticated provenance. Maximum recovery.
          </p>

          {/* Feature list — hidden on mobile */}
          <ul className="hidden md:flex flex-col gap-3 mt-8">
            {[
              "Expert authentication on every high-value item",
              "6+ simultaneous sales channels",
              "Real-time tracking & transparent ledger",
              "Court-ready documentation for probate",
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                <CheckCircle2 className="h-4 w-4 text-gold-j-mid mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#F4F0E8]">
        <div className="w-full max-w-md">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl font-medium text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="pt-6 pb-6">
              <form className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot" className="text-xs text-sapphire hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="text-base"
                  />
                </div>
                <Button type="submit" variant="primary" size="default" className="w-full gap-2 mt-2 active:scale-[0.97]">
                  Sign In <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="font-medium text-sapphire hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
