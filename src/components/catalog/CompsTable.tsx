"use client";

import { cn } from "@/lib/utils";
import { formatCents } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type CompSource =
  | "ebay_sold"
  | "sothebys"
  | "christies"
  | "liveauctioneers"
  | "manual";

export interface Comp {
  id: string;
  source: CompSource;
  title: string;
  price: number;
  date: string;
  condition?: string;
  url?: string;
}

export interface CompsTableProps {
  comps: Comp[];
  className?: string;
}

const sourceBadgeStyles: Record<CompSource, { bg: string; text: string }> = {
  ebay_sold: { bg: "bg-sapphire/15", text: "text-sapphire" },
  sothebys: { bg: "bg-amethyst/15", text: "text-amethyst" },
  christies: { bg: "bg-amethyst/15", text: "text-amethyst" },
  liveauctioneers: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  manual: { bg: "bg-silver/15", text: "text-pewter" },
};

const sourceLabels: Record<CompSource, string> = {
  ebay_sold: "eBay Sold",
  sothebys: "Sotheby's",
  christies: "Christie's",
  liveauctioneers: "LiveAuctioneers",
  manual: "Manual",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CompsTable({ comps, className }: CompsTableProps) {
  if (comps.length === 0) {
    return (
      <div className={cn("rounded-lg border border-platinum/50 bg-white p-8 text-center text-sm text-pewter", className)}>
        No comparable sales found.
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-platinum/50", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-platinum/50 bg-ivory">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">
              Source
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">
              Title
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">
              Condition
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-pewter">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {comps.map((comp, index) => {
            const sourceStyle = sourceBadgeStyles[comp.source] ?? sourceBadgeStyles.manual;
            return (
              <tr
                key={comp.id}
                className={cn(
                  "border-b border-platinum/30 transition-colors hover:bg-ivory/50",
                  index % 2 === 0 ? "bg-white" : "bg-cream"
                )}
              >
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      sourceStyle.bg,
                      sourceStyle.text
                    )}
                  >
                    {sourceLabels[comp.source] ?? comp.source}
                  </span>
                </td>
                <td className="max-w-[240px] truncate px-4 py-3 font-medium text-charcoal">
                  {comp.title}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-charcoal">
                  {formatCents(comp.price)}
                </td>
                <td className="px-4 py-3 text-pewter">
                  {formatDate(comp.date)}
                </td>
                <td className="px-4 py-3 text-pewter">
                  {comp.condition ?? "\u2014"}
                </td>
                <td className="px-4 py-3 text-center">
                  {comp.url ? (
                    <a
                      href={comp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-sapphire hover:text-sapphire-light transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-platinum">\u2014</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
