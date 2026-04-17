"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface JobTimelineProps {
  currentStatus: string;
  className?: string;
}

const steps = [
  { key: "lead", label: "Lead" },
  { key: "scheduled", label: "Scheduled" },
  { key: "onsite_capture", label: "Onsite" },
  { key: "processing", label: "Processing" },
  { key: "review", label: "Review" },
  { key: "customer_approval", label: "Approval" },
  { key: "publishing", label: "Publishing" },
  { key: "active_selling", label: "Selling" },
  { key: "payout_pending", label: "Payout" },
  { key: "closed", label: "Closed" },
] as const;

function getStepIndex(status: string): number {
  const idx = steps.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export function JobTimeline({ currentStatus, className }: JobTimelineProps) {
  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="flex items-center min-w-max px-2 py-4">
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isFuture = index > activeIndex;

          return (
            <div key={step.key} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all",
                    isCompleted &&
                      "border-emerald bg-emerald text-white",
                    isActive &&
                      "border-sapphire bg-sapphire text-white shadow-md",
                    isFuture &&
                      "border-platinum bg-white text-platinum"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs whitespace-nowrap",
                    isActive && "font-bold text-sapphire",
                    isCompleted && "font-medium text-emerald",
                    isFuture && "font-normal text-platinum"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 w-8 sm:w-12 lg:w-16",
                    index < activeIndex ? "bg-emerald" : "bg-platinum/50"
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
