"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-sapphire flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-gold-j-mid" />
            <span className="text-2xl font-medium text-white" style={{ fontFamily: "var(--font-display)" }}>
              Estate Liquidity
            </span>
          </Link>
          <p className="mt-2 text-sm text-white/60">Create your account</p>
        </div>

        <Card className="shadow-xl border-white/10">
          <CardContent className="pt-6 pb-6">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input placeholder="Jane" autoComplete="given-name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input placeholder="Smith" autoComplete="family-name" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input type="password" placeholder="At least 8 characters" />
              </div>
              <div className="space-y-1.5">
                <Label>Referral Code <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input placeholder="Partner code" />
              </div>
              <Button type="submit" variant="primary" size="default" className="w-full gap-2 mt-2">
                Create Account <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>
            <div className="mt-5 pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-sapphire hover:underline">Sign in</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
