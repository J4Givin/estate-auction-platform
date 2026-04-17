"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CoverageScore } from "@/components/catalog/CoverageScore";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Camera,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  ArrowLeft,
  Image,
} from "lucide-react";

interface RoomItem {
  id: string;
  name: string;
  photos: number;
  status: "pending" | "captured" | "flagged";
}

interface Room {
  id: string;
  name: string;
  targetItems: number;
  targetPhotos: number;
  items: RoomItem[];
  completed: boolean;
}

const mockRooms: Room[] = [
  {
    id: "room-1",
    name: "Living Room",
    targetItems: 8,
    targetPhotos: 40,
    completed: true,
    items: [
      { id: "lr-1", name: "Chesterfield Sofa (leather)", photos: 6, status: "captured" },
      { id: "lr-2", name: "Persian Kashan Rug 9x12", photos: 5, status: "captured" },
      { id: "lr-3", name: "Pair of Brass Table Lamps", photos: 4, status: "captured" },
      { id: "lr-4", name: "Oil Painting — Coastal Landscape", photos: 5, status: "captured" },
      { id: "lr-5", name: "Mahogany Side Table", photos: 4, status: "captured" },
      { id: "lr-6", name: "Crystal Decanter Set", photos: 3, status: "captured" },
      { id: "lr-7", name: "Carved Jade Figurine", photos: 5, status: "captured" },
      { id: "lr-8", name: "Silver-framed Mirror", photos: 4, status: "captured" },
    ],
  },
  {
    id: "room-2",
    name: "Kitchen",
    targetItems: 5,
    targetPhotos: 20,
    completed: false,
    items: [
      { id: "kt-1", name: "Copper Cookware Set (12pc)", photos: 4, status: "captured" },
      { id: "kt-2", name: "Vintage KitchenAid Mixer", photos: 3, status: "captured" },
      { id: "kt-3", name: "Le Creuset Dutch Oven Collection", photos: 2, status: "flagged" },
    ],
  },
  {
    id: "room-3",
    name: "Master Bedroom",
    targetItems: 6,
    targetPhotos: 30,
    completed: false,
    items: [
      { id: "mb-1", name: "Four-poster Walnut Bed Frame", photos: 5, status: "captured" },
      { id: "mb-2", name: "Antique Vanity with Mirror", photos: 4, status: "captured" },
      { id: "mb-3", name: "Silk Kimono Collection (3)", photos: 6, status: "captured" },
      { id: "mb-4", name: "Art Deco Nightstand Pair", photos: 3, status: "flagged" },
    ],
  },
  {
    id: "room-4",
    name: "Dining Room",
    targetItems: 4,
    targetPhotos: 25,
    completed: false,
    items: [
      { id: "dr-1", name: "Duncan Phyfe Dining Table", photos: 5, status: "captured" },
      { id: "dr-2", name: "Set of 8 Chippendale Chairs", photos: 4, status: "captured" },
    ],
  },
  {
    id: "room-5",
    name: "Garage",
    targetItems: 5,
    targetPhotos: 15,
    completed: false,
    items: [
      { id: "ga-1", name: "Vintage Tool Chest (Craftsman)", photos: 3, status: "captured" },
    ],
  },
  {
    id: "room-6",
    name: "Attic",
    targetItems: 6,
    targetPhotos: 20,
    completed: false,
    items: [],
  },
];

const photoWarnings = [
  { id: "pw-1", item: "Le Creuset Dutch Oven Collection", issue: "Photo #2 appears blurry — retake recommended" },
  { id: "pw-2", item: "Art Deco Nightstand Pair", issue: "Lighting too dark — use flash or move to natural light" },
];

