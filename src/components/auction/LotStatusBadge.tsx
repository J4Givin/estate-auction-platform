"use client";

import { Badge } from "@/components/ui/badge";
import type { LotStatus } from "@/types";

const statusConfig: Record<LotStatus, { label: string; variant: "default" | "sapphire" | "destructive" | "outline" | "success" | "warning" }> = {
  draft: { label: "Draft", variant: "sapphire" },
  queued: { label: "Queued", variant: "outline" },
  live_bidding: { label: "Live", variant: "destructive" },
  closing: { label: "Closing", variant: "warning" },
  sold_pending_payment: { label: "Sold - Pending Payment", variant: "warning" },
  reserve_not_met: { label: "Reserve Not Met", variant: "sapphire" },
  canceled: { label: "Canceled", variant: "sapphire" },
  voided: { label: "Voided", variant: "destructive" },
  paid: { label: "Paid", variant: "success" },
  fulfillment: { label: "Fulfillment", variant: "default" },
  completed: { label: "Completed", variant: "success" },
};

interface LotStatusBadgeProps {
  status: LotStatus;
  className?: string;
}

export function LotStatusBadge({ status, className }: LotStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "outline" as const };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
