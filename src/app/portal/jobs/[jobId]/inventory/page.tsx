"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { DispositionPicker } from "@/components/catalog/DispositionPicker";
import { CoverageScore } from "@/components/catalog/CoverageScore";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import {
  Filter,
  CheckSquare,
  Trash2,
  Heart,
  ShoppingCart,
  Package,
  Search,
} from "lucide-react";

type Disposition = "KEEP" | "SELL" | "DONATE" | "TRASH";
type Condition = "A" | "B" | "C" | "D";
type ItemStatus = "draft" | "pending_review" | "approved" | "listed" | "sold";

interface InventoryItem {
  id: string;
  title: string;
  room: string;
  condition: Condition;
  priceLow: number;
  priceMed: number;
  priceHigh: number;
  disposition: Disposition | null;
  status: ItemStatus;
  photoColor: string;
}

const conditionLabels: Record<Condition, { label: string; color: string; bg: string }> = {
  A: { label: "Excellent", color: "text-emerald", bg: "bg-emerald/10" },
  B: { label: "Good", color: "text-sapphire", bg: "bg-sapphire/10" },
  C: { label: "Fair", color: "text-gold-tone", bg: "bg-gold-tone/10" },
  D: { label: "Poor", color: "text-ruby", bg: "bg-ruby/10" },
};

const priceBandColor = (low: number, med: number, high: number) => {
  if (med >= 200000) return "bg-gold-tone";
  if (med >= 50000) return "bg-sapphire";
  return "bg-emerald";
};

const initialItems: InventoryItem[] = [
  { id: "item-01", title: "Tiffany Table Lamp", room: "Living Room", condition: "A", priceLow: 120000, priceMed: 180000, priceHigh: 250000, disposition: "SELL", status: "approved", photoColor: "bg-amber-100" },
  { id: "item-02", title: "Georgian Silver Tea Set", room: "Dining Room", condition: "A", priceLow: 280000, priceMed: 420000, priceHigh: 560000, disposition: "SELL", status: "listed", photoColor: "bg-slate-200" },
  { id: "item-03", title: "Eames Lounge Chair", room: "Study", condition: "B", priceLow: 180000, priceMed: 280000, priceHigh: 350000, disposition: "SELL", status: "approved", photoColor: "bg-stone-200" },
  { id: "item-04", title: "Herend Porcelain Collection", room: "Dining Room", condition: "A", priceLow: 320000, priceMed: 420000, priceHigh: 580000, disposition: "SELL", status: "pending_review", photoColor: "bg-blue-50" },
  { id: "item-05", title: "Persian Silk Rug (8x10)", room: "Living Room", condition: "B", priceLow: 150000, priceMed: 220000, priceHigh: 300000, disposition: null, status: "draft", photoColor: "bg-red-50" },
  { id: "item-06", title: "Chippendale Highboy", room: "Master Bedroom", condition: "C", priceLow: 80000, priceMed: 120000, priceHigh: 160000, disposition: "SELL", status: "approved", photoColor: "bg-amber-50" },
  { id: "item-07", title: "Steuben Crystal Bowl", room: "Dining Room", condition: "A", priceLow: 40000, priceMed: 65000, priceHigh: 90000, disposition: "KEEP", status: "approved", photoColor: "bg-sky-50" },
  { id: "item-08", title: "Waterford Chandelier", room: "Foyer", condition: "B", priceLow: 220000, priceMed: 350000, priceHigh: 480000, disposition: "SELL", status: "listed", photoColor: "bg-violet-50" },
  { id: "item-09", title: "Grandmother Clock (1820)", room: "Hallway", condition: "C", priceLow: 60000, priceMed: 95000, priceHigh: 130000, disposition: null, status: "draft", photoColor: "bg-yellow-50" },
  { id: "item-10", title: "Audubon Print (Framed)", room: "Study", condition: "A", priceLow: 35000, priceMed: 55000, priceHigh: 75000, disposition: "DONATE", status: "approved", photoColor: "bg-green-50" },
  { id: "item-11", title: "Art Deco Bar Cabinet", room: "Living Room", condition: "B", priceLow: 90000, priceMed: 140000, priceHigh: 190000, disposition: "SELL", status: "approved", photoColor: "bg-orange-50" },
  { id: "item-12", title: "Steinway Baby Grand Piano", room: "Music Room", condition: "A", priceLow: 650000, priceMed: 850000, priceHigh: 1100000, disposition: "SELL", status: "pending_review", photoColor: "bg-zinc-100" },
  { id: "item-13", title: "Vintage Chanel Handbag", room: "Master Bedroom", condition: "B", priceLow: 45000, priceMed: 70000, priceHigh: 95000, disposition: "KEEP", status: "approved", photoColor: "bg-pink-50" },
  { id: "item-14", title: "Majolica Garden Seat", room: "Sunroom", condition: "D", priceLow: 15000, priceMed: 25000, priceHigh: 35000, disposition: "TRASH", status: "draft", photoColor: "bg-lime-50" },
  { id: "item-15", title: "Baccarat Decanter Set", room: "Dining Room", condition: "A", priceLow: 28000, priceMed: 42000, priceHigh: 58000, disposition: null, status: "draft", photoColor: "bg-rose-50" },
];

