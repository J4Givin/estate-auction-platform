"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Radio, Package, Layers, Briefcase } from "lucide-react";
import { LotCard } from "@/components/auction/LotCard";
import type { Lot, Show } from "@/types";

export default function DashboardPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  // In production, get from auth context
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const [showsRes, lotsRes] = await Promise.all([
          fetch("/api/shows", { headers: { "x-user-id": userId } }),
          fetch("/api/lots", { headers: { "x-user-id": userId } }),
        ]);

        if (showsRes.ok) {
          const json = await showsRes.json();
          setShows(json.data || []);
        }
        if (lotsRes.ok) {
          const json = await lotsRes.json();
          setLots(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const activeLots = lots.filter((l) => l.status === "live_bidding");
  const recentLots = lots.slice(0, 6);
  const activeShows = shows.filter((s) => s.status === "live");

  const statCards = [
    {
      label: "Active Shows",
      value: activeShows.length,
      icon: Radio,
      borderColor: "border-l-sapphire",
      iconColor: "text-sapphire",
      bgColor: "bg-sapphire-muted",
    },
    {
      label: "Live Lots",
      value: activeLots.length,
      icon: Package,
      borderColor: "border-l-emerald",
      iconColor: "text-emerald",
      bgColor: "bg-emerald-muted",
    },
    {
      label: "Total Lots",
      value: lots.length,
      icon: Layers,
      borderColor: "border-l-amethyst",
      iconColor: "text-amethyst",
      bgColor: "bg-amethyst-muted",
    },
    {
      label: "Estate Jobs",
      value: shows.length,
      icon: Briefcase,
      borderColor: "border-l-gold-tone",
      iconColor: "text-gold-tone",
      bgColor: "bg-gold-tone-muted",
    },
  ];

  return (
    <AppShell role="admin" userName="Catherine Reynolds" orgName="Administration">
<div className="flex flex-1">
<main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl md:text-3xl text-onyx"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Dashboard
            </h1>
            <div className="flex gap-2">
              <Link href="/lots/new">
                <button className="inline-flex items-center gap-2 bg-sapphire text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sapphire-light transition-colors">
                  <PlusCircle className="h-4 w-4" />
                  New Lot
                </button>
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`bg-white rounded-xl p-5 border border-border/60 border-l-[3px] ${stat.borderColor}`}
                  style={{
                    boxShadow: "0 1px 3px rgba(15,14,13,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-pewter">
                      {stat.label}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${stat.iconColor}`} />
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

          {/* Active lots */}
          {activeLots.length > 0 && (
            <div>
              <h2
                className="text-xl text-onyx mb-4"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Live Now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeLots.map((lot) => (
                  <LotCard key={lot.id} lot={lot} />
                ))}
              </div>
            </div>
          )}

          {/* Recent lots */}
          <div>
            <h2
              className="text-xl text-onyx mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Recent Lots
            </h2>
            {loading ? (
              <p className="text-pewter">Loading...</p>
            ) : recentLots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentLots.map((lot) => (
                  <LotCard key={lot.id} lot={lot} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border/60 p-8 text-center text-pewter">
                No lots yet. Create your first lot to get started.
              </div>
            )}
          </div>

          {/* Shows */}
          <div>
            <h2
              className="text-xl text-onyx mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Shows
            </h2>
            {shows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shows.map((show) => (
                  <Link key={show.id} href={`/shows/${show.id}`}>
                    <div className="bg-white rounded-xl border border-border/60 p-5 hover:shadow-md transition-shadow cursor-pointer">
                      <h3
                        className="text-base font-semibold text-onyx mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {show.title}
                      </h3>
                      <p className="text-sm text-pewter mb-2">
                        {show.description || "No description"}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          show.status === "live"
                            ? "bg-emerald-muted text-emerald"
                            : "bg-sapphire-muted text-sapphire"
                        }`}
                      >
                        {show.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border/60 p-8 text-center text-pewter">
                No shows yet.
              </div>
            )}
          </div>
        </main>
      </div>
    </AppShell>
  );
}
