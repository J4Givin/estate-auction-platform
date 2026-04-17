"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import {
  Radio,
  ShoppingCart,
  Globe,
  Store,
  Tag,
  Gavel,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type ChannelHealth = "healthy" | "degraded" | "error";

interface Channel {
  id: string;
  name: string;
  icon: React.ElementType;
  health: ChannelHealth;
  lastSync: string;
  itemsListed: number;
  revenueThisMonth: string;
  apiKeyMasked: string;
  rateLimit: { perDay: number; perHour: number };
}

const healthStyles: Record<ChannelHealth, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  healthy: { bg: "bg-emerald/15", text: "text-emerald", icon: CheckCircle2, label: "Healthy" },
  degraded: { bg: "bg-gold-tone/15", text: "text-gold-tone", icon: AlertTriangle, label: "Degraded" },
  error: { bg: "bg-ruby/15", text: "text-ruby", icon: XCircle, label: "Error" },
};

const channels: Channel[] = [
  {
    id: "ch-storefront",
    name: "Storefront",
    icon: Store,
    health: "healthy",
    lastSync: "2 min ago",
    itemsListed: 342,
    revenueThisMonth: "$48,250",
    apiKeyMasked: "sk-****-****-****-7f3a",
    rateLimit: { perDay: 500, perHour: 50 },
  },
  {
    id: "ch-ebay",
    name: "eBay",
    icon: ShoppingCart,
    health: "healthy",
    lastSync: "5 min ago",
    itemsListed: 218,
    revenueThisMonth: "$32,180",
    apiKeyMasked: "eb-****-****-****-2d9c",
    rateLimit: { perDay: 200, perHour: 25 },
  },
  {
    id: "ch-facebook",
    name: "Facebook Marketplace",
    icon: Globe,
    health: "degraded",
    lastSync: "45 min ago",
    itemsListed: 156,
    revenueThisMonth: "$12,420",
    apiKeyMasked: "fb-****-****-****-8e1b",
    rateLimit: { perDay: 150, perHour: 20 },
  },
  {
    id: "ch-etsy",
    name: "Etsy",
    icon: Tag,
    health: "healthy",
    lastSync: "8 min ago",
    itemsListed: 89,
    revenueThisMonth: "$9,850",
    apiKeyMasked: "et-****-****-****-4a7f",
    rateLimit: { perDay: 100, perHour: 15 },
  },
  {
    id: "ch-offerup",
    name: "OfferUp",
    icon: Package,
    health: "error",
    lastSync: "3 hours ago",
    itemsListed: 67,
    revenueThisMonth: "$4,320",
    apiKeyMasked: "ou-****-****-****-6c2e",
    rateLimit: { perDay: 80, perHour: 10 },
  },
  {
    id: "ch-auction",
    name: "Auction",
    icon: Gavel,
    health: "healthy",
    lastSync: "1 min ago",
    itemsListed: 45,
    revenueThisMonth: "$78,900",
    apiKeyMasked: "au-****-****-****-9d5a",
    rateLimit: { perDay: 50, perHour: 10 },
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ChannelsPage() {
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const toggleCredentials = (id: string) => {
    setShowCredentials((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const testConnection = (id: string) => {
    setTestingConnection(id);
    setTimeout(() => setTestingConnection(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar userName="Catherine Reynolds" role="admin" />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Heading */}
          <h1
            className="text-2xl md:text-3xl text-onyx"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Sales Channels
          </h1>

          {/* Channel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {channels.map((channel) => {
              const ChannelIcon = channel.icon;
              const healthStyle = healthStyles[channel.health];
              const HealthIcon = healthStyle.icon;
              const showKey = showCredentials[channel.id];
              const isTesting = testingConnection === channel.id;

              return (
                <div
                  key={channel.id}
                  className="bg-white rounded-xl border border-border/60 overflow-hidden"
                  style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
                >
                  {/* Header */}
                  <div className="p-5 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sapphire-muted flex items-center justify-center">
                          <ChannelIcon className="h-5 w-5 text-sapphire" />
                        </div>
                        <h3 className="text-base font-medium text-charcoal">{channel.name}</h3>
                      </div>
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", healthStyle.bg, healthStyle.text)}>
                        <HealthIcon className="h-3 w-3" />
                        {healthStyle.label}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wide text-silver">Last Sync</span>
                        <p className="text-sm font-medium text-charcoal">{channel.lastSync}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wide text-silver">Listed</span>
                        <p className="text-sm font-medium text-charcoal">{channel.itemsListed}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wide text-silver">Revenue</span>
                        <p className="text-sm font-semibold tabular-nums text-charcoal">{channel.revenueThisMonth}</p>
                      </div>
                    </div>
                  </div>

                  {/* Credentials & Settings */}
                  <div className="border-t border-border/60 bg-cream p-4 space-y-3">
                    {/* API Key */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-pewter">API Key</span>
                        <button
                          onClick={() => toggleCredentials(channel.id)}
                          className="p-0.5 rounded text-silver hover:text-charcoal transition-colors"
                        >
                          {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      </div>
                      <input
                        type={showKey ? "text" : "password"}
                        readOnly
                        value={channel.apiKeyMasked}
                        className="w-full rounded-md border border-border/60 bg-white px-2.5 py-1.5 text-xs text-charcoal font-mono"
                      />
                    </div>

                    {/* Rate Limits */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-wide text-silver">Items/Day</span>
                        <p className="text-xs font-medium text-charcoal">{channel.rateLimit.perDay}</p>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-wide text-silver">Items/Hour</span>
                        <p className="text-xs font-medium text-charcoal">{channel.rateLimit.perHour}</p>
                      </div>
                    </div>

                    {/* Test Connection */}
                    <button
                      onClick={() => testConnection(channel.id)}
                      disabled={isTesting}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                        isTesting
                          ? "border-emerald bg-emerald-muted text-emerald"
                          : "border-sapphire bg-white text-sapphire hover:bg-sapphire-muted"
                      )}
                    >
                      <RefreshCw className={cn("h-3 w-3", isTesting && "animate-spin")} />
                      {isTesting ? "Testing..." : "Test Connection"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
