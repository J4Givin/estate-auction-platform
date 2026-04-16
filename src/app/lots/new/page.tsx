"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewLotPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <NewLotPageInner />
    </Suspense>
  );
}

function NewLotPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showId = searchParams.get("showId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    conditionNotes: "",
    mediaUrls: "",
    appraisalValueDollars: "",
    startPriceDollars: "1.00",
    reservePriceDollars: "",
    bidIncrementDollars: "1.00",
    softCloseEnabled: true,
    softCloseWindowSeconds: "30",
    softCloseExtendSeconds: "30",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const orgId = typeof window !== "undefined" ? localStorage.getItem("orgId") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !orgId) {
      setError("Please set your userId and orgId in localStorage");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const body: Record<string, unknown> = {
        orgId,
        title: formData.title,
        description: formData.description || undefined,
        conditionNotes: formData.conditionNotes || undefined,
        startPriceCents: Math.round(parseFloat(formData.startPriceDollars || "1") * 100),
        bidIncrementCents: Math.round(parseFloat(formData.bidIncrementDollars || "1") * 100),
        softCloseEnabled: formData.softCloseEnabled,
        softCloseWindowSeconds: parseInt(formData.softCloseWindowSeconds || "30"),
        softCloseExtendSeconds: parseInt(formData.softCloseExtendSeconds || "30"),
      };

      if (showId) body.showId = showId;
      if (formData.mediaUrls) {
        body.mediaUrls = formData.mediaUrls.split(",").map((u) => u.trim()).filter(Boolean);
      }
      if (formData.appraisalValueDollars) {
        body.appraisalValueCents = Math.round(parseFloat(formData.appraisalValueDollars) * 100);
      }
      if (formData.reservePriceDollars) {
        body.reservePriceCents = Math.round(parseFloat(formData.reservePriceDollars) * 100);
      }

      const res = await fetch("/api/lots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (res.ok) {
        router.push(`/lots/${json.data.id}`);
      } else {
        setError(json.message || "Failed to create lot");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create New Lot</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Antique Victorian Writing Desk"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe the item..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conditionNotes">Condition Notes</Label>
                  <textarea
                    id="conditionNotes"
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.conditionNotes}
                    onChange={(e) => updateField("conditionNotes", e.target.value)}
                    placeholder="Note any wear, damage, or restoration..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mediaUrls">Image URLs (comma-separated)</Label>
                  <Input
                    id="mediaUrls"
                    value={formData.mediaUrls}
                    onChange={(e) => updateField("mediaUrls", e.target.value)}
                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appraisalValue">Appraisal Value ($)</Label>
                    <Input
                      id="appraisalValue"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.appraisalValueDollars}
                      onChange={(e) => updateField("appraisalValueDollars", e.target.value)}
                      placeholder="500.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startPrice">Start Price ($) *</Label>
                    <Input
                      id="startPrice"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.startPriceDollars}
                      onChange={(e) => updateField("startPriceDollars", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reservePrice">Reserve Price ($)</Label>
                    <Input
                      id="reservePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.reservePriceDollars}
                      onChange={(e) => updateField("reservePriceDollars", e.target.value)}
                      placeholder="No reserve"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bidIncrement">Bid Increment ($) *</Label>
                    <Input
                      id="bidIncrement"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.bidIncrementDollars}
                      onChange={(e) => updateField("bidIncrementDollars", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Soft Close Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="softClose"
                    checked={formData.softCloseEnabled}
                    onChange={(e) => updateField("softCloseEnabled", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="softClose">Enable soft close</Label>
                </div>
                {formData.softCloseEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="window">Window (seconds)</Label>
                      <Input
                        id="window"
                        type="number"
                        min="1"
                        value={formData.softCloseWindowSeconds}
                        onChange={(e) => updateField("softCloseWindowSeconds", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extend">Extension (seconds)</Label>
                      <Input
                        id="extend"
                        type="number"
                        min="1"
                        value={formData.softCloseExtendSeconds}
                        onChange={(e) => updateField("softCloseExtendSeconds", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating lot..." : "Create Lot"}
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
}
