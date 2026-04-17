"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import {
  Zap,
  TrendingUp,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";

type Strategy = "sell-fast" | "max-value";

interface PriceDropRow {
  day: string;
  action: string;
  reduction: string;
}

interface HighlightedItem {
  id: string;
  title: string;
  currentPrice: number;
  floorOverride: number | null;
}

const sellFastSchedule: PriceDropRow[] = [
  { day: "Day 1-6", action: "Initial listing price", reduction: "Full price" },
  { day: "Day 7", action: "First markdown", reduction: "-10%" },
  { day: "Day 14", action: "Second markdown", reduction: "-15%" },
  { day: "Day 21", action: "Floor price or bundle", reduction: "Floor / Bundle" },
];

const maxValueSchedule: PriceDropRow[] = [
  { day: "Day 1-13", action: "Initial listing price", reduction: "Full price" },
  { day: "Day 14", action: "First markdown", reduction: "-5%" },
  { day: "Day 28", action: "Second markdown", reduction: "-10%" },
  { day: "Day 45", action: "Floor price", reduction: "Floor" },
];

const highlightedItems: HighlightedItem[] = [
  { id: "hl-1", title: "Tiffany Table Lamp", currentPrice: 180000, floorOverride: null },
  { id: "hl-2", title: "Georgian Silver Tea Set", currentPrice: 420000, floorOverride: null },
  { id: "hl-3", title: "Steinway Baby Grand Piano", currentPrice: 850000, floorOverride: null },
  { id: "hl-4", title: "Waterford Chandelier", currentPrice: 350000, floorOverride: null },
  { id: "hl-5", title: "Eames Lounge Chair", currentPrice: 280000, floorOverride: null },
];

