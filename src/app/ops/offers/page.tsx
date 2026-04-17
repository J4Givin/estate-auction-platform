"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn, formatCents } from "@/lib/utils";
import {
  Check,
  X,
  ArrowRightLeft,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

type OfferStatus = "pending" | "accepted" | "countered" | "declined" | "expired";

interface Offer {
  id: string;
  itemId: string;
  itemTitle: string;
  buyer: string;
  offerAmount: number;
  floorPrice: number;
  status: OfferStatus;
  createdAt: string;
  needsAppraisal: boolean;
}

const mockOffers: Offer[] = [
  { id: "OFR-001", itemId: "ITM-001", itemTitle: "Tiffany Studios Dragonfly Lamp", buyer: "Robert Chen", offerAmount: 4200000, floorPrice: 3500000, status: "pending", createdAt: "2026-04-17 09:15", needsAppraisal: true },
  { id: "OFR-002", itemId: "ITM-002", itemTitle: "Victorian Mahogany Secretary Desk", buyer: "Emily Watson", offerAmount: 2800000, floorPrice: 2600000, status: "pending", createdAt: "2026-04-17 08:30", needsAppraisal: false },
  { id: "OFR-003", itemId: "ITM-003", itemTitle: "Persian Kashan Silk Rug 12x16", buyer: "Amelia Whitfield", offerAmount: 2200000, floorPrice: 2500000, status: "pending", createdAt: "2026-04-17 07:45", needsAppraisal: false },
  { id: "OFR-004", itemId: "ITM-004", itemTitle: "Pair of Meissen Porcelain Figurines", buyer: "James Crawford", offerAmount: 1650000, floorPrice: 1500000, status: "accepted", createdAt: "2026-04-16 16:00", needsAppraisal: false },
  { id: "OFR-005", itemId: "ITM-005", itemTitle: "Art Deco Diamond Brooch (3.2ct)", buyer: "Diana Park", offerAmount: 1100000, floorPrice: 1350000, status: "declined", createdAt: "2026-04-16 14:30", needsAppraisal: true },
  { id: "OFR-006", itemId: "ITM-006", itemTitle: "Chippendale Mahogany Highboy", buyer: "Marcus Hayes", offerAmount: 1150000, floorPrice: 1000000, status: "pending", createdAt: "2026-04-16 11:00", needsAppraisal: false },
  { id: "OFR-007", itemId: "ITM-009", itemTitle: "Signed Chihuly Glass Bowl", buyer: "Sarah Lin", offerAmount: 580000, floorPrice: 550000, status: "countered", createdAt: "2026-04-16 09:45", needsAppraisal: false },
  { id: "OFR-008", itemId: "ITM-010", itemTitle: "Antique Grandfather Clock (circa 1880)", buyer: "William Nguyen", offerAmount: 350000, floorPrice: 400000, status: "pending", createdAt: "2026-04-15 17:00", needsAppraisal: false },
];

const statusStyles: Record<OfferStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  accepted: { bg: "bg-emerald/15", text: "text-emerald" },
  countered: { bg: "bg-sapphire/15", text: "text-sapphire" },
  declined: { bg: "bg-ruby/15", text: "text-ruby" },
  expired: { bg: "bg-silver/15", text: "text-pewter" },
};

function getGapPercent(offer: number, floor: number): number {
  return Math.round(((offer - floor) / floor) * 100);
}

function getGapColor(gapPct: number): string {
  if (gapPct >= 0) return "text-emerald";
  if (gapPct >= -5) return "text-gold-tone";
  return "text-ruby";
}

