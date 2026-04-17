"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  Star,
  Ban,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface QAItem {
  id: string;
  title: string;
  category: string;
  valueRange: string;
  confidence: number;
  assignedTo: string;
  sla: string;
  slaUrgent: boolean;
}

interface AuthQueueItem {
  id: string;
  title: string;
  category: string;
  requestedBy: string;
  dateRequested: string;
}

const awaitingReview: QAItem[] = [
  { id: "ITM-4201", title: "Chippendale Tall-Boy Chest c.1780", category: "Furniture", valueRange: "$4,500 - $7,200", confidence: 0.88, assignedTo: "Sarah M.", sla: "4h remaining", slaUrgent: false },
  { id: "ITM-4195", title: "Tiffany & Co. Sterling Tea Set (6 pc)", category: "Silver", valueRange: "$3,200 - $5,100", confidence: 0.91, assignedTo: "James K.", sla: "2h remaining", slaUrgent: true },
  { id: "ITM-4188", title: "Persian Tabriz Silk Rug 9x12", category: "Rugs & Textiles", valueRange: "$8,000 - $14,500", confidence: 0.72, assignedTo: "Sarah M.", sla: "6h remaining", slaUrgent: false },
  { id: "ITM-4182", title: "Patek Philippe Calatrava Ref.5196", category: "Watches & Jewelry", valueRange: "$18,000 - $28,000", confidence: 0.65, assignedTo: "Unassigned", sla: "1h remaining", slaUrgent: true },
  { id: "ITM-4177", title: "Winslow Homer Watercolor (attrib.)", category: "Fine Art", valueRange: "$12,000 - $22,000", confidence: 0.58, assignedTo: "James K.", sla: "8h remaining", slaUrgent: false },
  { id: "ITM-4170", title: "George III Mahogany Breakfront", category: "Furniture", valueRange: "$5,800 - $9,200", confidence: 0.82, assignedTo: "Laura P.", sla: "3h remaining", slaUrgent: true },
  { id: "ITM-4165", title: "Meissen Porcelain Figurine Group", category: "Ceramics", valueRange: "$2,800 - $4,600", confidence: 0.79, assignedTo: "Laura P.", sla: "5h remaining", slaUrgent: false },
  { id: "ITM-4160", title: "Cartier Art Deco Diamond Bracelet", category: "Watches & Jewelry", valueRange: "$15,000 - $24,000", confidence: 0.70, assignedTo: "Sarah M.", sla: "2h remaining", slaUrgent: true },
  { id: "ITM-4155", title: "Steinway Model B Grand Piano 1928", category: "Musical Instruments", valueRange: "$22,000 - $38,000", confidence: 0.84, assignedTo: "James K.", sla: "7h remaining", slaUrgent: false },
  { id: "ITM-4150", title: "Early American Sampler c.1810", category: "Folk Art", valueRange: "$1,800 - $3,200", confidence: 0.76, assignedTo: "Unassigned", sla: "4h remaining", slaUrgent: false },
  { id: "ITM-4148", title: "Louis XVI Ormolu Mantel Clock", category: "Clocks", valueRange: "$3,500 - $5,800", confidence: 0.83, assignedTo: "Laura P.", sla: "6h remaining", slaUrgent: false },
  { id: "ITM-4145", title: "Chinese Export Armorial Plate Set", category: "Ceramics", valueRange: "$4,200 - $7,000", confidence: 0.69, assignedTo: "Sarah M.", sla: "3h remaining", slaUrgent: true },
  { id: "ITM-4140", title: "Stickley Morris Chair #332", category: "Furniture", valueRange: "$6,000 - $9,500", confidence: 0.87, assignedTo: "James K.", sla: "5h remaining", slaUrgent: false },
  { id: "ITM-4135", title: "Lalique Crystal Bacchantes Vase", category: "Glass & Crystal", valueRange: "$2,200 - $3,800", confidence: 0.90, assignedTo: "Laura P.", sla: "8h remaining", slaUrgent: false },
  { id: "ITM-4130", title: "Federal Period Girandole Mirror", category: "Mirrors", valueRange: "$3,000 - $5,200", confidence: 0.77, assignedTo: "Unassigned", sla: "4h remaining", slaUrgent: false },
  { id: "ITM-4125", title: "Hermes Birkin 35 Gold Togo", category: "Fashion & Accessories", valueRange: "$9,000 - $14,000", confidence: 0.92, assignedTo: "Sarah M.", sla: "2h remaining", slaUrgent: true },
  { id: "ITM-4120", title: "Japanese Meiji Bronze Incense Burner", category: "Asian Art", valueRange: "$1,500 - $2,800", confidence: 0.81, assignedTo: "James K.", sla: "6h remaining", slaUrgent: false },
  { id: "ITM-4115", title: "Handel Reverse-Painted Table Lamp", category: "Lighting", valueRange: "$4,800 - $7,500", confidence: 0.74, assignedTo: "Laura P.", sla: "5h remaining", slaUrgent: false },
];