export default function StrategySelection() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [floors, setFloors] = useState<Record<string, string>>({});
  const [acknowledged, setAcknowledged] = useState(false);
  const [showFloorSection, setShowFloorSection] = useState(false);

  const handleFloorChange = (itemId: string, value: string) => {
    setFloors((prev) => ({ ...prev, [itemId]: value }));
  };

  const activeSchedule = selectedStrategy === "sell-fast" ? sellFastSchedule : maxValueSchedule;

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar userName="Margaret Mitchell" role="customer" />

      <div className="flex flex-1">
        <Sidebar role="customer" />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-8">
            {/* Page Header */}
            <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
              Pricing Strategy
            </h1>
            <p className="mt-2 text-sm text-pewter">
              Choose how aggressively items should be priced and marked down over time.
              This strategy applies to all items designated for sale in the Mitchell Estate.
            </p>

            {/* Strategy Cards */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Sell-Fast Card */}
              <button
                type="button"
                onClick={() => setSelectedStrategy("sell-fast")}
                className={cn(
                  "relative flex flex-col items-start rounded-xl border-2 bg-white p-6 text-left shadow-sm transition-all",
                  selectedStrategy === "sell-fast"
                    ? "border-sapphire ring-4 ring-sapphire/20 shadow-md"
                    : "border-platinum/50 hover:border-sapphire/40 hover:shadow-md"
                )}
              >
                {selectedStrategy === "sell-fast" && (
                  <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-sapphire text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sapphire/10">
                  <Zap className="h-6 w-6 text-sapphire" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-sapphire font-[family-name:var(--font-display)]">
                  Sell-Fast
                </h2>
                <p className="mt-2 text-sm text-pewter leading-relaxed">
                  Maximize speed. Aggressive pricing with scheduled drops. Ideal when you
                  need to liquidate quickly and clear the property within 30 days.
                </p>
                <div className="mt-4 w-full space-y-1.5">
                  {sellFastSchedule.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-charcoal">{row.day}</span>
                      <span className="text-pewter">{row.reduction}</span>
                    </div>
                  ))}
                </div>
              </button>

              {/* Max-Value Card */}
              <button
                type="button"
                onClick={() => setSelectedStrategy("max-value")}
                className={cn(
                  "relative flex flex-col items-start rounded-xl border-2 bg-white p-6 text-left shadow-sm transition-all",
                  selectedStrategy === "max-value"
                    ? "border-gold-tone ring-4 ring-gold-tone/20 shadow-md"
                    : "border-platinum/50 hover:border-gold-tone/40 hover:shadow-md"
                )}
              >
                {selectedStrategy === "max-value" && (
                  <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gold-tone text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-tone/10">
                  <TrendingUp className="h-6 w-6 text-gold-tone" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gold-tone font-[family-name:var(--font-display)]">
                  Max-Value
                </h2>
                <p className="mt-2 text-sm text-pewter leading-relaxed">
                  Maximize recovery. Patient pricing with gentle adjustments. Best for
                  high-value collections where patience yields significantly higher returns.
                </p>
                <div className="mt-4 w-full space-y-1.5">
                  {maxValueSchedule.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-charcoal">{row.day}</span>
                      <span className="text-pewter">{row.reduction}</span>
                    </div>
                  ))}
                </div>
              </button>
            </div>

            {/* Price Drop Schedule Preview */}
            {selectedStrategy && (
              <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                  Price Trajectory Preview
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-platinum/30">
                        <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-pewter">
                          Timeline
                        </th>
                        <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-pewter">
                          Action
                        </th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">
                          Price Change
                        </th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">
                          Example ($1,800 item)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSchedule.map((row, i) => {
                        const examplePrices =
                          selectedStrategy === "sell-fast"
                            ? ["$1,800", "$1,620", "$1,530", "$1,260"]
                            : ["$1,800", "$1,710", "$1,620", "$1,440"];
                        return (
                          <tr
                            key={row.day}
                            className={cn(
                              i < activeSchedule.length - 1 && "border-b border-platinum/20"
                            )}
                          >
                            <td className="py-3 pr-6 font-medium text-charcoal">
                              {row.day}
                            </td>
                            <td className="py-3 pr-6 text-pewter">{row.action}</td>
                            <td
                              className={cn(
                                "py-3 text-right font-semibold tabular-nums",
                                row.reduction.startsWith("-")
                                  ? "text-ruby"
                                  : "text-emerald"
                              )}
                            >
                              {row.reduction}
                            </td>
                            <td className="py-3 text-right font-medium tabular-nums text-charcoal">
                              {examplePrices[i]}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* "Never Below" Override Section */}
            {selectedStrategy && (
              <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowFloorSection(!showFloorSection)}
                  className="flex w-full items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gold-tone" />
                    <h2 className="text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                      Floor Price Overrides
                    </h2>
                  </div>
                  {showFloorSection ? (
                    <ChevronUp className="h-5 w-5 text-pewter" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-pewter" />
                  )}
                </button>
                <p className="mt-1 text-sm text-pewter">
                  Set a minimum price for highlighted items. Items will never be listed
                  below this amount, regardless of markdown schedule.
                </p>

                {showFloorSection && (
                  <div className="mt-5 space-y-3">
                    {highlightedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-platinum/30 bg-ivory/50 px-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-charcoal">
                            {item.title}
                          </p>
                          <p className="text-xs text-pewter">
                            Current price: ${(item.currentPrice / 100).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-pewter">
                            Never below:
                          </span>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-pewter">
                              $
                            </span>
                            <input
                              type="text"
                              value={floors[item.id] || ""}
                              onChange={(e) =>
                                handleFloorChange(item.id, e.target.value)
                              }
                              placeholder="0"
                              className="w-28 rounded-lg border border-platinum/50 bg-white py-2 pl-7 pr-3 text-right text-sm tabular-nums text-charcoal placeholder:text-platinum focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Disclosure & Confirm */}
            {selectedStrategy && (
              <div className="mt-8 space-y-6">
                {/* Acknowledgment */}
                <div className="flex items-start gap-3 rounded-xl border border-gold-tone/30 bg-gold-tone/5 p-5">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-tone" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal">
                      Strategy Disclosure
                    </p>
                    <p className="mt-1 text-sm text-pewter leading-relaxed">
                      By selecting a pricing strategy, you acknowledge that listed items
                      will be subject to automated price reductions per the schedule above.
                      Floor price overrides will be honored. You may change your strategy at
                      any time before the first markdown occurs. Proceeds are subject to
                      platform fees and commission as outlined in your service agreement.
                    </p>
                    <label className="mt-4 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="h-4 w-4 rounded border-platinum text-sapphire focus:ring-sapphire"
                      />
                      <span className="text-sm font-medium text-charcoal">
                        I understand and accept the pricing terms
                      </span>
                    </label>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  type="button"
                  disabled={!acknowledged}
                  className={cn(
                    "w-full rounded-xl px-6 py-4 text-center text-base font-semibold text-white shadow-sm transition-all",
                    acknowledged
                      ? "bg-sapphire hover:bg-sapphire-light hover:shadow-md cursor-pointer"
                      : "bg-platinum cursor-not-allowed"
                  )}
                >
                  Confirm{" "}
                  {selectedStrategy === "sell-fast" ? "Sell-Fast" : "Max-Value"}{" "}
                  Strategy
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
