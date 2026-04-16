"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Radio, PlusCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LotCard } from "@/components/auction/LotCard";
import type { Show, Lot } from "@/types";

export default function ShowDetailPage() {
  const params = useParams();
  const showId = params.id as string;
  const [show, setShow] = useState<Show | null>(null);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const [showRes, lotsRes] = await Promise.all([
          fetch(`/api/shows/${showId}`, { headers: { "x-user-id": userId } }),
          fetch(`/api/lots?showId=${showId}`, { headers: { "x-user-id": userId } }),
        ]);
        if (showRes.ok) {
          const json = await showRes.json();
          setShow(json.data);
        }
        if (lotsRes.ok) {
          const json = await lotsRes.json();
          setLots(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch show:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showId, userId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">
          <p className="text-muted-foreground">Show not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6 max-w-screen-xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/shows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{show.title}</h1>
              <Badge variant={show.status === "live" ? "destructive" : "secondary"}>
                {show.status}
              </Badge>
            </div>
            {show.description && (
              <p className="text-muted-foreground mt-1">{show.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/shows/${showId}/live`}>
              <Button variant="outline" className="gap-2">
                <Radio className="h-4 w-4" />
                Go Live
              </Button>
            </Link>
            <Link href={`/lots/new?showId=${showId}`}>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Lot
              </Button>
            </Link>
          </div>
        </div>

        {/* Show details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Show Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status:</span>{" "}
              <span className="font-medium">{show.status}</span>
            </div>
            {show.scheduled_at && (
              <div>
                <span className="text-muted-foreground">Scheduled:</span>{" "}
                <span className="font-medium">
                  {new Date(show.scheduled_at).toLocaleString()}
                </span>
              </div>
            )}
            {show.stream_url && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Stream URL:</span>{" "}
                <span className="font-medium">{show.stream_url}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lots in this show */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Lots ({lots.length})
          </h2>
          {lots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lots.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No lots in this show yet. Add your first lot.
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
