"use client";

import Link from "next/link";
import { ShieldCheck, Star, Ban, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";

const stats = [
  { label: "Awaiting Review",  value: "18", color: "gold"     as const, icon: Clock },
  { label: "Auth Queue",       value: "6",  color: "amethyst" as const, icon: ShieldCheck },
  { label: "Approved Today",   value: "24", color: "emerald"  as const, icon: CheckCircle },
  { label: "Prohibited Flags", value: "2",  color: "ruby"     as const, icon: Ban },
];

const reviewQueue = [
  { id: "ITEM001", title: "Tiffany Studios Bronze Lamp",     category: "Lighting",  confidence: 0.61, value: "$2,400", auth: "pending" },
  { id: "ITEM002", title: "18k Gold Diamond Ring",           category: "Jewelry",   confidence: 0.55, value: "$3,800", auth: "in_progress" },
  { id: "ITEM003", title: "Edwardian Mahogany Secretary",    category: "Furniture", confidence: 0.72, value: "$680",  auth: "not_required" },
  { id: "ITEM004", title: "Signed Watercolor — Landscape",   category: "Art",       confidence: 0.48, value: "$1,100", auth: "pending" },
  { id: "ITEM005", title: "Victorian Silver Tea Service",    category: "Silver",    confidence: 0.67, value: "$940",  auth: "pending" },
];

const authQueue = [
  { id: "ITEM006", title: "Art Deco Diamond Brooch",   category: "Jewelry", stage: "Extra photos required", urgent: true },
  { id: "ITEM007", title: "Signed Picasso Lithograph", category: "Art",     stage: "Provenance review",     urgent: true },
  { id: "ITEM008", title: "Rolex Datejust Watch",      category: "Watches", stage: "Serial verification",   urgent: false },
];

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 75 ? "bg-emerald-j" : pct >= 65 ? "bg-gold-j-light" : "bg-ruby";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-medium tabular-nums ${pct >= 75 ? "text-emerald-j" : pct >= 65 ? "text-gold-j" : "text-ruby"}`}>
        {pct}%
      </span>
    </div>
  );
}

export default function QADashboard() {
  return (
    <AppShell role="qa" userName="Maria Chen" orgName="QA & Appraisal">
      <PageHeader
        title="QA & Authentication"
        subtitle="Review queue, authentication pipeline, and compliance flags."
        actions={
          <Link href="/qa/items/demo">
            <Button variant="primary" size="sm" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Start Review
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Review Queue */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold-j" /> Review Queue
              <Badge variant="gold" className="ml-1">18 items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reviewQueue.map(item => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-foreground truncate">{item.title}</p>
                      <StatusBadge status={item.auth} type="auth" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-semibold text-foreground tabular-nums">{item.value}</span>
                    </div>
                    <div className="mt-2 max-w-[180px]">
                      <p className="text-[10px] text-muted-foreground mb-1">AI Confidence</p>
                      <ConfidenceBar value={item.confidence} />
                    </div>
                  </div>
                  <Link href={`/qa/items/${item.id}`}>
                    <Button variant="outline" size="sm">Review</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Auth Queue */}
        <div className="space-y-4">
          <Card className="border-amethyst/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4 text-gold-j" /> Authentication Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {authQueue.map(item => (
                  <div key={item.id} className={`rounded-lg p-3 border ${item.urgent ? "border-ruby/30 bg-ruby-muted" : "border-border bg-muted/20"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
                      {item.urgent && <Badge variant="ruby" className="text-[10px] shrink-0">Urgent</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.stage}</p>
                    <Link href={`/qa/auth/${item.id}`}>
                      <Button variant={item.urgent ? "destructive" : "outline"} size="sm" className="w-full text-xs">
                        {item.urgent ? "Review Now" : "Continue"}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-ruby/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Ban className="h-4 w-4 text-ruby" /> Prohibited Flags
                <Badge variant="ruby" className="ml-1">2</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Items flagged by the AI risk classifier require manual review before any action.</p>
              <Link href="/qa/prohibited">
                <Button variant="destructive" size="sm" className="w-full">Review Flags</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppShell>
  );
}
