"use client";

import Link from "next/link";
import { Package, CheckCircle, ShoppingCart, DollarSign, ClipboardList, ThumbsUp, BookOpen, AlertTriangle, ShieldCheck, Tag, TrendingUp } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobTimeline } from "@/components/workflow/JobTimeline";

const stats = [
  { label: "Estimated Items", value: "52",    color: "sapphire" as const, icon: Package },
  { label: "Items Approved",  value: "38",    color: "emerald"  as const, icon: CheckCircle },
  { label: "Active Listings", value: "29",    color: "amethyst" as const, icon: Tag },
  { label: "Total Earned",    value: "$4,820",color: "gold"     as const, icon: DollarSign },
];

const activity = [
  { id: "1", msg: "12 items approved and published to storefront",    time: "2 hrs ago", icon: CheckCircle, color: "text-emerald-j" },
  { id: "2", msg: "Victorian writing desk sold — $480 net",           time: "5 hrs ago", icon: DollarSign,  color: "text-gold-j" },
  { id: "3", msg: "Authentication complete on Tiffany lamp",          time: "1 day ago", icon: ShieldCheck, color: "text-amethyst" },
  { id: "4", msg: "Offer received on mid-century sofa — review now",  time: "1 day ago", icon: Tag,         color: "text-sapphire" },
  { id: "5", msg: "3 items flagged for QA review",                    time: "2 days ago",icon: AlertTriangle,color: "text-ruby" },
];

const quickActions = [
  { label: "Review Inventory",  href: "/portal/jobs/demo/inventory", icon: Package,     color: "bg-sapphire-muted text-sapphire" },
  { label: "Approve Listings",  href: "/portal/jobs/demo/approve",   icon: ThumbsUp,    color: "bg-emerald-j-muted text-emerald-j" },
  { label: "View Ledger",       href: "/portal/jobs/demo/ledger",    icon: BookOpen,    color: "bg-gold-j-muted text-gold-j" },
  { label: "Raise an Issue",    href: "/portal/jobs/demo/disputes",  icon: AlertTriangle,color: "bg-ruby-muted text-ruby" },
];

export default function CustomerPortal() {
  return (
    <AppShell role="customer" userName="Sarah Johnson" orgName="Johnson Estate">
      <PageHeader
        title="Your Estate Portal"
        subtitle="Track progress, review inventory, and monitor your earnings."
        badge={<StatusBadge status="active_selling" type="job" />}
        actions={
          <Link href="/book">
            <Button variant="gold" size="sm">Book Another Scan</Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} color={s.color} icon={s.icon} />
        ))}
      </div>

      {/* Job timeline */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Job Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="scroll-x">
            <JobTimeline currentStatus="active_selling" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {quickActions.map(a => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex flex-col items-center gap-2 rounded-xl p-4 border border-border hover:border-sapphire/30 hover:shadow-sm transition-all text-center"
                >
                  <div className={`rounded-lg p-2.5 ${a.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-foreground leading-tight">{a.label}</span>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {activity.map(a => {
                const Icon = a.icon;
                return (
                  <li key={a.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <div className="rounded-full bg-muted p-1.5 mt-0.5 shrink-0">
                      <Icon className={`h-3.5 w-3.5 ${a.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">{a.msg}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
