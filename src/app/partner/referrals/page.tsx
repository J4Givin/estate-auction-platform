"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type ReferralStatus = "submitted" | "contacted" | "converted" | "paid" | "rejected";

interface Referral {
  id: string;
  date: string;
  clientName: string;
  status: ReferralStatus;
  jobValue?: string;
  fee?: string;
  paidDate?: string;
}

interface PayoutRecord {
  id: string;
  date: string;
  amount: string;
  referrals: number;
  method: string;
}

const statusBadge: Record<ReferralStatus, { bg: string; text: string }> = {
  submitted: { bg: "bg-sapphire/15", text: "text-sapphire" },
  contacted: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  converted: { bg: "bg-emerald/15", text: "text-emerald" },
  paid: { bg: "bg-amethyst/15", text: "text-amethyst" },
  rejected: { bg: "bg-ruby/15", text: "text-ruby" },
};

const referrals: Referral[] = [
  { id: "REF-024", date: "2026-04-15", clientName: "William & Dorothy Patterson", status: "submitted" },
  { id: "REF-023", date: "2026-04-12", clientName: "Nakamura Family Trust", status: "contacted", jobValue: "$38,000" },
  { id: "REF-022", date: "2026-04-08", clientName: "Eleanor Whitfield Estate", status: "converted", jobValue: "$52,400", fee: "$262" },
  { id: "REF-021", date: "2026-04-02", clientName: "Marcus & June Henderson", status: "paid", jobValue: "$28,700", fee: "$144", paidDate: "2026-04-15" },
  { id: "REF-020", date: "2026-03-28", clientName: "The Cromwell Collection", status: "paid", jobValue: "$64,200", fee: "$321", paidDate: "2026-04-15" },
  { id: "REF-019", date: "2026-03-22", clientName: "Sullivan Downsizing", status: "paid", jobValue: "$18,300", fee: "$92", paidDate: "2026-03-31" },
  { id: "REF-018", date: "2026-03-15", clientName: "Abernathy Probate Case", status: "paid", jobValue: "$42,100", fee: "$211", paidDate: "2026-03-31" },
  { id: "REF-017", date: "2026-03-10", clientName: "Riverside Storage Unit #247", status: "converted", jobValue: "$8,500", fee: "$43" },
  { id: "REF-016", date: "2026-03-05", clientName: "Dr. James Worthington Estate", status: "paid", jobValue: "$95,800", fee: "$479", paidDate: "2026-03-31" },
  { id: "REF-015", date: "2026-02-28", clientName: "Karen & Bill Forsythe", status: "rejected" },
  { id: "REF-014", date: "2026-02-20", clientName: "Hillcrest Manor Clearance", status: "paid", jobValue: "$72,600", fee: "$363", paidDate: "2026-02-28" },
  { id: "REF-013", date: "2026-02-14", clientName: "Ming Dynasty Collection", status: "paid", jobValue: "$128,400", fee: "$642", paidDate: "2026-02-28" },
  { id: "REF-012", date: "2026-02-08", clientName: "Thornton Family Trust", status: "paid", jobValue: "$34,900", fee: "$175", paidDate: "2026-02-28" },
  { id: "REF-011", date: "2026-02-01", clientName: "Anderson Estate Sale", status: "paid", jobValue: "$22,800", fee: "$114", paidDate: "2026-02-28" },
  { id: "REF-010", date: "2026-01-25", clientName: "Harbor View Condo Contents", status: "rejected" },
  { id: "REF-009", date: "2026-01-18", clientName: "Parker Antiques Collection", status: "paid", jobValue: "$56,200", fee: "$281", paidDate: "2026-01-31" },
  { id: "REF-008", date: "2026-01-12", clientName: "Westwood Storage Clean-out", status: "paid", jobValue: "$12,400", fee: "$62", paidDate: "2026-01-31" },
  { id: "REF-007", date: "2026-01-05", clientName: "Elizabeth Monroe Estate", status: "paid", jobValue: "$88,700", fee: "$444", paidDate: "2026-01-31" },
  { id: "REF-006", date: "2025-12-20", clientName: "Richards Family Downsizing", status: "paid", jobValue: "$19,600", fee: "$98", paidDate: "2025-12-31" },
  { id: "REF-005", date: "2025-12-14", clientName: "Heritage Oak Farm Contents", status: "paid", jobValue: "$45,300", fee: "$227", paidDate: "2025-12-31" },
  { id: "REF-004", date: "2025-12-05", clientName: "Jacobson Art Collection", status: "rejected" },
  { id: "REF-003", date: "2025-11-28", clientName: "Maple Street Condo Clean-out", status: "paid", jobValue: "$7,800", fee: "$39", paidDate: "2025-11-30" },
  { id: "REF-002", date: "2025-11-15", clientName: "Beaumont Estate Liquidation", status: "paid", jobValue: "$62,500", fee: "$313", paidDate: "2025-11-30" },
  { id: "REF-001", date: "2025-08-20", clientName: "Kensington Manor Clearance", status: "paid", jobValue: "$110,200", fee: "$551", paidDate: "2025-08-31" },
];