const rooms = ["All Rooms", "Living Room", "Dining Room", "Study", "Master Bedroom", "Foyer", "Hallway", "Music Room", "Sunroom"];
const dispositions = ["All Dispositions", "SELL", "KEEP", "DONATE", "TRASH", "Unassigned"];
const statuses = ["All Statuses", "draft", "pending_review", "approved", "listed", "sold"];

export default function InventoryReview() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [items, setItems] = useState(initialItems);
  const [selectedRoom, setSelectedRoom] = useState("All Rooms");
  const [selectedDisposition, setSelectedDisposition] = useState("All Dispositions");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedRoom !== "All Rooms" && item.room !== selectedRoom) return false;
      if (selectedDisposition !== "All Dispositions") {
        if (selectedDisposition === "Unassigned" && item.disposition !== null) return false;
        if (selectedDisposition !== "Unassigned" && item.disposition !== selectedDisposition) return false;
      }
      if (selectedStatus !== "All Statuses" && item.status !== selectedStatus) return false;
      return true;
    });
  }, [items, selectedRoom, selectedDisposition, selectedStatus]);

  const handleDispositionChange = (itemId: string, disposition: Disposition) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, disposition } : item
      )
    );
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const bulkSetDisposition = (disposition: Disposition) => {
    setItems((prev) =>
      prev.map((item) =>
        selectedItems.has(item.id) ? { ...item, disposition } : item
      )
    );
    setSelectedItems(new Set());
  };

  const coverageScore = Math.round(
    (items.filter((i) => i.disposition !== null).length / items.length) * 100
  );

  return (
    <AppShell role="customer" userName="Client" orgName="My Portal">
<div className="flex flex-1">
<main className="flex-1 overflow-y-auto pb-24">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
                  Inventory Review
                </h1>
                <p className="mt-1 text-sm text-pewter">
                  Review cataloged items and assign dispositions for the Mitchell Estate
                </p>
              </div>
              <CoverageScore score={coverageScore} className="shrink-0" />
            </div>

            {/* Filter Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-platinum/50 bg-white p-4 shadow-sm">
              <Filter className="h-4 w-4 text-pewter" />

              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="rounded-lg border border-platinum/50 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              >
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>

              <select
                value={selectedDisposition}
                onChange={(e) => setSelectedDisposition(e.target.value)}
                className="rounded-lg border border-platinum/50 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              >
                {dispositions.map((d) => (
                  <option key={d} value={d}>
                    {d === "SELL" || d === "KEEP" || d === "DONATE" || d === "TRASH"
                      ? d.charAt(0) + d.slice(1).toLowerCase()
                      : d}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-platinum/50 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "All Statuses"
                      ? s
                      : s
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                  </option>
                ))}
              </select>

              <span className="ml-auto text-xs text-pewter">
                {filteredItems.length} of {items.length} items
              </span>
            </div>

            {/* Item Grid */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const cond = conditionLabels[item.condition];
                const isSelected = selectedItems.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-xl border bg-white shadow-sm transition-all",
                      isSelected
                        ? "border-sapphire ring-2 ring-sapphire/20"
                        : "border-platinum/50"
                    )}
                  >
                    {/* Photo Placeholder */}
                    <div className={cn("relative h-40 rounded-t-xl", item.photoColor)}>
                      <button
                        onClick={() => toggleItemSelection(item.id)}
                        className={cn(
                          "absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded border-2 transition-colors",
                          isSelected
                            ? "border-sapphire bg-sapphire text-white"
                            : "border-white/80 bg-white/60 text-transparent hover:border-sapphire"
                        )}
                      >
                        {isSelected && <CheckSquare className="h-4 w-4" />}
                      </button>
                      <div className="absolute right-3 top-3">
                        <StatusBadge status={item.status} type="item" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-charcoal">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-pewter">{item.room}</p>

                      {/* Condition + Price Band */}
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            cond.bg,
                            cond.color
                          )}
                        >
                          {item.condition} - {cond.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-1.5 w-4 rounded-full", priceBandColor(item.priceLow, item.priceMed, item.priceHigh))} />
                          <span className="text-xs font-medium tabular-nums text-charcoal">
                            ${(item.priceMed / 100).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Disposition Picker */}
                      <div className="mt-4">
                        <DispositionPicker
                          value={item.disposition}
                          onChange={(d) => handleDispositionChange(item.id, d)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bulk Action Toolbar (sticky bottom) */}
          {selectedItems.size > 0 && (
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-platinum/50 bg-white/95 shadow-lg backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={selectAll}
                    className="text-sm font-medium text-sapphire hover:underline"
                  >
                    {selectedItems.size === filteredItems.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  <span className="text-sm text-pewter">
                    {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""} selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="mr-2 text-xs font-medium text-pewter">
                    Set disposition:
                  </span>
                  <button
                    onClick={() => bulkSetDisposition("SELL")}
                    className="flex items-center gap-1.5 rounded-lg bg-sapphire px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sapphire-light"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Sell
                  </button>
                  <button
                    onClick={() => bulkSetDisposition("KEEP")}
                    className="flex items-center gap-1.5 rounded-lg bg-amethyst px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amethyst-light"
                  >
                    <Package className="h-3.5 w-3.5" />
                    Keep
                  </button>
                  <button
                    onClick={() => bulkSetDisposition("DONATE")}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-light"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    Donate
                  </button>
                  <button
                    onClick={() => bulkSetDisposition("TRASH")}
                    className="flex items-center gap-1.5 rounded-lg bg-ruby px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-ruby-light"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Trash
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppShell>
  );
}
