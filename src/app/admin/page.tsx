"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LotStatusBadge } from "@/components/auction/LotStatusBadge";
import { formatCents } from "@/lib/utils";
import { Building2, Package, CheckCircle2, XCircle } from "lucide-react";
import type { Org, Lot } from "@/types";

export default function AdminPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orgs" | "lots">("orgs");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const [orgsRes, lotsRes] = await Promise.all([
          fetch("/api/orgs", { headers: { "x-user-id": userId } }),
          fetch("/api/lots", { headers: { "x-user-id": userId } }),
        ]);
        if (orgsRes.ok) {
          const json = await orgsRes.json();
          setOrgs(json.data || []);
        }
        if (lotsRes.ok) {
          const json = await lotsRes.json();
          setLots(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-8">
          <h1
            className="text-2xl md:text-3xl text-onyx"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Admin Panel
          </h1>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div
              className="bg-white rounded-xl p-5 border border-border/60 border-l-[3px] border-l-sapphire"
              style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-pewter">
                  Organizations
                </span>
                <div className="w-9 h-9 rounded-lg bg-sapphire-muted flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-sapphire" />
                </div>
              </div>
              <div
                className="text-3xl font-semibold text-onyx"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {orgs.length}
              </div>
            </div>
            <div
              className="bg-white rounded-xl p-5 border border-border/60 border-l-[3px] border-l-amethyst"
              style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-pewter">
                  All Lots
                </span>
                <div className="w-9 h-9 rounded-lg bg-amethyst-muted flex items-center justify-center">
                  <Package className="h-4 w-4 text-amethyst" />
                </div>
              </div>
              <div
                className="text-3xl font-semibold text-onyx"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {lots.length}
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-pewter">Loading...</p>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="flex gap-1 bg-white rounded-lg border border-border/60 p-1 w-fit">
                <button
                  onClick={() => setActiveTab("orgs")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "orgs"
                      ? "bg-sapphire text-white"
                      : "text-pewter hover:text-charcoal"
                  }`}
                >
                  Organizations ({orgs.length})
                </button>
                <button
                  onClick={() => setActiveTab("lots")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "lots"
                      ? "bg-sapphire text-white"
                      : "text-pewter hover:text-charcoal"
                  }`}
                >
                  All Lots ({lots.length})
                </button>
              </div>

              {/* Orgs Tab */}
              {activeTab === "orgs" && (
                <div className="space-y-4">
                  {orgs.length > 0 ? (
                    orgs.map((org) => (
                      <div
                        key={org.id}
                        className="bg-white rounded-xl border border-border/60 p-5"
                        style={{
                          boxShadow: "0 1px 3px rgba(15,14,13,0.06)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="text-base text-onyx"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                            }}
                          >
                            {org.name}
                          </h3>
                          {org.stripe_account_id ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-muted text-emerald">
                              <CheckCircle2 className="h-3 w-3" />
                              Stripe Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-ivory text-pewter">
                              <XCircle className="h-3 w-3" />
                              No Stripe
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-pewter space-y-1">
                          <p>
                            ID:{" "}
                            <span className="font-mono text-xs">{org.id}</span>
                          </p>
                          <p>
                            Created:{" "}
                            {new Date(org.created_at).toLocaleDateString()}
                          </p>
                          {org.stripe_account_id && (
                            <p>
                              Stripe:{" "}
                              <span className="font-mono text-xs">
                                {org.stripe_account_id}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl border border-border/60 p-8 text-center text-pewter">
                      No organizations found.
                    </div>
                  )}
                </div>
              )}

              {/* Lots Tab */}
              {activeTab === "lots" && (
                <div>
                  {lots.length > 0 ? (
                    <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-ivory">
                            <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">
                              Title
                            </th>
                            <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">
                              Status
                            </th>
                            <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">
                              Start Price
                            </th>
                            <th className="text-right p-3 font-medium text-pewter text-xs uppercase tracking-wide">
                              Bids
                            </th>
                            <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">
                              Created
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {lots.map((lot) => (
                            <tr
                              key={lot.id}
                              className="hover:bg-ivory/50 transition-colors"
                            >
                              <td className="p-3 font-medium text-charcoal">
                                {lot.title}
                              </td>
                              <td className="p-3">
                                <LotStatusBadge status={lot.status} />
                              </td>
                              <td className="p-3 text-right text-charcoal">
                                {formatCents(lot.start_price_cents)}
                              </td>
                              <td className="p-3 text-right text-charcoal">
                                {lot.last_bid_seq}
                              </td>
                              <td className="p-3 text-pewter">
                                {new Date(lot.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-border/60 p-8 text-center text-pewter">
                      No lots found.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
