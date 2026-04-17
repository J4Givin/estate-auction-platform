"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wifi, WifiOff, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LotStatusBadge } from "@/components/auction/LotStatusBadge";
import { CountdownTimer } from "@/components/auction/CountdownTimer";
import { BidInput } from "@/components/auction/BidInput";
import { BidHistory } from "@/components/auction/BidHistory";
import { useAuction } from "@/hooks/useAuction";
import { formatCents } from "@/lib/utils";

export default function LotLivePage() {
  const params = useParams();
  const lotId = params.id as string;
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  const { lot, events, lastEventNo, connectionState } = useAuction({
    lotId,
    userId,
  });

  const isLive = lot?.status === "live_bidding";
  const currentHighCents = (() => {
    const bidEvents = events
      .filter((e) => e.event_type === "bid_placed")
      .sort((a, b) => b.event_no - a.event_no);
    if (bidEvents.length > 0) {
      return (bidEvents[0].payload as Record<string, unknown>).amountCents as number || 0;
    }
    return 0;
  })();

  const hasSoftCloseExtension = events.some(
    (e) => e.event_type === "soft_close_extended"
  );

  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Operations">
<main className="flex-1 p-6 max-w-screen-xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/lots/${lotId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold flex-1">
            {lot?.title || "Loading..."}
          </h1>

          {/* Connection status */}
          <Badge
            variant={
              connectionState === "connected"
                ? "success"
                : connectionState === "polling"
                ? "warning"
                : "destructive"
            }
            className="gap-1"
          >
            {connectionState === "connected" ? (
              <Wifi className="h-3 w-3" />
            ) : connectionState === "polling" ? (
              <Radio className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {connectionState === "connected"
              ? "Realtime"
              : connectionState === "polling"
              ? "Polling"
              : "Offline"}
          </Badge>
        </div>

        {lot ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main bidding area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Current state */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <LotStatusBadge status={lot.status} />
                      <p className="text-sm text-muted-foreground mt-1">
                        Event #{lastEventNo} | Bid #{lot.last_bid_seq}
                      </p>
                    </div>
                    <CountdownTimer
                      closesAt={lot.closes_at}
                      softCloseExtended={hasSoftCloseExtension}
                      className="text-3xl"
                    />
                  </div>

                  <div className="text-center py-6 bg-muted/30 rounded-lg mb-6">
                    <p className="text-sm text-muted-foreground mb-1">
                      Current High Bid
                    </p>
                    <p className="text-4xl font-bold">
                      {currentHighCents > 0
                        ? formatCents(currentHighCents)
                        : formatCents(lot.start_price_cents)}
                    </p>
                    {lot.appraisal_value_cents && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Appraised at {formatCents(lot.appraisal_value_cents)}
                      </p>
                    )}
                  </div>

                  {/* Bid Input */}
                  {isLive ? (
                    <div>
                      {bidError && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-3">
                          {bidError}
                        </div>
                      )}
                      {bidSuccess && (
                        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 mb-3">
                          {bidSuccess}
                        </div>
                      )}
                      <BidInput
                        lotId={lotId}
                        userId={userId}
                        minBidCents={lot.start_price_cents}
                        currentHighCents={currentHighCents}
                        bidIncrementCents={lot.bid_increment_cents}
                        onBidPlaced={(bid) => {
                          setBidError(null);
                          setBidSuccess(
                            `Bid placed: ${formatCents(bid.amountCents)} (seq #${bid.sequenceNo})`
                          );
                          setTimeout(() => setBidSuccess(null), 3000);
                        }}
                        onError={(err) => {
                          setBidSuccess(null);
                          setBidError(err);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {lot.status === "draft" || lot.status === "queued"
                        ? "Bidding has not started yet."
                        : "Bidding has ended."}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lot details */}
              {lot.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">About this lot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{lot.description}</p>
                    {lot.condition_notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-md">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Condition Notes
                        </p>
                        <p className="text-sm">{lot.condition_notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Bid History Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bid History</CardTitle>
                </CardHeader>
                <CardContent>
                  <BidHistory events={events} />
                </CardContent>
              </Card>

              {/* Lot info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lot Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Price</span>
                    <span>{formatCents(lot.start_price_cents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Increment</span>
                    <span>{formatCents(lot.bid_increment_cents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soft Close</span>
                    <span>
                      {lot.soft_close_enabled
                        ? `${lot.soft_close_window_seconds}s / +${lot.soft_close_extend_seconds}s`
                        : "Disabled"}
                    </span>
                  </div>
                  {lot.reserve_price_cents && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reserve</span>
                      <span>Hidden</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Loading lot data...</p>
        )}
      </main>
    </AppShell>
  );
}