export default function GuidedCapturePage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set(["room-1", "room-2"]));
  const [isOnline] = useState(true);

  const totalItems = mockRooms.reduce((acc, r) => acc + r.items.length, 0);
  const totalTargetItems = mockRooms.reduce((acc, r) => acc + r.targetItems, 0);
  const coveragePercent = Math.round((totalItems / totalTargetItems) * 100);

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) next.delete(roomId);
      else next.add(roomId);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link
              href={`/ops/jobs/${jobId}`}
              className="inline-flex items-center gap-1 text-sm text-pewter hover:text-sapphire transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {jobId}
            </Link>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
                Guided Capture
              </h1>
              <p className="text-sm text-pewter mt-1">{jobId} — Harrington Estate</p>
            </div>
            {/* Online/Offline indicator */}
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
                isOnline
                  ? "bg-emerald/10 text-emerald border border-emerald/30"
                  : "bg-ruby/10 text-ruby border border-ruby/30"
              )}
            >
              {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              {isOnline ? "Online" : "Offline"}
            </div>
          </div>

          {/* Coverage Score Progress Bar */}
          <div className="rounded-lg border border-platinum/50 bg-white p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-charcoal">Capture Progress</p>
                <p className="text-xs text-pewter">
                  {totalItems} of {totalTargetItems} target items captured
                </p>
              </div>
              <CoverageScore score={coveragePercent} className="scale-75 origin-right" />
            </div>
            <div className="h-3 w-full rounded-full bg-platinum/30">
              <div
                className="h-full rounded-full bg-sapphire transition-all duration-500"
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
          </div>

          {/* Photo Quality Warnings */}
          {photoWarnings.length > 0 && (
            <div className="space-y-2 mb-6">
              {photoWarnings.map((warning) => (
                <div
                  key={warning.id}
                  className="flex items-start gap-3 rounded-lg border border-gold-tone/30 bg-gold-tone/5 p-4"
                >
                  <AlertTriangle className="h-4 w-4 text-gold-tone mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">{warning.item}</p>
                    <p className="text-xs text-pewter">{warning.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Room Accordions */}
          <div className="space-y-3">
            {mockRooms.map((room) => {
              const isExpanded = expandedRooms.has(room.id);
              const itemCount = room.items.length;
              const photoCount = room.items.reduce((a, i) => a + i.photos, 0);
              const flaggedCount = room.items.filter((i) => i.status === "flagged").length;

              return (
                <div
                  key={room.id}
                  className={cn(
                    "rounded-lg border bg-white shadow-sm overflow-hidden",
                    room.completed ? "border-emerald/30" : "border-platinum/50"
                  )}
                >
                  {/* Room Header */}
                  <button
                    onClick={() => toggleRoom(room.id)}
                    className="flex w-full items-center gap-3 px-5 py-4 hover:bg-ivory/50 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-pewter shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-pewter shrink-0" />
                    )}
                    <span className="text-base font-semibold text-charcoal font-[family-name:var(--font-display)] flex-1 text-left">
                      {room.name}
                    </span>
                    {room.completed && (
                      <CheckCircle2 className="h-5 w-5 text-emerald shrink-0" />
                    )}
                    <div className="flex items-center gap-4 text-xs text-pewter">
                      <span className="tabular-nums">
                        {itemCount}/{room.targetItems} items
                      </span>
                      <span className="tabular-nums">
                        {photoCount}/{room.targetPhotos} photos
                      </span>
                      {flaggedCount > 0 && (
                        <span className="rounded-full bg-gold-tone/10 px-2 py-0.5 text-gold-tone font-medium">
                          {flaggedCount} flagged
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Room Content */}
                  {isExpanded && (
                    <div className="border-t border-platinum/30 px-5 py-4">
                      {room.items.length === 0 ? (
                        <p className="text-sm text-pewter text-center py-4">No items captured yet</p>
                      ) : (
                        <ul className="space-y-2 mb-4">
                          {room.items.map((item) => (
                            <li
                              key={item.id}
                              className={cn(
                                "flex items-center gap-3 rounded-md border p-3",
                                item.status === "flagged"
                                  ? "border-gold-tone/30 bg-gold-tone/5"
                                  : "border-platinum/30 bg-white"
                              )}
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-platinum/20">
                                <Image className="h-4 w-4 text-pewter" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
                                <p className="text-xs text-pewter">{item.photos} photos</p>
                              </div>
                              {item.status === "captured" && (
                                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                              )}
                              {item.status === "flagged" && (
                                <AlertTriangle className="h-4 w-4 text-gold-tone shrink-0" />
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-sapphire text-sapphire px-3 py-2 text-sm font-medium hover:bg-sapphire/10 transition-colors">
                          <Plus className="h-4 w-4" />
                          Add Item
                        </button>
                        {!room.completed && (
                          <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-light transition-colors">
                            <CheckCircle2 className="h-4 w-4" />
                            Complete Room
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
