"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LotStatusBadge } from "./LotStatusBadge";
import { CountdownTimer } from "./CountdownTimer";
import { formatCents } from "@/lib/utils";
import type { Lot } from "@/types";

interface LotCardProps {
  lot: Lot;
}

export function LotCard({ lot }: LotCardProps) {
  const isLive = lot.status === "live_bidding";

  return (
    <Link href={isLive ? `/lots/${lot.id}/live` : `/lots/${lot.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base line-clamp-1">{lot.title}</CardTitle>
            <LotStatusBadge status={lot.status} />
          </div>
        </CardHeader>
        <CardContent>
          {lot.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {lot.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                {isLive ? "Current bid" : "Start price"}
              </p>
              <p className="text-lg font-semibold">
                {formatCents(lot.start_price_cents)}
              </p>
            </div>

            {isLive && lot.closes_at && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Time left</p>
                <CountdownTimer closesAt={lot.closes_at} className="text-base" />
              </div>
            )}
          </div>

          {lot.appraisal_value_cents && (
            <p className="text-xs text-muted-foreground mt-2">
              Appraised at {formatCents(lot.appraisal_value_cents)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
