"use client";

import { cn } from "@/lib/utils";
import { Star, Shield, Clock, AlertTriangle } from "lucide-react";

type AuthStatus = "not_required" | "pending" | "in_progress" | "authenticated" | "inconclusive";

export interface AuthBadgeProps {
  status: AuthStatus;
  className?: string;
}

const authConfig: Record<
  AuthStatus,
  {
    label: string;
    icon: React.ElementType;
    bgClass: string;
    textClass: string;
    borderClass: string;
    filled: boolean;
  }
> = {
  authenticated: {
    label: "Authenticated",
    icon: Star,
    bgClass: "bg-gold-tone/15",
    textClass: "text-gold-tone",
    borderClass: "border-gold-tone",
    filled: true,
  },
  not_required: {
    label: "Auth Required",
    icon: Shield,
    bgClass: "bg-transparent",
    textClass: "text-gold-tone",
    borderClass: "border-gold-tone",
    filled: false,
  },
  pending: {
    label: "Pending",
    icon: Clock,
    bgClass: "bg-transparent",
    textClass: "text-gold-tone",
    borderClass: "border-gold-tone",
    filled: false,
  },
  in_progress: {
    label: "In Progress",
    icon: Shield,
    bgClass: "bg-transparent",
    textClass: "text-gold-tone",
    borderClass: "border-gold-tone",
    filled: false,
  },
  inconclusive: {
    label: "Inconclusive",
    icon: AlertTriangle,
    bgClass: "bg-ruby/15",
    textClass: "text-ruby",
    borderClass: "border-ruby",
    filled: true,
  },
};

export function AuthBadge({ status, className }: AuthBadgeProps) {
  const config = authConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
        config.filled ? config.bgClass : "bg-transparent",
        config.textClass,
        config.borderClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
