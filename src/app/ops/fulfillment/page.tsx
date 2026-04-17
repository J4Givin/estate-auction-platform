"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle2,
  Eye,
} from "lucide-react";

type FulfillmentStatus = "paid" | "packed" | "shipped" | "delivered";
type FulfillmentType = "ship" | "pickup";

const statusTabs: { key: FulfillmentStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

interface FulfillmentOrder {
  id: string;
  itemTitle: string;
  buyer: string;
  type: FulfillmentType;
  status: FulfillmentStatus;
  carrier: string | null;
  tracking: string | null;
}

const mockOrders: FulfillmentOrder[] = [
  { id: "ORD-3001", itemTitle: "Pair of Meissen Porcelain Figurines", buyer: "James Crawford", type: "ship", status: "paid", carrier: null, tracking: null },
  { id: "ORD-3002", itemTitle: "Chippendale Mahogany Highboy", buyer: "Marcus Hayes", type: "pickup", status: "paid", carrier: null, tracking: null },
  { id: "ORD-3003", itemTitle: "Signed Chihuly Glass Bowl", buyer: "Sarah Lin", type: "ship", status: "packed", carrier: "FedEx", tracking: null },
  { id: "ORD-3004", itemTitle: "Mid-Century Eames Lounge Chair", buyer: "David Kim", type: "ship", status: "shipped", carrier: "UPS", tracking: "1Z999AA10123456784" },
  { id: "ORD-3005", itemTitle: "Royal Copenhagen Flora Danica Plate", buyer: "Patricia Moore", type: "ship", status: "shipped", carrier: "FedEx", tracking: "789456123012" },
  { id: "ORD-3006", itemTitle: "Oil Painting — Hudson River School", buyer: "Thomas Rivera", type: "ship", status: "delivered", carrier: "FedEx", tracking: "789456123098" },
  { id: "ORD-3007", itemTitle: "Vintage Hermes Birkin Bag", buyer: "Diana Park", type: "ship", status: "packed", carrier: "USPS", tracking: null },
  { id: "ORD-3008", itemTitle: "Antique Grandfather Clock (circa 1880)", buyer: "William Nguyen", type: "pickup", status: "delivered", carrier: null, tracking: null },
];

const fulfillmentStatusStyles: Record<FulfillmentStatus, { bg: string; text: string }> = {
  paid: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  packed: { bg: "bg-sapphire/15", text: "text-sapphire" },
  shipped: { bg: "bg-amethyst/15", text: "text-amethyst" },
  delivered: { bg: "bg-emerald/15", text: "text-emerald" },
};

export default function FulfillmentPage() {
  const [activeTab, setActiveTab] = useState<FulfillmentStatus | "all">("all");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const filtered = activeTab === "all" ? mockOrders : mockOrders.filter((o) => o.status === activeTab);

  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)] mb-6">
            Fulfillment Queue
          </h1>

          {/* Status Tabs */}
          <div className="border-b border-platinum/50 mb-6">
            <nav className="flex gap-1 -mb-px">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                    activeTab === tab.key
                      ? "border-sapphire text-sapphire"
                      : "border-transparent text-pewter hover:text-charcoal hover:border-platinum"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.size > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-sapphire/30 bg-sapphire/5 p-3 mb-4">
              <span className="text-sm font-medium text-sapphire">
                {selectedOrders.size} selected
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button className="inline-flex items-center gap-1.5 rounded-md bg-sapphire px-3 py-1.5 text-xs font-semibold text-white hover:bg-sapphire-light transition-colors">
                  <Package className="h-3.5 w-3.5" />
                  Mark Packed
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-emerald px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-light transition-colors">
                  <Truck className="h-3.5 w-3.5" />
                  Mark Shipped
                </button>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="rounded-lg border border-platinum/50 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-platinum/50 bg-ivory">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={() => {
                          if (selectedOrders.size === filtered.length) {
                            setSelectedOrders(new Set());
                          } else {
                            setSelectedOrders(new Set(filtered.map((o) => o.id)));
                          }
                        }}
                        checked={selectedOrders.size === filtered.length && filtered.length > 0}
                        className="rounded border-platinum accent-sapphire"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Carrier</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Tracking</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-pewter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, idx) => {
                    const statusStyle = fulfillmentStatusStyles[order.status];

                    return (
                      <tr
                        key={order.id}
                        className={cn(
                          "border-b border-platinum/30 transition-colors hover:bg-ivory/50",
                          idx % 2 === 0 ? "bg-white" : "bg-cream"
                        )}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order.id)}
                            onChange={() => toggleSelect(order.id)}
                            className="rounded border-platinum accent-sapphire"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-sapphire font-medium">
                          <Link href={`/ops/fulfillment/${order.id}`} className="hover:underline">
                            {order.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-medium text-charcoal">{order.itemTitle}</td>
                        <td className="px-4 py-3 text-charcoal">{order.buyer}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            order.type === "ship"
                              ? "bg-sapphire/15 text-sapphire"
                              : "bg-emerald/15 text-emerald"
                          )}>
                            {order.type === "ship" ? <Truck className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                            {order.type === "ship" ? "Ship" : "Pickup"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", statusStyle.bg, statusStyle.text)}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-pewter">{order.carrier ?? <span className="text-platinum">&mdash;</span>}</td>
                        <td className="px-4 py-3 font-mono text-xs text-pewter">
                          {order.tracking ?? <span className="text-platinum">&mdash;</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/ops/fulfillment/${order.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-pewter hover:bg-sapphire/10 hover:text-sapphire transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
