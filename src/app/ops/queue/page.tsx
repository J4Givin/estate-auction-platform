"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn, formatCents } from "@/lib/utils";
import {
  ArrowUpDown,
  Filter,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

interface QueueItem {
  id: string;
  title: string;
  category: string;
  value: number;
  confidence: number;
  slaRemaining: number; // minutes
  assignee: string | null;
  status: string;
}

const mockQueueItems: QueueItem[] = [
  { id: "ITM-001", title: "Tiffany Studios Dragonfly Lamp", category: "Lighting", value: 4500000, confidence: 92, slaRemaining: -45, assignee: null, status: "pending_review" },
  { id: "ITM-002", title: "Victorian Mahogany Secretary Desk", category: "Furniture", value: 3200000, confidence: 87, slaRemaining: -15, assignee: null, status: "pending_review" },
  { id: "ITM-003", title: "Persian Kashan Silk Rug 12x16", category: "Rugs", value: 2800000, confidence: 78, slaRemaining: 30, assignee: "James K.", status: "qa_required" },
  { id: "ITM-004", title: "Pair of Meissen Porcelain Figurines", category: "Ceramics", value: 1850000, confidence: 95, slaRemaining: 45, assignee: "James K.", status: "pending_review" },
  { id: "ITM-005", title: "Art Deco Diamond Brooch (3.2ct)", category: "Jewelry", value: 1500000, confidence: 63, slaRemaining: 90, assignee: null, status: "qa_required" },
  { id: "ITM-006", title: "Chippendale Mahogany Highboy", category: "Furniture", value: 1200000, confidence: 88, slaRemaining: 120, assignee: "Sarah M.", status: "pending_review" },
  { id: "ITM-007", title: "Sterling Silver Tea Service (6pc)", category: "Silver", value: 950000, confidence: 91, slaRemaining: -120, assignee: null, status: "pending_review" },
  { id: "ITM-008", title: "Carved Jade Dragon Figurine", category: "Asian Art", value: 750000, confidence: 55, slaRemaining: 150, assignee: null, status: "qa_required" },
  { id: "ITM-009", title: "Signed Chihuly Glass Bowl", category: "Art Glass", value: 650000, confidence: 96, slaRemaining: 180, assignee: "Sarah M.", status: "pending_review" },
  { id: "ITM-010", title: "Antique Grandfather Clock (circa 1880)", category: "Clocks", value: 480000, confidence: 82, slaRemaining: 45, assignee: null, status: "pending_review" },
  { id: "ITM-011", title: "Mid-Century Eames Lounge Chair", category: "Furniture", value: 420000, confidence: 97, slaRemaining: 200, assignee: "James K.", status: "pending_review" },
  { id: "ITM-012", title: "Vintage Hermes Birkin Bag", category: "Accessories", value: 380000, confidence: 89, slaRemaining: 60, assignee: null, status: "qa_required" },
  { id: "ITM-013", title: "Oil Painting — Hudson River School", category: "Fine Art", value: 320000, confidence: 72, slaRemaining: 100, assignee: null, status: "pending_review" },
  { id: "ITM-014", title: "Antique Samurai Katana (Edo Period)", category: "Weapons", value: 280000, confidence: 61, slaRemaining: 25, assignee: null, status: "qa_required" },
  { id: "ITM-015", title: "Royal Copenhagen Flora Danica Plate", category: "Ceramics", value: 150000, confidence: 94, slaRemaining: 240, assignee: "Sarah M.", status: "pending_review" },
];

function getSlaColor(minutes: number): string {
  if (minutes < 0) return "text-ruby";
  if (minutes <= 120) return "text-gold-tone";
  return "text-emerald";
}

function getSlaLabel(minutes: number): string {
  if (minutes < 0) return `${Math.abs(minutes)}m overdue`;
  if (minutes < 60) return `${minutes}m remaining`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m remaining`;
}

export default function QueuePage() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<"value" | "confidence" | "slaRemaining">("value");
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = [...mockQueueItems].sort((a, b) => {
    const mult = sortDesc ? -1 : 1;
    return (a[sortField] - b[sortField]) * mult;
  });

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedItems.size === sorted.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sorted.map((i) => i.id)));
    }
  };

  const handleSort = (field: "value" | "confidence" | "slaRemaining") => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)] mb-6">
            Review Queue
          </h1>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-pewter" />
              <select className="rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal">
                <option value="">All Categories</option>
                <option value="furniture">Furniture</option>
                <option value="jewelry">Jewelry</option>
                <option value="fine-art">Fine Art</option>
                <option value="ceramics">Ceramics</option>
                <option value="silver">Silver</option>
              </select>
            </div>
            <select className="rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal">
              <option value="">All Price Ranges</option>
              <option value="0-1000">Under $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-25000">$5,000 - $25,000</option>
              <option value="25000+">$25,000+</option>
            </select>
            <select className="rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal">
              <option value="">All Confidence</option>
              <option value="90">90%+</option>
              <option value="75">75%+</option>
              <option value="50">50%+</option>
            </select>
          </div>

          {/* Bulk Action Toolbar */}
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-sapphire/30 bg-sapphire/5 p-3 mb-4">
              <span className="text-sm font-medium text-sapphire">
                {selectedItems.size} selected
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button className="inline-flex items-center gap-1.5 rounded-md bg-sapphire px-3 py-1.5 text-xs font-semibold text-white hover:bg-sapphire-light transition-colors">
                  <UserPlus className="h-3.5 w-3.5" />
                  Assign to Me
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md border border-sapphire text-sapphire px-3 py-1.5 text-xs font-semibold hover:bg-sapphire/10 transition-colors">
                  <UserPlus className="h-3.5 w-3.5" />
                  Assign to...
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-emerald px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-light transition-colors">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve All
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-gold-tone px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-tone-light transition-colors">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Route to QA
                </button>
              </div>
            </div>
          )}

          {/* Queue Table */}
          <div className="rounded-lg border border-platinum/50 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-platinum/50 bg-ivory">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === sorted.length}
                        onChange={toggleAll}
                        className="rounded border-platinum accent-sapphire"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Category</th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter cursor-pointer select-none"
                      onClick={() => handleSort("value")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Value
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter cursor-pointer select-none"
                      onClick={() => handleSort("confidence")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Confidence
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter cursor-pointer select-none"
                      onClick={() => handleSort("slaRemaining")}
                    >
                      <span className="inline-flex items-center gap-1">
                        SLA Remaining
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Assignee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={cn(
                        "border-b border-platinum/30 transition-colors hover:bg-ivory/50",
                        idx % 2 === 0 ? "bg-white" : "bg-cream",
                        selectedItems.has(item.id) && "bg-sapphire/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-platinum accent-sapphire"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/ops/catalog/${item.id}`}
                          className="text-sm font-medium text-charcoal hover:text-sapphire transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-pewter font-mono">{item.id}</p>
                      </td>
                      <td className="px-4 py-3 text-pewter">{item.category}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-charcoal">
                        {formatCents(item.value)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-platinum/30">
                            <div
                              className="h-full rounded-full bg-sapphire"
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-pewter">{item.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold", getSlaColor(item.slaRemaining))}>
                          {getSlaLabel(item.slaRemaining)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-pewter">
                        {item.assignee ?? <span className="text-platinum">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} type="item" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
