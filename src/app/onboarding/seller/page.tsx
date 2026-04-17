"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SellerOnboardingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SellerOnboardingInner />
    </Suspense>
  );
}

function SellerOnboardingInner() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const refresh = searchParams.get("refresh");
  const orgIdParam = searchParams.get("orgId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const orgId = orgIdParam || (typeof window !== "undefined" ? localStorage.getItem("orgId") : null);

  const handleStartOnboarding = async () => {
    if (!userId || !orgId) {
      setError("Please set userId and orgId in localStorage");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/connect/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ orgId }),
      });

      const json = await res.json();

      if (res.ok && json.data?.url) {
        window.location.href = json.data.url;
      } else {
        setError(json.message || "Failed to start onboarding");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell role="admin" userName="Catherine Reynolds" orgName="Administration">
<main className="flex-1 p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Seller Onboarding</h1>
        </div>

        {success === "true" ? (
          <Card>
            <CardHeader className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle>Onboarding Complete</CardTitle>
              <CardDescription>
                Your Stripe Connect Express account is set up. You can now
                receive payments from auction sales.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        ) : refresh === "true" ? (
          <Card>
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <CardTitle>Onboarding Incomplete</CardTitle>
              <CardDescription>
                Your onboarding session expired or was interrupted. Please try
                again to complete the setup.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleStartOnboarding} disabled={loading}>
                {loading ? "Loading..." : "Resume Onboarding"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Set Up Payments</CardTitle>
              <CardDescription>
                Connect your Stripe account to receive payments from auction
                sales. This is a secure Stripe Connect Express setup powered by
                Stripe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-medium">What you&apos;ll need:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Business or personal identification</li>
                  <li>Bank account for payouts</li>
                  <li>Tax information (SSN or EIN)</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-medium">How payments work:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    When a bidder wins, their payment is authorized (held, not
                    charged)
                  </li>
                  <li>
                    You confirm fulfillment, and the payment is captured
                  </li>
                  <li>
                    Funds are deposited to your bank account on Stripe&apos;s
                    payout schedule
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleStartOnboarding}
                disabled={loading}
                className="w-full gap-2"
              >
                <CreditCard className="h-4 w-4" />
                {loading ? "Setting up..." : "Start Stripe Onboarding"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </AppShell>
  );
}
