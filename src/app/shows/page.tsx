"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Show } from "@/types";

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const orgId = typeof window !== "undefined" ? localStorage.getItem("orgId") : null;

  useEffect(() => {
    const fetchShows = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const res = await fetch("/api/shows", {
          headers: { "x-user-id": userId },
        });
        if (res.ok) {
          const json = await res.json();
          setShows(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch shows:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [userId]);

  const handleCreate = async () => {
    if (!userId || !orgId || !title) return;
    setCreating(true);
    try {
      const res = await fetch("/api/shows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ orgId, title, description: description || undefined }),
      });
      if (res.ok) {
        const json = await res.json();
        setShows((prev) => [json.data, ...prev]);
        setDialogOpen(false);
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      console.error("Failed to create show:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Shows</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Show
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new show</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="show-title">Title</Label>
                    <Input
                      id="show-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Estate Sale — Downtown Collection"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="show-desc">Description</Label>
                    <Input
                      id="show-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional description"
                    />
                  </div>
                  <Button onClick={handleCreate} disabled={creating || !title} className="w-full">
                    {creating ? "Creating..." : "Create Show"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading shows...</p>
          ) : shows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shows.map((show) => (
                <Link key={show.id} href={`/shows/${show.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{show.title}</CardTitle>
                        <Badge variant={show.status === "live" ? "destructive" : "secondary"}>
                          {show.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {show.description || "No description"}
                      </p>
                      {show.scheduled_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Scheduled: {new Date(show.scheduled_at).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No shows yet. Create your first show to get started.
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
