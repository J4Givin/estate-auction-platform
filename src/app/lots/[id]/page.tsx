"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, ImageIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LotStatusBadge } from "@/components/auction/LotStatusBadge";
import { formatCents } from "@/lib/utils";
import type { Lot, AuctionEvent } from "@/types";

export default function LotDetailPage() {
  const params = useParams();
  const lotId = params.id as string;
  const [lot, setLot] = useState<Lot | null>(null);
  const [events, setEvents] = useState<AuctionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const [lotRes, eventsRes] = await Promise.all([
          fetch(`/api/lots/${lotId}`, { headers: { "x-user-id": userId } }),
          fetch(`/api/lots/${lotId}/events?afterEventNo=0`, {
            headers: { "x-user-id": userId },
          }),
        ]);
        if (lotRes.ok) {
          const json = await lotRes.json();
          setLot(json.data);
        }
        if (eventsRes.ok) {
          const json = await eventsRes.json();
          setEvents(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch lot:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lotId, userId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">
          <p className="text-muted-foreground">Lot not found.</p>
        </main>
      </div>
    );
  }

  const bidEvents = events.filter((e) => e.event_type === "bid_placed");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6 max-w-screen-xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{lot.title}</h1>
              <LotStatusBadge status={lot.status} />
            </div>
          </div>
          {lot.status === "live_bidding" && (
            <Link href={`/lots/${lotId}/live`}>
              <Button className="gap-2">
                <Play className="h-4 w-4" />
                Join Live Bidding
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images */}
          <div className="lg:col-span-2">
            {lot.media_urls && lot.media_urls.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {lot.media_urls.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${lot.title} - Image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="aspect-video flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p>No images uploaded</p>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {lot.description && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{lot.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Condition */}
            {lot.condition_notes && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Condition Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{lot.condition_notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {lot.appraisal_value_cents && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Appraised Value</span>
                    <span className="font-semibold">
                      {formatCents(lot.appraisal_value_cents)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Price</span>
                  <span className="font-semibold">
                    {formatCents(lot.start_price_cents)}
                  </span>
                </div>
                {lot.reserve_price_cents && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reserve</span>
                    <span className="font-semibold">
                      {formatCents(lot.reserve_price_cents)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bid Increment</span>
                  <span className="font-semibold">
                    {formatCents(lot.bid_increment_cents)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Auction Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Soft Close</span>
                  <span>{lot.soft_close_enabled ? "Enabled" : "Disabled"}</span>
                </div>
                {lot.soft_close_enabled && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Window</span>
                      <span>{lot.soft_close_window_seconds}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extension</span>
                      <span>{lot.soft_close_extend_seconds}s</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Bid History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Bid History ({bidEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bidEvents.length > 0 ? (
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {bidEvents
                      .sort((a, b) => b.event_no - a.event_no)
                      .map((event) => {
                        const p = event.payload as Record<string, unknown>;
                        return (
                          <div
                            key={event.id}
                            className="flex justify-between text-sm py-1"
                          >
                            <span className="font-mono text-xs text-muted-foreground">
                              #{p.sequenceNo as number}
                            </span>
                            <span className="font-medium">
                              {formatCents((p.amountCents as number) || 0)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No bids yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
