"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import {
  Globe,
  ShoppingBag,
  Store,
  Tag,
  Gavel,
  RefreshCw,
  RotateCcw,
  ExternalLink,
  CheckSquare,
} from "lucide-react";

type Channel = "storefront" | "ebay" | "facebook" | "etsy" | "offerup" | "auction";

const channelTabs: { key: Channel; label: string; icon: React.ElementType }[] = [
  { key: "storefront", label: "Storefront", icon: Store },
  { key: "ebay", label: "eBay", icon: ShoppingBag },
  { key: "facebook", label: "Facebook", icon: Globe },
  { key: "etsy", label: "Etsy", icon: Tag },
  { key: "offerup", label: "OfferUp", icon: Tag },
  { key: "auction", label: "Auction", icon: Gavel },
];

type PublishStatus = "published" | "pending" | "error" | "draft" | "rolled_back";

interface PublishItem {
  id: string;
  title: string;
  channel: Channel;
  status: PublishStatus;
  externalLink: string | null;
  publishedAt: string | null;
  error: string | null;
}

const mockItems: PublishItem[] = [
  { id: "ITM-001", title: "Tiffany Studios Dragonfly Lamp", channel: "storefront", status: "published", externalLink: "#", publishedAt: "2026-04-16 14:30", error: null },
  { id: "ITM-001", title: "Tiffany Studios Dragonfly Lamp", channel: "ebay", status: "published", externalLink: "#", publishedAt: "2026-04-16 14:32", error: null },
  { id: "ITM-002", title: "Victorian Mahogany Secretary Desk", channel: "storefront", status: "published", externalLink: "#", publishedAt: "2026-04-16 14:30", error: null },
  { id: "ITM-002", title: "Victorian Mahogany Secretary Desk", channel: "ebay", status: "error", externalLink: null, publishedAt: null, error: "Category mapping failed — eBay category ID 20091 deprecated" },
  { id: "ITM-003", title: "Persian Kashan Silk Rug 12x16", channel: "storefront", status: "published", externalLink: "#", publishedAt: "2026-04-16 14:30", error: null },
  { id: "ITM-003", title: "Persian Kashan Silk Rug 12x16", channel: "facebook", status: "pending", externalLink: null, publishedAt: null, error: null },
  { id: "ITM-004", title: "Pair of Meissen Porcelain Figurines", channel: "storefront", status: "published", externalLink: "#", publishedAt: "2026-04-16 15:00", error: null },
  { id: "ITM-004", title: "Pair of Meissen Porcelain Figurines", channel: "etsy", status: "published", externalLink: "#", publishedAt: "2026-04-16 15:05", error: null },
  { id: "ITM-005", title: "Art Deco Diamond Brooch (3.2ct)", channel: "storefront", status: "draft", externalLink: null, publishedAt: null, error: null },
  { id: "ITM-005", title: "Art Deco Diamond Brooch (3.2ct)", channel: "auction", status: "draft", externalLink: null, publishedAt: null, error: null },
  { id: "ITM-006", title: "Chippendale Mahogany Highboy", channel: "storefront", status: "published", externalLink: "#", publishedAt: "2026-04-15 10:00", error: null },
  { id: "ITM-006", title: "Chippendale Mahogany Highboy", channel: "offerup", status: "error", externalLink: null, publishedAt: null, error: "Image upload timeout — connection reset" },
  { id: "ITM-007", title: "Sterling Silver Tea Service (6pc)", channel: "storefront", status: "rolled_back", externalLink: null, publishedAt: null, error: null },
  { id: "ITM-007", title: "Sterling Silver Tea Service (6pc)", channel: "ebay", status: "rolled_back", externalLink: null, publishedAt: null, error: null },
];

