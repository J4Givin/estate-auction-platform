"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LotStatusBadge } from "@/components/auction/LotStatusBadge";
import { formatCents } from "@/lib/utils";
import type { Org, Lot } from "@/types";

export default function AdminPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) { setLoading(false); return; }
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <Tabs defaultValue="orgs">
              <TabsList>
                <TabsTrigger value="orgs">
                  Organizations ({orgs.length})
                </TabsTrigger>
                <TabsTrigger value="lots">
                  All Lots ({lots.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orgs" className="space-y-4">
                {orgs.length > 0 ? (
                  orgs.map((org) => (
                    <Card key={org.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{org.name}</CardTitle>
                          <Badge variant={org.stripe_account_id ? "success" : "secondary"}>
                            {org.stripe_account_id ? "Stripe Connected" : "No Stripe"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        <p>ID: {org.id}</p>
                        <p>Created: {new Date(org.created_at).toLocaleDateString()}</p>
                        {org.stripe_account_id && (
                          <p>Stripe Account: {org.stripe_account_id}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No organizations found.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="lots" className="space-y-4">
                {lots.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">Title</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-right p-3 font-medium">Start Price</th>
                          <th className="text-right p-3 font-medium">Bids</th>
                          <th className="text-left p-3 font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {lots.map((lot) => (
                          <tr key={lot.id} className="hover:bg-muted/30">
                            <td className="p-3 font-medium">{lot.title}</td>
                            <td className="p-3">
                              <LotStatusBadge status={lot.status} />
                            </td>
                            <td className="p-3 text-right">
                              {formatCents(lot.start_price_cents)}
                            </td>
                            <td className="p-3 text-right">{lot.last_bid_seq}</td>
                            <td className="p-3 text-muted-foreground">
                              {new Date(lot.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No lots found.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
}
