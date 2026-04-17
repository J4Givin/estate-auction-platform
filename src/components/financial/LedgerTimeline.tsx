"use client";

import { cn } from "@/lib/utils";
import { formatCents } from "@/lib/utils";

type LedgerEntryType =
  | "sale"
  | "fee"
  | "adjustment"
  | "refund"
  | "payout"
  | "reserve";

export interface LedgerEntry {
  id: string;
  type: LedgerEntryType;
  amount: number;
  description: string;
  date: string;
  approved_by?: string;
}

export interface LedgerTimelineProps {
  entries: LedgerEntry[];
  className?: string;
}

const entryTypeConfig: Record<
  LedgerEntryType,
  { dotColor: string; label: string }
> = {
  sale: { dotColor: "bg-emerald", label: "Sale" },
  fee: { dotColor: "bg-ruby", label: "Fee" },
  adjustment: { dotColor: "bg-gold-tone", label: "Adjustment" },
  refund: { dotColor: "bg-ruby", label: "Refund" },
  payout: { dotColor: "bg-sapphire", label: "Payout" },
  reserve: { dotColor: "bg-amethyst", label: "Reserve" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function LedgerTimeline({ entries, className }: LedgerTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className={cn("rounded-lg border border-platinum/50 bg-white p-8 text-center text-sm text-pewter", className)}>
        No ledger entries yet.
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Vertical connecting line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-platinum/40" />

      <ul className="space-y-6">
        {entries.map((entry) => {
          const config = entryTypeConfig[entry.type] ?? entryTypeConfig.adjustment;
          const isNegative = entry.type === "fee" || entry.type === "refund";

          return (
            <li key={entry.id} className="relative flex gap-4 pl-0">
              {/* Dot */}
              <div
                className={cn(
                  "relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-white",
                  config.dotColor
                )}
              />

              {/* Content */}
              <div className="flex-1 min-w-0 rounded-lg border border-platinum/30 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-pewter">
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-charcoal">
                      {entry.description}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-pewter">
                      <span>{formatDate(entry.date)}</span>
                      {entry.approved_by && (
                        <>
                          <span className="text-platinum">|</span>
                          <span>Approved by {entry.approved_by}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      isNegative ? "text-ruby" : "text-emerald"
                    )}
                  >
                    {isNegative ? "-" : "+"}
                    {formatCents(Math.abs(entry.amount))}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
