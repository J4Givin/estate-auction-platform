"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LedgerTimeline } from "@/components/financial/LedgerTimeline";
import type { LedgerEntry } from "@/components/financial/LedgerTimeline";
import { cn } from "@/lib/utils";
import { Download, DollarSign, TrendingDown, TrendingUp } from "lucide-react";

interface FeeRow {
  label: string;
  amount: number;
  description: string;
}

const ledgerEntries: LedgerEntry[] = [
  {
    id: "led-01",
    type: "sale",
    amount: 280000,
    description: "Eames Lounge Chair sold on 1stDibs to buyer in New York",
    date: "2026-04-15T14:30:00Z",
    approved_by: "Sarah Chen",
  },
  {
    id: "led-02",
    type: "fee",
    amount: 42000,
    description: "Platform commission (15%) on Eames Lounge Chair",
    date: "2026-04-15T14:30:00Z",
  },
  {
    id: "led-03",
    type: "sale",
    amount: 420000,
    description: "Georgian Silver Tea Set sold via Heritage Auctions",
    date: "2026-04-12T10:15:00Z",
    approved_by: "Sarah Chen",
  },
  {
    id: "led-04",
    type: "fee",
    amount: 63000,
    description: "Platform commission (15%) on Georgian Silver Tea Set",
    date: "2026-04-12T10:15:00Z",
  },
  {
    id: "led-05",
    type: "fee",
    amount: 25000,
    description: "Authentication fee — Georgian Silver Tea Set (Worthington & Associates)",
    date: "2026-04-10T09:00:00Z",
  },
  {
    id: "led-06",
    type: "sale",
    amount: 180000,
    description: "Tiffany Table Lamp sold on Chairish to buyer in Los Angeles",
    date: "2026-04-08T16:45:00Z",
    approved_by: "Sarah Chen",
  },
  {
    id: "led-07",
    type: "fee",
    amount: 27000,
    description: "Platform commission (15%) on Tiffany Table Lamp",
    date: "2026-04-08T16:45:00Z",
  },
  {
    id: "led-08",
    type: "sale",
    amount: 350000,
    description: "Waterford Chandelier sold via private buyer referral",
    date: "2026-04-05T11:20:00Z",
    approved_by: "Sarah Chen",
  },
  {
    id: "led-09",
    type: "fee",
    amount: 52500,
    description: "Platform commission (15%) on Waterford Chandelier",
    date: "2026-04-05T11:20:00Z",
  },
  {
    id: "led-10",
    type: "sale",
    amount: 612000,
    description: "Steinway Baby Grand Piano sold to collector via Heritage Auctions",
    date: "2026-04-02T13:00:00Z",
    approved_by: "Sarah Chen",
  },
  {
    id: "led-11",
    type: "fee",
    amount: 91800,
    description: "Platform commission (15%) on Steinway Baby Grand Piano",
    date: "2026-04-02T13:00:00Z",
  },
  {
    id: "led-12",
    type: "fee",
    amount: 18500,
    description: "Shipping and handling — Steinway Baby Grand Piano (white glove delivery)",
    date: "2026-04-03T09:30:00Z",
  },
];

const feeBreakdown: FeeRow[] = [
  { label: "Listing Fees", amount: 0, description: "Included in service agreement" },
  { label: "Platform Commission (15%)", amount: 276300, description: "Applied to each completed sale" },
  { label: "Authentication Fees", amount: 25000, description: "Third-party verification for high-value items" },
  { label: "Shipping & Handling", amount: 18500, description: "White glove delivery for sold items" },
];

const totalFees = feeBreakdown.reduce((sum, f) => sum + f.amount, 0);

export default function LedgerPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const grossAmount = 1842000;
  const feesAmount = 276300;
  const netAmount = 1565700;

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar userName="Margaret Mitchell" role="customer" />

      <div className="flex flex-1">
        <Sidebar role="customer" />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-8">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
                  Financial Ledger
                </h1>
                <p className="mt-2 text-sm text-pewter">
                  Complete financial record for the Mitchell Estate liquidation
                </p>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-gold-tone px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gold-tone-light hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                Download Statement
              </button>
            </div>

            {/* Three Summary Cards */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-platinum/50 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sapphire/10">
                    <DollarSign className="h-5 w-5 text-sapphire" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                      Gross Proceeds
                    </p>
                    <p className="text-2xl font-semibold tabular-nums text-sapphire font-[family-name:var(--font-display)]">
                      $18,420
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-platinum/50 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ruby/10">
                    <TrendingDown className="h-5 w-5 text-ruby" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                      Total Fees
                    </p>
                    <p className="text-2xl font-semibold tabular-nums text-ruby font-[family-name:var(--font-display)]">
                      $2,763
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-platinum/50 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/10">
                    <TrendingUp className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                      Net to You
                    </p>
                    <p className="text-2xl font-semibold tabular-nums text-emerald font-[family-name:var(--font-display)]">
                      $15,657
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ledger Timeline */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                Transaction History
              </h2>
              <LedgerTimeline entries={ledgerEntries} />
            </div>

            {/* Fee Breakdown Table */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                Fee Breakdown
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-platinum/30">
                      <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-pewter">
                        Fee Type
                      </th>
                      <th className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-pewter">
                        Description
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeBreakdown.map((fee, i) => (
                      <tr
                        key={fee.label}
                        className={cn(
                          i < feeBreakdown.length - 1 &&
                            "border-b border-platinum/20"
                        )}
                      >
                        <td className="py-3 pr-6 font-medium text-charcoal">
                          {fee.label}
                        </td>
                        <td className="py-3 pr-6 text-pewter">
                          {fee.description}
                        </td>
                        <td className="py-3 text-right font-semibold tabular-nums text-ruby">
                          {fee.amount === 0
                            ? "Included"
                            : `$${(fee.amount / 100).toLocaleString()}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-platinum/40">
                      <td
                        colSpan={2}
                        className="pt-3 text-sm font-semibold text-charcoal"
                      >
                        Total Fees
                      </td>
                      <td className="pt-3 text-right text-base font-bold tabular-nums text-ruby font-[family-name:var(--font-display)]">
                        ${(totalFees / 100).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
