"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Square, SkipForward } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LotStatusBadge } from "@/components/auction/LotStatusBadge";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { BidHistory } from "@/components/auction/BidHistory";
import { useAuction } from "@/hooks/useAuction";
import { formatCents } from "@/lib/utils";
import type { Lot } from "@/types";

export default function ShowLivePage() {
  const params = useParams();
  const showId = params.id as string;
  const [lots, setLots] = useState<Lot[]>([]);
  const [currentLotIndex, setCurrentLotIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchLots = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/lots?showId=${showId}`, {
          headers: { "x-user-id": userId },
        });
        if (res.ok) {
          const json = await res.json();
          setLots(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch lots:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, [showId, userId]);

  const currentLot = lots[currentLotIndex];

  const {
    lot: liveLotData,
    events,
    connectionState,
  } = useAuction({
    lotId: currentLot?.id || "",
    userId: userId || undefined,
  });

  const activeLot = liveLotData || currentLot;

  const handleStartLot = async () => {
    if (!currentLot || !userId) return;
    try {
      await fetch(`/api/lots/${currentLot.id}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ durationSeconds: 300 }),
      });
    } catch (err) {
      console.error("Failed to start lot:", err);
    }
  };

  const handleCloseLot = async () => {
    if (!currentLot || !userId) return;
    try {
      await fetch(`/api/lots/${currentLot.id}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      });
    } catch (err) {
      console.error("Failed to close lot:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6 max-w-screen-xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/shows/${showId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Live Auction — Host View</h1>
          <Badge
            variant={connectionState === "connected" ? "success" : "warning"}
          >
            {connectionState}
          </Badge>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream / Main Area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Stream embed placeholder */}
              <Card>
                <CardContent className="aspect-video flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    Stream embed placeholder — connect your streaming service
                  </p>
                </CardContent>
              </Card>

              {/* Current Lot Controls */}
              {activeLot && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Current: {activeLot.title}
                      </CardTitle>
                      <LotStatusBadge status={activeLot.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Start Price</p>
                        <p className="text-lg font-semibold">
                          {formatCents(activeLot.start_price_cents)}
                        </p>
                      </div>
                      {activeLot.closes_at && (
                        <CountdownTimer closesAt={activeLot.closes_at} />
                      )}
                    </div>

                    <div className="flex gap-2">
                      {activeLot.status === "draft" && (
                        <Button onClick={handleStartLot} className="gap-2">
                          <Play className="h-4 w-4" />
                          Start Bidding
                        </Button>
                      )}
                      {activeLot.status === "live_bidding" && (
                        <Button
                          variant="destructive"
                          onClick={handleCloseLot}
                          className="gap-2"
                        >
                          <Square className="h-4 w-4" />
                          Close Lot
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentLotIndex((i) => Math.min(i + 1, lots.length - 1))
                        }
                        disabled={currentLotIndex >= lots.length - 1}
                        className="gap-2"
                      >
                        <SkipForward className="h-4 w-4" />
                        Next Lot
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar — Bid History + Lot Queue */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bid History</CardTitle>
                </CardHeader>
                <CardContent>
                  <BidHistory events={events} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Lot Queue ({lots.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {lots.map((lot, idx) => (
                      <button
                        key={lot.id}
                        onClick={() => setCurrentLotIndex(idx)}
                        className={`w-full text-left p-2 rounded-md text-sm ${
                          idx === currentLotIndex
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">
                            {idx + 1}. {lot.title}
                          </span>
                          <LotStatusBadge status={lot.status} />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