const payouts: PayoutRecord[] = [
  { id: "PO-006", date: "2026-04-15", amount: "$465.00", referrals: 2, method: "ACH Transfer" },
  { id: "PO-005", date: "2026-03-31", amount: "$782.00", referrals: 3, method: "ACH Transfer" },
  { id: "PO-004", date: "2026-02-28", amount: "$1,294.00", referrals: 4, method: "ACH Transfer" },
  { id: "PO-003", date: "2026-01-31", amount: "$787.00", referrals: 3, method: "ACH Transfer" },
  { id: "PO-002", date: "2025-12-31", amount: "$325.00", referrals: 2, method: "ACH Transfer" },
  { id: "PO-001", date: "2025-11-30", amount: "$352.00", referrals: 2, method: "ACH Transfer" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReferralHistoryPage() {
  const totalSubmitted = referrals.length;
  const totalConverted = referrals.filter((r) => ["converted", "paid"].includes(r.status)).length;
  const conversionRate = Math.round((totalConverted / totalSubmitted) * 100);
  const totalEarned = "$4,320";

  return (
    <AppShell role="partner" userName="Partner" orgName="Partner Portal">
<main className="flex-1 p-6 md:p-8 max-w-screen-xl mx-auto w-full space-y-8">
        {/* Back link */}
        <Link
          href="/partner"
          className="inline-flex items-center gap-1 text-sm text-pewter hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Heading */}
        <h1
          className="text-2xl md:text-3xl text-onyx"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          Referral History
        </h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="bg-white rounded-xl p-5 border border-border/60 border-l-[3px] border-l-sapphire"
            style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-pewter">Total Submitted</span>
              <div className="w-9 h-9 rounded-lg bg-sapphire-muted flex items-center justify-center">
                <Users className="h-4 w-4 text-sapphire" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-onyx" style={{ fontFamily: "var(--font-display)" }}>
              {totalSubmitted}
            </div>
          </div>
          <div
            className="bg-white rounded-xl p-5 border border-border/60 border-l-[3px] border-l-emerald"
            style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-pewter">Conversion Rate</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-muted flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-onyx" style={{ fontFamily: "var(--font-display)" }}>
              {conversionRate}%
            </div>
          </div>
          <div
            className="bg-white rounded-xl p-5 border border-border/60 border-l-[3px] border-l-gold-tone"
            style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-pewter">Total Earned</span>
              <div className="w-9 h-9 rounded-lg bg-gold-tone-muted flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-gold-tone" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-onyx" style={{ fontFamily: "var(--font-display)" }}>
              {totalEarned}
            </div>
          </div>
        </div>

        {/* Referrals Table */}
        <section className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
          <div className="p-6 pb-0">
            <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              All Referrals
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ivory">
                  <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Client Name</th>
                  <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Job Value</th>
                  <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Fee</th>
                  <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Paid Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {referrals.map((ref) => {
                  const badge = statusBadge[ref.status];
                  return (
                    <tr key={ref.id} className="hover:bg-ivory/50 transition-colors">
                      <td className="p-3 text-pewter">{ref.date}</td>
                      <td className="p-3">
                        <div className="font-medium text-charcoal">{ref.clientName}</div>
                        <div className="text-xs text-pewter">{ref.id}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", badge.bg, badge.text)}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="p-3 text-right tabular-nums text-charcoal">{ref.jobValue ?? "-"}</td>
                      <td className="p-3 text-right tabular-nums font-medium text-charcoal">{ref.fee ?? "-"}</td>
                      <td className="p-3 text-pewter">{ref.paidDate ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Payout History */}
        <section className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
          <div className="p-6 pb-0">
            <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Payout History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ivory">
                  <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Payout ID</th>
                  <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Date</th>
                  <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Amount</th>
                  <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">Referrals</th>
                  <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-ivory/50 transition-colors">
                    <td className="p-3 font-mono text-xs text-charcoal">{payout.id}</td>
                    <td className="p-3 text-pewter">{payout.date}</td>
                    <td className="p-3 text-right tabular-nums font-semibold text-charcoal">{payout.amount}</td>
                    <td className="p-3 text-right tabular-nums text-charcoal">{payout.referrals}</td>
                    <td className="p-3 text-pewter">{payout.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
