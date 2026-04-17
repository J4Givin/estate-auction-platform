"use client";

import Link from "next/link";
import { Users, Scale, BarChart3, Radio, ShieldCheck, Package, DollarSign, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Active Jobs",      value: "12",    color: "sapphire" as const, icon: Package },
  { label: "Open Disputes",    value: "3",     color: "ruby"     as const, icon: Scale },
  { label: "Gross This Month", value: "$68.4k",color: "emerald"  as const, icon: DollarSign },
  { label: "Sell-Through",     value: "84%",   color: "gold"     as const, icon: TrendingUp },
];

const adminLinks = [
  { href: "/admin/users",     label: "User Management",  icon: Users,      desc: "RBAC roles and permissions",           color: "sapphire" },
  { href: "/admin/policies",  label: "Policies",         icon: ShieldCheck,desc: "Prohibited items, floors, disclosures", color: "amethyst" },
  { href: "/admin/channels",  label: "Channels",         icon: Radio,      desc: "Marketplace credentials & health",      color: "emerald" },
  { href: "/admin/disputes",  label: "Disputes",         icon: Scale,      desc: "All open disputes & legal holds",       color: "ruby" },
  { href: "/admin/analytics", label: "Analytics",        icon: BarChart3,  desc: "Sell-through, labor, channel perf",     color: "gold" },
  { href: "/admin/audit",     label: "Audit Log",        icon: CheckCircle,desc: "Immutable action history",              color: "platinum" },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  sapphire: { bg: "bg-sapphire-muted",  icon: "text-sapphire",  border: "border-sapphire/20" },
  amethyst: { bg: "bg-amethyst-muted",  icon: "text-amethyst",  border: "border-amethyst/20" },
  emerald:  { bg: "bg-emerald-j-muted", icon: "text-emerald-j", border: "border-emerald-j/20" },
  ruby:     { bg: "bg-ruby-muted",      icon: "text-ruby",      border: "border-ruby/20" },
  gold:     { bg: "bg-gold-j-muted",    icon: "text-gold-j",    border: "border-gold-j/20" },
  platinum: { bg: "bg-platinum/20",     icon: "text-pewter",    border: "border-border" },
};

const recentAlerts = [
  { msg: "Dispute opened — Rivera Estate ownership claim",     type: "ruby",   time: "1h ago" },
  { msg: "Channel error: eBay rate limit reached",             type: "ruby",   time: "3h ago" },
  { msg: "2 items prohibited — ivory figurines flagged",       type: "gold",   time: "5h ago" },
  { msg: "Ledger adjustment requires dual approval",           type: "gold",   time: "6h ago" },
];

export default function AdminDashboard() {
  return (
    <AppShell role="admin" userName="Admin" orgName="Estate Liquidity">
      <PageHeader
        title="Administration"
        subtitle="System overview, disputes, user management, and platform health."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Admin modules */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {adminLinks.map(link => {
            const Icon = link.icon;
            const c = colorMap[link.color];
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group rounded-xl bg-white border ${c.border} p-5 hover:shadow-md transition-all`}
              >
                <div className={`inline-flex rounded-lg p-2.5 mb-3 ${c.bg}`}>
                  <Icon className={`h-5 w-5 ${c.icon}`} />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{link.label}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </Link>
            );
          })}
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <Card className="border-ruby/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-ruby" />
                System Alerts
                <Badge variant="ruby" className="ml-1">4</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentAlerts.map((a, i) => (
                  <li key={i} className="flex gap-3 py-2 border-b border-border last:border-0">
                    <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${a.type === "ruby" ? "bg-ruby" : "bg-gold-j"}`} />
                    <div>
                      <p className="text-sm text-foreground leading-snug">{a.msg}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <Link href="/admin/disputes">
                  <Button variant="outline" size="sm" className="w-full">View All</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-j" /> Channel Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              {[
                { name: "Storefront",         ok: true },
                { name: "eBay",               ok: false },
                { name: "Facebook Marketplace",ok: true },
                { name: "Etsy",               ok: true },
                { name: "OfferUp",            ok: true },
              ].map(ch => (
                <div key={ch.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{ch.name}</span>
                  <Badge variant={ch.ok ? "emerald" : "ruby"}>{ch.ok ? "Healthy" : "Error"}</Badge>
                </div>
              ))}
              <div className="mt-3">
                <Link href="/admin/channels">
                  <Button variant="outline" size="sm" className="w-full">Manage Channels</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppShell>
  );
}
