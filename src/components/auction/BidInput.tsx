"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCents } from "@/lib/utils";

interface BidInputProps {
  lotId: string;
  userId: string;
  minBidCents: number;
  currentHighCents: number;
  bidIncrementCents: number;
  disabled?: boolean;
  onBidPlaced?: (bid: { amountCents: number; sequenceNo: number }) => void;
  onError?: (error: string) => void;
}

export function BidInput({
  lotId,
  userId,
  minBidCents,
  currentHighCents,
  bidIncrementCents,
  disabled,
  onBidPlaced,
  onError,
}: BidInputProps) {
  const [amountDollars, setAmountDollars] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const suggestedBid = Math.max(minBidCents, currentHighCents + bidIncrementCents);

  const handleSubmit = useCallback(async () => {
    const amountCents = amountDollars
      ? Math.round(parseFloat(amountDollars) * 100)
      : suggestedBid;

    if (amountCents < suggestedBid) {
      onError?.(`Minimum bid is ${formatCents(suggestedBid)}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/lots/${lotId}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          amountCents,
          idempotencyKey: uuidv4(),
          clientSentAt: new Date().toISOString(),
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setAmountDollars("");
        onBidPlaced?.({
          amountCents: json.data.amount_cents,
          sequenceNo: json.data.sequence_no,
        });
      } else {
        onError?.(json.message || "Failed to place bid");
      }
    } catch {
      onError?.("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }, [amountDollars, suggestedBid, lotId, userId, onBidPlaced, onError]);

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Current high bid: <span className="font-semibold text-foreground">{formatCents(currentHighCents)}</span>
        {" | "}
        Min next bid: <span className="font-semibold text-foreground">{formatCents(suggestedBid)}</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            type="number"
            step="0.01"
            min={(suggestedBid / 100).toFixed(2)}
            placeholder={(suggestedBid / 100).toFixed(2)}
            value={amountDollars}
            onChange={(e) => setAmountDollars(e.target.value)}
            className="pl-7"
            disabled={disabled || submitting}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={disabled || submitting}
          className="min-w-[120px]"
        >
          {submitting ? "Bidding..." : "Place Bid"}
        </Button>
      </div>

      <div className="flex gap-2">
        {[1, 2, 5].map((multiplier) => {
          const quickBid = suggestedBid + bidIncrementCents * (multiplier - 1);
          return (
            <Button
              key={multiplier}
              variant="outline"
              size="sm"
              disabled={disabled || submitting}
              onClick={() => {
                setAmountDollars((quickBid / 100).toFixed(2));
              }}
            >
              {formatCents(quickBid)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
