"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react";

type ReturnStatus = "requested" | "in_transit" | "received" | "refunded" | "denied";

interface ReturnItem {
  id: string;
  orderId: string;
  itemTitle: string;
  buyer: string;
  reason: string;
  status: ReturnStatus;
  requestedDate: string;
}

const returnStatusStyles: Record<ReturnStatus, { bg: string; text: string }> = {
  requested: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  in_transit: { bg: "bg-sapphire/15", text: "text-sapphire" },
  received: { bg: "bg-emerald/15", text: "text-emerald" },
  refunded: { bg: "bg-amethyst/15", text: "text-amethyst" },
  denied: { bg: "bg-ruby/15", text: "text-ruby" },
};

const mockReturns: ReturnItem[] = [
  { id: "RET-001", orderId: "ORD-2990", itemTitle: "Antique Brass Telescope", buyer: "Michael Torres", reason: "Item not as described — lens has scratch not mentioned in listing", status: "requested", requestedDate: "2026-04-16" },
  { id: "RET-002", orderId: "ORD-2985", itemTitle: "Waterford Crystal Decanter Set", buyer: "Jennifer Adams", reason: "Received wrong item — got single decanter instead of set", status: "in_transit", requestedDate: "2026-04-14" },
  { id: "RET-003", orderId: "ORD-2978", itemTitle: "Vintage Cartier Watch", buyer: "Steven Park", reason: "Authentication concerns — wants independent verification", status: "received", requestedDate: "2026-04-12" },
  { id: "RET-004", orderId: "ORD-2965", itemTitle: "Art Deco Bronze Sculpture", buyer: "Laura Mitchell", reason: "Damaged in transit — base cracked", status: "refunded", requestedDate: "2026-04-08" },
  { id: "RET-005", orderId: "ORD-2960", itemTitle: "Limoges Porcelain Dinner Set", buyer: "David Nguyen", reason: "Changed mind — no longer needed", status: "denied", requestedDate: "2026-04-06" },
  { id: "RET-006", orderId: "ORD-2952", itemTitle: "Pair of Georgian Silver Candlesticks", buyer: "Rachel Goldman", reason: "Size smaller than expected from photos", status: "requested", requestedDate: "2026-04-17" },
  { id: "RET-007", orderId: "ORD-2948", itemTitle: "Chinese Export Porcelain Vase", buyer: "Anthony Wells", reason: "Color significantly different from listing photos", status: "in_transit", requestedDate: "2026-04-15" },
];

function formatStatus(status: ReturnStatus): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ReturnsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)] mb-6">
            Returns Queue
          </h1>

          {/* Returns Table */}
          <div className="rounded-lg border border-platinum/50 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-platinum/50 bg-ivory">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Requested</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-pewter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReturns.map((ret, idx) => {
                    const statusStyle = returnStatusStyles[ret.status];

                    return (
                      <tr
                        key={ret.id}
                        className={cn(
                          "border-b border-platinum/30 transition-colors hover:bg-ivory/50",
                          idx % 2 === 0 ? "bg-white" : "bg-cream"
                        )}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-sapphire font-medium">{ret.orderId}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-charcoal">{ret.itemTitle}</p>
                          <p className="text-xs text-pewter font-mono">{ret.id}</p>
                        </td>
                        <td className="px-4 py-3 text-charcoal">{ret.buyer}</td>
                        <td className="px-4 py-3 text-pewter max-w-[240px]">
                          <p className="text-xs truncate">{ret.reason}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyle.bg, statusStyle.text)}>
                            {formatStatus(ret.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-pewter text-xs">{ret.requestedDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {(ret.status === "requested" || ret.status === "in_transit") && (
                              <>
                                <button className="inline-flex items-center gap-1 rounded-md bg-emerald/10 px-2 py-1.5 text-xs font-medium text-emerald hover:bg-emerald/20 transition-colors">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Approve
                                </button>
                                <button className="inline-flex items-center gap-1 rounded-md bg-ruby/10 px-2 py-1.5 text-xs font-medium text-ruby hover:bg-ruby/20 transition-colors">
                                  <XCircle className="h-3 w-3" />
                                  Deny
                                </button>
                              </>
                            )}
                            {ret.status === "received" && (
                              <button className="inline-flex items-center gap-1 rounded-md bg-amethyst/10 px-2 py-1.5 text-xs font-medium text-amethyst hover:bg-amethyst/20 transition-colors">
                                <DollarSign className="h-3 w-3" />
                                Process Refund
                              </button>
                            )}
                            {(ret.status === "refunded" || ret.status === "denied") && (
                              <span className="text-xs text-platinum">Resolved</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
