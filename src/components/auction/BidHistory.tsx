"use client";

import { formatCents } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { AuctionEvent } from "@/types";

interface BidHistoryProps {
  events: AuctionEvent[];
  className?: string;
}

export function BidHistory({ events, className }: BidHistoryProps) {
  const bidEvents = events
    .filter((e) => e.event_type === "bid_placed")
    .sort((a, b) => b.event_no - a.event_no);

  if (bidEvents.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground text-center py-4">
          No bids yet. Be the first to bid!
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="max-h-[300px] overflow-y-auto space-y-1">
        {bidEvents.map((event) => {
          const payload = event.payload as Record<string, unknown>;
          return (
            <div
              key={event.id}
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs">
                  #{payload.sequenceNo as number}
                </span>
                <span className="font-medium">
                  {formatCents((payload.amountCents as number) || 0)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs truncate max-w-[120px]">
                  {(payload.bidderUserId as string)?.slice(0, 8)}...
                </span>
                <span className="text-xs">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