const authQueue: AuthQueueItem[] = [
  { id: "ITM-4182", title: "Patek Philippe Calatrava Ref.5196", category: "Watches & Jewelry", requestedBy: "Sarah M.", dateRequested: "2026-04-16" },
  { id: "ITM-4177", title: "Winslow Homer Watercolor (attrib.)", category: "Fine Art", requestedBy: "James K.", dateRequested: "2026-04-15" },
  { id: "ITM-4160", title: "Cartier Art Deco Diamond Bracelet", category: "Watches & Jewelry", requestedBy: "Sarah M.", dateRequested: "2026-04-16" },
  { id: "ITM-4125", title: "Hermes Birkin 35 Gold Togo", category: "Fashion & Accessories", requestedBy: "Laura P.", dateRequested: "2026-04-15" },
  { id: "ITM-4155", title: "Steinway Model B Grand Piano 1928", category: "Musical Instruments", requestedBy: "James K.", dateRequested: "2026-04-14" },
  { id: "ITM-4145", title: "Chinese Export Armorial Plate Set", category: "Ceramics", requestedBy: "Sarah M.", dateRequested: "2026-04-16" },
  { id: "ITM-4188", title: "Persian Tabriz Silk Rug 9x12", category: "Rugs & Textiles", requestedBy: "Laura P.", dateRequested: "2026-04-13" },
];

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  icon: Icon,
  borderColor,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5 border border-border/60 border-l-[3px]",
        borderColor
      )}
      style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-pewter">{label}</span>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>
      <div
        className="text-3xl font-semibold text-onyx"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function QADashboard() {
  const [sortField] = useState<"value" | "sla">("value");

  const sortedItems = [...awaitingReview].sort((a, b) => {
    if (sortField === "value") {
      const aVal = parseInt(a.valueRange.replace(/[^0-9]/g, ""));
      const bVal = parseInt(b.valueRange.replace(/[^0-9]/g, ""));
      return bVal - aVal;
    }
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar userName="QA Reviewer" role="qa" />
      <div className="flex flex-1">
        <Sidebar role="qa" />
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Heading */}
          <h1
            className="text-2xl md:text-3xl text-onyx"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Quality Assurance
          </h1>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Awaiting Review"
              value={18}
              icon={ClipboardCheck}
              borderColor="border-l-gold-tone"
              iconBg="bg-gold-tone-muted"
              iconColor="text-gold-tone"
            />
            <StatCard
              label="Authentication Queue"
              value={7}
              icon={Star}
              borderColor="border-l-gold-tone"
              iconBg="bg-gold-tone-muted"
              iconColor="text-gold-tone"
            />
            <StatCard
              label="Prohibited Flags"
              value={3}
              icon={Ban}
              borderColor="border-l-ruby"
              iconBg="bg-ruby-muted"
              iconColor="text-ruby"
            />
          </div>

          {/* Items Awaiting Review Table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl text-onyx"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Items Awaiting Review
              </h2>
              <span className="text-sm text-pewter">Sorted by value (high to low)</span>
            </div>

            <div className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ivory">
                      <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Item</th>
                      <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Category</th>
                      <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Value Range</th>
                      <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Confidence</th>
                      <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Assigned To</th>
                      <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">SLA</th>
                      <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {sortedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-ivory/50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-charcoal">{item.title}</div>
                          <div className="text-xs text-pewter">{item.id}</div>
                        </td>
                        <td className="p-3 text-pewter">{item.category}</td>
                        <td className="p-3 text-right tabular-nums font-medium text-charcoal">{item.valueRange}</td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              item.confidence >= 0.85
                                ? "bg-emerald/15 text-emerald"
                                : item.confidence >= 0.7
                                ? "bg-gold-tone/15 text-gold-tone"
                                : "bg-ruby/15 text-ruby"
                            )}
                          >
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </td>
                        <td className="p-3 text-pewter">
                          {item.assignedTo === "Unassigned" ? (
                            <span className="text-ruby italic">Unassigned</span>
                          ) : (
                            item.assignedTo
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium",
                              item.slaUrgent ? "text-ruby" : "text-pewter"
                            )}
                          >
                            <Clock className="h-3 w-3" />
                            {item.sla}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Link
                            href={`/qa/items/${item.id}`}
                            className="inline-flex items-center gap-1 text-sapphire text-xs font-medium hover:text-sapphire-light transition-colors"
                          >
                            Review
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Authentication Queue */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl text-onyx"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Authentication Queue
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gold-tone">
                <Star className="h-3.5 w-3.5" />
                {authQueue.length} items pending authentication
              </span>
            </div>

            <div
              className="bg-white rounded-xl border border-border/60 border-l-[3px] border-l-gold-tone overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gold-tone-muted/50">
                      <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Item</th>
                      <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Category</th>
                      <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Requested By</th>
                      <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Date</th>
                      <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {authQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-ivory/50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-charcoal">{item.title}</div>
                          <div className="text-xs text-pewter">{item.id}</div>
                        </td>
                        <td className="p-3 text-pewter">{item.category}</td>
                        <td className="p-3 text-pewter">{item.requestedBy}</td>
                        <td className="p-3 text-pewter">{item.dateRequested}</td>
                        <td className="p-3 text-center">
                          <Link
                            href={`/qa/auth/${item.id}`}
                            className="inline-flex items-center gap-1 text-gold-tone text-xs font-medium hover:text-gold-tone-light transition-colors"
                          >
                            Authenticate
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <Link
              href="/qa/prohibited"
              className="inline-flex items-center gap-2 rounded-lg border border-ruby/30 bg-ruby-muted px-4 py-3 text-sm font-medium text-ruby hover:bg-ruby/15 transition-colors"
            >
              <Ban className="h-4 w-4" />
              View Prohibited Items Queue (3 flagged)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
