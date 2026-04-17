"use client";

import Link from "next/link";
import { ListChecks, MessageSquare, Globe, ShieldCheck, AlertTriangle, Clock, Package, TrendingUp, Truck } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";

const stats = [
  { label: "Items in QA",       value: "14",  color: "gold"     as const, icon: ShieldCheck, subtitle: "3 SLA overdue" },
  { label: "Pending Publish",   value: "27",  color: "sapphire" as const, icon: Globe },
  { label: "Open Orders",       value: "8",   color: "emerald"  as const, icon: Truck },
  { label: "Unread Messages",   value: "5",   color: "ruby"     as const, icon: MessageSquare, subtitle: "2 past SLA" },
];

const recentJobs = [
  { id: "J001", client: "Johnson Estate",      status: "active_selling", items: 52, coverage: 94 },
  { id: "J002", client: "Rivera Family Trust", status: "review",          items: 31, coverage: 87 },
  { id: "J003", client: "Chen Probate",        status: "processing",      items: 18, coverage: 72 },
  { id: "J004", client: "Martinez Downsizing", status: "scheduled",       items: 0,  coverage: 0 },
];

const slaAlerts = [
  { item: "Tiffany Studios Lamp #SKU-3F2A",  age: "3h 12m", type: "QA Review",   color: "ruby" },
  { item: "Message from buyer — eBay #1920", age: "2h 45m", type: "Message SLA",  color: "ruby" },
  { item: "Offer review — Sapphire necklace",age: "1h 58m", type: "Offer Expiry", color: "gold" },
];

export default function OpsDashboard() {
  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Estate Liquidity Ops">
      <PageHeader
        title="Operations Dashboard"
        subtitle="Thursday, April 16 · Active queue, SLA status, and recent jobs."
        actions={
          <Link href="/ops/queue">
            <Button variant="primary" size="sm" className="gap-1.5">
              <ListChecks className="h-3.5 w-3.5" /> Open Queue
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SLA Alerts */}
        <Card className="border-ruby/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-ruby" />
              SLA Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {slaAlerts.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 py-3 border-b border-border last:border-0 ${a.color === "ruby" ? "" : ""}`}>
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${a.color === "ruby" ? "bg-ruby" : "bg-gold-j"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.item}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={a.color === "ruby" ? "ruby" : "gold"} className="text-[10px]">{a.type}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{a.age}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-3">
              <Link href="/ops/queue">
                <Button variant="outline" size="sm" className="w-full">View Full Queue</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="scroll-x rounded-lg">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</th>
                    <th className="pb-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="pb-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items</th>
                    <th className="pb-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Coverage</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map(j => (
                    <tr key={j.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-foreground">{j.client}</p>
                          <p className="text-xs text-muted-foreground">{j.id}</p>
                        </div>
                      </td>
                      <td className="py-3"><StatusBadge status={j.status} type="job" /></td>
                      <td className="py-3 text-right tabular-nums text-muted-foreground">{j.items || "—"}</td>
                      <td className="py-3 text-right">
                        {j.coverage > 0 ? (
                          <span className={`text-sm font-medium tabular-nums ${j.coverage >= 90 ? "text-emerald-j" : j.coverage >= 75 ? "text-gold-j" : "text-ruby"}`}>
                            {j.coverage}%
                          </span>
                        ) : "—"}
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/ops/jobs/${j.id}`}>
                          <Button variant="ghost" size="icon-sm">
                            <TrendingUp className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link href="/ops/jobs">
                <Button variant="outline" size="sm">View All Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
