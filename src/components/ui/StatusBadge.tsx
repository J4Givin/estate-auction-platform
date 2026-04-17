"use client";

import { cn } from "@/lib/utils";
import { Star, ShieldCheck, Clock, AlertTriangle } from "lucide-react";

type JobStatus =
  | "scheduled"
  | "onsite_capture"
  | "processing"
  | "review"
  | "customer_approval"
  | "publishing"
  | "active_selling"
  | "fulfillment"
  | "payout_pending"
  | "closed"
  | "hold"
  | "cancelled";

type ItemStatus =
  | "draft"
  | "pending_review"
  | "qa_required"
  | "approved"
  | "listed"
  | "sold"
  | "hold"
  | "removed";

type AuthStatus =
  | "not_required"
  | "pending"
  | "in_progress"
  | "authenticated"
  | "inconclusive";

export interface StatusBadgeProps {
  status: string;
  type?: "job" | "item" | "auth";
  className?: string;
}

const jobStatusColors: Record<JobStatus, { bg: string; text: string }> = {
  scheduled: { bg: "bg-sapphire/15", text: "text-sapphire" },
  onsite_capture: { bg: "bg-sapphire/15", text: "text-sapphire" },
  processing: { bg: "bg-amethyst/15", text: "text-amethyst" },
  review: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  customer_approval: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  publishing: { bg: "bg-sapphire/15", text: "text-sapphire" },
  active_selling: { bg: "bg-emerald/15", text: "text-emerald" },
  fulfillment: { bg: "bg-amethyst/15", text: "text-amethyst" },
  payout_pending: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  closed: { bg: "bg-platinum/15", text: "text-pewter" },
  hold: { bg: "bg-ruby/15", text: "text-ruby" },
  cancelled: { bg: "bg-ruby/15", text: "text-ruby" },
};

const itemStatusColors: Record<ItemStatus, { bg: string; text: string }> = {
  draft: { bg: "bg-silver/15", text: "text-pewter" },
  pending_review: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  qa_required: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  approved: { bg: "bg-emerald/15", text: "text-emerald" },
  listed: { bg: "bg-sapphire/15", text: "text-sapphire" },
  sold: { bg: "bg-amethyst/15", text: "text-amethyst" },
  hold: { bg: "bg-ruby/15", text: "text-ruby" },
  removed: { bg: "bg-ruby/15", text: "text-ruby" },
};

const authStatusColors: Record<AuthStatus, { bg: string; text: string }> = {
  not_required: { bg: "bg-silver/15", text: "text-pewter" },
  pending: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  in_progress: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  authenticated: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  inconclusive: { bg: "bg-ruby/15", text: "text-ruby" },
};

function getAuthIcon(status: AuthStatus) {
  switch (status) {
    case "authenticated":
      return <Star className="h-3 w-3" />;
    case "pending":
      return <Clock className="h-3 w-3" />;
    case "in_progress":
      return <ShieldCheck className="h-3 w-3" />;
    case "inconclusive":
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return null;
  }
}

function formatLabel(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function StatusBadge({ status, type = "job", className }: StatusBadgeProps) {
  let colors: { bg: string; text: string } | undefined;
  let icon: React.ReactNode = null;

  switch (type) {
    case "job":
      colors = jobStatusColors[status as JobStatus];
      break;
    case "item":
      colors = itemStatusColors[status as ItemStatus];
      break;
    case "auth":
      colors = authStatusColors[status as AuthStatus];
      icon = getAuthIcon(status as AuthStatus);
      break;
  }

  if (!colors) {
    colors = { bg: "bg-silver/15", text: "text-pewter" };
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium font-[family-name:var(--font-body)]",
        colors.bg,
        colors.text,
        className
      )}
    >
      {icon}
      {formatLabel(status)}
    </span>
  );
}
