"use client";

import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "scheduled",        label: "Scheduled",        short: "Scheduled" },
  { key: "onsite_capture",   label: "On-Site Capture",  short: "Capture" },
  { key: "processing",       label: "Processing",       short: "Processing" },
  { key: "review",           label: "Under Review",     short: "Review" },
  { key: "customer_approval",label: "Your Approval",    short: "Approval" },
  { key: "publishing",       label: "Publishing",       short: "Publishing" },
  { key: "active_selling",   label: "Active Selling",   short: "Active" },
  { key: "fulfillment",      label: "Fulfillment",      short: "Fulfillment" },
  { key: "payout_pending",   label: "Payout Sent",      short: "Payout" },
];

const ORDER = STEPS.map(s => s.key);

interface JobTimelineProps {
  currentStatus: string;
  className?: string;
}

export function JobTimeline({ currentStatus, className }: JobTimelineProps) {
  const currentIndex = ORDER.indexOf(currentStatus);

  return (
    <div className={cn("w-full scroll-x", className)}>
      <div className="flex items-center min-w-max py-2 px-1">
        {STEPS.map((step, i) => {
          const done    = i < currentIndex;
          const active  = i === currentIndex;
          const pending = i > currentIndex;

          return (
            <div key={step.key} className="flex items-center">
              {/* Step node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all",
                    done   ? "h-7 w-7 bg-emerald-j text-white"
                    : active ? "h-7 w-7 bg-sapphire text-white ring-4 ring-sapphire/20"
                    : "h-7 w-7 bg-muted border border-border text-muted-foreground"
                  )}
                >
                  {done   ? <CheckCircle className="h-4 w-4" />
                  : active ? <Clock className="h-3.5 w-3.5" />
                  : <Circle className="h-3.5 w-3.5" />}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium text-center leading-tight whitespace-nowrap",
                    done   ? "text-emerald-j"
                    : active ? "text-sapphire"
                    : "text-muted-foreground"
                  )}
                >
                  {step.short}
                </span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-[2px] w-10 sm:w-14 mx-1 rounded-full transition-colors",
                    i < currentIndex ? "bg-emerald-j" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
