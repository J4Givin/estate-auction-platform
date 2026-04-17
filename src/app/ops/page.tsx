"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  Globe,
  ShoppingCart,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  ListChecks,
  Package,
  Tag,
  Truck,
  RotateCcw,
  Send,
} from "lucide-react";

const statCards = [
  { label: "Items in QA", value: 23, color: "gold-tone", icon: ClipboardCheck },
  { label: "Pending Publish", value: 15, color: "sapphire", icon: Globe },
  { label: "Open Orders", value: 8, color: "emerald", icon: ShoppingCart },
  { label: "Unread Messages", value: 12, color: "ruby", icon: MessageSquare },
] as const;

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  "gold-tone": { bg: "bg-gold-tone/10", text: "text-gold-tone", border: "border-gold-tone/30" },
  sapphire: { bg: "bg-sapphire/10", text: "text-sapphire", border: "border-sapphire/30" },
  emerald: { bg: "bg-emerald/10", text: "text-emerald", border: "border-emerald/30" },
  ruby: { bg: "bg-ruby/10", text: "text-ruby", border: "border-ruby/30" },
};

const slaAlerts = [
  { id: "SLA-001", title: "Victorian Mahogany Secretary Desk", deadline: "2026-04-17T10:00:00Z", overdue: "2h 15m" },
  { id: "SLA-002", title: "Tiffany Studios Dragonfly Lamp", deadline: "2026-04-17T09:00:00Z", overdue: "3h 30m" },
  { id: "SLA-003", title: "Sterling Silver Tea Service (6pc)", deadline: "2026-04-17T11:00:00Z", overdue: "1h 05m" },
];

const recentJobs = [
  { id: "JOB-2041", client: "Harrington Estate", status: "processing", date: "2026-04-16", items: 47 },
  { id: "JOB-2040", client: "Chen Family Trust", status: "review", date: "2026-04-15", items: 32 },
  { id: "JOB-2039", client: "Morrison Collection", status: "active_selling", date: "2026-04-14", items: 85 },
  { id: "JOB-2038", client: "Delacroix Estate", status: "scheduled", date: "2026-04-13", items: 0 },
  { id: "JOB-2037", client: "Park Avenue Downsizing", status: "fulfillment", date: "2026-04-12", items: 61 },
];

const quickLinks = [
  { href: "/ops/jobs", label: "Jobs", icon: Briefcase, description: "Manage estate jobs" },
  { href: "/ops/queue", label: "Review Queue", icon: ListChecks, description: "QA review pipeline" },
  { href: "/ops/publish", label: "Publish", icon: Globe, description: "Batch publish items" },
  { href: "/ops/messages", label: "Messages", icon: MessageSquare, description: "Unified inbox" },
  { href: "/ops/offers", label: "Offers", icon: Tag, description: "Manage buyer offers" },
  { href: "/ops/fulfillment", label: "Fulfillment", icon: Truck, description: "Ship and track" },
  { href: "/ops/catalog/ITM-001", label: "Catalog", icon: Package, description: "Item editor" },
  { href: "/ops/returns", label: "Returns", icon: RotateCcw, description: "Process returns" },
];

export default function OpsDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)] mb-8">
            Operations Console
          </h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => {
              const colors = colorMap[card.color];
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={cn(
                    "rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
                    colors.border
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-pewter">{card.label}</span>
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", colors.bg)}>
                      <Icon className={cn("h-5 w-5", colors.text)} />
                    </div>
                  </div>
                  <p className={cn("text-3xl font-bold tabular-nums", colors.text)}>
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* SLA Alerts */}
            <div className="rounded-lg border border-ruby/30 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-ruby/20 px-5 py-4">
                <AlertTriangle className="h-5 w-5 text-ruby" />
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                  SLA Alerts
                </h2>
                <span className="ml-auto rounded-full bg-ruby/10 px-2.5 py-0.5 text-xs font-semibold text-ruby">
                  {slaAlerts.length} overdue
                </span>
              </div>
              <ul className="divide-y divide-platinum/30">
                {slaAlerts.map((alert) => (
                  <li key={alert.id} className="flex items-center justify-between px-5 py-3 hover:bg-ruby/5 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-charcoal truncate">{alert.title}</p>
                      <p className="text-xs text-pewter">
                        Deadline: {new Date(alert.deadline).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="ml-3 rounded-full bg-ruby/10 px-2.5 py-0.5 text-xs font-bold text-ruby whitespace-nowrap">
                      {alert.overdue} overdue
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Jobs */}
            <div className="rounded-lg border border-platinum/50 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-platinum/30 px-5 py-4">
                <Briefcase className="h-5 w-5 text-sapphire" />
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                  Recent Jobs
                </h2>
              </div>
              <ul className="divide-y divide-platinum/30">
                {recentJobs.map((job) => (
                  <li key={job.id} className="flex items-center gap-4 px-5 py-3 hover:bg-ivory/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-pewter">{job.id}</span>
                        <StatusBadge status={job.status} type="job" />
                      </div>
                      <p className="text-sm font-medium text-charcoal mt-0.5">{job.client}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-pewter">{job.date}</p>
                      <p className="text-xs text-silver">{job.items} items</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-3 rounded-lg border border-platinum/50 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-sapphire/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sapphire/10">
                      <Icon className="h-5 w-5 text-sapphire" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-charcoal group-hover:text-sapphire transition-colors">
                        {link.label}
                      </p>
                      <p className="text-xs text-pewter truncate">{link.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-platinum group-hover:text-sapphire transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