export default function OffersPage() {
  const [showCounterModal, setShowCounterModal] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState("");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)] mb-6">
            Offers Queue
          </h1>

          {/* High-value threshold alert */}
          {mockOffers.some((o) => o.needsAppraisal && o.status === "pending") && (
            <div className="flex items-start gap-3 rounded-lg border border-amethyst/30 bg-amethyst/5 p-4 mb-6">
              <AlertTriangle className="h-5 w-5 text-amethyst shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amethyst">Appraiser Approval Required</p>
                <p className="text-xs text-pewter mt-0.5">
                  {mockOffers.filter((o) => o.needsAppraisal && o.status === "pending").length} offer(s) exceed the high-value threshold and require appraiser sign-off before acceptance.
                </p>
              </div>
            </div>
          )}

          {/* Offers Table */}
          <div className="rounded-lg border border-platinum/50 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-platinum/50 bg-ivory">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Buyer</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">Offer</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">Floor</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">Gap %</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-pewter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOffers.map((offer, idx) => {
                    const gapPct = getGapPercent(offer.offerAmount, offer.floorPrice);
                    const gapColor = getGapColor(gapPct);
                    const style = statusStyles[offer.status];
                    const isBelowFloor = offer.offerAmount < offer.floorPrice;

                    return (
                      <tr
                        key={offer.id}
                        className={cn(
                          "border-b border-platinum/30 transition-colors hover:bg-ivory/50",
                          idx % 2 === 0 ? "bg-white" : "bg-cream"
                        )}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-charcoal">{offer.itemTitle}</p>
                          <p className="text-xs text-pewter font-mono">{offer.itemId}</p>
                        </td>
                        <td className="px-4 py-3 text-charcoal">{offer.buyer}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium text-charcoal">
                          {formatCents(offer.offerAmount)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-pewter">
                          {formatCents(offer.floorPrice)}
                        </td>
                        <td className={cn("px-4 py-3 text-right tabular-nums font-semibold", gapColor)}>
                          {gapPct > 0 ? "+" : ""}{gapPct}%
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", style.bg, style.text)}>
                            {offer.status}
                          </span>
                          {isBelowFloor && offer.status === "pending" && (
                            <p className="text-[10px] text-ruby mt-0.5">Below floor — auto-decline eligible</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {offer.status === "pending" && (
                            <div className="flex items-center justify-center gap-1">
                              <button className="inline-flex items-center gap-1 rounded-md bg-emerald/10 px-2 py-1.5 text-xs font-medium text-emerald hover:bg-emerald/20 transition-colors">
                                <Check className="h-3 w-3" />
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  setShowCounterModal(offer.id);
                                  setCounterAmount("");
                                }}
                                className="inline-flex items-center gap-1 rounded-md bg-gold-tone/10 px-2 py-1.5 text-xs font-medium text-gold-tone hover:bg-gold-tone/20 transition-colors"
                              >
                                <ArrowRightLeft className="h-3 w-3" />
                                Counter
                              </button>
                              <button className="inline-flex items-center gap-1 rounded-md bg-ruby/10 px-2 py-1.5 text-xs font-medium text-ruby hover:bg-ruby/20 transition-colors">
                                <X className="h-3 w-3" />
                                Decline
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Counter Offer Modal */}
          {showCounterModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-md rounded-lg border border-platinum/50 bg-white shadow-xl p-6">
                <h3 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4">
                  Counter Offer
                </h3>
                <p className="text-sm text-pewter mb-4">
                  {mockOffers.find((o) => o.id === showCounterModal)?.itemTitle}
                </p>
                <div className="mb-4">
                  <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">
                    Counter Amount ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pewter" />
                    <input
                      type="text"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(e.target.value)}
                      placeholder="Enter counter amount..."
                      className="w-full rounded-md border border-platinum/50 bg-white pl-9 pr-3 py-2 text-sm text-charcoal tabular-nums focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setShowCounterModal(null)}
                    className="rounded-md border border-platinum/50 px-4 py-2 text-sm font-medium text-pewter hover:bg-ivory transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!counterAmount.trim()}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors",
                      counterAmount.trim()
                        ? "bg-gold-tone text-white hover:bg-gold-tone-light"
                        : "bg-platinum/50 text-silver cursor-not-allowed"
                    )}
                  >
                    Send Counter
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
