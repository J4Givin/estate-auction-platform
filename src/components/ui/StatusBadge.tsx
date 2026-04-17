"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, AlertTriangle, CheckCircle, XCircle, Pause, Star } from "lucide-react";

/* Maps every FRD status string to a jewel-tone badge variant + label */

type StatusMap = Record<string, { label: string; variant: "sapphire" | "emerald" | "amethyst" | "ruby" | "gold" | "platinum" | "draft"; icon?: React.ElementType }>;

const JOB_STATUS: StatusMap = {
  new:                { label: "New",               variant: "platinum" },
  contacted:          { label: "Contacted",          variant: "sapphire" },
  scheduled:          { label: "Scheduled",          variant: "sapphire", icon: Clock },
  onsite_capture:     { label: "On-Site Capture",    variant: "amethyst" },
  processing:         { label: "Processing",         variant: "amethyst" },
  review:             { label: "Under Review",       variant: "gold", icon: Clock },
  customer_approval:  { label: "Awaiting Approval",  variant: "gold", icon: AlertTriangle },
  publishing:         { label: "Publishing",         variant: "sapphire" },
  active_selling:     { label: "Active",             variant: "emerald", icon: CheckCircle },
  fulfillment:        { label: "Fulfillment",        variant: "emerald" },
  payout_pending:     { label: "Payout Pending",     variant: "gold" },
  closed:             { label: "Closed",             variant: "platinum" },
  hold:               { label: "On Hold",            variant: "ruby", icon: Pause },
  cancelled:          { label: "Cancelled",          variant: "ruby", icon: XCircle },
};

const ITEM_STATUS: StatusMap = {
  draft:     { label: "Draft",     variant: "draft" },
  classified:{ label: "Classified",variant: "sapphire" },
  priced:    { label: "Priced",    variant: "sapphire" },
  qa_required:{ label: "QA Required", variant: "gold", icon: AlertTriangle },
  approved:  { label: "Approved",  variant: "emerald", icon: CheckCircle },
  listed:    { label: "Listed",    variant: "sapphire" },
  sold:      { label: "Sold",      variant: "amethyst", icon: CheckCircle },
  returned:  { label: "Returned",  variant: "ruby" },
  relisted:  { label: "Relisted",  variant: "sapphire" },
  disposed:  { label: "Disposed",  variant: "platinum" },
  hold:      { label: "On Hold",   variant: "ruby", icon: Pause },
};

const AUTH_STATUS: StatusMap = {
  not_required: { label: "No Auth Required", variant: "platinum" },
  pending:      { label: "Auth Pending",     variant: "gold", icon: Clock },
  in_progress:  { label: "Auth In Progress", variant: "amethyst", icon: ShieldCheck },
  authenticated:{ label: "Authenticated",   variant: "emerald", icon: Star },
  inconclusive: { label: "Inconclusive",    variant: "ruby", icon: AlertTriangle },
};

const LISTING_STATUS: StatusMap = {
  draft:      { label: "Draft",      variant: "draft" },
  queued:     { label: "Queued",     variant: "sapphire" },
  published:  { label: "Published",  variant: "emerald" },
  edited:     { label: "Edited",     variant: "gold" },
  delisted:   { label: "Delisted",   variant: "platinum" },
  error:      { label: "Error",      variant: "ruby", icon: AlertTriangle },
  suspended:  { label: "Suspended",  variant: "ruby" },
};

const ORDER_STATUS: StatusMap = {
  created:          { label: "Created",           variant: "platinum" },
  paid:             { label: "Paid",              variant: "emerald" },
  packed:           { label: "Packed",            variant: "sapphire" },
  shipped:          { label: "Shipped",           variant: "sapphire" },
  delivered:        { label: "Delivered",         variant: "emerald", icon: CheckCircle },
  closed:           { label: "Closed",            variant: "platinum" },
  return_requested: { label: "Return Requested",  variant: "gold", icon: AlertTriangle },
  returned:         { label: "Returned",          variant: "ruby" },
};

const DISPUTE_STATUS: StatusMap = {
  open:     { label: "Open",     variant: "ruby", icon: AlertTriangle },
  hold:     { label: "On Hold",  variant: "gold" },
  resolved: { label: "Resolved", variant: "emerald" },
  closed:   { label: "Closed",   variant: "platinum" },
};

const ALL_MAPS = { ...JOB_STATUS, ...ITEM_STATUS, ...AUTH_STATUS, ...LISTING_STATUS, ...ORDER_STATUS, ...DISPUTE_STATUS };

interface StatusBadgeProps {
  status: string;
  type?: "job" | "item" | "auth" | "listing" | "order" | "dispute";
  className?: string;
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  let map: StatusMap;
  if (type === "job")     map = JOB_STATUS;
  else if (type === "item")    map = ITEM_STATUS;
  else if (type === "auth")    map = AUTH_STATUS;
  else if (type === "listing") map = LISTING_STATUS;
  else if (type === "order")   map = ORDER_STATUS;
  else if (type === "dispute") map = DISPUTE_STATUS;
  else map = ALL_MAPS;

  const config = map[status] ?? { label: status, variant: "platinum" as const };
  const Icon = config.icon;

  return (
    <Badge variant={config.variant as "sapphire" | "emerald" | "amethyst" | "ruby" | "gold" | "platinum" | "draft"} className={className}>
      {Icon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
