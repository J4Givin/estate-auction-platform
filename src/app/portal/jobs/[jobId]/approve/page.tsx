"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthBadge } from "@/components/catalog/AuthBadge";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Pause,
  Star,
  DollarSign,
} from "lucide-react";

type AuthStatus = "not_required" | "pending" | "in_progress" | "authenticated" | "inconclusive";

interface ApprovalItem {
  id: string;
  title: string;
  price: number;
  authStatus: AuthStatus;
  approved: boolean;
  photoColor: string;
}

const initialItems: ApprovalItem[] = [
  { id: "apr-01", title: "Tiffany Table Lamp", price: 180000, authStatus: "authenticated", approved: true, photoColor: "bg-amber-100" },
  { id: "apr-02", title: "Georgian Silver Tea Set", price: 420000, authStatus: "authenticated", approved: true, photoColor: "bg-slate-200" },
  { id: "apr-03", title: "Eames Lounge Chair", price: 280000, authStatus: "not_required", approved: true, photoColor: "bg-stone-200" },
  { id: "apr-04", title: "Herend Porcelain Collection", price: 420000, authStatus: "in_progress", approved: false, photoColor: "bg-blue-50" },
  { id: "apr-05", title: "Persian Silk Rug (8x10)", price: 220000, authStatus: "not_required", approved: true, photoColor: "bg-red-50" },
  { id: "apr-06", title: "Chippendale Highboy", price: 120000, authStatus: "not_required", approved: true, photoColor: "bg-amber-50" },
  { id: "apr-07", title: "Steuben Crystal Bowl", price: 65000, authStatus: "not_required", approved: true, photoColor: "bg-sky-50" },
  { id: "apr-08", title: "Waterford Chandelier", price: 350000, authStatus: "authenticated", approved: true, photoColor: "bg-violet-50" },
  { id: "apr-09", title: "Grandmother Clock (1820)", price: 95000, authStatus: "pending", approved: false, photoColor: "bg-yellow-50" },
  { id: "apr-10", title: "Audubon Print (Framed)", price: 55000, authStatus: "not_required", approved: true, photoColor: "bg-green-50" },
  { id: "apr-11", title: "Art Deco Bar Cabinet", price: 140000, authStatus: "not_required", approved: true, photoColor: "bg-orange-50" },
  { id: "apr-12", title: "Steinway Baby Grand Piano", price: 850000, authStatus: "authenticated", approved: true, photoColor: "bg-zinc-100" },
  { id: "apr-13", title: "Vintage Chanel Handbag", price: 70000, authStatus: "authenticated", approved: true, photoColor: "bg-pink-50" },
  { id: "apr-14", title: "Majolica Garden Seat", price: 25000, authStatus: "not_required", approved: true, photoColor: "bg-lime-50" },
  { id: "apr-15", title: "Baccarat Decanter Set", price: 42000, authStatus: "not_required", approved: true, photoColor: "bg-rose-50" },
  { id: "apr-16", title: "Meissen Figurine (18th C.)", price: 180000, authStatus: "in_progress", approved: false, photoColor: "bg-purple-50" },
  { id: "apr-17", title: "Lalique Vase", price: 95000, authStatus: "pending", approved: false, photoColor: "bg-teal-50" },
  { id: "apr-18", title: "Nakashima Coffee Table", price: 320000, authStatus: "authenticated", approved: true, photoColor: "bg-amber-50" },
];

export default function ApprovalPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [items, setItems] = useState(initialItems);

  const approvedCount = useMemo(
    () => items.filter((i) => i.approved).length,
    [items]
  );
  const totalItems = items.length;
  const progressPercent = Math.round((approvedCount / totalItems) * 100);

  const totalEstimatedValue = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items]
  );

  const toggleApproval = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, approved: !item.approved } : item
      )
    );
  };

  const bulkApproveAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, approved: true })));
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar userName="Margaret Mitchell" role="customer" />

      <div className="flex flex-1">
        <Sidebar role="customer" />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-8">
            {/* Page Header */}
            <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
              Approve Items for Publication
            </h1>
            <p className="mt-2 text-sm text-pewter">
              Review and approve items before they are published to marketplace channels.
              Items marked as authenticated have been verified by accredited specialists.
            </p>

            {/* Progress + Bulk Approve */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tabular-nums text-charcoal font-[family-name:var(--font-display)]">
                      {approvedCount} of {totalItems}
                    </span>
                    <span className="text-sm text-pewter">items approved</span>
                  </div>
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-platinum/30">
                    <div
                      className="h-full rounded-full bg-emerald transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs tabular-nums text-pewter">
                    {progressPercent}% complete
                  </p>
                </div>
                <button
                  type="button"
                  onClick={bulkApproveAll}
                  className="flex items-center gap-2 rounded-xl bg-gold-tone px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gold-tone-light hover:shadow-md"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve All Items
                </button>
              </div>
            </div>

            {/* Item List */}
            <div className="mt-6 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all",
                    item.approved
                      ? "border-emerald/30"
                      : "border-platinum/50"
                  )}
                >
                  {/* Photo */}
                  <div
                    className={cn(
                      "h-14 w-14 shrink-0 rounded-lg",
                      item.photoColor
                    )}
                  />

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal">
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <AuthBadge status={item.authStatus} />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    <DollarSign className="h-3.5 w-3.5 text-pewter" />
                    <span className="text-sm font-semibold tabular-nums text-charcoal">
                      {(item.price / 100).toLocaleString()}
                    </span>
                  </div>

                  {/* Approve / Hold Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleApproval(item.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all shrink-0",
                      item.approved
                        ? "bg-emerald/10 text-emerald hover:bg-emerald/20"
                        : "bg-gold-tone/10 text-gold-tone hover:bg-gold-tone/20"
                    )}
                  >
                    {item.approved ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approved
                      </>
                    ) : (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        On Hold
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Footer */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                    Total Estimated Value
                  </p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-sapphire font-[family-name:var(--font-display)]">
                    ${(totalEstimatedValue / 100).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-pewter">
                  <Star className="h-4 w-4 text-gold-tone" />
                  <span>
                    {items.filter((i) => i.authStatus === "authenticated").length} items
                    authenticated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
