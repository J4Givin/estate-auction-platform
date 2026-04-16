"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Radio, Package } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LotCard } from "@/components/auction/LotCard";
import type { Lot, Show } from "@/types";

export default function DashboardPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  // In production, get from auth context
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex gap-2">
              <Link href="/lots/new">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Lot
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Shows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold">
                    {shows.filter((s) => s.status === "live").length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Live Lots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{activeLots.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Lots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">{lots.length}</span>
              </CardContent>
            </Card>
          </div>

          {/* Active lots */}
          {activeLots.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Live Now</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeLots.map((lot) => (
                  <LotCard key={lot.id} lot={lot} />
                ))}
              </div>
            </div>
          )}

          {/* Recent lots */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Recent Lots</h2>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : recentLots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentLots.map((lot) => (
                  <LotCard key={lot.id} lot={lot} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No lots yet. Create your first lot to get started.
                </CardContent>
              </Card>
            )}
          </div>

          {/* Shows */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Shows</h2>
            {shows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shows.map((show) => (
                  <Link key={show.id} href={`/shows/${show.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-base">{show.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {show.description || "No description"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Status: {show.status}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No shows yet.
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
