"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import {
  Users,
  CheckCircle2,
  DollarSign,
  Gem,
  ArrowRight,
  Clock,
  Calendar,
  Plus,
  FileText,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

interface RecentReferral {
  id: string;
  clientName: string;
  date: string;
  status: "submitted" | "contacted" | "converted" | "paid" | "rejected";
  jobValue?: string;
}

const stats: StatCard[] = [
  { label: "Total Referrals", value: "24", icon: Users, borderColor: "border-l-sapphire", iconBg: "bg-sapphire-muted", iconColor: "text-sapphire" },
  { label: "Converted", value: "18", icon: CheckCircle2, borderColor: "border-l-emerald", iconBg: "bg-emerald-muted", iconColor: "text-emerald" },
  { label: "Total Earned", value: "$4,320", icon: DollarSign, borderColor: "border-l-gold-tone", iconBg: "bg-gold-tone-muted", iconColor: "text-gold-tone" },
  { label: "Pending Payout", value: "$720", icon: Gem, borderColor: "border-l-amethyst", iconBg: "bg-amethyst-muted", iconColor: "text-amethyst" },
];

const statusBadge: Record<string, { bg: string; text: string }> = {
  submitted: { bg: "bg-sapphire/15", text: "text-sapphire" },
  contacted: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  converted: { bg: "bg-emerald/15", text: "text-emerald" },
  paid: { bg: "bg-amethyst/15", text: "text-amethyst" },
  rejected: { bg: "bg-ruby/15", text: "text-ruby" },
};

const recentReferrals: RecentReferral[] = [
  { id: "REF-024", clientName: "William & Dorothy Patterson", date: "2026-04-15", status: "submitted" },
  { id: "REF-023", clientName: "Nakamura Family Trust", date: "2026-04-12", status: "contacted", jobValue: "$38,000" },
  { id: "REF-022", clientName: "Eleanor Whitfield Estate", date: "2026-04-08", status: "converted", jobValue: "$52,400" },
  { id: "REF-021", clientName: "Marcus & June Henderson", date: "2026-04-02", status: "paid", jobValue: "$28,700" },
  { id: "REF-020", clientName: "The Cromwell Collection", date: "2026-03-28", status: "paid", jobValue: "$64,200" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PartnerDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar userName="Robert Hargreaves" role="partner" />
      <main className="flex-1 p-6 md:p-8 max-w-screen-xl mx-auto w-full space-y-8">
        {/* Heading */}
        <div>
          <h1
            className="text-2xl md:text-3xl text-onyx"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Partner Dashboard
          </h1>
          <p className="text-sm text-pewter mt-1">
            Welcome back, <span className="font-medium text-charcoal">Robert</span> from <span className="font-medium text-charcoal">Hargreaves Realty Group</span>
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={cn(
                  "bg-white rounded-xl p-5 border border-border/60 border-l-[3px]",
                  stat.borderColor
                )}
                style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-pewter">{stat.label}</span>
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", stat.iconBg)}>
                    <Icon className={cn("h-4 w-4", stat.iconColor)} />
                  </div>
                </div>
                <div
                  className="text-3xl font-semibold text-onyx"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Referrals */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
              <div className="flex items-center justify-between p-5 pb-0">
                <h2 className="text-lg text-onyx" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Recent Referrals
                </h2>
                <Link
                  href="/partner/referrals"
                  className="text-xs font-medium text-sapphire hover:text-sapphire-light transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {recentReferrals.map((ref) => {
                    const badge = statusBadge[ref.status];
                    return (
                      <div
                        key={ref.id}
                        className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3 hover:bg-ivory/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div>
                            <div className="font-medium text-sm text-charcoal truncate">{ref.clientName}</div>
                            <div className="text-xs text-pewter">{ref.id} &middot; {ref.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {ref.jobValue && (
                            <span className="text-sm tabular-nums font-medium text-charcoal">{ref.jobValue}</span>
                          )}
                          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", badge.bg, badge.text)}>
                            {ref.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Quick Actions & Payout */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-border/60 p-5" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
              <h3 className="text-base text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/partner/referrals/new"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-sapphire px-4 py-3 text-sm font-semibold text-white hover:bg-sapphire-light transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Submit New Referral
                </Link>
                <Link
                  href="/partner/referrals"
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-sapphire bg-white px-4 py-3 text-sm font-semibold text-sapphire hover:bg-sapphire-muted transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  View Payout History
                </Link>
              </div>
            </div>

            {/* Next Payout Info */}
            <div
              className="rounded-xl border border-gold-tone/30 bg-gold-tone-muted p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-gold-tone" />
                <h3 className="text-base font-medium text-gold-tone" style={{ fontFamily: "var(--font-display)" }}>
                  Next Payout
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs uppercase tracking-wide text-gold-tone/60">Amount</span>
                  <p
                    className="text-2xl font-semibold text-gold-tone"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    $720.00
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gold-tone/60">Scheduled Date</span>
                  <p className="text-sm font-medium text-gold-tone">April 30, 2026</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide text-gold-tone/60">Referrals Included</span>
                  <p className="text-sm font-medium text-gold-tone">3 converted referrals</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gold-tone/60">
                  <Clock className="h-3 w-3" />
                  Payouts processed on the last business day of each month
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