const statusColorMap: Record<PublishStatus, { bg: string; text: string }> = {
  published: { bg: "bg-emerald/15", text: "text-emerald" },
  pending: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  error: { bg: "bg-ruby/15", text: "text-ruby" },
  draft: { bg: "bg-silver/15", text: "text-pewter" },
  rolled_back: { bg: "bg-amethyst/15", text: "text-amethyst" },
};

export default function BatchPublishPage() {
  const [activeChannel, setActiveChannel] = useState<Channel | "all">("all");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filtered =
    activeChannel === "all"
      ? mockItems
      : mockItems.filter((i) => i.channel === activeChannel);

  const toggleSelect = (key: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
              Batch Publish
            </h1>
            <button
              disabled={selectedItems.size === 0}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors",
                selectedItems.size > 0
                  ? "bg-sapphire text-white hover:bg-sapphire-light"
                  : "bg-platinum/50 text-silver cursor-not-allowed"
              )}
            >
              <Globe className="h-4 w-4" />
              Publish Selected ({selectedItems.size})
            </button>
          </div>

          {/* Channel Tabs */}
          <div className="border-b border-platinum/50 mb-6">
            <nav className="flex gap-1 -mb-px">
              <button
                onClick={() => setActiveChannel("all")}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                  activeChannel === "all"
                    ? "border-sapphire text-sapphire"
                    : "border-transparent text-pewter hover:text-charcoal hover:border-platinum"
                )}
              >
                All Channels
              </button>
              {channelTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveChannel(tab.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                      activeChannel === tab.key
                        ? "border-sapphire text-sapphire"
                        : "border-transparent text-pewter hover:text-charcoal hover:border-platinum"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Publish Table */}
          <div className="rounded-lg border border-platinum/50 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-platinum/50 bg-ivory">
                    <th className="px-4 py-3 text-left">
                      <CheckSquare className="h-4 w-4 text-pewter" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">External Link</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Published At</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-pewter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => {
                    const key = `${item.id}-${item.channel}`;
                    const statusStyle = statusColorMap[item.status];
                    const isError = item.status === "error";

                    return (
                      <>
                        <tr
                          key={key}
                          className={cn(
                            "border-b border-platinum/30 transition-colors",
                            isError ? "bg-ruby/5" : idx % 2 === 0 ? "bg-white" : "bg-cream",
                            "hover:bg-ivory/50"
                          )}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(key)}
                              onChange={() => toggleSelect(key)}
                              className="rounded border-platinum accent-sapphire"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-charcoal">{item.title}</p>
                            <p className="text-xs text-pewter font-mono">{item.id}</p>
                          </td>
                          <td className="px-4 py-3 capitalize text-pewter">{item.channel}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                                statusStyle.bg,
                                statusStyle.text
                              )}
                            >
                              {item.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {item.externalLink ? (
                              <a
                                href={item.externalLink}
                                className="inline-flex items-center gap-1 text-sapphire hover:text-sapphire-light text-xs"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                View
                              </a>
                            ) : (
                              <span className="text-platinum text-xs">&mdash;</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-pewter">
                            {item.publishedAt ?? <span className="text-platinum">&mdash;</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {isError && (
                                <button className="inline-flex items-center gap-1 rounded-md bg-ruby/10 px-2 py-1 text-xs font-medium text-ruby hover:bg-ruby/20 transition-colors">
                                  <RefreshCw className="h-3 w-3" />
                                  Retry
                                </button>
                              )}
                              {(item.status === "published" || item.status !== "draft") && item.status !== "rolled_back" && (
                                <button className="inline-flex items-center gap-1 rounded-md bg-amethyst/10 px-2 py-1 text-xs font-medium text-amethyst hover:bg-amethyst/20 transition-colors">
                                  <RotateCcw className="h-3 w-3" />
                                  Rollback
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {isError && item.error && (
                          <tr key={`${key}-error`} className="bg-ruby/5">
                            <td colSpan={7} className="px-8 py-2 text-xs text-ruby">
                              Error: {item.error}
                            </td>
                          </tr>
                        )}
                      </>
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
