"use client";

import { cn } from "@/lib/utils";
import { formatCents } from "@/lib/utils";

export interface PriceBandProps {
  low: number;
  med: number;
  high: number;
  confidence: number;
  className?: string;
}

function Band({
  label,
  amount,
  confidence,
}: {
  label: string;
  amount: number;
  confidence: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-pewter">
        {label}
      </span>
      <span className="text-lg font-semibold tabular-nums text-charcoal font-[family-name:var(--font-body)]">
        {formatCents(amount)}
      </span>
      <div className="h-1.5 w-full rounded-full bg-platinum/30">
        <div
          className="h-full rounded-full bg-sapphire transition-all duration-500"
          style={{ width: `${Math.round(confidence * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function PriceBand({ low, med, high, confidence, className }: PriceBandProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-6", className)}>
      <Band label="Low" amount={low} confidence={confidence * 0.7} />
      <Band label="Med" amount={med} confidence={confidence} />
      <Band label="High" amount={high} confidence={confidence * 0.85} />
    </div>
  );
}
