"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { use, useState } from "react";
import Link from "next/link";
import { CompsTable, Comp } from "@/components/catalog/CompsTable";
import { PriceBand } from "@/components/catalog/PriceBand";
import { cn, formatCents } from "@/lib/utils";
import { ArrowLeft, Lock, History } from "lucide-react";

const mockComps: Comp[] = [
  { id: "comp-1", source: "ebay_sold", title: "Tiffany Studios Dragonfly Table Lamp 14\" shade", price: 4200000, date: "2026-03-15", condition: "Good", url: "#" },
  { id: "comp-2", source: "sothebys", title: "Tiffany Studios Dragonfly Lamp w/ Mushroom Base", price: 5800000, date: "2026-01-22", condition: "Excellent", url: "#" },
  { id: "comp-3", source: "christies", title: "Tiffany Dragonfly Shade on Bronze Base", price: 4900000, date: "2025-11-08", condition: "Good", url: "#" },
  { id: "comp-4", source: "liveauctioneers", title: "Attr. Tiffany Studios Dragonfly Lamp", price: 3100000, date: "2025-09-14", condition: "Fair", url: "#" },
  { id: "comp-5", source: "manual", title: "Private sale — verified Dragonfly lamp", price: 5500000, date: "2025-07-01", condition: "Excellent" },
];

const priceHistory = [
  { date: "2026-04-16", low: 3000000, med: 4500000, high: 6000000, source: "AI Model v3.2" },
  { date: "2026-04-10", low: 2800000, med: 4200000, high: 5800000, source: "AI Model v3.1" },
  { date: "2026-04-05", low: 3100000, med: 4400000, high: 5700000, source: "Manual Override" },
  { date: "2026-03-28", low: 2900000, med: 4100000, high: 5500000, source: "AI Model v3.1" },
];

export default function PricingReviewPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);
  const [overrideLow, setOverrideLow] = useState("");
  const [overrideMed, setOverrideMed] = useState("");
  const [overrideHigh, setOverrideHigh] = useState("");
  const [rationale, setRationale] = useState("");

  const confidenceScore = 87;

  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Operations">
<div className="flex flex-1">
<main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link
              href={`/ops/catalog/${itemId}`}
              className="inline-flex items-center gap-1 text-sm text-pewter hover:text-sapphire transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Item
            </Link>
          </div>

          <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)] mb-2">
            Pricing Review
          </h1>
          <p className="text-sm text-pewter mb-8">Tiffany Studios Dragonfly Lamp — {itemId}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* CompsTable */}
              <section>
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-3">
                  Comparable Sales
                </h2>
                <CompsTable comps={mockComps} />
              </section>

              {/* PriceBand */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4">
                  Price Band
                </h2>
                <PriceBand low={3000000} med={4500000} high={6000000} confidence={0.87} />
              </section>

              {/* Editable Price Overrides */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4">
                  Manual Price Override
                </h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Low ($)</label>
                    <input
                      type="text"
                      value={overrideLow}
                      onChange={(e) => setOverrideLow(e.target.value)}
                      placeholder="30,000"
                      className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal tabular-nums focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Med ($)</label>
                    <input
                      type="text"
                      value={overrideMed}
                      onChange={(e) => setOverrideMed(e.target.value)}
                      placeholder="45,000"
                      className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal tabular-nums focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">High ($)</label>
                    <input
                      type="text"
                      value={overrideHigh}
                      onChange={(e) => setOverrideHigh(e.target.value)}
                      placeholder="60,000"
                      className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal tabular-nums focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">
                    Override Rationale <span className="text-ruby">*</span>
                  </label>
                  <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    rows={3}
                    placeholder="Required — explain why the AI-generated price band is being overridden..."
                    className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire resize-none"
                  />
                </div>
                <button
                  disabled={!rationale.trim()}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors",
                    rationale.trim()
                      ? "bg-sapphire text-white hover:bg-sapphire-light"
                      : "bg-platinum/50 text-silver cursor-not-allowed"
                  )}
                >
                  Save Override
                </button>
              </section>

              {/* Price History Table */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 border-b border-platinum/30 px-5 py-4">
                  <History className="h-5 w-5 text-pewter" />
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Price History
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-platinum/50 bg-ivory">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Date</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">Low</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">Med</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">High</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceHistory.map((entry, idx) => (
                        <tr
                          key={entry.date}
                          className={cn(
                            "border-b border-platinum/30 transition-colors hover:bg-ivory/50",
                            idx % 2 === 0 ? "bg-white" : "bg-cream"
                          )}
                        >
                          <td className="px-4 py-3 text-pewter">{entry.date}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-charcoal">{formatCents(entry.low)}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium text-charcoal">{formatCents(entry.med)}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-charcoal">{formatCents(entry.high)}</td>
                          <td className="px-4 py-3 text-pewter">{entry.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Confidence Score Gauge */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4 text-center">
                  Confidence Score
                </h2>
                <div className="flex justify-center">
                  <div className="relative h-40 w-40">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="var(--color-platinum)"
                        strokeWidth="8"
                        opacity="0.3"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="var(--color-sapphire)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - confidenceScore / 100)}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-semibold tabular-nums text-sapphire font-[family-name:var(--font-display)]">
                        {confidenceScore}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-pewter mt-3">
                  Based on {mockComps.length} comparable sales
                </p>
              </section>

              {/* Freeze Snapshot */}
              <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-gold-tone px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gold-tone-light transition-colors">
                <Lock className="h-4 w-4" />
                Freeze Snapshot
              </button>
              <p className="text-xs text-pewter text-center">
                Locks comps and price band at publish time. Cannot be undone.
              </p>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
