"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Clock,
  DollarSign,
  RotateCcw,
  BarChart3,
  AlertTriangle,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface KPI {
  label: string;
  value: string;
  icon: React.ElementType;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
}

interface ChannelPerf {
  channel: string;
  itemsListed: number;
  itemsSold: number;
  revenue: string;
  sellThrough: string;
  avgDaysToSale: number;
}

interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: "warning" | "critical";
  date: string;
}

const kpis: KPI[] = [
  {
    label: "Sell-Through Rate",
    value: "78%",
    icon: TrendingUp,
    borderColor: "border-l-emerald",
    iconBg: "bg-emerald-muted",
    iconColor: "text-emerald",
    trend: "+3.2%",
    trendUp: true,
  },
  {
    label: "Avg Time-to-Sale",
    value: "12 days",
    icon: Clock,
    borderColor: "border-l-sapphire",
    iconBg: "bg-sapphire-muted",
    iconColor: "text-sapphire",
    trend: "-1.5 days",
    trendUp: true,
  },
  {
    label: "Net Recovery Rate",
    value: "82%",
    icon: DollarSign,
    borderColor: "border-l-gold-tone",
    iconBg: "bg-gold-tone-muted",
    iconColor: "text-gold-tone",
    trend: "+1.8%",
    trendUp: true,
  },
  {
    label: "Refund Rate",
    value: "2.1%",
    icon: RotateCcw,
    borderColor: "border-l-ruby",
    iconBg: "bg-ruby-muted",
    iconColor: "text-ruby",
    trend: "-0.3%",
    trendUp: true,
  },
];

const channelPerformance: ChannelPerf[] = [
  { channel: "Storefront", itemsListed: 342, itemsSold: 278, revenue: "$48,250", sellThrough: "81.3%", avgDaysToSale: 9 },
  { channel: "eBay", itemsListed: 218, itemsSold: 165, revenue: "$32,180", sellThrough: "75.7%", avgDaysToSale: 14 },
  { channel: "Facebook Marketplace", itemsListed: 156, itemsSold: 120, revenue: "$12,420", sellThrough: "76.9%", avgDaysToSale: 11 },
  { channel: "Etsy", itemsListed: 89, itemsSold: 72, revenue: "$9,850", sellThrough: "80.9%", avgDaysToSale: 10 },
  { channel: "OfferUp", itemsListed: 67, itemsSold: 48, revenue: "$4,320", sellThrough: "71.6%", avgDaysToSale: 16 },
  { channel: "Auction", itemsListed: 45, itemsSold: 38, revenue: "$78,900", sellThrough: "84.4%", avgDaysToSale: 7 },
];

const anomalies: Anomaly[] = [
  {
    id: "AN-001",
    title: "eBay sell-through drop",
    description: "eBay sell-through rate dropped 8% week-over-week. Possible cause: increased competition in furniture category or pricing misalignment.",
    severity: "warning",
    date: "2026-04-16",
  },
  {
    id: "AN-002",
    title: "Auction revenue spike",
    description: "Auction channel revenue is 2.4x above 30-day average. Driven by single high-value Patek Philippe sale at $28,500.",
    severity: "warning",
    date: "2026-04-15",
  },
  {
    id: "AN-003",
    title: "OfferUp connection failures",
    description: "OfferUp API returning 503 errors intermittently. 12 failed listing updates in the past 24 hours. Items may be showing stale pricing.",
    severity: "critical",
    date: "2026-04-17",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  return (
    <AppShell role="admin" userName="Catherine Reynolds" orgName="Administration">
<div className="flex flex-1">
<main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Heading */}
          <h1
            className="text-2xl md:text-3xl text-onyx"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Analytics Dashboard
          </h1>

          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className={cn(
                    "bg-white rounded-xl p-5 border border-border/60 border-l-[3px]",
                    kpi.borderColor
                  )}
                  style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-pewter">{kpi.label}</span>
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", kpi.iconBg)}>
                      <Icon className={cn("h-4 w-4", kpi.iconColor)} />
                    </div>
                  </div>
                  <div
                    className="text-3xl font-semibold text-onyx"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {kpi.value}
                  </div>
                  {kpi.trend && (
                    <p className={cn("text-xs font-medium mt-1", kpi.trendUp ? "text-emerald" : "text-ruby")}>
                      {kpi.trend} vs. last month
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Channel Performance Table */}
          <section className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="p-6 pb-0">
              <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Channel Performance
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ivory">
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Channel</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Listed</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Sold</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Revenue</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Sell-Through %</th>
                    <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Avg Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {channelPerformance.map((ch) => (
                    <tr key={ch.channel} className="hover:bg-ivory/50 transition-colors">
                      <td className="p-3 font-medium text-charcoal">{ch.channel}</td>
                      <td className="p-3 text-right tabular-nums text-charcoal">{ch.itemsListed}</td>
                      <td className="p-3 text-right tabular-nums text-charcoal">{ch.itemsSold}</td>
                      <td className="p-3 text-right tabular-nums font-medium text-charcoal">{ch.revenue}</td>
                      <td className="p-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
                            parseFloat(ch.sellThrough) >= 80
                              ? "bg-emerald/15 text-emerald"
                              : parseFloat(ch.sellThrough) >= 75
                              ? "bg-gold-tone/15 text-gold-tone"
                              : "bg-ruby/15 text-ruby"
                          )}
                        >
                          {ch.sellThrough}
                        </span>
                      </td>
                      <td className="p-3 text-right tabular-nums text-pewter">{ch.avgDaysToSale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Labor Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-white rounded-xl p-6 border border-border/60 border-l-[3px] border-l-amethyst"
              style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-pewter">Labor per $1K Proceeds</span>
                <div className="w-9 h-9 rounded-lg bg-amethyst-muted flex items-center justify-center">
                  <Users className="h-4 w-4 text-amethyst" />
                </div>
              </div>
              <div
                className="text-3xl font-semibold text-onyx"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $127
              </div>
              <p className="text-xs text-emerald font-medium mt-1">-$8 vs. last month</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-silver">Capture</span>
                  <p className="font-medium text-charcoal">$42</p>
                </div>
                <div>
                  <span className="text-silver">Processing</span>
                  <p className="font-medium text-charcoal">$51</p>
                </div>
                <div>
                  <span className="text-silver">Fulfillment</span>
                  <p className="font-medium text-charcoal">$34</p>
                </div>
              </div>
            </div>

            {/* Anomaly Alerts */}
            <div className="space-y-4">
              <h2 className="text-lg text-onyx" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Anomaly Alerts
              </h2>
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={cn(
                    "rounded-xl border p-4",
                    anomaly.severity === "critical"
                      ? "border-ruby/30 bg-ruby-muted"
                      : "border-gold-tone/30 bg-gold-tone-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={cn(
                        "h-4 w-4 shrink-0 mt-0.5",
                        anomaly.severity === "critical" ? "text-ruby" : "text-gold-tone"
                      )}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "text-sm font-medium",
                          anomaly.severity === "critical" ? "text-ruby" : "text-gold-tone"
                        )}>
                          {anomaly.title}
                        </h4>
                        <span className="text-[10px] text-pewter">{anomaly.date}</span>
                      </div>
                      <p className={cn(
                        "text-xs leading-relaxed mt-1",
                        anomaly.severity === "critical" ? "text-ruby/70" : "text-gold-tone/70"
                      )}>
                        {anomaly.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
